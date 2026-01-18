import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language, TemplateCategory } from '../types';
import { TRANSLATIONS } from '../constants';
import { TEMPLATE_CATEGORIES } from '../data/legal_templates';

interface LibraryProps {
  language: Language;
}

const Library: React.FC<LibraryProps> = ({ language }) => {
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];
  const [activeCategory, setActiveCategory] = useState<string>(TEMPLATE_CATEGORIES[0].id);
  
  const currentCategory = TEMPLATE_CATEGORIES.find(c => c.id === activeCategory);

  const handleSelectTemplate = (templateId: string) => {
      navigate('/studio', { state: { initialTemplate: templateId } });
  };

  return (
    <div className="h-full flex bg-slate-50 overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto shrink-0">
             <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-serif font-bold text-slate-900">{t.libraryTitle}</h2>
                <p className="text-xs text-slate-500 mt-1">{t.librarySubtitle}</p>
             </div>
             
             <div className="p-4 space-y-1">
                 {TEMPLATE_CATEGORIES.map((cat) => (
                     <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 transition-all ${
                            activeCategory === cat.id 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700'
                        }`}
                     >
                         <span className="text-xl">{cat.icon}</span>
                         <span className="font-bold text-sm">{cat.title[language]}</span>
                     </button>
                 ))}
             </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto">
                 {currentCategory && (
                     <div className="space-y-10 animate-fade-in">
                         {/* Header */}
                         <div className="flex items-center space-x-4 mb-8">
                             <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                                 {currentCategory.icon}
                             </div>
                             <div>
                                 <h1 className="text-3xl font-serif font-bold text-slate-900">{currentCategory.title[language]}</h1>
                                 <p className="text-slate-500">{t.librarySelectPrompt}</p>
                             </div>
                         </div>

                         {/* Subcategories */}
                         {currentCategory.subcategories.map((sub) => (
                             <div key={sub.id} className="space-y-4">
                                 <h3 className="text-lg font-bold text-slate-700 border-l-4 border-blue-500 pl-3 uppercase tracking-wide">
                                     {sub.title[language]}
                                 </h3>
                                 
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                     {sub.templates.map((temp) => (
                                         <button
                                            key={temp.id}
                                            onClick={() => handleSelectTemplate(temp.templateId)}
                                            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-300 transition-all text-left group relative overflow-hidden h-full flex flex-col"
                                         >
                                             {temp.isPro && (
                                                 <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">PRO</div>
                                             )}
                                             
                                             <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                             </div>
                                             
                                             <div className="flex-1">
                                                 <h4 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors mb-1">{temp.title}</h4>
                                                 <p className="text-xs text-gray-500 line-clamp-3">{temp.description}</p>
                                             </div>

                                             <div className="mt-3 flex items-center space-x-2 pt-2">
                                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                     temp.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                     temp.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                     'bg-red-100 text-red-700'
                                                 }`}>{temp.difficulty}</span>
                                             </div>
                                         </button>
                                     ))}
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}
            </div>
             <div className="mt-12 p-6 bg-slate-100 rounded-xl text-center border-t border-slate-200">
                <p className="text-sm text-slate-500">{t.libraryFooter}</p>
            </div>
        </div>
    </div>
  );
};

export default Library;