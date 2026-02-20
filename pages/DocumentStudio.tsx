
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Language, GeneratedDocument, Message, DocSection } from '../types';
import { TRANSLATIONS } from '../constants';
import { draftDocument } from '../services/geminiService';
import { saveSession } from '../services/storage';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import saveAs from 'file-saver';

interface DocumentStudioProps {
  language: Language;
  isPro: boolean;
}

const DocumentStudio: React.FC<DocumentStudioProps> = ({ language, isPro }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const t = TRANSLATIONS[language];
  
  // Mobile Tab State: 'chat' or 'doc'
  const [mobileTab, setMobileTab] = useState<'chat' | 'doc'>('chat');

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  const [docData, setDocData] = useState<GeneratedDocument>({
      title: "LEGAL DOCUMENT",
      sections: [],
      isComplete: false
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check Daily Limit
  const checkAndIncrementLimit = (): boolean => {
      if (isPro) return true;

      const today = new Date().toISOString().split('T')[0];
      const storageKey = 'lawify_docs_daily';
      const raw = localStorage.getItem(storageKey);
      let data = { date: today, count: 0 };

      if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.date === today) {
              data = parsed;
          }
      }

      setUsageCount(data.count); 

      if (data.count >= 3) {
          setShowLimitModal(true);
          return false;
      }

      data.count++;
      localStorage.setItem(storageKey, JSON.stringify(data));
      setUsageCount(data.count);
      return true;
  };

  useEffect(() => {
      const state = location.state as { 
          initialTemplate?: string; 
          restoredDocData?: GeneratedDocument; 
          restoredMessages?: Message[] 
      } | null;

      if (state?.restoredMessages && state.restoredMessages.length > 0) {
          setMessages(state.restoredMessages);
      }
      
      if (state?.restoredDocData) {
          setDocData(state.restoredDocData);
      }

      // If we have a template but no messages (new session), start drafting
      if (state?.initialTemplate && (!state.restoredMessages || state.restoredMessages.length === 0)) {
          if (!checkAndIncrementLimit()) return;

          const startDrafting = async () => {
              setIsLoading(true);
              const prompt = state.initialTemplate || "I want to draft a Legal Document.";
              
              setMessages([{
                  id: 'init',
                  role: 'model',
                  text: language === 'uz' ? "Hujjat yuklanmoqda... Keling, uni to'ldirishni boshlaymiz." : "Loading template... Let's start filling it out.",
                  timestamp: Date.now()
              }]);

              await processTurn(prompt);
          };
          startDrafting();
      }
  }, [location.state]);

  // AUTO SAVE
  useEffect(() => {
      if (messages.length > 0 && docData.sections.length > 0) {
          const timeout = setTimeout(() => {
              saveSession(
                  messages, 
                  'drafter', 
                  docData.title || 'Draft Document', 
                  docData 
              );
          }, 1000);
          return () => clearTimeout(timeout);
      }
  }, [messages, docData]);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processTurn = async (userPrompt: string) => {
      setIsLoading(true);
      
      const response = await draftDocument(
          userPrompt,
          docData,
          language,
          "Legal Document"
      );

      if (response) {
          setMessages(prev => [
              ...prev, 
              { id: Date.now().toString(), role: 'model', text: response.chatResponse, timestamp: Date.now() }
          ]);
          
          if (response.documentUpdate) {
              setDocData(response.documentUpdate);
          }
      } else {
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Connection Error.", timestamp: Date.now() }]);
      }
      
      setIsLoading(false);
  };

  const handleSend = async () => {
      if (!input.trim()) return;
      const text = input;
      setInput('');
      
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: text, timestamp: Date.now() }]);
      await processTurn(text);
  };

  const handleContentBlur = (index: number, newText: string) => {
      const updatedSections = [...docData.sections];
      updatedSections[index].content = newText;
      setDocData({ ...docData, sections: updatedSections });
  };

  const handleTitleBlur = (newTitle: string) => {
      setDocData({ ...docData, title: newTitle });
  };

  const handlePrint = () => {
      window.print();
  };

  const downloadWordDoc = async () => {
    if (!docData.sections.length) return;

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: docData.title,
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),
                ...docData.sections.flatMap(sec => [
                    new Paragraph({
                        text: sec.heading,
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 100 }
                    }),
                    new Paragraph({
                        children: [new TextRun(sec.content)],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 }
                    })
                ])
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${docData.title.replace(/\s+/g, '_')}.docx`);
  };

  const getPages = () => {
      const pages: any[][] = [];
      let currentPage: any[] = [];
      let currentLength = 0;
      const MAX_CHARS_PER_PAGE = 2200; 

      docData.sections.forEach((sec, index) => {
          const secWithIndex = { ...sec, originalIndex: index };
          const secLength = sec.content.length + (sec.heading?.length || 0) + 100;
          
          if (currentLength + secLength > MAX_CHARS_PER_PAGE && currentPage.length > 0) {
              pages.push(currentPage);
              currentPage = [];
              currentLength = 0;
          }
          
          currentPage.push(secWithIndex);
          currentLength += secLength;
      });

      if (currentPage.length > 0) pages.push(currentPage);
      if (pages.length === 0 && docData.title) pages.push([]); 

      return pages;
  };

  const pages = getPages();

  return (
    <div className="flex flex-col md:flex-row h-full bg-slate-100 relative overflow-hidden">
        
        {/* MOBILE TAB SWITCHER */}
        <div className="md:hidden flex bg-white border-b border-gray-200 p-2 shrink-0 z-30">
            <button 
              onClick={() => setMobileTab('chat')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all mr-2 ${mobileTab === 'chat' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-500'}`}
            >
              💬 Chat & Input
            </button>
            <button 
              onClick={() => setMobileTab('doc')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mobileTab === 'doc' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-500'}`}
            >
              📄 Document Preview
            </button>
        </div>

        {/* LEFT PANEL: Chat (Conditionally hidden on mobile) */}
        <div className={`w-full md:w-[35%] md:min-w-[320px] flex flex-col border-r border-gray-200 bg-white shadow-xl z-20 print:hidden ${
            mobileTab === 'chat' ? 'flex h-full' : 'hidden md:flex'
        }`}>
            <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-gray-50 shrink-0">
                <div className="flex items-center">
                    <button onClick={() => navigate('/library')} className="text-gray-500 hover:text-blue-600 mr-2 flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back
                    </button>
                    <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                        {language === 'uz' ? 'AI Kotib' : language === 'ru' ? 'AI Секретарь' : 'AI Secretary'}
                    </h2>
                </div>
                {!isPro && (
                     <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                        {usageCount}/3 Daily Free
                     </span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] p-4 rounded-xl text-sm shadow-sm relative ${
                            m.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white border border-gray-200 text-slate-800 rounded-bl-none'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm rounded-bl-none">
                            <span className="text-xs text-gray-400 ml-2 font-medium">Interviewer is thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                    <input 
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={language === 'uz' ? "Javobingizni yozing..." : "Type your answer..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading || showLimitModal}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || showLimitModal}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </button>
                </div>
            </div>
        </div>

        {/* RIGHT PANEL: Document Preview (Conditionally hidden on mobile) */}
        <div className={`flex-1 bg-gray-200 overflow-y-auto flex flex-col items-center relative gap-8 ${
            mobileTab === 'doc' ? 'flex h-full' : 'hidden md:flex'
        }`}>
            {/* Toolbar */}
            <div className="sticky top-4 z-40 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-4 print:hidden border border-gray-300 mx-4">
                <div className="flex space-x-2">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-100 rounded text-gray-700 text-xs md:text-sm font-medium transition-colors"
                    >
                        <span>Print</span>
                    </button>
                    <button 
                        onClick={downloadWordDoc}
                        disabled={docData.sections.length === 0}
                        className="flex items-center space-x-2 bg-blue-700 text-white px-3 md:px-4 py-1.5 rounded-lg shadow hover:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm font-medium"
                    >
                        <span>Download .DOCX</span>
                    </button>
                </div>
            </div>

            {/* Document Pages */}
            <div className="pb-20 pt-4 flex flex-col items-center gap-8 w-full relative px-2 md:px-0">
                {!isPro && docData.sections.length > 0 && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-10 select-none">
                        <div className="transform -rotate-45 text-5xl md:text-7xl font-bold text-gray-500 whitespace-nowrap text-center">
                            DRAFTED BY LAWIFY AI<br/>NOT FOR OFFICIAL USE
                        </div>
                    </div>
                )}

                {docData.sections.length === 0 ? (
                     <div className="a4-paper relative flex flex-col items-center justify-center text-gray-300">
                         <p className="text-lg">Document Preview</p>
                     </div>
                ) : (
                    pages.map((pageSections, pageIndex) => (
                        <div key={pageIndex} className="a4-paper relative shadow-2xl bg-white text-black print:shadow-none print:m-0 print:w-full z-10">
                            {pageIndex === 0 && (
                                <div className="text-center mb-10 group relative">
                                    <h1 
                                        className="text-xl md:text-2xl font-serif font-bold text-black uppercase tracking-wider mb-2 outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleTitleBlur(e.currentTarget.innerText)}
                                    >
                                        {docData.title}
                                    </h1>
                                    <div className="w-full h-0.5 bg-black"></div>
                                </div>
                            )}

                            <div className="space-y-6 text-justify leading-relaxed font-serif text-xs md:text-sm">
                                {pageSections.map((sec: any) => (
                                    <div 
                                        key={sec.originalIndex} 
                                        className={`mb-4 group relative ${
                                            (pageIndex === 0 && sec.originalIndex === 0) ? 'ml-auto w-1/2 pl-4 border-l-2 border-transparent' : ''
                                        }`}
                                    >
                                        {sec.heading && !sec.heading.toUpperCase().includes("SUD VA TARAFLAR") && (
                                            <h3 className="font-bold text-black mb-1 uppercase outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-1" contentEditable suppressContentEditableWarning>
                                                {sec.heading}
                                            </h3>
                                        )}
                                        <div 
                                            className="whitespace-pre-wrap outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-1"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleContentBlur(sec.originalIndex, e.currentTarget.innerText)}
                                        >
                                            {sec.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute bottom-8 left-0 w-full text-center text-xs text-gray-400 font-serif">
                                Page {pageIndex + 1} of {pages.length}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {showLimitModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                 <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
                     <h3 className="text-xl font-bold text-slate-900 mb-2">Daily Limit Reached</h3>
                     <p className="text-sm text-gray-500 mb-6">You have reached the daily limit. Upgrade to Pro.</p>
                     <button onClick={() => navigate('/plans')} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors">Upgrade to Pro</button>
                     <button onClick={() => setShowLimitModal(false)} className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700">Close</button>
                 </div>
            </div>
        )}
    </div>
  );
};

export default DocumentStudio;
