
import React, { useEffect, useState } from 'react';
import { View, Language, ChatSession, Message } from '../types';
import { getHistory, clearHistory } from '../services/storage';
import { TRANSLATIONS } from '../constants'; 

interface HistoryProps {
  onNavigate: (view: View) => void;
  language?: Language; 
  onRestore: (messages: Message[], type: 'lawyer' | 'odilbek' | 'drafter', customData?: any) => void;
}

const History: React.FC<HistoryProps> = ({ language = Language.UZ, onRestore }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeTab, setActiveTab] = useState<'lawyer' | 'odilbek' | 'drafter'>('lawyer');
  const t = TRANSLATIONS[language]; 

  useEffect(() => {
      setSessions(getHistory());
  }, []);

  const handleClear = () => {
      if(confirm('Are you sure you want to clear all history?')) {
          clearHistory();
          setSessions([]);
      }
  }

  const filteredSessions = sessions.filter(s => s.type === activeTab);

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-8">
             <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900">{t.historyTitle}</h2>
                    <p className="text-slate-500">{t.historySubtitle}</p>
                </div>
                {sessions.length > 0 && (
                    <button onClick={handleClear} className="text-red-500 text-sm hover:underline">{t.historyClear}</button>
                )}
            </div>

            {/* Tabs - Expanded Width */}
            <div className="flex space-x-1 bg-white p-1.5 rounded-xl border border-gray-200 w-full md:w-3/4 shadow-sm">
                <button
                    onClick={() => setActiveTab('lawyer')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
                        activeTab === 'lawyer' 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <span>⚖️</span>
                    <span>{language === Language.UZ ? "AI Yurist" : "AI Lawyer"}</span>
                </button>
                <button
                    onClick={() => setActiveTab('odilbek')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
                        activeTab === 'odilbek' 
                        ? 'bg-amber-500 text-white shadow' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <span>🧑‍🏫</span>
                    <span>Odilbek</span>
                </button>
                <button
                    onClick={() => setActiveTab('drafter')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
                        activeTab === 'drafter' 
                        ? 'bg-green-600 text-white shadow' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <span>📝</span>
                    <span>AI Kotib</span>
                </button>
            </div>

            {filteredSessions.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p>{t.historyEmpty}</p>
                    <p className="text-xs mt-2 text-gray-400">
                        ({activeTab === 'lawyer' ? 'No legal consultations found' : 
                          activeTab === 'odilbek' ? 'No Odilbek explanations found' : 
                          'No drafted documents found'})
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredSessions.map((session) => (
                        <div 
                            key={session.id} 
                            onClick={() => onRestore(session.messages, session.type, session.customData)}
                            className={`p-5 rounded-xl shadow-sm border transition-all group cursor-pointer hover:shadow-md ${
                                session.type === 'odilbek' 
                                ? 'bg-amber-50 border-amber-100 hover:border-amber-300' 
                                : session.type === 'drafter'
                                ? 'bg-green-50 border-green-100 hover:border-green-300'
                                : 'bg-white border-gray-100 hover:border-blue-200'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-semibold text-lg transition-colors ${
                                    session.type === 'odilbek' ? 'text-amber-900 group-hover:text-amber-700' : 
                                    session.type === 'drafter' ? 'text-green-900 group-hover:text-green-700' :
                                    'text-slate-800 group-hover:text-blue-600'
                                }`}>
                                    {session.title}
                                </h3>
                                <span className="text-xs text-gray-400">{new Date(session.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">{session.preview}</p>
                             <div className="mt-3 flex items-center text-xs text-gray-400 space-x-4">
                                <span>{session.messages.length} {t.historyMessages}</span>
                                <span className={`flex items-center opacity-0 group-hover:opacity-100 transition-opacity ${
                                    session.type === 'odilbek' ? 'text-amber-600' : 
                                    session.type === 'drafter' ? 'text-green-600' :
                                    'text-blue-500'
                                }`}>
                                    Click to continue
                                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default History;
