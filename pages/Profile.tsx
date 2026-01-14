
import React from 'react';
import { View, Language, UserSettings } from '../types';
import { TRANSLATIONS } from '../constants';
import { getHistory } from '../services/storage';

interface ProfileProps {
  onNavigate: (view: View) => void;
  language: Language;
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, language, settings, setSettings }) => {
  const t = TRANSLATIONS[language];
  const history = getHistory();
  const stats = {
      consultations: history.length,
      savedDocs: 0 // Mocked for now
  };

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2 animate-fade-in">
                <h2 className="text-3xl font-serif font-bold text-slate-900">{t.profileTitle}</h2>
                <p className="text-slate-500">{t.profileSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Personal Info Card */}
                <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in-up">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mb-3">
                            U
                        </div>
                        <h3 className="font-bold text-lg text-slate-800">User Name</h3>
                        <p className="text-sm text-gray-500">user@example.com</p>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{t.profileConsultations}</span>
                            <span className="font-bold text-slate-800">{stats.consultations}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{t.profileSavedDocs}</span>
                            <span className="font-bold text-slate-800">{stats.savedDocs}</span>
                        </div>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in-up delay-100">
                    <h3 className="font-serif font-bold text-xl text-slate-800 mb-6">{t.settings}</h3>
                    
                    <div className="space-y-6">
                        {/* Profile Input Fields (Mocked) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.profileName}</label>
                                <input type="text" defaultValue="User Name" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.profileEmail}</label>
                                <input type="email" defaultValue="user@example.com" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm" />
                            </div>
                        </div>

                        <hr className="border-gray-100 my-6" />

                        {/* App Preferences */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Length */}
                             <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.length}</label>
                                <div className="grid grid-cols-3 gap-2">
                                     {['Short', 'Medium', 'Detailed'].map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => setSettings({...settings, answerLength: l as any})}
                                            className={`py-2 text-[10px] uppercase font-bold rounded-lg border transition-all ${
                                                settings.answerLength === l 
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {l === 'Short' ? t.short : l === 'Medium' ? t.medium : t.detailed}
                                        </button>
                                    ))}
                                </div>
                             </div>

                             {/* Tone */}
                             <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.tone}</label>
                                 <div className="grid grid-cols-2 gap-2">
                                     {['Simple', 'Professional'].map((tone) => (
                                        <button
                                            key={tone}
                                            onClick={() => setSettings({...settings, tone: tone as any})}
                                            className={`py-2 text-xs rounded-lg border transition-all ${
                                                settings.tone === tone 
                                                ? 'bg-slate-700 border-slate-700 text-white' 
                                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {tone === 'Simple' ? t.simple : t.professional}
                                        </button>
                                    ))}
                                </div>
                             </div>

                             {/* Document Type */}
                             <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.docType}</label>
                                <select 
                                    value={settings.documentType}
                                    onChange={(e) => setSettings({...settings, documentType: e.target.value as any})}
                                    className="w-full text-sm p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 outline-none"
                                >
                                    <option value="General">{t.docGeneral}</option>
                                    <option value="Contract">{t.docContract}</option>
                                    <option value="Letter">{t.docLetter}</option>
                                    <option value="Application">{t.docApp}</option>
                                </select>
                             </div>

                             {/* Perspective */}
                             <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.perspective}</label>
                                <div className="flex flex-col space-y-2">
                                    {['Neutral', 'Pro-Consumer', 'Pro-Business'].map((p) => (
                                         <label key={p} className="flex items-center space-x-3 cursor-pointer group">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${settings.perspective === p ? 'border-blue-600' : 'border-gray-300'}`}>
                                                {settings.perspective === p && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                                            </div>
                                            <input 
                                                type="radio" 
                                                name="perspective" 
                                                className="hidden" 
                                                checked={settings.perspective === p}
                                                onChange={() => setSettings({...settings, perspective: p as any})} 
                                            />
                                            <span className={`text-sm ${settings.perspective === p ? 'text-blue-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                                {p === 'Neutral' ? t.persNeutral : p === 'Pro-Consumer' ? t.persConsumer : t.persBusiness}
                                            </span>
                                         </label>
                                    ))}
                                </div>
                             </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                {t.profileSave}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Profile;
