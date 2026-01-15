import React, { useState, useRef } from 'react';
import { View, Language, UserSettings, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';
import { getHistory } from '../services/storage';
import { updateUserProfile } from '../services/supabaseClient';

interface ProfileProps {
  onNavigate: (view: View) => void;
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
      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 h-28 w-full group ${
          selected 
          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md transform scale-[1.02]' 
          : 'border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:bg-gray-50'
      }`}
  >
      {icon && <div className={`mb-2 ${selected ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-400'}`}>{icon}</div>}
      <span className={`text-sm font-bold ${selected ? 'text-blue-700' : 'text-gray-600'}`}>{label}</span>
      {selected && (
          <div className="absolute top-2 right-2 text-blue-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          </div>
      )}
  </button>
);

const PRESET_AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Willow",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Trouble",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Gizmo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Cuddles"
];

const Profile: React.FC<ProfileProps> = ({ onNavigate, language, settings, setSettings, userProfile, onLogin, onLogout, refreshProfile }) => {
  const t = TRANSLATIONS[language];
  const history = getHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const stats = {
      consultations: history.length,
      savedDocs: 0 // Mocked for now
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
              // Ideally upload to storage, but using base64 for demo
              handleAvatarUpdate(result);
          };
          reader.readAsDataURL(file);
      }
  };

  if (!userProfile) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50">
               <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t.profileTitle}</h2>
               <p className="text-slate-500 mb-8">Please login to manage your profile and subscription.</p>
               <button 
                  onClick={onLogin}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg"
               >
                   Login / Register
               </button>
          </div>
      )
  }

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-10">
            <div className="space-y-2 animate-fade-in flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900">{t.profileTitle}</h2>
                    <p className="text-slate-500">{t.profileSubtitle}</p>
                </div>
                <button 
                    onClick={onLogout}
                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Personal Info & Stats */}
                <div className="lg:col-span-4 space-y-6">
                     {/* Personal Info Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-fade-in-up flex flex-col items-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-white z-0"></div>
                        
                        <div className="relative z-10 mb-4 cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center relative text-blue-600 text-4xl font-bold group-hover:ring-4 ring-blue-100 transition-all">
                                {userProfile.avatar_url ? (
                                    <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    userProfile.email ? userProfile.email[0].toUpperCase() : 'U'
                                )}
                                
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full space-y-1 z-10 text-center">
                            <h3 className="font-bold text-xl text-slate-800">{userProfile.full_name || "User"}</h3>
                            <p className="text-sm text-gray-500">{userProfile.email}</p>
                            
                            <div className="mt-4 inline-block">
                                {userProfile.is_pro ? (
                                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {userProfile.plan_type} PLAN
                                    </span>
                                ) : (
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        FREE PLAN
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up delay-100">
                         <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-4">{t.profileStats}</h4>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <span className="text-sm text-gray-600 font-medium">{t.profileConsultations}</span>
                                <span className="font-bold text-blue-600 bg-white px-3 py-1 rounded-lg shadow-sm">{stats.consultations}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <span className="text-sm text-gray-600 font-medium">{t.profileSavedDocs}</span>
                                <span className="font-bold text-blue-600 bg-white px-3 py-1 rounded-lg shadow-sm">{stats.savedDocs}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings */}
                <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up delay-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-serif font-bold text-2xl text-slate-800">{t.settings}</h3>
                    </div>
                    
                    <div className="space-y-10">
                         {/* Answer Length */}
                         <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                                {t.length}
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                 {['Short', 'Medium', 'Detailed'].map((l) => (
                                    <OptionCard 
                                        key={l}
                                        label={l === 'Short' ? t.short : l === 'Medium' ? t.medium : t.detailed}
                                        selected={settings.answerLength === l}
                                        onClick={() => setSettings({...settings, answerLength: l as any})}
                                        icon={
                                            l === 'Short' ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8"></path></svg> :
                                            l === 'Medium' ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h8"></path></svg> :
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M4 22h10"></path></svg>
                                        }
                                    />
                                ))}
                            </div>
                         </div>

                         {/* Tone */}
                         <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                {t.tone}
                            </label>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 {['Simple', 'Professional'].map((tone) => (
                                    <OptionCard 
                                        key={tone}
                                        label={tone === 'Simple' ? t.simple : t.professional}
                                        selected={settings.tone === tone}
                                        onClick={() => setSettings({...settings, tone: tone as any})}
                                        icon={
                                            tone === 'Simple' ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> :
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                        }
                                    />
                                ))}
                            </div>
                         </div>

                         {/* Perspective */}
                         <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {t.perspective}
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {['Neutral', 'Pro-Consumer', 'Pro-Business'].map((p) => (
                                     <OptionCard 
                                        key={p}
                                        label={p === 'Neutral' ? t.persNeutral : p === 'Pro-Consumer' ? t.persConsumer : t.persBusiness}
                                        selected={settings.perspective === p}
                                        onClick={() => setSettings({...settings, perspective: p as any})}
                                        icon={
                                            p === 'Neutral' ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg> :
                                            p === 'Pro-Consumer' ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg> :
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                        }
                                    />
                                ))}
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Avatar Selection Modal */}
        {isAvatarModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-fade-in">
                    <button 
                        onClick={() => setIsAvatarModalOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Choose Avatar</h3>
                    
                    {/* Custom Upload */}
                    <div className="mb-6">
                         <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors"
                         >
                             <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload}
                                accept="image/*"
                                className="hidden"
                             />
                             <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                             </div>
                             <span className="text-sm font-bold text-gray-600">Upload Photo</span>
                         </div>
                    </div>

                    <div className="border-t border-gray-100 my-4 pt-4">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-4">Or choose a preset</p>
                        <div className="grid grid-cols-4 gap-4">
                            {PRESET_AVATARS.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAvatarUpdate(url)}
                                    className="aspect-square rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 hover:scale-105 transition-all"
                                >
                                    <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover bg-gray-50" />
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default Profile;