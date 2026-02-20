
import React, { useState, useRef } from 'react';
import { Language, UserSettings, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';
import { getHistory } from '../services/storage';
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

interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const OptionCard: React.FC<OptionCardProps> = ({ label, selected, onClick, icon }) => (
  <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 h-24 w-full group ${
          selected 
          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
          : 'border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:bg-gray-50'
      }`}
  >
      {icon && <div className={`mb-1 ${selected ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-400'}`}>{icon}</div>}
      <span className={`text-xs font-bold text-center ${selected ? 'text-blue-700' : 'text-gray-600'}`}>{label}</span>
  </button>
);

const Profile: React.FC<ProfileProps> = ({ language, settings, setSettings, userProfile, onLogin, onLogout, refreshProfile }) => {
  const t = TRANSLATIONS[language];
  const history = getHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const stats = {
      consultations: history.length,
      savedDocs: 0
  };

  const handleAvatarUpdate = async (newUrl: string) => {
      if (!userProfile) return;
      setLoading(true);
      try {
          await updateUserProfile(userProfile.id, { avatar_url: newUrl });
          refreshProfile();
          setIsAvatarModalOpen(false);
      } catch (e) {
          console.error(e);
          alert("Failed to update avatar");
      } finally {
          setLoading(false);
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              handleAvatarUpdate(result);
          };
          reader.readAsDataURL(file);
      }
  };

  // MOBILE-OPTIMIZED LOGIN VIEW
  if (!userProfile) {
      return (
          <div className="h-full flex flex-col bg-white">
               <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
                   <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                       <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                   </div>
                   
                   <div>
                       <h2 className="text-2xl font-serif font-bold text-slate-900 mb-3">{t.profileTitle}</h2>
                       <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">{t.profileLoginPrompt}</p>
                   </div>

                   <button 
                      onClick={onLogin}
                      className="w-full max-w-xs bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-transform active:scale-95"
                   >
                       {t.profileLoginBtn}
                   </button>
                   
                   <p className="text-xs text-gray-400 mt-4">Secure access via Supabase Auth</p>
               </div>
               {/* Simplified Footer for Login Screen */}
               <div className="p-6 border-t border-gray-100 bg-gray-50 text-center">
                   <p className="text-xs text-gray-400">© 2026 OXFORDER LLC</p>
               </div>
          </div>
      )
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 flex flex-col">
        <div className="flex-1 p-4 md:p-10">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Header Row */}
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{t.profileTitle}</h2>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium text-xs transition-colors"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Personal Info & Stats */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Personal Info Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50 to-white z-0"></div>
                            
                            <div className="relative z-10 mb-3 cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center relative text-blue-600 text-3xl font-bold group-hover:ring-4 ring-blue-50 transition-all">
                                    {userProfile.avatar_url ? (
                                        <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        userProfile.email ? userProfile.email[0].toUpperCase() : 'U'
                                    )}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-full space-y-1 z-10 text-center">
                                <h3 className="font-bold text-lg text-slate-800">{userProfile.full_name || "User"}</h3>
                                <p className="text-xs text-gray-500">{userProfile.email}</p>
                                
                                <div className="mt-3">
                                    {userProfile.is_pro ? (
                                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-orange-200">
                                            {userProfile.plan_type} PLAN
                                        </span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-gray-200">
                                            FREE PLAN
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                            <h4 className="font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-3">{t.profileStats}</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <span className="font-bold text-xl text-blue-600">{stats.consultations}</span>
                                    <span className="text-[10px] text-blue-400 uppercase font-bold mt-1">Chats</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 bg-purple-50 rounded-xl border border-purple-100">
                                    <span className="font-bold text-xl text-purple-600">{stats.savedDocs}</span>
                                    <span className="text-[10px] text-purple-400 uppercase font-bold mt-1">Docs</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-serif font-bold text-xl text-slate-800 mb-6">{t.settings}</h3>
                        
                        <div className="space-y-8">
                            {/* Answer Length */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                                    {t.length}
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Short', 'Medium', 'Detailed'].map((l) => (
                                        <OptionCard 
                                            key={l}
                                            label={l === 'Short' ? t.short : l === 'Medium' ? t.medium : t.detailed}
                                            selected={settings.answerLength === l}
                                            onClick={() => setSettings({...settings, answerLength: l as any})}
                                            icon={
                                                l === 'Short' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8"></path></svg> :
                                                l === 'Medium' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h8"></path></svg> :
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M4 22h10"></path></svg>
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Tone */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                                    {t.tone}
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Simple', 'Professional'].map((tone) => (
                                        <OptionCard 
                                            key={tone}
                                            label={tone === 'Simple' ? t.simple : t.professional}
                                            selected={settings.tone === tone}
                                            onClick={() => setSettings({...settings, tone: tone as any})}
                                            icon={
                                                tone === 'Simple' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> :
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Perspective */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                                    {t.perspective}
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Neutral', 'Pro-Consumer', 'Pro-Business'].map((p) => (
                                        <OptionCard 
                                            key={p}
                                            label={p === 'Neutral' ? t.persNeutral : p === 'Pro-Consumer' ? t.persConsumer : t.persBusiness}
                                            selected={settings.perspective === p}
                                            onClick={() => setSettings({...settings, perspective: p as any})}
                                            icon={
                                                p === 'Neutral' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg> :
                                                p === 'Pro-Consumer' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg> :
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Only show full footer on desktop to save space on mobile profile */}
        <div className="hidden md:block">
            <Footer />
        </div>
        
        {/* Avatar Modal */}
        {isAvatarModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-fade-in">
                    <button onClick={() => setIsAvatarModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Choose Avatar</h3>
                    <div className="mb-6">
                         <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors">
                             <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                             <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                             </div>
                             <span className="text-sm font-bold text-gray-600">Upload Photo</span>
                         </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Profile;
