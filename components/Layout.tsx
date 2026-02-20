
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onStartLive: () => void;
  userProfile: UserProfile | null;
  onLogin: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  language, 
  onLanguageChange,
  onStartLive,
  userProfile,
  onLogin
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const t = TRANSLATIONS[language];

  // Helper to check if a route is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavItem = ({ path, icon, label }: { path: string; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isActive(path)
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
      }`}
      aria-label={label}
      aria-current={isActive(path) ? 'page' : undefined}
    >
      <div className={`${isActive(path) ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );

  const BottomNavItem = ({ path, icon, label }: { path: string; icon: React.ReactNode; label: string }) => (
    <button
        onClick={() => navigate(path)}
        className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors active:scale-95 ${
            isActive(path) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
        }`}
    >
        <div className={`mb-1 transition-transform ${isActive(path) ? 'transform scale-110' : ''}`}>
            {icon}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wide leading-none">{label}</span>
        {isActive(path) && <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-gray-800">
      {/* Sidebar - DESKTOP ONLY */}
      <aside className="hidden md:flex z-50 w-72 h-full bg-white border-r border-gray-200 flex-col transition-transform duration-300">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')} role="button" aria-label="Go to Dashboard">
                {/* Lady Justice Logo */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-800 to-slate-900 rounded-full flex items-center justify-center text-white shadow-xl ring-2 ring-blue-100 overflow-hidden">
                   <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="5" r="2" strokeWidth="1.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 7v10M8 21h8M12 17l-4 4M12 17l4 4" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 9l-3 2v3m0-3l3 2v3m-3-5h3" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 7l-6 2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 7l6-2v-2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 5v6l-1 1m2-1l1 1m-1-1v4" />
                   </svg>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight leading-none">LAWIFY</h1>
                    <span className="text-[10px] text-blue-700 font-bold tracking-widest uppercase mt-1">AI Legal Counsel</span>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-2">
            <NavItem 
                path="/" 
                label={t.navDashboard} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>}
            />
            <NavItem 
                path="/chat" 
                label={t.navChat} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>}
            />
            <NavItem 
                path="/topics" 
                label={t.navTopics} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>}
            />
            <NavItem 
                path="/library" 
                label={t.navTemplates} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
            />
            <NavItem
                path="/mediation"
                label={t.navMediation}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
            />
            <NavItem
                path="/commentator"
                label={language === Language.UZ ? 'AI sharh beruvchi' : language === Language.RU ? 'AI Комментатор' : 'AI Commentator'}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>}
            />
            <NavItem
                path="/history" 
                label={t.navHistory} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
            />
            <NavItem 
                path="/plans" 
                label={t.navPlans} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>}
            />
             <NavItem 
                path="/profile" 
                label={t.navProfile} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
            />
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
             {/* User Status / Login */}
             {userProfile ? (
                 <div className="mb-4 flex items-center p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-2 overflow-hidden">
                         {userProfile.avatar_url ? (
                             <img src={userProfile.avatar_url} alt="User" className="w-full h-full object-cover" />
                         ) : (
                             userProfile.email ? userProfile.email[0].toUpperCase() : 'U'
                         )}
                     </div>
                     <div className="flex-1 min-w-0">
                         <p className="text-xs font-bold text-gray-800 truncate">{userProfile.full_name || userProfile.email}</p>
                         <p className="text-[10px] text-gray-500 flex items-center">
                             {userProfile.is_pro ? (
                                 <span className="text-orange-500 font-bold flex items-center">
                                     <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                     PRO
                                 </span>
                             ) : 'Free Plan'}
                         </p>
                     </div>
                 </div>
             ) : (
                 <button 
                    onClick={onLogin}
                    className="w-full mb-4 bg-white text-gray-700 text-xs font-bold py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
                 >
                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                     Login / Register
                 </button>
             )}

             {/* Live Chat CTA */}
             <button 
                onClick={onStartLive}
                className="w-full mb-6 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                aria-label={t.startLive}
            >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </div>
                <span className="font-semibold text-sm">{t.startLive}</span>
            </button>

            {/* Language Toggle */}
            <div className="grid grid-cols-3 gap-1 bg-gray-200 p-1 rounded-lg" role="group" aria-label="Language selection">
                {[Language.UZ, Language.RU, Language.EN].map((lang) => (
                    <button
                        key={lang}
                        onClick={() => onLanguageChange(lang)}
                        className={`text-xs font-bold py-1.5 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            language === lang 
                                ? 'bg-white text-blue-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                        aria-pressed={language === lang}
                    >
                        {lang.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden pb-16 md:pb-0">
        {/* Mobile Header - Logo Only */}
        <header className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-center px-4 z-30 sticky top-0 shrink-0">
            <span className="font-serif font-bold text-slate-900 text-lg flex items-center tracking-tight">
               LAWIFY
            </span>
        </header>

        <div className="flex-1 overflow-hidden relative animate-fade-in">
            {children}
        </div>

        {/* Bottom Navigation - MOBILE ONLY */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 z-50 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <BottomNavItem 
                path="/" 
                label={t.navDashboard} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>} 
            />
            <BottomNavItem 
                path="/chat" 
                label={t.navChat} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>} 
            />
            <BottomNavItem 
                path="/library" 
                label={t.navTemplates} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>} 
            />
            <BottomNavItem 
                path="/mediation" 
                label={t.navMediation} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>} 
            />
            <BottomNavItem 
                path="/profile" 
                label={t.navProfile} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>} 
            />
        </nav>
      </main>
    </div>
  );
};

export default Layout;
