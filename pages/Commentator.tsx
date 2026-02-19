import React, { useState, useRef } from 'react';
import { Language } from '../types';
import { Source } from '../types';
import { generateArticleCommentary } from '../services/geminiService';
import Footer from '../components/Footer';

interface CommentatorProps {
  language: Language;
}

const Commentator: React.FC<CommentatorProps> = ({ language }) => {
  const [lawName, setLawName] = useState('');
  const [articleNumber, setArticleNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; sources: Source[] } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const L = {
    title: language === Language.UZ ? 'AI Yuridik Sharh Beruvchi' : language === Language.RU ? 'AI Юридический Комментатор' : 'AI Legal Commentator',
    subtitle:
      language === Language.UZ
        ? "Qonun nomi va modda raqamini kiriting — AI rasmiy matnni topib, chuqur yuridik sharh beradi"
        : language === Language.RU
        ? "Введите название закона и номер статьи — AI найдёт официальный текст и даст юридический комментарий"
        : "Enter a law name and article number — AI finds the official text and provides in-depth legal commentary",
    lawLabel: language === Language.UZ ? 'Qonun / Kodeks nomi' : language === Language.RU ? 'Название закона / кодекса' : 'Law / Code Name',
    lawPlaceholder: language === Language.UZ ? "Masalan: Mehnat kodeksi" : language === Language.RU ? "Пример: Трудовой кодекс" : "E.g. Labor Code",
    articleLabel: language === Language.UZ ? 'Modda raqami' : language === Language.RU ? 'Номер статьи' : 'Article Number',
    articlePlaceholder: language === Language.UZ ? "Masalan: 100" : language === Language.RU ? "Пример: 100" : "E.g. 100",
    analyze: language === Language.UZ ? 'Sharh Olish' : language === Language.RU ? 'Получить Комментарий' : 'Get Commentary',
    analyzing: language === Language.UZ ? 'lex.uz qidirilmoqda...' : language === Language.RU ? 'Поиск на lex.uz...' : 'Searching lex.uz...',
    examples: language === Language.UZ ? 'Tez Namunalar' : language === Language.RU ? 'Быстрые примеры' : 'Quick Examples',
    sources: language === Language.UZ ? "Manbalar" : language === Language.RU ? "Источники" : "Sources",
    emptyTitle: language === Language.UZ ? 'Qonun va modda kiriting' : language === Language.RU ? 'Введите закон и статью' : 'Enter Law & Article',
    emptyDesc:
      language === Language.UZ
        ? "AI lex.uz va norma.uz'dan rasmiy matnni qidiradi va professional yuridik sharh yozadi"
        : language === Language.RU
        ? "AI найдёт официальный текст на lex.uz / norma.uz и напишет профессиональный юридический комментарий"
        : "AI will find the official text on lex.uz / norma.uz and write a professional legal commentary",
    formCard: language === Language.UZ ? 'Qonun va Modda' : language === Language.RU ? 'Закон и Статья' : 'Law & Article',
    newSearch: language === Language.UZ ? 'Yangi qidiruv' : language === Language.RU ? 'Новый поиск' : 'New Search',
  };

  const examples = language === Language.UZ
    ? [
        { law: 'Mehnat kodeksi', article: '100', label: "100-modda — Ishdan bo'shatish" },
        { law: 'Oila kodeksi', article: '14', label: '14-modda — Nikoh shartlari' },
        { law: 'Jinoyat kodeksi', article: '168', label: "168-modda — O'g'irlik" },
        { law: 'Fuqarolik kodeksi', article: '386', label: '386-modda — Shartnoma' },
      ]
    : language === Language.RU
    ? [
        { law: 'Трудовой кодекс', article: '100', label: 'Ст. 100 — Увольнение' },
        { law: 'Семейный кодекс', article: '14', label: 'Ст. 14 — Условия брака' },
        { law: 'Уголовный кодекс', article: '168', label: 'Ст. 168 — Кража' },
        { law: 'Гражданский кодекс', article: '386', label: 'Ст. 386 — Договор' },
      ]
    : [
        { law: 'Labor Code', article: '100', label: 'Art. 100 — Dismissal' },
        { law: 'Family Code', article: '14', label: 'Art. 14 — Marriage Conditions' },
        { law: 'Criminal Code', article: '168', label: 'Art. 168 — Theft' },
        { law: 'Civil Code', article: '386', label: 'Art. 386 — Contract' },
      ];

  const handleSubmit = async () => {
    if (!lawName.trim() || !articleNumber.trim() || isLoading) return;
    setIsLoading(true);
    setResult(null);
    const res = await generateArticleCommentary(lawName.trim(), articleNumber.trim(), language);
    setResult(res);
    setIsLoading(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleExample = (ex: { law: string; article: string }) => {
    setLawName(ex.law);
    setArticleNumber(ex.article);
    setResult(null);
  };

  // Parse AI result into visual sections
  const parseResultSections = (text: string) => {
    const sectionRegex = /###\s*(📋|🔍|⚡)\s*\*\*(.+?)\*\*/g;
    const sections: { emoji: string; header: string; content: string; colorIndex: number }[] = [];
    let lastIndex = 0;
    let match;
    let colorIndex = 0;

    while ((match = sectionRegex.exec(text)) !== null) {
      if (sections.length > 0) {
        sections[sections.length - 1].content = text.slice(lastIndex, match.index).trim();
      }
      sections.push({ emoji: match[1], header: match[2], content: '', colorIndex: colorIndex++ });
      lastIndex = match.index + match[0].length;
    }
    if (sections.length > 0) {
      sections[sections.length - 1].content = text.slice(lastIndex).trim();
    }
    if (sections.length === 0 && text.trim()) {
      sections.push({ emoji: '📋', header: 'Result', content: text.trim(), colorIndex: 0 });
    }
    return sections;
  };

  // Simple inline bold renderer
  const renderWithBold = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-2" />;
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="mb-1.5 leading-relaxed">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="font-semibold text-slate-900">{part}</strong> : part
          )}
        </p>
      );
    });
  };

  const sectionGradients = [
    { bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '#bfdbfe', accent: '#2563eb' },
    { bg: 'linear-gradient(135deg, #faf5ff, #ede9fe)', border: '#ddd6fe', accent: '#7c3aed' },
    { bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '#bbf7d0', accent: '#059669' },
  ];

  return (
    <div className="h-full overflow-y-auto flex flex-col" style={{ background: '#f8fafc' }}>

      {/* ══ DARK HEADER ══════════════════════════════════════════════════════ */}
      <div
        className="shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 55%, #1e1b4b 100%)' }}
      >
        <div className="absolute pointer-events-none" style={{ top: '-50px', right: '8%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-30px', left: '5%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              {/* Badge */}
              <div
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-5"
                style={{ background: 'rgba(124,58,237,0.14)', border: '1px solid rgba(124,58,237,0.3)', backdropFilter: 'blur(10px)' }}
              >
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-purple-300 font-bold text-xs uppercase tracking-widest">
                  AI · lex.uz · norma.uz
                </span>
              </div>

              <h1
                className="gradient-text font-serif font-bold mb-3"
                style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', lineHeight: 1.15 }}
              >
                {L.title}
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">{L.subtitle}</p>
            </div>

            {/* Icon visual */}
            <div
              className="hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-3xl shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
            >
              <span className="text-4xl">⚖️</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">Sharh</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ CONTENT ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-6 items-start">

        {/* LEFT COLUMN: Form */}
        <div className="w-full lg:w-[360px] shrink-0 space-y-4 lg:sticky lg:top-6">

          {/* Form card */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
            <div
              className="px-6 py-4"
              style={{ background: 'linear-gradient(135deg, #eff6ff, #f0f0ff)', borderBottom: '1px solid #e2e8f0' }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: '#2563eb18' }}>📝</div>
                <span className="font-bold text-slate-700 text-sm">{L.formCard}</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Law name */}
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

              {/* Article number */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{L.articleLabel}</label>
                <input
                  value={articleNumber}
                  onChange={e => setArticleNumber(e.target.value)}
                  placeholder={L.articlePlaceholder}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                  style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed60'; e.target.style.background = 'white'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={isLoading || !lawName.trim() || !articleNumber.trim()}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] flex items-center justify-center space-x-2"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
                }}
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
                >
                  {L.newSearch}
                </button>
              )}
            </div>
          </div>

          {/* Examples card */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{L.examples}</span>
            </div>
            <div className="p-3 space-y-1">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => handleExample(ex)}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all duration-150 flex items-center justify-between group active:scale-[0.98]"
                  style={{ border: '1px solid transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.borderColor = '#ddd6fe'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                >
                  <span className="text-sm font-medium text-slate-600 group-hover:text-purple-700 transition-colors">{ex.label}</span>
                  <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="flex-1 min-w-0" ref={resultsRef}>

          {/* Empty state */}
          {!result && !isLoading && (
            <div
              className="flex flex-col items-center justify-center text-center py-20 px-8 bg-white rounded-3xl"
              style={{ border: '1px solid #e2e8f0', minHeight: '320px' }}
            >
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
                style={{ background: 'linear-gradient(135deg, #f0f0ff, #ede9fe)' }}
              >
                ⚖️
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">{L.emptyTitle}</h3>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">{L.emptyDesc}</p>
              <div className="flex items-center gap-2 mt-6">
                {['lex.uz', 'norma.uz', 'AI'].map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: '#f0f0ff', color: '#4f46e5' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div
              className="flex flex-col items-center justify-center text-center py-20 px-8 bg-white rounded-3xl"
              style={{ border: '1px solid #e2e8f0', minHeight: '320px' }}
            >
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
                style={{ background: 'linear-gradient(135deg, #1e1b4b, #0d1a3a)' }}
              >
                <div className="w-8 h-8 rounded-full border-t-2 border-white animate-spin" style={{ borderWidth: '3px', borderTopColor: 'white', borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }} />
              </div>
              <p className="text-base font-semibold text-slate-700 mb-1">{lawName} · {articleNumber}</p>
              <p className="text-sm text-slate-400">{L.analyzing}</p>
              <div className="flex items-center space-x-1 mt-4">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: '#7c3aed', animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div className="space-y-4">
              {/* Query header */}
              <div
                className="flex items-center justify-between px-6 py-4 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #1e1b4b, #0d1a3a)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: 'rgba(124,58,237,0.3)' }}>
                    ⚖️
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{lawName}</p>
                    <p className="text-purple-300 text-xs font-medium">{articleNumber}-modda</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
                  ✓ Found
                </span>
              </div>

              {/* Section cards */}
              {parseResultSections(result.text).map((section, i) => {
                const grad = sectionGradients[i % sectionGradients.length];
                return (
                  <div
                    key={i}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in"
                    style={{ border: `1px solid ${grad.border}`, animationDelay: `${i * 80}ms` }}
                  >
                    <div className="px-6 py-4" style={{ background: grad.bg, borderBottom: `1px solid ${grad.border}` }}>
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{section.emoji}</span>
                        <h3 className="font-bold text-slate-800">{section.header}</h3>
                      </div>
                    </div>
                    <div className="p-6 text-sm text-slate-700">
                      {renderWithBold(section.content)}
                    </div>
                  </div>
                );
              })}

              {/* Sources */}
              {result.sources.length > 0 && (
                <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{L.sources}</p>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.slice(0, 6).map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 hover:-translate-y-0.5"
                        style={{ background: '#f0f0ff', color: '#4f46e5', border: '1px solid #ddd6fe' }}
                      >
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
    </div>
  );
};

export default Commentator;
