import React, { useState, useRef, useEffect } from 'react';
import { Language, UserSettings, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';
import { getHistory, clearHistory } from '../services/storage';
import { updateUserProfile } from '../services/supabaseClient';
import Footer from '../components/Footer';

interface ProfileProps {
  language: Language;
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
  userProfile: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  refreshProfile: () => void;
}

const Toggle: React.FC<{ checked: boolean; onChange: () => void; accent?: string }> = ({ checked, onChange, accent = '#3b82f6' }) => (
  <button onClick={onChange}
    className="relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none shrink-0"
    style={{ background: checked ? accent : '#334155' }}>
    <span className="inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
      style={{ transform: checked ? 'translateX(26px)' : 'translateX(2px)' }} />
  </button>
);

const PillGroup: React.FC<{ options: { value: string; label: string }[]; selected: string; onChange: (v: string) => void; accent?: string }> = ({ options, selected, onChange, accent = '#2563eb' }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => (
      <button key={opt.value} onClick={() => onChange(opt.value)}
        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
        style={{
          background: selected === opt.value ? accent : 'rgba(255,255,255,0.05)',
          color: selected === opt.value ? 'white' : '#94a3b8',
          border: selected === opt.value ? `1px solid ${accent}` : '1px solid rgba(255,255,255,0.08)',
        }}>
        {opt.label}
      </button>
    ))}
  </div>
);

const Profile: React.FC<ProfileProps> = ({ language, settings, setSettings, userProfile, onLogin, onLogout, refreshProfile }) => {
  const t = TRANSLATIONS[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  const loadLocalSettings = () => {
    try {
      const raw = localStorage.getItem('lawify_ui_prefs');
      return raw ? JSON.parse(raw) : { showSources: true, compactMode: false, usageWarnings: true, autoLang: false };
    } catch { return { showSources: true, compactMode: false, usageWarnings: true, autoLang: false }; }
  };
  const [uiPrefs, setUiPrefs] = useState(loadLocalSettings);

  useEffect(() => { setHistoryCount(getHistory().length); }, []);

  const updateUiPref = (key: string, val: boolean) => {
    const next = { ...uiPrefs, [key]: val };
    setUiPrefs(next);
    localStorage.setItem('lawify_ui_prefs', JSON.stringify(next));
  };

  const handleAvatarUpdate = async (newUrl: string) => {
    if (!userProfile) return;
    setLoading(true);
    try { await updateUserProfile(userProfile.id, { avatar_url: newUrl }); refreshProfile(); setIsAvatarModalOpen(false); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onloadend = () => handleAvatarUpdate(r.result as string); r.readAsDataURL(file); }
  };

  const handleClearHistory = () => {
    const msg = language === Language.UZ ? "Barcha tarixni o'chirmoqchimisiz?" : language === Language.RU ? 'Очистить всю историю?' : 'Clear all history?';
    if (confirm(msg)) { clearHistory(); setHistoryCount(0); }
  };

  const L = {
    stats:        language === Language.UZ ? 'Statistika'          : language === Language.RU ? 'Статистика'        : 'Statistics',
    aiSettings:   language === Language.UZ ? 'AI Sozlamalari'      : language === Language.RU ? 'Настройки AI'      : 'AI Settings',
    aiPrefs:      language === Language.UZ ? 'AI Afzalliklari'     : language === Language.RU ? 'Предпочтения AI'   : 'AI Preferences',
    notifications:language === Language.UZ ? 'Bildirishnomalar'    : language === Language.RU ? 'Уведомления'       : 'Notifications',
    danger:       language === Language.UZ ? 'Xavfli zona'         : language === Language.RU ? 'Опасная зона'      : 'Danger Zone',
    logout:       language === Language.UZ ? 'Chiqish'             : language === Language.RU ? 'Выйти'             : 'Logout',
    clearHistory: language === Language.UZ ? 'Tarixni tozalash'    : language === Language.RU ? 'Очистить историю'  : 'Clear History',
    upgrade:      language === Language.UZ ? "Pro rejaga o'tish"   : language === Language.RU ? 'Перейти на Pro'    : 'Upgrade to Pro',
    loginPrompt:  language === Language.UZ ? "Profilingizni ko'rish uchun tizimga kiring" : language === Language.RU ? 'Войдите, чтобы увидеть профиль' : 'Login to view your profile',
    chats:        language === Language.UZ ? 'Suhbatlar'           : language === Language.RU ? 'Чаты'              : 'Chats',
    planLabel:    language === Language.UZ ? 'Reja'                : language === Language.RU ? 'Тариф'             : 'Plan',
    short:        language === Language.UZ ? 'Qisqa'               : language === Language.RU ? 'Краткий'           : 'Short',
    medium:       language === Language.UZ ? "O'rta"               : language === Language.RU ? 'Средний'           : 'Medium',
    detailed:     language === Language.UZ ? 'Batafsil'            : language === Language.RU ? 'Подробный'         : 'Detailed',
    simple:       language === Language.UZ ? 'Oddiy'               : language === Language.RU ? 'Простой'           : 'Simple',
    professional: language === Language.UZ ? 'Professional'        : language === Language.RU ? 'Профессиональный'  : 'Professional',
    neutral:      language === Language.UZ ? 'Neytral'             : language === Language.RU ? 'Нейтральный'       : 'Neutral',
    consumer:     language === Language.UZ ? "Iste'molchi"         : language === Language.RU ? 'Потребитель'       : 'Consumer',
    business:     language === Language.UZ ? 'Biznes'              : language === Language.RU ? 'Бизнес'            : 'Business',
    showSources:  language === Language.UZ ? "Javoblarda manbalar ko'rsatish"    : language === Language.RU ? 'Показывать источники'    : 'Show sources in responses',
    compactMode:  language === Language.UZ ? 'Ixcham rejim'                       : language === Language.RU ? 'Компактный режим'        : 'Compact response mode',
    usageWarnings:language === Language.UZ ? 'Limit haqida ogohlantirish'         : language === Language.RU ? 'Предупреждения о лимите' : 'Usage limit warnings',
    autoLang:     language === Language.UZ ? 'Tilni avtomatik aniqlash'           : language === Language.RU ? 'Автоопределение языка'   : 'Auto-detect language',
    changeAvatar: language === Language.UZ ? "Avatar o'zgartirish"               : language === Language.RU ? 'Изменить аватар'         : 'Change Avatar',
    uploadPhoto:  language === Language.UZ ? 'Rasm yuklash'                       : language === Language.RU ? 'Загрузить фото'          : 'Upload Photo',
    close:        language === Language.UZ ? 'Yopish'                             : language === Language.RU ? 'Закрыть'                 : 'Close',
  };

  const planColors: Record<string, string> = { free: '#64748b', day: '#3b82f6', week: '#6366f1', month: '#a855f7', lawyer: '#10b981' };
  const planColor = userProfile ? (planColors[userProfile.plan_type] || '#64748b') : '#64748b';

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!userProfile) {
    return (
      <div className="h-full flex flex-col" style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #0d1a3a 100%)' }}>
        <div className="shrink-0 relative overflow-hidden px-6 py-10" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 55%, #1e1b4b 100%)' }}>
          <h2 className="text-2xl font-serif font-bold text-white relative z-10">{t.profileTitle}</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{t.profileTitle}</h3>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">{L.loginPrompt}</p>
          </div>
          <button onClick={onLogin}
            className="px-8 py-3.5 rounded-2xl font-bold text-white hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 20px rgba(37,99,235,0.35)' }}>
            {t.profileLoginBtn}
          </button>
        </div>
      </div>
    );
  }

  const Section: React.FC<{ title: string; icon: string; children: React.ReactNode; accent?: string }> = ({ title, icon, children, accent = '#2563eb' }) => (
    <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="px-6 py-4 flex items-center space-x-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
          style={{ background: `${accent}20`, border: `1px solid ${accent}30` }}>{icon}</div>
        <span className="font-bold text-xs text-slate-400 uppercase tracking-widest">{title}</span>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto flex flex-col" style={{ background: 'linear-gradient(180deg, #060d1a 0%, #0a1428 100%)' }}>

      {/* HEADER */}
      <div className="shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 55%, #1e1b4b 100%)' }}>
        <div className="absolute pointer-events-none" style={{ top: '-50px', right: '8%', width: '350px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">
          <div className="flex items-center space-x-5">
            <div className="relative cursor-pointer group shrink-0" onClick={() => setIsAvatarModalOpen(true)}>
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-2xl font-black"
                style={{ background: `linear-gradient(135deg, ${planColor}40, ${planColor}20)`, border: `2px solid ${planColor}50` }}>
                {userProfile.avatar_url
                  ? <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  : <span style={{ color: planColor }}>{(userProfile.full_name || userProfile.email || 'U')[0].toUpperCase()}</span>}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: '#0d1a3a', border: '1px solid rgba(255,255,255,0.12)' }}>
                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white mb-0.5 truncate">{userProfile.full_name || 'User'}</h2>
              <p className="text-slate-400 text-sm truncate mb-2">{userProfile.email}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                  style={{ background: `${planColor}20`, color: planColor, border: `1px solid ${planColor}30` }}>
                  {userProfile.plan_type} PLAN
                </span>
              </div>
            </div>
            <button onClick={onLogout}
              className="hidden md:flex shrink-0 items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{L.logout}</span>
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-8 py-6 space-y-4">

        <Section title={L.stats} icon="📊" accent="#6366f1">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: L.chats, value: historyCount, color: '#3b82f6' },
              { label: L.planLabel, value: (userProfile.plan_type || 'free').toUpperCase(), color: planColor },
              { label: 'Status', value: userProfile.is_pro ? 'PRO' : 'Free', color: userProfile.is_pro ? '#10b981' : '#64748b' },
            ].map((stat, i) => (
              <div key={i} className="px-3 py-3 rounded-2xl text-center"
                style={{ background: `${stat.color}12`, border: `1px solid ${stat.color}25` }}>
                <div className="font-black text-lg leading-none mb-0.5" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title={L.aiSettings} icon="🤖" accent="#2563eb">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t.length}</p>
              <PillGroup
                options={[{ value: 'Short', label: L.short }, { value: 'Medium', label: L.medium }, { value: 'Detailed', label: L.detailed }]}
                selected={settings.answerLength}
                onChange={v => setSettings({ ...settings, answerLength: v as any })}
                accent="#2563eb"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t.tone}</p>
              <PillGroup
                options={[{ value: 'Simple', label: L.simple }, { value: 'Professional', label: L.professional }]}
                selected={settings.tone}
                onChange={v => setSettings({ ...settings, tone: v as any })}
                accent="#7c3aed"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t.perspective}</p>
              <PillGroup
                options={[{ value: 'Neutral', label: L.neutral }, { value: 'Pro-Consumer', label: L.consumer }, { value: 'Pro-Business', label: L.business }]}
                selected={settings.perspective}
                onChange={v => setSettings({ ...settings, perspective: v as any })}
                accent="#059669"
              />
            </div>
          </div>
        </Section>

        <Section title={L.aiPrefs} icon="⚙️" accent="#7c3aed">
          <div className="space-y-4">
            {[
              { key: 'showSources', label: L.showSources, accent: '#7c3aed' },
              { key: 'compactMode', label: L.compactMode, accent: '#7c3aed' },
              { key: 'autoLang', label: L.autoLang, accent: '#7c3aed' },
            ].map(pref => (
              <div key={pref.key} className="flex items-center justify-between">
                <span className="text-sm text-slate-300 font-medium">{pref.label}</span>
                <Toggle checked={uiPrefs[pref.key]} onChange={() => updateUiPref(pref.key, !uiPrefs[pref.key])} accent={pref.accent} />
              </div>
            ))}
          </div>
        </Section>

        <Section title={L.notifications} icon="🔔" accent="#d97706">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300 font-medium">{L.usageWarnings}</span>
            <Toggle checked={uiPrefs.usageWarnings} onChange={() => updateUiPref('usageWarnings', !uiPrefs.usageWarnings)} accent="#d97706" />
          </div>
        </Section>

        <Section title={L.danger} icon="⚠️" accent="#ef4444">
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleClearHistory}
              className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all hover:opacity-80"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>{L.clearHistory}</span>
            </button>
            <button onClick={onLogout}
              className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all hover:opacity-80 md:hidden"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{L.logout}</span>
            </button>
          </div>
        </Section>

        <p className="text-center text-xs text-slate-700 py-2">© 2026 OXFORDER LLC · Lawify.uz</p>
      </div>

      {/* AVATAR MODAL */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-sm rounded-3xl p-6 relative"
            style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={() => setIsAvatarModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-bold text-white mb-5">{L.changeAvatar}</h3>
            <div onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center cursor-pointer transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.5)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-300">{L.uploadPhoto}</span>
              <span className="text-xs text-slate-500 mt-1">JPG, PNG, WebP</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
