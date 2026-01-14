import React, { useEffect, useState } from 'react';
import { View, Language, ChatSession, Message } from '../types';
import { getHistory, clearHistory } from '../services/storage';
import { TRANSLATIONS } from '../constants'; // Import translations

interface HistoryProps {
  onNavigate: (view: View) => void;
  language?: Language; 
  onRestore: (messages: Message[]) => void;
}

const History: React.FC<HistoryProps> = ({ language = Language.UZ, onRestore }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
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

            {sessions.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p>{t.historyEmpty}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sessions.map((session) => (
                        <div 
                            key={session.id} 
                            onClick={() => onRestore(session.messages)}
                            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer hover:border-blue-200"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{session.title}</h3>
                                <span className="text-xs text-gray-400">{new Date(session.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">{session.preview}</p>
                             <div className="mt-3 flex items-center text-xs text-gray-400 space-x-4">
                                <span>{session.messages.length} {t.historyMessages}</span>
                                <span className="flex items-center text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to view
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