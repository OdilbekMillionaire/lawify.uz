
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language, ChatSession } from '../types';
import { getHistory, clearHistory, cleanText } from '../services/storage';
import { TRANSLATIONS } from '../constants';
import Footer from '../components/Footer';

interface HistoryProps {
  language?: Language;
}

const History: React.FC<HistoryProps> = ({ language = Language.UZ }) => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeTab, setActiveTab] = useState<'lawyer' | 'odilbek' | 'drafter'>('lawyer');
  const t = TRANSLATIONS[language];

  useEffect(() => {
    setSessions(getHistory());
  }, []);

  // ── All UI strings translated ──────────────────────────────────────────────
  const L = {
    tabLawyer:
      language === Language.UZ ? 'AI Yurist' :
      language === Language.RU ? 'AI Юрист' : 'AI Lawyer',
    tabOdilbek: 'Odilbek',
    tabDrafter:
      language === Language.UZ ? 'AI Kotib' :
      language === Language.RU ? 'AI Секретарь' : 'AI Drafter',
    resume:
      language === Language.UZ ? 'Davom ettirish →' :
      language === Language.RU ? 'Продолжить →' : 'Resume →',
    msgs:
      language === Language.UZ ? 'xabar' :
      language === Language.RU ? 'сообщ.' : 'msgs',
    confirmClear:
      language === Language.UZ ? "Barcha tarixni o'chirmoqchimisiz?" :
      language === Language.RU ? 'Вы уверены, что хотите очистить историю?' :
      'Are you sure you want to clear all history?',
    emptySub:
      language === Language.UZ ? "Hali hech qanday suhbat yo'q." :
      language === Language.RU ? 'Здесь пока пусто.' : 'Nothing here yet.',
    emptyAction:
      language === Language.UZ ? "Suhbat boshlash" :
      language === Language.RU ? 'Начать чат' : 'Start a chat',
    today:
      language === Language.UZ ? 'Bugun' :
      language === Language.RU ? 'Сегодня' : 'Today',
    yesterday:
      language === Language.UZ ? 'Kecha' :
      language === Language.RU ? 'Вчера' : 'Yesterday',
    daysAgo: (n: number) =>
      language === Language.UZ ? `${n} kun oldin` :
      language === Language.RU ? `${n} дн. назад` : `${n} days ago`,
  };

  const getRelativeDate = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (diff === 0) return L.today;
    if (diff === 1) return L.yesterday;
    if (diff < 7) return L.daysAgo(diff);
    return new Date(dateStr).toLocaleDateString();
  };

  const handleClear = () => {
    if (confirm(L.confirmClear)) { clearHistory(); setSessions([]); }
  };

  const handleRestore = (session: ChatSession) => {
    if (session.type === 'odilbek') {
      navigate('/odilbek', { state: { restoredMessages: session.messages } });
    } else if (session.type === 'drafter') {
      navigate('/studio', { state: { restoredMessages: session.messages, restoredDocData: session.customData } });
    } else {
      navigate('/chat', { state: { restoredMessages: session.messages } });
    }
  };

  const tabs = [
    {
      key: 'lawyer' as const,
      label: L.tabLawyer,
      icon: '⚖️',
      count: sessions.filter(s => s.type === 'lawyer').length,
      accent: '#2563eb',
      accentBg: 'rgba(37,99,235,0.12)',
      accentText: '#60a5fa',
      borderActive: 'border-blue-500',
      textActive: 'text-blue-600',
      emptyPath: '/chat',
    },
    {
      key: 'odilbek' as const,
      label: L.tabOdilbek,
      icon: '🧑‍🏫',
      count: sessions.filter(s => s.type === 'odilbek').length,
      accent: '#d97706',
      accentBg: 'rgba(217,119,6,0.12)',
      accentText: '#fbbf24',
      borderActive: 'border-amber-500',
      textActive: 'text-amber-600',
      emptyPath: '/odilbek',
    },
    {
      key: 'drafter' as const,
      label: L.tabDrafter,
      icon: '📝',
      count: sessions.filter(s => s.type === 'drafter').length,
      accent: '#059669',
      accentBg: 'rgba(5,150,105,0.12)',
      accentText: '#34d399',
      borderActive: 'border-emerald-500',
      textActive: 'text-emerald-700',
      emptyPath: '/studio',
    },
  ];

  const activeTabConfig = tabs.find(t => t.key === activeTab)!;
  const filtered = sessions.filter(s => s.type === activeTab);

  return (
    <div className="h-full overflow-y-auto flex flex-col" style={{ background: '#f8fafc' }}>

      {/* ══ DARK HEADER ══════════════════════════════════════════════════════ */}
      <div
        className="shrink-0"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}
      >
        {/* Background glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0, right: '20%',
            width: '320px', height: '200px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="max-w-5xl mx-auto px-6 py-8 md:py-10 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1">
                {t.historyTitle}
              </h2>
              <p className="text-slate-400 text-sm">{t.historySubtitle}</p>
            </div>
            {sessions.length > 0 && (
              <button
                onClick={handleClear}
                className="shrink-0 text-xs font-bold text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {t.historyClear}
              </button>
            )}
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-6 mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {tabs.map(tab => (
              <div key={tab.key} className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: tab.accentBg }}
                >
                  {tab.icon}
                </div>
                <div>
                  <div className="text-white font-black text-xl leading-none">{tab.count}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{tab.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ STICKY TABS ═════════════════════════════════════════════════════ */}
      <div className="shrink-0 bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-5 py-4 font-bold text-sm border-b-2 transition-all duration-200 ${
                  activeTab === tab.key
                    ? `${tab.borderActive} ${tab.textActive}`
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className="text-xs font-black px-2 py-0.5 rounded-full transition-all"
                    style={{
                      background: activeTab === tab.key ? tab.accentBg : '#f1f5f9',
                      color: activeTab === tab.key ? tab.accent : '#94a3b8',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SESSION LIST ════════════════════════════════════════════════════ */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-6">

        {filtered.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-3xl"
              style={{
                background: activeTabConfig.accentBg,
                border: `1px solid ${activeTabConfig.accent}20`,
              }}
            >
              {activeTabConfig.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">{t.historyEmpty}</h3>
            <p className="text-sm text-slate-400 max-w-xs mb-8 leading-relaxed">{L.emptySub}</p>
            <button
              onClick={() => navigate(activeTabConfig.emptyPath)}
              className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 hover:shadow-lg"
              style={{ background: `linear-gradient(135deg, ${activeTabConfig.accent}, ${activeTabConfig.accent}cc)` }}
            >
              {L.emptyAction}
            </button>
          </div>
        ) : (
          /* ── Cards ── */
          <div className="space-y-3">
            {filtered.map((session, idx) => (
              <button
                key={session.id}
                onClick={() => handleRestore(session)}
                className="w-full text-left group animate-fade-in"
                style={{ animationDelay: `${idx * 35}ms` }}
              >
                <div
                  className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 transition-all duration-300 group-active:scale-[0.99]"
                  style={{
                    borderLeftWidth: '3px',
                    borderLeftColor: activeTabConfig.accent,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      `0 8px 32px rgba(0,0,0,0.09)`;
                    (e.currentTarget as HTMLElement).style.borderColor =
                      `${activeTabConfig.accent}60`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    (e.currentTarget as HTMLElement).style.borderColor = '#f3f4f6';
                    (e.currentTarget as HTMLElement).style.borderLeftColor = activeTabConfig.accent;
                  }}
                >
                  {/* Subtle hover bg fill */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: activeTabConfig.accentBg }}
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    {/* Left: icon + content */}
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 mt-0.5"
                        style={{ background: activeTabConfig.accentBg }}
                      >
                        {activeTabConfig.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-base truncate transition-colors group-hover:text-slate-900">
                          {cleanText(session.title)}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mt-0.5">
                          {cleanText(session.preview)}
                        </p>
                      </div>
                    </div>

                    {/* Right: date + message count */}
                    <div className="shrink-0 flex flex-col items-end gap-2 pt-0.5">
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {getRelativeDate(session.date)}
                      </span>
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                        style={{
                          background: activeTabConfig.accentBg,
                          color: activeTabConfig.accent,
                        }}
                      >
                        {session.messages.length} {L.msgs}
                      </span>
                    </div>
                  </div>

                  {/* Resume CTA — appears on hover */}
                  <div className="relative mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span
                      className="text-xs font-bold"
                      style={{ color: activeTabConfig.accent }}
                    >
                      {L.resume}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default History;
