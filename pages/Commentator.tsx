import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Language } from '../types';
import { Source } from '../types';
import { generateArticleCommentary } from '../services/geminiService';
import { saveCommentatorResult } from '../services/storage';
import Footer from '../components/Footer';

interface CommentatorProps {
  language: Language;
  isPro: boolean;
}

const COMMENTATOR_FREE_LIMIT = 3;

const Commentator: React.FC<CommentatorProps> = ({ language, isPro }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lawName, setLawName] = useState('');
  const [articleNumber, setArticleNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; sources: Source[] } | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const L = {
    title:          language === Language.UZ ? 'AI yuridik sharh beruvchi'         : language === Language.RU ? 'AI Юридический Комментатор'         : 'AI Legal Commentator',
    subtitle:       language === Language.UZ ? "Qonun nomi va modda raqamini kiriting — AI lex.uz'dan rasmiy matnni topib, chuqur yuridik sharh beradi" : language === Language.RU ? "Введите название закона и номер статьи — AI найдёт официальный текст на lex.uz и даст развёрнутый юридический комментарий" : "Enter a law name and article number — AI finds the official text on lex.uz and delivers in-depth legal commentary",
    lawLabel:       language === Language.UZ ? 'Qonun / Kodeks nomi'               : language === Language.RU ? 'Название закона / кодекса'           : 'Law / Code Name',
    lawPlaceholder: language === Language.UZ ? 'Masalan: Mehnat kodeksi'            : language === Language.RU ? 'Пример: Трудовой кодекс'             : 'E.g. Labor Code',
    artLabel:       language === Language.UZ ? 'Modda raqami'                       : language === Language.RU ? 'Номер статьи'                        : 'Article Number',
    artPlaceholder: language === Language.UZ ? 'Masalan: 100'                       : language === Language.RU ? 'Пример: 100'                         : 'E.g. 100',
    analyze:        language === Language.UZ ? 'Sharh Olish'                        : language === Language.RU ? 'Получить Комментарий'                : 'Get Commentary',
    analyzing:      language === Language.UZ ? 'lex.uz qidirilmoqda...'             : language === Language.RU ? 'Поиск на lex.uz...'                  : 'Searching lex.uz...',
    sources:        language === Language.UZ ? 'Manbalar'                           : language === Language.RU ? 'Источники'                          : 'Sources',
    emptyTitle:     language === Language.UZ ? 'Qonun va modda kiriting'            : language === Language.RU ? 'Введите закон и статью'              : 'Enter Law & Article',
    emptyDesc:      language === Language.UZ ? "AI lex.uz va norma.uz'dan rasmiy matnni qidiradi va 5 bo'limli chuqur yuridik sharh yozadi" : language === Language.RU ? "AI найдёт официальный текст на lex.uz / norma.uz и напишет 5-разделный развёрнутый юридический комментарий" : "AI finds the official text on lex.uz / norma.uz and writes a 5-section in-depth legal commentary",
    formCard:       language === Language.UZ ? 'Qonun va Modda'                     : language === Language.RU ? 'Закон и Статья'                      : 'Law & Article',
    newSearch:      language === Language.UZ ? 'Yangi qidiruv'                      : language === Language.RU ? 'Новый поиск'                         : 'New Search',
    usageLabel:     language === Language.UZ ? 'bepul sharh'                        : language === Language.RU ? 'бесплатных запроса'                  : 'free uses',
    limitTitle:     language === Language.UZ ? 'Kunlik limit tugadi'                : language === Language.RU ? 'Дневной лимит исчерпан'              : 'Daily limit reached',
    limitDesc:      language === Language.UZ ? `Bepul rejada kuniga ${COMMENTATOR_FREE_LIMIT} ta yuridik sharh beriladi. Cheksiz sharhlar uchun Pro rejaga o'ting.` : language === Language.RU ? `В бесплатном плане доступно ${COMMENTATOR_FREE_LIMIT} комментария в день. Перейдите на Pro для безлимитного доступа.` : `The free plan includes ${COMMENTATOR_FREE_LIMIT} commentaries per day. Upgrade to Pro for unlimited access.`,
    upgrade:        language === Language.UZ ? "Pro rejaga o'tish"                  : language === Language.RU ? 'Перейти на Pro'                      : 'Upgrade to Pro',
    close:          language === Language.UZ ? 'Yopish'                             : language === Language.RU ? 'Закрыть'                            : 'Close',
  };

  useEffect(() => {
    if (!isPro) {
      const today = new Date().toISOString().split('T')[0];
      const raw = localStorage.getItem('lawify_commentator_daily');
      if (raw) {
        const p = JSON.parse(raw);
        if (p.date === today) setUsageCount(p.count);
      }
    }
  }, [isPro]);

  useEffect(() => {
    const state = location.state as { lawName?: string; articleNumber?: string; restoredResult?: string } | null;
    if (state?.restoredResult) {
      setLawName(state.lawName || '');
      setArticleNumber(state.articleNumber || '');
      setResult({ text: state.restoredResult, sources: [] });
    }
  }, []);

  const checkAndIncrementLimit = (): boolean => {
    if (isPro) return true;
    const today = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem('lawify_commentator_daily');
    let data = { date: today, count: 0 };
    if (raw) { const p = JSON.parse(raw); if (p.date === today) data = p; }
    if (data.count >= COMMENTATOR_FREE_LIMIT) { setShowLimitModal(true); return false; }
    data.count++;
    localStorage.setItem('lawify_commentator_daily', JSON.stringify(data));
    setUsageCount(data.count);
    return true;
  };

  const handleSubmit = async () => {
    if (!lawName.trim() || !articleNumber.trim() || isLoading) return;
    if (!checkAndIncrementLimit()) return;
    setIsLoading(true);
    setResult(null);
    const res = await generateArticleCommentary(lawName.trim(), articleNumber.trim(), language);
    setResult(res);
    saveCommentatorResult(lawName.trim(), articleNumber.trim(), res.text);
    setIsLoading(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const parseResultSections = (text: string) => {
    const sectionRegex = /\[SECTION:([^\]:]+):([^\]]+)\]([\s\S]*?)\[\/SECTION\]/g;
    const sections: { emoji: string; header: string; content: string }[] = [];
    let match;
    while ((match = sectionRegex.exec(text)) !== null) {
      sections.push({ emoji: match[1].trim(), header: match[2].trim(), content: match[3].trim() });
    }
    if (sections.length === 0 && text.trim()) {
      sections.push({ emoji: '📋', header: language === Language.UZ ? 'Natija' : language === Language.RU ? 'Результат' : 'Result', content: text.trim() });
    }
    return sections;
  };

  const renderText = (text: string) => {
    const clean = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^#{1,6}\s+/gm, '').replace(/`/g, '');
    return clean.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-1.5" />;
      return <p key={i} className="mb-1.5 leading-relaxed text-slate-700">{line}</p>;
    });
  };

  const sectionStyles = [
    { border: '#bfdbfe', headerBg: 'linear-gradient(135deg, #dbeafe, #eff6ff)' },
    { border: '#ddd6fe', headerBg: 'linear-gradient(135deg, #ede9fe, #faf5ff)' },
    { border: '#fed7aa', headerBg: 'linear-gradient(135deg, #ffedd5, #fff7ed)' },
    { border: '#bbf7d0', headerBg: 'linear-gradient(135deg, #dcfce7, #f0fdf4)' },
    { border: '#fde68a', headerBg: 'linear-gradient(135deg, #fef9c3, #fefce8)' },
  ];

  const remainingFree = Math.max(0, COMMENTATOR_FREE_LIMIT - usageCount);

  return (
    <div className="h-full overflow-y-auto flex flex-col" style={{ background: '#f8fafc' }}>

      {/* DARK HEADER */}
      <div className="shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 55%, #1e1b4b 100%)' }}>
        <div className="absolute pointer-events-none" style={{ top: '-60px', right: '6%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(124,58,237,0.13) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-40px', left: '4%', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full mb-5"
                style={{ background: 'rgba(124,58,237,0.14)', border: '1px solid rgba(124,58,237,0.3)' }}>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-purple-300 font-bold text-xs uppercase tracking-widest">AI · lex.uz · norma.uz</span>
              </div>
              <h1 className="gradient-text font-serif font-bold mb-3"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.15 }}>
                {L.title}
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">{L.subtitle}</p>

              {!isPro && (
                <div className="mt-4 inline-flex items-center space-x-2.5 px-4 py-2 rounded-xl"
                  style={{ background: remainingFree === 0 ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.07)', border: remainingFree === 0 ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="flex space-x-1">
                    {Array.from({ length: COMMENTATOR_FREE_LIMIT }).map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full"
                        style={{ background: i < usageCount ? '#ef4444' : '#34d399' }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold" style={{ color: remainingFree === 0 ? '#f87171' : '#94a3b8' }}>
                    {remainingFree} / {COMMENTATOR_FREE_LIMIT} {L.usageLabel}
                  </span>
                </div>
              )}
            </div>
            <div className="hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-3xl shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-4xl">⚖️</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">Sharh</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-6 items-start">

        {/* LEFT: Form */}
        <div className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
            <div className="px-6 py-4"
              style={{ background: 'linear-gradient(135deg, #eff6ff, #f0f0ff)', borderBottom: '1px solid #e2e8f0' }}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#2563eb18', fontSize: '14px' }}>📝</div>
                <span className="font-bold text-slate-700 text-sm">{L.formCard}</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{L.lawLabel}</label>
                <input
                  value={lawName}
                  onChange={e => setLawName(e.target.value)}
                  placeholder={L.lawPlaceholder}
                  className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                  style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed60'; e.target.style.background = 'white'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{L.artLabel}</label>
                <input
                  value={articleNumber}
                  onChange={e => setArticleNumber(e.target.value)}
                  placeholder={L.artPlaceholder}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                  style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed60'; e.target.style.background = 'white'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !lawName.trim() || !articleNumber.trim()}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] flex items-center justify-center space-x-2"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{L.analyzing}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>{L.analyze}</span>
                  </>
                )}
              </button>
              {result && (
                <button
                  onClick={() => { setResult(null); setLawName(''); setArticleNumber(''); }}
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                  style={{ border: '1px solid #e2e8f0' }}
                >{L.newSearch}</button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="flex-1 min-w-0" ref={resultsRef}>
          {!result && !isLoading && (
            <div className="flex flex-col items-center justify-center text-center py-20 px-8 bg-white rounded-3xl"
              style={{ border: '1px solid #e2e8f0', minHeight: '320px' }}>
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
                style={{ background: 'linear-gradient(135deg, #f0f0ff, #ede9fe)' }}>⚖️</div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">{L.emptyTitle}</h3>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">{L.emptyDesc}</p>
              <div className="flex items-center gap-2 mt-6">
                {['lex.uz', 'norma.uz', 'zakon.uz'].map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: '#f0f0ff', color: '#4f46e5' }}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center py-20 px-8 bg-white rounded-3xl"
              style={{ border: '1px solid #e2e8f0', minHeight: '320px' }}>
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
                style={{ background: 'linear-gradient(135deg, #1e1b4b, #0d1a3a)' }}>
                <div className="w-8 h-8 rounded-full animate-spin"
                  style={{ border: '3px solid transparent', borderTopColor: 'white' }} />
              </div>
              <p className="text-base font-semibold text-slate-700 mb-1">{lawName} · {articleNumber}-modda</p>
              <p className="text-sm text-slate-400">{L.analyzing}</p>
              <div className="flex items-center space-x-1.5 mt-5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: '#7c3aed', animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-6 py-4 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #1e1b4b, #0d1a3a)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                    style={{ background: 'rgba(124,58,237,0.3)' }}>⚖️</div>
                  <div>
                    <p className="text-white font-bold text-sm">{lawName}</p>
                    <p className="text-purple-300 text-xs font-medium">{articleNumber}-modda</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>✓ Found</span>
              </div>

              {parseResultSections(result.text).map((section, i) => {
                const s = sectionStyles[i % sectionStyles.length];
                return (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-fade-in"
                    style={{ border: `1px solid ${s.border}`, animationDelay: `${i * 70}ms` }}>
                    <div className="px-6 py-4" style={{ background: s.headerBg, borderBottom: `1px solid ${s.border}` }}>
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{section.emoji}</span>
                        <h3 className="font-bold text-slate-800">{section.header}</h3>
                      </div>
                    </div>
                    <div className="p-6 text-sm leading-relaxed">
                      {renderText(section.content)}
                    </div>
                  </div>
                );
              })}

              {result.sources.length > 0 && (
                <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{L.sources}</p>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.slice(0, 6).map((src, i) => (
                      <a key={i} href={src.uri} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                        style={{ background: '#f0f0ff', color: '#4f46e5', border: '1px solid #ddd6fe' }}>
                        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="max-w-[200px] truncate">{src.title || src.uri}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* LIMIT MODAL */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md rounded-3xl p-8 relative"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>🚫</div>
              <h3 className="text-white font-bold text-xl mb-2">{L.limitTitle}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{L.limitDesc}</p>
            </div>
            <div className="flex justify-center space-x-2 mb-6">
              {Array.from({ length: COMMENTATOR_FREE_LIMIT }).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-red-500" />
              ))}
            </div>
            <button
              onClick={() => { setShowLimitModal(false); navigate('/plans'); }}
              className="w-full py-3.5 rounded-xl font-bold text-white mb-3"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
              {L.upgrade}
            </button>
            <button
              onClick={() => setShowLimitModal(false)}
              className="w-full py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 transition-colors">
              {L.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commentator;
