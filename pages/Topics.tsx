import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS, TOPICS_DATA } from '../constants';
import Footer from '../components/Footer';

interface TopicsProps {
  language: Language;
}

const Topics: React.FC<TopicsProps> = ({ language }) => {
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];
  const topics = TOPICS_DATA[language];

  const handleTopicSelect = (prompt: string) => {
    navigate('/chat', { state: { initialPrompt: prompt } });
  };

  const getCategoryConfig = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes('mehnat') || lower.includes('labor') || lower.includes('трудовое'))
      return { color: '#2563eb', bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)', icon: '👷' };
    if (lower.includes('oila') || lower.includes('family') || lower.includes('семейное'))
      return { color: '#e11d48', bg: 'linear-gradient(135deg, #fff1f2, #ffe4e6)', icon: '👨‍👩‍👧' };
    if (lower.includes('mulk') || lower.includes('property') || lower.includes('гражданское') || lower.includes('civil'))
      return { color: '#4f46e5', bg: 'linear-gradient(135deg, #f0f0ff, #e0e7ff)', icon: '🏠' };
    if (lower.includes('iste\'mol') || lower.includes('consumer') || lower.includes('потребител'))
      return { color: '#059669', bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', icon: '🛒' };
    if (lower.includes('avto') || lower.includes('auto') || lower.includes('авто'))
      return { color: '#d97706', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)', icon: '🚗' };
    if (lower.includes('biznes') || lower.includes('business') || lower.includes('бизнес'))
      return { color: '#0891b2', bg: 'linear-gradient(135deg, #ecfeff, #cffafe)', icon: '💼' };
    return { color: '#7c3aed', bg: 'linear-gradient(135deg, #faf5ff, #ede9fe)', icon: '📋' };
  };

  const totalTopics = topics.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="h-full overflow-y-auto flex flex-col" style={{ background: '#f8fafc' }}>

      {/* ══ DARK HEADER ══════════════════════════════════════════════════════ */}
      <div
        className="shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 55%, #1e1b4b 100%)' }}
      >
        {/* Background glow orbs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-60px', right: '10%',
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-40px', left: '5%',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'rgba(59,130,246,0.12)',
                border: '1px solid rgba(59,130,246,0.28)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-blue-300 font-bold text-xs uppercase tracking-widest">
                {language === Language.UZ ? 'Huquqiy mavzular' : language === Language.RU ? 'Правовые темы' : 'Legal Topics'}
              </span>
            </div>

            {/* Title */}
            <h1
              className="gradient-text font-serif font-bold mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
            >
              {t.topicsTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              {t.topicsSubtitle}
            </p>

            {/* Stats strip */}
            <div className="flex justify-center gap-8 md:gap-12">
              {[
                {
                  value: topics.length,
                  label: language === Language.UZ ? 'Kategoriya' : language === Language.RU ? 'Категорий' : 'Categories',
                },
                {
                  value: `${totalTopics}+`,
                  label: language === Language.UZ ? 'Savol' : language === Language.RU ? 'Вопросов' : 'Questions',
                },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div
                    className="text-3xl font-black"
                    style={{
                      background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ CONTENT ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-5">

          {topics.map((category, idx) => {
            const config = getCategoryConfig(category.category);

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg animate-fade-in-up"
                style={{
                  animationDelay: `${idx * 60}ms`,
                  borderLeft: `4px solid ${config.color}`,
                  boxShadow: `0 2px 16px ${config.color}0a`,
                }}
              >
                {/* Category header */}
                <div
                  className="px-6 py-5 flex items-center justify-between"
                  style={{ background: config.bg, borderBottom: `1px solid ${config.color}18` }}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
                      style={{ background: `${config.color}18` }}
                    >
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{category.category}</h3>
                      <p className="text-xs font-medium mt-0.5" style={{ color: config.color }}>
                        {category.items.length}{' '}
                        {language === Language.UZ ? 'ta savol' : language === Language.RU ? 'вопросов' : 'questions'}
                      </p>
                    </div>
                  </div>
                  <div
                    className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${config.color}15` }}
                  >
                    <svg className="w-4 h-4" style={{ color: config.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Items grid */}
                <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {category.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={() => handleTopicSelect(item.prompt)}
                      className="group flex items-start space-x-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{
                        background: 'transparent',
                        border: '1px solid #f1f5f9',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = `${config.color}09`;
                        (e.currentTarget as HTMLButtonElement).style.borderColor = `${config.color}30`;
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px ${config.color}12`;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#f1f5f9';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                      }}
                    >
                      <div
                        className="mt-1.5 w-2 h-2 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125"
                        style={{ background: config.color }}
                      />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors leading-relaxed line-clamp-2 flex-1">
                        {item.title}
                      </span>
                      <svg
                        className="mt-1 w-3.5 h-3.5 shrink-0 transition-all duration-200 group-hover:translate-x-0.5"
                        style={{ color: `${config.color}60` }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Footer notice */}
          <div className="pt-4 pb-2 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-100">
              <span className="text-slate-400 text-xs">⚖️</span>
              <p className="text-xs text-slate-400 font-medium">
                {language === Language.UZ
                  ? "Barcha ma'lumotlar Lex.uz rasmiy huquqiy bazasiga asoslangan"
                  : language === Language.RU
                  ? "Все данные основаны на официальной правовой базе Lex.uz"
                  : "All data sourced from the official Lex.uz legal database"}
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Topics;
