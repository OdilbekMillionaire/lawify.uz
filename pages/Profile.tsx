import React, { useState, useEffect } from 'react';
import { View, Language, UserSettings } from '../types';
import { TRANSLATIONS } from '../constants';
import { getHistory } from '../services/storage';

interface ProfileProps {
  onNavigate: (view: View) => void;
  language: Language;
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
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

const Profile: React.FC<ProfileProps> = ({ onNavigate, language, settings, setSettings }) => {
  const t = TRANSLATIONS[language];
  const history = getHistory();
  const stats = {
      consultations: history.length,
      savedDocs: 0 // Mocked for now
  };

  // Profile State
  const [profileImage, setProfileImage] = useState<string | null>(localStorage.getItem('user_avatar'));
  const [name, setName] = useState(localStorage.getItem('user_name') || "User Name");
  const [email, setEmail] = useState(localStorage.getItem('user_email') || "user@example.com");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        localStorage.setItem('user_avatar', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
      localStorage.setItem('user_name', name);
      localStorage.setItem('user_email', email);
      alert("Profile updated successfully!");
  };

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-10">
            <div className="space-y-2 animate-fade-in">
                <h2 className="text-3xl font-serif font-bold text-slate-900">{t.profileTitle}</h2>
                <p className="text-slate-500">{t.profileSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Personal Info & Stats */}
                <div className="lg:col-span-4 space-y-6">
                     {/* Personal Info Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-fade-in-up flex flex-col items-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-white z-0"></div>
                        
                        <div className="relative z-10 mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center relative">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-blue-600 text-4xl font-bold">
                                        {name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                     <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                        
                        <div className="w-full space-y-3 z-10">
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="w-full text-center font-bold text-xl text-slate-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                            />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full text-center text-sm text-gray-500 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                            />
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
                        <button 
                            onClick={handleSave}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95"
                        >
                            {t.profileSave}
                        </button>
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
    </div>
  );
};

export default Profile;