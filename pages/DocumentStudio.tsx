
import React, { useState, useEffect, useRef } from 'react';
import { View, Language, GeneratedDocument, Message, DocSection } from '../types';
import { TRANSLATIONS } from '../constants';
import { draftDocument } from '../services/geminiService';
import { saveSession } from '../services/storage';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import saveAs from 'file-saver';

interface DocumentStudioProps {
  onNavigate: (view: View) => void;
  language: Language;
  initialTemplate?: string; // The prompt from Library
  initialDocType?: string;
  isPro: boolean;
  initialDocData?: GeneratedDocument; // Restored document data
  initialMessages?: Message[]; // Restored chat messages
}

const DocumentStudio: React.FC<DocumentStudioProps> = ({ 
    onNavigate, 
    language, 
    initialTemplate, 
    initialDocType = "Legal Document",
    isPro,
    initialDocData,
    initialMessages
}) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Limit State
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  // Document State
  const [docData, setDocData] = useState<GeneratedDocument>({
      title: initialDocType.toUpperCase(),
      sections: [],
      isComplete: false
  });

  // Track the actively editing section index to update state
  const activeSectionRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper: Check Daily Limit
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

  // RESTORE or INITIALIZE
  useEffect(() => {
      if (initialMessages && initialMessages.length > 0) {
          setMessages(initialMessages);
      }
      if (initialDocData) {
          setDocData(initialDocData);
      }
  }, [initialMessages, initialDocData]);

  // INITIAL PROMPT
  useEffect(() => {
    // Only run if we don't have messages yet (new session)
    if (messages.length === 0 && !initialMessages) {
        if (!checkAndIncrementLimit()) {
            return; 
        }

        const startDrafting = async () => {
            setIsLoading(true);
            const prompt = initialTemplate || `I want to draft a ${initialDocType}.`;
            
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
  }, []);

  // AUTO SAVE SESSION
  useEffect(() => {
      if (messages.length > 0 && docData.sections.length > 0) {
          // Debounce saving slightly or just save
          const timeout = setTimeout(() => {
              saveSession(
                  messages, 
                  'drafter', 
                  docData.title || 'Draft Document', 
                  docData // Save the full document JSON as customData
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
          initialDocType
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

  // --- MANUAL EDITING LOGIC ---
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

  // --- Pagination Logic ---
  const getPages = () => {
      const pages: any[][] = [];
      let currentPage: any[] = [];
      let currentLength = 0;
      const MAX_CHARS_PER_PAGE = 2200; 

      docData.sections.forEach((sec, index) => {
          // Attach original index to section for editing callback
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
    <div className="flex h-full bg-slate-100 relative overflow-hidden">
        {/* LEFT PANEL: Chat / Interviewer (30%) */}
        <div className="w-[35%] min-w-[320px] flex flex-col border-r border-gray-200 bg-white shadow-xl z-20 print:hidden">
            <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-gray-50 shrink-0">
                <div className="flex items-center">
                    <button onClick={() => onNavigate(View.LIBRARY)} className="text-gray-500 hover:text-blue-600 mr-2 flex items-center">
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
                            {m.role === 'model' && (
                                <div className="absolute -left-2 -top-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                                    AI
                                </div>
                            )}
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm rounded-bl-none">
                            <div className="flex space-x-1 items-center">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-75"></div>
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-150"></div>
                                <span className="text-xs text-gray-400 ml-2 font-medium">Interviewer is thinking...</span>
                            </div>
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

        {/* RIGHT PANEL: Live Document Preview (Word-like Editor) */}
        <div className="flex-1 bg-gray-200 overflow-y-auto flex flex-col items-center relative gap-8">
            
            {/* Word-like Toolbar */}
            <div className="sticky top-4 z-40 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-4 print:hidden border border-gray-300">
                <div className="flex space-x-1 border-r border-gray-200 pr-4">
                    <button className="p-2 hover:bg-gray-100 rounded text-gray-700 font-serif font-bold">B</button>
                    <button className="p-2 hover:bg-gray-100 rounded text-gray-700 font-serif italic">I</button>
                    <button className="p-2 hover:bg-gray-100 rounded text-gray-700 font-serif underline">U</button>
                </div>
                <div className="flex space-x-2">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-100 rounded text-gray-700 text-sm font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                        <span>Print</span>
                    </button>
                    <button 
                        onClick={downloadWordDoc}
                        disabled={docData.sections.length === 0}
                        className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-1.5 rounded-lg shadow hover:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        <span>Download .DOCX</span>
                    </button>
                </div>
            </div>

            {/* Document Pages */}
            <div className="pb-20 pt-4 flex flex-col items-center gap-8 w-full relative">
                {/* WATERMARK FOR FREE USERS */}
                {!isPro && docData.sections.length > 0 && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-10 select-none">
                        <div className="transform -rotate-45 text-5xl md:text-7xl font-bold text-gray-500 whitespace-nowrap text-center">
                            DRAFTED BY LAWIFY AI<br/>
                            NOT FOR OFFICIAL USE
                        </div>
                    </div>
                )}

                {docData.sections.length === 0 ? (
                     <div className="a4-paper relative flex flex-col items-center justify-center text-gray-300">
                         <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                         <p className="text-lg">Document Preview</p>
                         <p className="text-sm">Start answering questions to generate.</p>
                     </div>
                ) : (
                    pages.map((pageSections, pageIndex) => (
                        <div key={pageIndex} className="a4-paper relative shadow-2xl bg-white text-black print:shadow-none print:m-0 print:w-full z-10">
                            {/* Page Header (Editable Title on Page 1) */}
                            {pageIndex === 0 && (
                                <div className="text-center mb-10 group relative">
                                    <h1 
                                        className="text-2xl font-serif font-bold text-black uppercase tracking-wider mb-2 outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleTitleBlur(e.currentTarget.innerText)}
                                    >
                                        {docData.title}
                                    </h1>
                                    <div className="w-full h-0.5 bg-black"></div>
                                    <span className="absolute -top-6 right-0 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">Click to Edit Title</span>
                                </div>
                            )}

                            {/* Page Content (Editable Sections) */}
                            <div className="space-y-6 text-justify leading-relaxed font-serif text-sm">
                                {pageSections.map((sec: any) => (
                                    <div 
                                        key={sec.originalIndex} 
                                        className={`mb-4 group relative ${
                                            /* Right-align Parties section if on page 1 */
                                            (pageIndex === 0 && sec.originalIndex === 0)
                                            ? 'ml-auto w-1/2 pl-4 border-l-2 border-transparent' 
                                            : ''
                                        }`}
                                    >
                                        {/* Editable Heading */}
                                        {sec.heading && !sec.heading.toUpperCase().includes("SUD VA TARAFLAR") && (
                                            <h3 
                                                className="font-bold text-black mb-1 uppercase outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-1"
                                                contentEditable={true}
                                                suppressContentEditableWarning={true}
                                            >
                                                {sec.heading}
                                            </h3>
                                        )}
                                        
                                        <div 
                                            className="whitespace-pre-wrap outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-1"
                                            contentEditable={true}
                                            suppressContentEditableWarning={true}
                                            onBlur={(e) => handleContentBlur(sec.originalIndex, e.currentTarget.innerText)}
                                        >
                                            {sec.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Page Footer */}
                            <div className="absolute bottom-8 left-0 w-full text-center text-xs text-gray-400 font-serif">
                                Page {pageIndex + 1} of {pages.length}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Limit Modal */}
        {showLimitModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                 <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
                     <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                         ⏳
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">Daily Limit Reached</h3>
                     <p className="text-sm text-gray-500 mb-6">
                         You have reached the daily limit for document drafting. Please upgrade to Pro for unlimited access.
                     </p>
                     <button 
                         onClick={() => onNavigate(View.PLANS)}
                         className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
                     >
                         Upgrade to Pro
                     </button>
                     <button 
                         onClick={() => setShowLimitModal(false)}
                         className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700"
                     >
                         Close
                     </button>
                 </div>
            </div>
        )}
    </div>
  );
};

export default DocumentStudio;
