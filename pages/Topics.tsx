import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS, TOPICS_DATA } from '../constants';

interface TopicsProps {
  language: Language;
}

const Topics: React.FC<TopicsProps> = ({ language }) => {
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];
  const topics = TOPICS_DATA[language];

  const handleTopicSelect = (prompt: string) => {
      navigate('/chat', { state: { initialPrompt: prompt } });
  };

  const getCategoryStyle = (catName: string) => {
      const lower = catName.toLowerCase();
      if (lower.includes('mehnat') || lower.includes('labor') || lower.includes('трудовое')) return { color: 'blue', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> };
      if (lower.includes('oila') || lower.includes('family') || lower.includes('семейное')) return { color: 'rose', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg> };
      if (lower.includes('mulk') || lower.includes('property') || lower.includes('гражданское') || lower.includes('civil')) return { color: 'indigo', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> };
      if (lower.includes('iste\'mol') || lower.includes('consumer') || lower.includes('потребител')) return { color: 'emerald', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> };
      if (lower.includes('avto') || lower.includes('auto') || lower.includes('авто')) return { color: 'orange', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 012-2v0a2 2 0 012 2m9 0a2 2 0 012-2v0a2 2 0 012 2"></path></svg> };
      if (lower.includes('biznes') || lower.includes('business') || lower.includes('бизнес')) return { color: 'slate', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> };
      
      return { color: 'gray', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg> };
  }

  const getColorClasses = (color: string) => {
      switch(color) {
          case 'blue': return 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-300';
          case 'rose': return 'bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-300';
          case 'indigo': return 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:border-indigo-300';
          case 'emerald': return 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-300';
          case 'orange': return 'bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-300';
          case 'slate': return 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300';
          default: return 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300';
      }
  }

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10 bg-slate-50">
        <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12 animate-fade-in-up">
                <h2 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-900 pb-1">{t.topicsTitle}</h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">{t.topicsSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {topics.map((category, idx) => {
                    const style = getCategoryStyle(category.category);
                    const colorClass = getColorClasses(style.color);

                    return (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}>
                                    {style.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{category.category}</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {category.items.map((item, itemIdx) => (
                                    <button
                                        key={itemIdx}
                                        onClick={() => handleTopicSelect(item.prompt)}
                                        className="text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-md transition-all group"
                                    >
                                        <span className="font-medium text-slate-600 group-hover:text-blue-700 text-sm transition-colors block">
                                            {item.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default Topics;