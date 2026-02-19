
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

  const [mobileTab, setMobileTab] = useState<'chat' | 'doc'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  const [docData, setDocData] = useState<GeneratedDocument>({
    title: "LEGAL DOCUMENT",
    sections: [],
    isComplete: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const checkAndIncrementLimit = (): boolean => {
    if (isPro) return true;
    const today = new Date().toISOString().split('T')[0];
    const storageKey = 'lawify_docs_daily';
    const raw = localStorage.getItem(storageKey);
    let data = { date: today, count: 0 };
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === today) data = parsed;
    }
    setUsageCount(data.count);
    if (data.count >= 3) { setShowLimitModal(true); return false; }
    data.count++;
    localStorage.setItem(storageKey, JSON.stringify(data));
    setUsageCount(data.count);
    return true;
  };

  useEffect(() => {
    const state = location.state as {
      initialTemplate?: string;
      restoredDocData?: GeneratedDocument;
      restoredMessages?: Message[];
    } | null;

    if (state?.restoredMessages && state.restoredMessages.length > 0) setMessages(state.restoredMessages);
    if (state?.restoredDocData) setDocData(state.restoredDocData);

    if (state?.initialTemplate && (!state.restoredMessages || state.restoredMessages.length === 0)) {
      if (!checkAndIncrementLimit()) return;
      const startDrafting = async () => {
        setIsLoading(true);
        const prompt = state.initialTemplate || "I want to draft a Legal Document.";
        setMessages([{
          id: 'init', role: 'model',
          text: language === 'uz'
            ? "Hujjat yuklanmoqda... Keling, uni to'ldirishni boshlaymiz."
            : "Loading template... Let's start filling it out.",
          timestamp: Date.now(),
        }]);
        await processTurn(prompt);
      };
      startDrafting();
    }
  }, [location.state]);

  useEffect(() => {
    if (messages.length > 0 && docData.sections.length > 0) {
      const timeout = setTimeout(() => {
        saveSession(messages, 'drafter', docData.title || 'Draft Document', docData);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [messages, docData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processTurn = async (userPrompt: string) => {
    setIsLoading(true);
    const response = await draftDocument(userPrompt, docData, language, "Legal Document");
    if (response) {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'model', text: response.chatResponse, timestamp: Date.now() },
      ]);
      if (response.documentUpdate) setDocData(response.documentUpdate);
    } else {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'model', text: "Connection Error.", timestamp: Date.now() },
      ]);
    }
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() }]);
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

  const handlePrint = () => window.print();

  const downloadWordDoc = async () => {
    if (!docData.sections.length) return;
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: docData.title, heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER, spacing: { after: 400 },
          }),
          ...docData.sections.flatMap(sec => [
            new Paragraph({ text: sec.heading, heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
            new Paragraph({ children: [new TextRun(sec.content)], alignment: AlignmentType.JUSTIFIED, spacing: { after: 200 } }),
          ]),
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

  const L = {
    chatTab: language === Language.UZ ? 'AI Suhbat' : language === Language.RU ? 'AI Чат' : 'AI Chat',
    docTab: language === Language.UZ ? 'Hujjat' : language === Language.RU ? 'Документ' : 'Document',
    kotib: language === Language.UZ ? 'AI Kotib' : language === Language.RU ? 'AI Секретарь' : 'AI Secretary',
    subtitle: language === Language.UZ ? 'Huquqiy Hujjat Yaratuvchi' : language === Language.RU ? 'Составитель правовых документов' : 'Legal Document Drafter',
    placeholder: language === Language.UZ ? "Javobingizni yozing..." : language === Language.RU ? "Введите ответ..." : "Type your answer...",
    thinking: language === Language.UZ ? "AI yozmoqda..." : language === Language.RU ? "AI пишет..." : "AI is writing...",
    dailyFree: language === Language.UZ ? 'kunlik bepul' : language === Language.RU ? 'бесплатно/день' : 'daily free',
    limitTitle: language === Language.UZ ? 'Kunlik limit tugadi' : language === Language.RU ? 'Дневной лимит исчерпан' : 'Daily Limit Reached',
    limitDesc: language === Language.UZ ? "Bugungi bepul limitingiz tugadi. Pro ga o'ting." : language === Language.RU ? "Ваш бесплатный лимит на сегодня исчерпан. Перейдите на Pro." : "You've reached today's free limit. Upgrade to Pro.",
    upgrade: language === Language.UZ ? "Pro ga o'tish" : language === Language.RU ? "Перейти на Pro" : "Upgrade to Pro",
    close: language === Language.UZ ? 'Yopish' : language === Language.RU ? 'Закрыть' : 'Close',
    emptyDoc: language === Language.UZ ? "Hujjat ko'rinishi" : language === Language.RU ? "Предварительный просмотр" : "Document Preview",
    emptyDocDesc: language === Language.UZ ? "AI bilan suhbatlashganingiz sayin hujjat shu yerda paydo bo'ladi" : language === Language.RU ? "Документ появится здесь по мере вашего общения с AI" : "Your document will appear here as you chat with AI",
    back: language === Language.UZ ? 'Orqaga' : language === Language.RU ? 'Назад' : 'Back',
  };

  return (
    <div className="flex flex-col md:flex-row h-full relative overflow-hidden" style={{ background: '#f1f5f9' }}>

      {/* ── MOBILE TAB SWITCHER ─────────────────────────────────────── */}
      <div
        className="md:hidden shrink-0 z-30"
        style={{ background: 'linear-gradient(135deg, #0a0f1e, #0d1a3a)' }}
      >
        <div className="flex p-2.5 gap-2">
          {[
            { id: 'chat' as const, label: L.chatTab, icon: '💬' },
            { id: 'doc' as const, label: L.docTab, icon: '📄' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
              style={
                mobileTab === tab.id
                  ? { background: 'rgba(37,99,235,0.9)', color: 'white', boxShadow: '0 4px 16px rgba(37,99,235,0.4)' }
                  : { background: 'rgba(255,255,255,0.07)', color: 'rgba(148,163,184,0.9)' }
              }
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── LEFT PANEL: Chat ─────────────────────────────────────────── */}
      <div
        className={`w-full md:w-[36%] md:min-w-[320px] flex flex-col z-20 print:hidden ${
          mobileTab === 'chat' ? 'flex h-full' : 'hidden md:flex'
        }`}
        style={{ background: 'white', borderRight: '1px solid #e2e8f0' }}
      >
        {/* Panel header */}
        <div
          className="shrink-0 px-5 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/library')}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
              style={{ color: 'rgba(148,163,184,0.9)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
              style={{ background: 'rgba(37,99,235,0.25)', border: '1px solid rgba(37,99,235,0.4)' }}
            >
              📝
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">{L.kotib}</p>
              <p className="text-blue-300 text-[10px] font-medium mt-0.5">{L.subtitle}</p>
            </div>
          </div>
          {!isPro && (
            <div
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <span className="text-slate-400 text-[10px] font-mono">{usageCount}/3</span>
              <span className="text-slate-500 text-[9px] font-medium">{L.dailyFree}</span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: '#f8fafc' }}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)' }}
              >
                📝
              </div>
              <p className="text-slate-500 text-sm font-medium">
                {language === Language.UZ ? "AI Kotib tayyor" : language === Language.RU ? "AI Секретарь готов" : "AI Secretary ready"}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {language === Language.UZ ? "Shablonni tanlang yoki savol yozing" : language === Language.RU ? "Выберите шаблон или задайте вопрос" : "Select a template or start typing"}
              </p>
            </div>
          )}

          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
              {m.role === 'model' && (
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                >
                  AI
                </div>
              )}
              <div
                className="max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm"
                style={
                  m.role === 'user'
                    ? {
                        background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                        color: 'white',
                        borderBottomRightRadius: '4px',
                      }
                    : {
                        background: 'white',
                        color: '#334155',
                        border: '1px solid #e2e8f0',
                        borderBottomLeftRadius: '4px',
                      }
                }
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
              >
                AI
              </div>
              <div
                className="px-4 py-3 rounded-2xl shadow-sm"
                style={{ background: 'white', border: '1px solid #e2e8f0', borderBottomLeftRadius: '4px' }}
              >
                <div className="flex items-center space-x-1.5">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: '#94a3b8', animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-1">{L.thinking}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="shrink-0 p-4 bg-white" style={{ borderTop: '1px solid #f1f5f9' }}>
          <div
            className="flex items-center gap-2 rounded-2xl px-4 py-2.5"
            style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
          >
            <input
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              placeholder={L.placeholder}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={isLoading || showLimitModal}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || showLimitModal || !input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', flexShrink: 0 }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Document Preview ───────────────────────────── */}
      <div
        className={`flex-1 flex flex-col relative ${mobileTab === 'doc' ? 'flex h-full' : 'hidden md:flex'}`}
        style={{ background: '#e2e8f0' }}
      >
        {/* Toolbar */}
        <div
          className="sticky top-0 z-40 print:hidden mx-4 mt-4 rounded-2xl px-5 py-3 flex items-center justify-between shadow-md"
          style={{ background: 'white', border: '1px solid #e2e8f0' }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              {docData.title || 'LEGAL DOCUMENT'}
            </span>
            {docData.isComplete && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#059669' }}>
                ✓ Complete
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="hidden md:inline">Print</span>
            </button>
            <button
              onClick={downloadWordDoc}
              disabled={docData.sections.length === 0}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e1b4b)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download .DOCX</span>
            </button>
          </div>
        </div>

        {/* Document pages area */}
        <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col items-center gap-8 relative">
          {/* Watermark for free users */}
          {!isPro && docData.sections.length > 0 && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.07] select-none">
              <div className="transform -rotate-45 text-4xl md:text-6xl font-bold text-gray-500 whitespace-nowrap text-center">
                DRAFTED BY LAWIFY AI<br />NOT FOR OFFICIAL USE
              </div>
            </div>
          )}

          {/* Empty state */}
          {docData.sections.length === 0 && (
            <div
              className="a4-paper relative flex flex-col items-center justify-center text-center z-10"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
                style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)' }}
              >
                📄
              </div>
              <p className="text-lg font-bold text-slate-400">{L.emptyDoc}</p>
              <p className="text-sm text-slate-300 mt-2 max-w-xs leading-relaxed">{L.emptyDocDesc}</p>
            </div>
          )}

          {/* Document pages */}
          {docData.sections.length > 0 && pages.map((pageSections, pageIndex) => (
            <div
              key={pageIndex}
              className="a4-paper relative shadow-2xl bg-white text-black print:shadow-none print:m-0 print:w-full z-10"
            >
              {pageIndex === 0 && (
                <div className="text-center mb-10 group relative">
                  <h1
                    className="text-xl md:text-2xl font-serif font-bold text-black uppercase tracking-wider mb-2 outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => handleTitleBlur(e.currentTarget.innerText)}
                  >
                    {docData.title}
                  </h1>
                  <div className="w-full h-0.5 bg-black" />
                </div>
              )}

              <div className="space-y-6 text-justify leading-relaxed font-serif text-xs md:text-sm">
                {pageSections.map((sec: any) => (
                  <div
                    key={sec.originalIndex}
                    className={`mb-4 group relative ${
                      pageIndex === 0 && sec.originalIndex === 0 ? 'ml-auto w-1/2 pl-4 border-l-2 border-transparent' : ''
                    }`}
                  >
                    {sec.heading && !sec.heading.toUpperCase().includes("SUD VA TARAFLAR") && (
                      <h3
                        className="font-bold text-black mb-1 uppercase outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-1"
                        contentEditable suppressContentEditableWarning
                      >
                        {sec.heading}
                      </h3>
                    )}
                    <div
                      className="whitespace-pre-wrap outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-1"
                      contentEditable suppressContentEditableWarning
                      onBlur={e => handleContentBlur(sec.originalIndex, e.currentTarget.innerText)}
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
          ))}
        </div>
      </div>

      {/* ── LIMIT MODAL ──────────────────────────────────────────────── */}
      {showLimitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)' }}
          >
            {/* Modal header */}
            <div className="px-8 pt-8 pb-6 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                🚫
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{L.limitTitle}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{L.limitDesc}</p>
            </div>

            {/* Stats */}
            <div
              className="mx-8 mb-6 px-4 py-3 rounded-2xl flex items-center justify-between"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              <span className="text-xs text-slate-500 font-medium">Today's usage</span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-6 h-1.5 rounded-full"
                    style={{ background: i < usageCount ? '#ef4444' : 'rgba(255,255,255,0.1)' }}
                  />
                ))}
              </div>
            </div>

            <div className="px-8 pb-8 space-y-3">
              <button
                onClick={() => navigate('/plans')}
                className="w-full py-3.5 rounded-2xl font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 24px rgba(37,99,235,0.4)' }}
              >
                {L.upgrade}
              </button>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full py-2.5 rounded-2xl text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
              >
                {L.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentStudio;
