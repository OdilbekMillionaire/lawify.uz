
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS, DID_YOU_KNOW_FACTS } from '../constants';
import Footer from '../components/Footer';

interface DashboardProps {
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];
  const facts = DID_YOU_KNOW_FACTS[language];

  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [facts.length]);

  // Stable star positions — useMemo prevents regeneration on re-renders
  const stars = useMemo(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      left: (i * 37.3 + 11) % 100,
      top: (i * 53.7 + 7) % 100,
      size: (i % 3) + 1,
      delay: (i * 0.3) % 5,
      duration: 2 + (i % 4),
      color: i % 3 === 0 ? '#60a5fa' : i % 3 === 1 ? '#a78bfa' : '#e2e8f0',
    }))
  , []);

  const quickLinks = [
    { label: t.qlFamily,   icon: "👨‍👩‍👧‍👦", prompt: t.qlFamilyPrompt },
    { label: t.qlLabor,    icon: "👷‍♂️",   prompt: t.qlLaborPrompt },
    { label: t.qlCriminal, icon: "⚖️",    prompt: t.qlCriminalPrompt },
    { label: t.qlHousing,  icon: "🏠",    prompt: t.qlHousingPrompt },
    { label: t.qlBusiness, icon: "💼",    prompt: t.qlBusinessPrompt },
    { label: t.qlAdmin,    icon: "📋",    prompt: t.qlAdminPrompt },
    { label: t.qlBank,     icon: "🏦",    prompt: t.qlBankPrompt },
    { label: t.qlHealth,   icon: "🏥",    prompt: t.qlHealthPrompt },
    { label: t.qlEdu,      icon: "🎓",    prompt: t.qlEduPrompt },
    { label: t.qlCustoms,  icon: "🛃",    prompt: t.qlCustomsPrompt },
    { label: t.qlTax,      icon: "💸",    prompt: t.qlTaxPrompt },
    { label: t.qlPension,  icon: "👴",    prompt: t.qlPensionPrompt },
  ];

  const handleQuickLink = (prompt: string) => {
    navigate('/chat', { state: { initialPrompt: prompt } });
  };

  const handleFactClick = (fact: any) => {
    let prompt = "";
    if (language === Language.UZ) {
      prompt = `Men "${fact.title}" haqida batafsil ma'lumot olmoqchiman.`;
    } else if (language === Language.RU) {
      prompt = `Я хочу узнать подробнее о теме: "${fact.title}".`;
    } else {
      prompt = `I would like to know more about "${fact.title}".`;
    }
    navigate('/chat', { state: { initialPrompt: prompt } });
  };

  const nextFact = () => setCurrentFactIndex((prev) => (prev + 1) % facts.length);
  const prevFact = () => setCurrentFactIndex((prev) => (prev - 1 + facts.length) % facts.length);

  const howItWorks = [
    {
      title:
        language === Language.UZ ? "Savolingizni yozing" :
        language === Language.RU ? "Задайте вопрос" :
        "Ask Your Question",
      desc:
        language === Language.UZ ? "Huquqiy muammoingizni o'zbek, rus yoki ingliz tilida erkin yozing" :
        language === Language.RU ? "Опишите вашу правовую проблему на удобном для вас языке" :
        "Describe your legal issue in Uzbek, Russian, or English",
      color: '#2563eb',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      ),
    },
    {
      title:
        language === Language.UZ ? "AI tahlil qiladi" :
        language === Language.RU ? "ИИ анализирует" :
        "AI Analyzes",
      desc:
        language === Language.UZ ? "OdilbekAI v1.3 lex.uz va norma.uz'dan real-time huquqiy ma'lumot qidiradi" :
        language === Language.RU ? "OdilbekAI v1.3 ищет актуальные законы из lex.uz и norma.uz в реальном времени" :
        "OdilbekAI v1.3 retrieves real-time legal data from lex.uz and norma.uz",
      color: '#7c3aed',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      ),
    },
    {
      title:
        language === Language.UZ ? "Aniq javob oling" :
        language === Language.RU ? "Получите ответ" :
        "Get Your Answer",
      desc:
        language === Language.UZ ? "Huquqiy maslahat manbalar va havolalar bilan tasdiqlangan holda keladi" :
        language === Language.RU ? "Юридический совет с подтверждёнными ссылками на законодательство" :
        "Receive legal advice backed by verified citations and sources",
      color: '#059669',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="h-full overflow-y-auto flex flex-col" style={{ background: '#0a0f1e' }}>

      {/* ═══════════════════════════════════════
          SECTION 1 — CINEMATIC HERO
      ═══════════════════════════════════════ */}
      <section
        className="relative lg:min-h-screen flex flex-col-reverse lg:flex-row items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 55%, #0c1525 100%)' }}
      >
        {/* Background grid */}
        <div className="absolute inset-0 hero-grid-bg pointer-events-none" />

        {/* Stars */}
        {stars.map(s => (
          <div
            key={s.id}
            className="absolute rounded-full pointer-events-none animate-twinkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: s.color,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}

        {/* Glow orbs */}
        <div
          className="absolute pointer-events-none animate-float"
          style={{
            top: '15%', left: '10%',
            width: '420px', height: '420px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute pointer-events-none animate-float"
          style={{
            bottom: '10%', right: '20%',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animationDelay: '2s',
          }}
        />

        {/* ── Left text pane ── */}
        <div className="w-full lg:w-[48%] z-20 relative px-6 md:px-12 lg:pl-16 lg:pr-8 pt-8 pb-10 lg:py-0 text-center lg:text-left">

          {/* Decorative faint scales bg */}
          <div
            className="absolute inset-0 pointer-events-none hidden lg:flex items-center justify-center"
            style={{ zIndex: 0, opacity: 0.03 }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-full h-full" style={{ maxWidth: '480px' }}>
              <path d="M12 3a1 1 0 01.894.553l2.382 4.764 5.256.763a1 1 0 01.554 1.706l-3.801 3.705.898 5.23a1 1 0 01-1.451 1.054L12 17.27l-4.732 2.488a1 1 0 01-1.451-1.054l.897-5.23L2.914 9.786a1 1 0 01.554-1.706l5.257-.763L11.106 2.553A1 1 0 0112 3z"/>
            </svg>
          </div>

          {/* Live badge */}
          <div
            className="inline-flex items-center px-4 py-2 rounded-full mb-6 animate-fade-in"
            style={{
              background: 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(59,130,246,0.28)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
            <span className="text-blue-300 font-bold text-xs uppercase tracking-widest">
              AI-Powered Legal Assistant
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="gradient-text font-serif animate-slide-up"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: '0.5rem',
            }}
          >
            {t.dashboardWelcome}
          </h1>

          {/* Animated underline accent */}
          <div className="flex justify-center lg:justify-start mb-5 animate-slide-up">
            <div
              className="h-1 rounded-full"
              style={{
                width: '80px',
                background: 'linear-gradient(90deg, #2563eb, #7c3aed, #2563eb)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s linear infinite',
              }}
            />
          </div>

          {/* Subtitle */}
          <p
            className="text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 animate-slide-up delay-100"
            style={{ color: 'rgba(148,163,184,0.9)' }}
          >
            {t.dashboardSubtitle}
          </p>

          {/* Primary CTA */}
          <div className="animate-slide-up delay-200">
            <button
              onClick={() => navigate('/chat')}
              className="relative px-8 py-4 rounded-2xl font-bold text-white overflow-hidden group transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                boxShadow: '0 0 35px rgba(59,130,246,0.4)',
              }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              />
              <span className="relative flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                </svg>
                <span>
                  {language === Language.UZ ? "AI Yurist bilan maslahat" : language === Language.RU ? "Консультация с AI Юристом" : "Consult AI Lawyer"}
                </span>
              </span>
            </button>
          </div>

          {/* Tool chip buttons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-4 animate-slide-up delay-200">
            {[
              { icon: '👨‍🏫', label: language === Language.UZ ? 'AI Odilbek' : language === Language.RU ? 'AI Одилбек' : 'AI Odilbek', path: '/odilbek', color: 'rgba(245,158,11,0.18)', border: 'rgba(245,158,11,0.35)', text: '#fbbf24' },
              { icon: '📝', label: language === Language.UZ ? 'AI Kotib' : language === Language.RU ? 'AI Котиб' : 'AI Drafter', path: '/studio', color: 'rgba(5,150,105,0.18)', border: 'rgba(5,150,105,0.35)', text: '#34d399' },
              { icon: '🤝', label: language === Language.UZ ? 'AI Murosa' : language === Language.RU ? 'AI Медиатор' : 'AI Mediator', path: '/mediation', color: 'rgba(139,92,246,0.18)', border: 'rgba(139,92,246,0.35)', text: '#c4b5fd' },
            ].map((chip, i) => (
              <button
                key={i}
                onClick={() => navigate(chip.path)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: chip.color, border: `1px solid ${chip.border}`, color: chip.text, backdropFilter: 'blur(10px)' }}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Stats — 2×2 metric cards */}
          <div className="grid grid-cols-2 gap-3 mt-10 animate-slide-up delay-300">
            {[
              { label: '15k+',  desc: t.statUsers,    icon: '👥', color: '#2563eb' },
              { label: '85k+',  desc: t.statDocs,     icon: '📄', color: '#7c3aed' },
              { label: '99.8%', desc: t.statAccuracy, icon: '✅', color: '#059669' },
              { label: '3',     desc: t.statLanguages,icon: '🌐', color: '#d97706' },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 px-4 py-3 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: `${s.color}22`, border: `1px solid ${s.color}44` }}
                >
                  {s.icon}
                </div>
                <div className="text-left min-w-0">
                  <div
                    className="text-lg font-black leading-none"
                    style={{
                      background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >{s.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-tight truncate">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Platform Guarantees Card ── */}
          <div className="hidden lg:block mt-8 z-10 relative animate-float" style={{ animationDelay: '1.3s' }}>
            <div
              className="rounded-2xl p-5 text-left"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(28px)',
                maxWidth: '400px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
              }}
            >
              {/* Card header */}
              <div className="flex items-center space-x-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2))', border: '1px solid rgba(16,185,129,0.3)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-slate-300">
                  {language === Language.UZ ? "Platforma kafolatlari" : language === Language.RU ? "Гарантии платформы" : "Platform Guarantees"}
                </span>
              </div>

              {/* Guarantee items */}
              <div className="space-y-3">
                {[
                  {
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                    color: '#3b82f6',
                    label: language === Language.UZ ? "Faqat lex.uz va norma.uz asosida" : language === Language.RU ? "Только на основе lex.uz и norma.uz" : "Based only on lex.uz & norma.uz",
                  },
                  {
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
                    color: '#10b981',
                    label: language === Language.UZ ? "Har bir modda raqami tasdiqlangan" : language === Language.RU ? "Каждый номер статьи верифицирован" : "Every article number verified",
                  },
                  {
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                    color: '#a78bfa',
                    label: language === Language.UZ ? "Faqat amaldagi qonunchilik" : language === Language.RU ? "Только действующее законодательство" : "Only in-force legislation",
                  },
                  {
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
                    color: '#f59e0b',
                    label: language === Language.UZ ? "3 tilda: O'zbek, Rus, Ingliz" : language === Language.RU ? "На 3 языках: Узб, Рус, Англ" : "3 languages: UZ, RU, EN",
                  },
                  {
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
                    color: '#ef4444',
                    label: language === Language.UZ ? "Gallyutsinatsiyaga nol tolerantlik" : language === Language.RU ? "Нулевая толерантность к галлюцинациям" : "Zero tolerance for hallucination",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-[11px] text-slate-300 leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Source badges */}
              <div className="mt-4 pt-3 flex items-center space-x-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <span
                  className="text-[9px] font-bold text-blue-400 px-2 py-1 rounded-full"
                  style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.25)' }}
                >lex.uz</span>
                <span
                  className="text-[9px] font-bold text-purple-400 px-2 py-1 rounded-full"
                  style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}
                >norma.uz</span>
                <span
                  className="text-[9px] font-bold text-emerald-400 px-2 py-1 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}
                >gov.uz</span>
              </div>
            </div>
          </div>

          {/* ── Trust strip — pill badges ── */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-6 z-10 relative animate-slide-up delay-400">
            {[
              { icon: '🎓', label: 'Oxford Founded' },
              { icon: '🏛️', label: 'TSUL Partner' },
              { icon: '⚖️', label: 'lex.uz Certified' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>

        </div>

        {/* ── Right: Spline robot with CSS fallback ── */}
        <div className="w-full lg:w-[52%] h-[60vw] min-h-[300px] sm:h-[420px] md:h-[520px] lg:h-screen z-10 relative flex items-center justify-center order-first lg:order-last">
          <div className="w-full h-full relative" style={{ filter: 'drop-shadow(0 0 70px rgba(59,130,246,0.28))' }}>
            {/* Spline iframe */}
            <iframe
              src="https://my.spline.design/nexbotrobotcharacterconcept-wZSAPju6UR2ZkjxujstTmNOR/"
              frameBorder="0"
              width="100%"
              height="100%"
              title="Lawify AI Robot"
              loading="eager"
              allow="autoplay; fullscreen; accelerometer; gyroscope"
              onLoad={() => setSplineLoaded(true)}
              style={{ border: 'none', opacity: splineLoaded ? 1 : 0, transition: 'opacity 0.6s ease', position: 'absolute', inset: 0 }}
            />
            {/* CSS fallback — shows while Spline loads or if WebGL unavailable */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ opacity: splineLoaded ? 0 : 1, transition: 'opacity 0.6s ease', pointerEvents: splineLoaded ? 'none' : 'auto' }}
            >
              {/* Animated glow rings */}
              <div className="relative flex items-center justify-center" style={{ width: '260px', height: '260px' }}>
                <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }} />
                <div className="absolute rounded-full animate-ping" style={{ width: '220px', height: '220px', border: '1px solid rgba(59,130,246,0.2)', animationDuration: '3s' }} />
                <div className="absolute rounded-full animate-ping" style={{ width: '180px', height: '180px', border: '1px solid rgba(124,58,237,0.2)', animationDuration: '2s', animationDelay: '0.5s' }} />
                {/* Central icon */}
                <div className="relative z-10 flex flex-col items-center justify-center rounded-full"
                  style={{ width: '140px', height: '140px', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)' }}>
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="rgba(147,197,253,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17l10 5 10-5" stroke="rgba(147,197,253,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12l10 5 10-5" stroke="rgba(196,181,253,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xs font-bold mt-1" style={{ color: '#93c5fd', letterSpacing: '0.1em' }}>AI</span>
                </div>
              </div>
              {/* Floating label */}
              <div className="mt-4 px-4 py-2 rounded-xl animate-pulse"
                style={{ background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.28)' }}>
                <span className="text-xs font-bold" style={{ color: '#34d399' }}>OdilbekAI v1.3</span>
              </div>
            </div>
            {/* Watermark blocker */}
            <div className="absolute bottom-2 right-2 w-44 h-14 z-50 rounded-tl-xl"
              style={{ background: 'linear-gradient(135deg, #0a0f1e, #0d1a3a)' }} />
          </div>

          {/* Floating tech badges (desktop only) */}
          <div className="absolute top-16 left-6 md:left-10 hidden md:block animate-float" style={{ animationDelay: '0s' }}>
            <div className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.28)', backdropFilter: 'blur(10px)', color: '#34d399' }}>
              OdilbekAI v1.3
            </div>
          </div>
          <div className="absolute bottom-28 left-6 md:left-10 hidden md:block animate-float" style={{ animationDelay: '1.8s' }}>
            <div className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(139,92,246,0.28)', backdropFilter: 'blur(10px)', color: '#c4b5fd' }}>
              lex.uz · norma.uz
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center z-20">
          <span className="text-slate-600 text-[10px] mb-2 uppercase tracking-widest">scroll</span>
          <div className="w-5 h-9 border-2 border-slate-700 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2.5 bg-blue-500 rounded-full scroll-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LIGHT CONTENT AREA
      ═══════════════════════════════════════ */}
      <div className="bg-slate-50 flex-1">
        <div className="p-4 md:p-10 max-w-[90rem] mx-auto w-full space-y-16 md:space-y-24 pb-28">

          {/* ═══════════════════════════════════════
              SECTION 2 — CORE FEATURE CARDS (dark gradient)
          ═══════════════════════════════════════ */}
          <section className="space-y-8 pt-6">
            <div className="text-center space-y-3">
              <div
                className="inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                style={{ background: 'linear-gradient(135deg, #dbeafe, #ede9fe)', color: '#4338ca' }}
              >
                Core Features
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                {language === Language.UZ ? "Barcha kerakli vositalar" :
                 language === Language.RU ? "Всё что вам нужно" :
                 "Everything You Need"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                {
                  title: t.navChat,
                  desc: t.quickChatDesc,
                  path: '/chat',
                  gradient: 'linear-gradient(145deg, #1e3a8a 0%, #1e1b4b 100%)',
                  glow: 'rgba(59,130,246,0.35)',
                  badge: 'AI-Powered',
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                    </svg>
                  ),
                },
                {
                  title: t.odilbekTitle,
                  desc: t.odilbekSubtitle,
                  path: '/odilbek',
                  gradient: 'linear-gradient(145deg, #78350f 0%, #451a03 100%)',
                  glow: 'rgba(245,158,11,0.35)',
                  badge: 'Simplified',
                  icon: <span className="text-4xl">👨‍🏫</span>,
                },
                {
                  title: t.navTemplates,
                  desc: t.quickTemplatesDesc,
                  path: '/library',
                  gradient: 'linear-gradient(145deg, #064e3b 0%, #022c22 100%)',
                  glow: 'rgba(16,185,129,0.35)',
                  badge: '100+ Templates',
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  ),
                },
                {
                  title: language === Language.UZ ? 'AI yuridik sharh beruvchi' : language === Language.RU ? 'AI Комментатор' : 'AI Legal Commentator',
                  desc: language === Language.UZ
                    ? "Modda raqamini bering — AI rasmiy matnni topib, yuridik sharh yozadi"
                    : language === Language.RU
                    ? "Укажите статью — AI найдёт официальный текст и напишет комментарий"
                    : "Enter an article — AI finds the official text and writes legal commentary",
                  path: '/commentator',
                  gradient: 'linear-gradient(145deg, #2e1065 0%, #1a0533 100%)',
                  glow: 'rgba(168,85,247,0.35)',
                  badge: 'NEW · lex.uz',
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                  ),
                },
              ].map((card, i) => (
                <button
                  key={i}
                  onClick={() => navigate(card.path)}
                  className="card-3d group relative overflow-hidden rounded-3xl text-left active:scale-95"
                  style={{
                    background: card.gradient,
                    boxShadow: `0 20px 60px ${card.glow}`,
                  }}
                >
                  {/* Hover brightener */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  />
                  {/* Dot-pattern texture */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                      backgroundSize: '22px 22px',
                    }}
                  />

                  <div className="relative p-8 md:p-10 flex flex-col h-64">
                    <div className="flex items-start justify-between mb-auto">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
                      >
                        {card.icon}
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-black"
                        style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
                      >
                        {card.badge}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <h3 className="text-2xl font-serif font-bold text-white mb-2">{card.title}</h3>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {card.desc}
                      </p>
                      <div className="flex items-center text-sm font-bold" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        <span>{t.openApp}</span>
                        <svg
                          className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════
              SECTION 3 — HOW IT WORKS
          ═══════════════════════════════════════ */}
          <section className="space-y-12">
            <div className="text-center space-y-3">
              <div
                className="inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                style={{ background: 'linear-gradient(135deg, #dbeafe, #ede9fe)', color: '#4338ca' }}
              >
                Process
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                {language === Language.UZ ? "Qanday ishlaydi?" :
                 language === Language.RU ? "Как это работает?" :
                 "How It Works"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line — desktop only */}
              <div
                className="absolute top-12 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px hidden md:block"
                style={{
                  background: 'linear-gradient(90deg, #2563eb40, #7c3aed60, #05966940)',
                }}
              />

              {howItWorks.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative z-10 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle, ${step.color}22, ${step.color}0a)`,
                      border: `2px solid ${step.color}40`,
                      boxShadow: `0 0 40px ${step.color}20`,
                      color: step.color,
                    }}
                  >
                    {step.icon}
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-xs font-black text-white flex items-center justify-center"
                      style={{ background: step.color }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════
              SECTION 4 — QUICK LINKS
          ═══════════════════════════════════════ */}
          <section className="space-y-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 uppercase tracking-wide">
                {t.quickLinksTitle}
              </h3>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {quickLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickLink(link.prompt)}
                  className="flex flex-col items-center justify-center p-3 md:p-4 bg-white border border-gray-100 rounded-2xl transition-all duration-300 group h-28 md:h-32 active:scale-95 hover:-translate-y-1"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(59,130,246,0.14)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#93c5fd';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#f3f4f6';
                  }}
                >
                  <span className="text-2xl md:text-3xl mb-2 md:mb-3 group-hover:scale-125 transition-transform duration-300 filter drop-shadow-sm">
                    {link.icon}
                  </span>
                  <span className="text-[10px] md:text-xs font-bold text-slate-600 group-hover:text-blue-700 text-center leading-tight px-1 transition-colors">
                    {link.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════
              SECTION 5 — FACTS CAROUSEL (redesigned)
          ═══════════════════════════════════════ */}
          <section
            className="relative h-[420px] md:h-80 overflow-hidden rounded-3xl shadow-2xl group"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}
          >
            {/* Glow decor */}
            <div
              className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)',
                transform: 'translate(30%, -30%)',
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-60 h-60 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
                transform: 'translate(-25%, 25%)',
              }}
            />

            {facts.map((fact, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out p-6 md:p-12 flex flex-col justify-center ${
                  index === currentFactIndex
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-full pointer-events-none'
                }`}
              >
                <div className="relative z-10 max-w-4xl">
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="px-3 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center"
                      style={{
                        background: 'rgba(99,102,241,0.2)',
                        border: '1px solid rgba(99,102,241,0.3)',
                        color: '#a5b4fc',
                      }}
                    >
                      <span className="mr-1.5">💡</span>
                      {t.didYouKnowTag}
                    </span>
                    <span className="text-xs text-slate-600 font-mono">
                      {index + 1} / {facts.length}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-3xl font-serif font-bold text-white mb-4 leading-tight">
                    {fact.title}
                  </h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 border-l-2 border-indigo-700 pl-4">
                    {fact.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleFactClick(fact)}
                      className="flex items-center space-x-2 font-bold text-sm group/btn transition-all duration-300"
                      style={{ color: '#818cf8' }}
                    >
                      <span className="group-hover/btn:text-white transition-colors">{fact.button}</span>
                      <svg
                        className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </button>

                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={prevFact}
                        className="p-2 rounded-full transition-colors"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                      </button>
                      <button
                        onClick={nextFact}
                        className="p-2 rounded-full transition-colors"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Dots — desktop only */}
            <div className="absolute bottom-4 left-6 right-6 hidden md:flex flex-wrap justify-center gap-1 z-20 pointer-events-auto">
              {facts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentFactIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 flex-shrink-0 ${
                    idx === currentFactIndex ? 'w-4 bg-indigo-400' : 'w-1 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════
              SECTION 6 — TECHNOLOGY SHOWCASE (dark)
          ═══════════════════════════════════════ */}
          <section
            className="rounded-3xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0d1a3a 100%)' }}
          >
            <div className="p-8 md:p-12">
              {/* Header row */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">
                    {t.techTitle}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                    {language === Language.UZ ? "Eng yaxshi texnologiyalarda qurilgan" :
                     language === Language.RU ? "Построено на лучших технологиях" :
                     "Built on the Best"}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm text-emerald-400 font-bold">{t.statSystemOp}</span>
                </div>
              </div>

              {/* Tech tiles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { name: 'OdilbekAI v1.3', sub: 'Fine-tuned Legal AI', icon: '🤖', color: '#4285f4' },
                  { name: 'RAG System',    sub: 'Real-time search', icon: '🔍', color: '#34a853' },
                  { name: 'Supabase',      sub: 'Database & Auth',  icon: '⚡', color: '#3ecf8e' },
                  { name: 'lex.uz · norma.uz', sub: 'Official Sources', icon: '📜', color: '#a78bfa' },
                ].map((tech, i) => (
                  <div
                    key={i}
                    className="p-4 md:p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${tech.color}30`,
                    }}
                  >
                    <div className="text-3xl mb-3">{tech.icon}</div>
                    <div className="font-bold text-white text-sm">{tech.name}</div>
                    <div className="text-xs mt-1 font-medium" style={{ color: tech.color }}>{tech.sub}</div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {[
                  { value: '15k+',  label: t.statUsers },
                  { value: '85k+',  label: t.statDocs },
                  { value: '24/7',  label: t.statAIAvailability },
                  { value: '99.8%', label: t.statAccuracy },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="text-3xl md:text-4xl font-black mb-1"
                      style={{
                        background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════
              SECTION 7 — VISION / ROADMAP
          ═══════════════════════════════════════ */}
          <section className="space-y-8">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 uppercase tracking-wide">
                {t.visTitle}
              </h3>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {[
                {
                  title: t.visAutoAgents,
                  desc: t.visAutoAgentsDesc,
                  bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  accent: '#2563eb',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  ),
                },
                {
                  title: t.visCourtAPI,
                  desc: t.visCourtAPIDesc,
                  bg: 'linear-gradient(135deg, #faf5ff, #ede9fe)',
                  accent: '#7c3aed',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                    </svg>
                  ),
                },
                {
                  title: t.visBlockchain,
                  desc: t.visBlockchainDesc,
                  bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  accent: '#059669',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                  ),
                },
                {
                  title: t.visAIJudge,
                  desc: t.visAIJudgeDesc,
                  bg: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
                  accent: '#d97706',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  ),
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 group cursor-default"
                  style={{
                    background: card.bg,
                    borderColor: `${card.accent}20`,
                    boxShadow: `0 4px 20px ${card.accent}10`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${card.accent}18`, color: card.accent }}
                  >
                    {card.icon}
                  </div>
                  <div
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-black mb-3"
                    style={{ background: `${card.accent}18`, color: card.accent }}
                  >
                    Soon
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wide">
                    {card.title}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
