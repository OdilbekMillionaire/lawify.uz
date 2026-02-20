
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language, ChatSession } from '../types';
import { getHistory, clearHistory, cleanText } from '../services/storage';
import { TRANSLATIONS } from '../constants';
import Footer from '../components/Footer';

interface HistoryProps {
  language?: Language;
}

type TabKey = 'lawyer' | 'odilbek' | 'drafter' | 'commentator';

const History: React.FC<HistoryProps> = ({ language = Language.UZ }) => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('lawyer');
  const t = TRANSLATIONS[language];

  const L = {
    tabLawyer:      language === Language.UZ ? 'AI Yurist'           : language === Language.RU ? 'AI Юрист'           : 'AI Lawyer',
    tabOdilbek:     'Odilbek',
    tabDrafter:     language === Language.UZ ? 'AI Kotib'            : language === Language.RU ? 'AI Секретарь'       : 'AI Drafter',
    tabCommentator: language === Language.UZ ? 'AI Sharh'            : language === Language.RU ? 'AI Комментарий'    : 'AI Commentary',
    resume:         language === Language.UZ ? 'Davom ettirish'      : language === Language.RU ? 'Продолжить'         : 'Resume',
    view:           language === Language.UZ ? 'Ko\'rish'            : language === Language.RU ? 'Посмотреть'         : 'View',
    msgs:           language === Language.UZ ? 'xabar'               : language === Language.RU ? 'сообщ.'             : 'msgs',
    article:        language === Language.UZ ? 'modda'               : language === Language.RU ? 'статья'             : 'article',
    confirmClear:   language === Language.UZ ? "Barcha tarixni o'chirmoqchimisiz?" : language === Language.RU ? 'Очистить всю историю?' : 'Clear all history?',
    emptySub:       language === Language.UZ ? "Hali hech qanday suhbat yo'q."    : language === Language.RU ? 'Здесь пока пусто.'   : 'Nothing here yet.',
    emptyAction:    language === Language.UZ ? "Boshlash"            : language === Language.RU ? 'Начать'              : 'Start',
    today:          language === Language.UZ ? 'Bugun'               : language === Language.RU ? 'Сегодня'            : 'Today',
    yesterday:      language === Language.UZ ? 'Kecha'               : language === Language.RU ? 'Вчера'              : 'Yesterday',
    daysAgo: (n: number) =>
      language === Language.UZ ? `${n} kun oldin` : language === Language.RU ? `${n} дн. назад` : `${n}d ago`,
    clearAll:       language === Language.UZ ? "Tarixni tozalash"    : language === Language.RU ? 'Очистить историю'   : 'Clear history',
    sessions:       language === Language.UZ ? 'ta suhbat'           : language === Language.RU ? 'чатов'              : 'sessions',
    commentaries:   language === Language.UZ ? 'ta sharh'            : language === Language.RU ? 'комментариев'       : 'commentaries',
  };

  useEffect(() => {
    setSessions(getHistory());
  }, []);

  const getRelativeDate = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 86400000);
    if (diff === 0) return L.today;
    if (diff === 1) return L.yesterday;
    if (diff < 7) return L.daysAgo(diff);
    return new Date(ts).toLocaleDateString();
  };

  const handleClear = () => {
    if (confirm(L.confirmClear)) { clearHistory(); setSessions([]); }
  };

  const handleRestore = (session: ChatSession) => {
    if (session.type === 'commentator') {
      const cd = session.customData;
      navigate('/commentator', { state: { lawName: cd?.lawName, articleNumber: cd?.articleNumber, restoredResult: cd?.resultText } });
    } else if (session.type === 'odilbek') {
      navigate('/odilbek', { state: { restoredMessages: session.messages } });
    } else if (session.type === 'drafter') {
      navigate('/studio', { state: { restoredMessages: session.messages, restoredDocData: session.customData } });
    } else if (session.type === 'mediator') {
      navigate('/mediation');
    } else {
      navigate('/chat', { state: { restoredMessages: session.messages } });
    }
  };

  const tabs: { key: TabKey; label: string; icon: string; accent: string; accentBg: string; emptyPath: string; emptyLabel: string }[] = [
    {
      key: 'lawyer',
      label: L.tabLawyer,
      icon: '⚖️',
      accent: '#2563eb',
      accentBg: 'rgba(37,99,235,0.1)',
      emptyPath: '/chat',
      emptyLabel: language === Language.UZ ? 'Chat boshlash' : language === Language.RU ? 'Начать чат' : 'Start chat',
    },
    {
      key: 'odilbek',
      label: L.tabOdilbek,
      icon: '🧑‍🏫',
      accent: '#d97706',
      accentBg: 'rgba(217,119,6,0.1)',
      emptyPath: '/odilbek',
      emptyLabel: language === Language.UZ ? 'Odilbek bilan gaplashing' : language === Language.RU ? 'Спросить Одилбека' : 'Ask Odilbek',
    },
    {
      key: 'drafter',
      label: L.tabDrafter,
      icon: '📝',
      accent: '#059669',
      accentBg: 'rgba(5,150,105,0.1)',
      emptyPath: '/studio',
      emptyLabel: language === Language.UZ ? 'Hujjat yaratish' : language === Language.RU ? 'Создать документ' : 'Create document',
    },
    {
      key: 'commentator',
      label: L.tabCommentator,
      icon: '📚',
      accent: '#7c3aed',
      accentBg: 'rgba(124,58,237,0.1)',
      emptyPath: '/commentator',
      emptyLabel: language === Language.UZ ? 'Sharh olish' : language === Language.RU ? 'Получить комментарий' : 'Get commentary',
    },
  ];

  const activeTabConfig = tabs.find(t => t.key === activeTab)!;
  const filtered = sessions.filter(s => s.type === activeTab);
  const totalSessions = sessions.filter(s => s.type !== 'commentator').length;
  const totalCommentaries = sessions.filter(s => s.type === 'commentator').length;

  return (
    <div className="h-full overflow-y-auto flex flex-col" style={{ background: '#f8fafc' }}>

      {/* DARK HEADER */}
      <div className="shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 55%, #1e1b4b 100%)' }}>
        <div className="absolute pointer-events-none" style={{ top: '-40px', right: '10%', width: '350px', height: '250px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-30px', left: '5%', width: '250px', height: '200px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="max-w-5xl mx-auto px-6 py-8 md:py-10 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full mb-3"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                <span className="text-indigo-300 font-bold text-xs uppercase tracking-widest">History</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1">{t.historyTitle}</h2>
              <p className="text-slate-400 text-sm">{t.historySubtitle}</p>
            </div>
            {sessions.length > 0 && (
              <button onClick={handleClear}
                className="shrink-0 text-xs font-bold text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {L.clearAll}
              </button>
            )}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {tabs.map(tab => {
              const cnt = sessions.filter(s => s.type === tab.key).length;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200"
                  style={{
                    background: activeTab === tab.key ? `${tab.accentBg}` : 'rgba(255,255,255,0.04)',
                    border: activeTab === tab.key ? `1px solid ${tab.accent}40` : '1px solid rgba(255,255,255,0.06)',
                  }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: tab.accentBg }}>
                    {tab.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-black text-lg leading-none" style={{ color: activeTab === tab.key ? tab.accent : 'white' }}>{cnt}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-medium">{tab.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* STICKY TABS */}
      <div className="shrink-0 bg-white sticky top-0 z-20 shadow-sm" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map(tab => {
              const cnt = sessions.filter(s => s.type === tab.key).length;
              const isActive = activeTab === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className="flex items-center space-x-2 px-4 py-4 font-bold text-sm whitespace-nowrap transition-all duration-200 border-b-2"
                  style={{
                    borderBottomColor: isActive ? tab.accent : 'transparent',
                    color: isActive ? tab.accent : '#94a3b8',
                  }}>
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {cnt > 0 && (
                    <span className="text-xs font-black px-2 py-0.5 rounded-full transition-all"
                      style={{ background: isActive ? `${tab.accentBg}` : '#f1f5f9', color: isActive ? tab.accent : '#94a3b8' }}>
                      {cnt}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SESSION LIST */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-3xl"
              style={{ background: activeTabConfig.accentBg, border: `1px solid ${activeTabConfig.accent}25` }}>
              {activeTabConfig.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">{t.historyEmpty}</h3>
            <p className="text-sm text-slate-400 max-w-xs mb-8 leading-relaxed">{L.emptySub}</p>
            <button onClick={() => navigate(activeTabConfig.emptyPath)}
              className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${activeTabConfig.accent}, ${activeTabConfig.accent}cc)` }}>
              {activeTabConfig.emptyLabel}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((session, idx) => {
              const isCommentator = session.type === 'commentator';
              const cd = session.customData;
              return (
                <button key={session.id} onClick={() => handleRestore(session)}
                  className="w-full text-left group animate-fade-in"
                  style={{ animationDelay: `${idx * 35}ms` }}>
                  <div className="relative overflow-hidden rounded-2xl bg-white p-5 transition-all duration-300 group-active:scale-[0.99]"
                    style={{
                      border: '1px solid #e2e8f0',
                      borderLeftWidth: '3px',
                      borderLeftColor: activeTabConfig.accent,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 24px rgba(0,0,0,0.08)`;
                      (e.currentTarget as HTMLElement).style.borderColor = `${activeTabConfig.accent}50`;
                      (e.currentTarget as HTMLElement).style.borderLeftColor = activeTabConfig.accent;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                      (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                      (e.currentTarget as HTMLElement).style.borderLeftColor = activeTabConfig.accent;
                    }}>
                    {/* Hover bg */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                      style={{ background: activeTabConfig.accentBg }} />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 mt-0.5"
                          style={{ background: activeTabConfig.accentBg }}>
                          {activeTabConfig.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 text-sm truncate">{cleanText(session.title)}</h3>
                          {isCommentator && cd?.lawName ? (
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                                style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                                {cd.lawName}
                              </span>
                              <span className="text-xs text-slate-400">{cd.articleNumber}-{L.article}</span>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-0.5">
                              {cleanText(session.preview)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-2 pt-0.5">
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {getRelativeDate(session.date)}
                        </span>
                        {isCommentator ? (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                            style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                            lex.uz
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                            style={{ background: activeTabConfig.accentBg, color: activeTabConfig.accent }}>
                            {session.messages.length} {L.msgs}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="relative mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-xs font-bold flex items-center space-x-1" style={{ color: activeTabConfig.accent }}>
                        <span>{isCommentator ? L.view : L.resume}</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default History;
