
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language, TemplateCategory } from '../types';
import { TRANSLATIONS } from '../constants';
import { TEMPLATE_CATEGORIES } from '../data/legal_templates';
import Footer from '../components/Footer';

interface LibraryProps {
  language: Language;
}

const Library: React.FC<LibraryProps> = ({ language }) => {
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];
  const [activeCategory, setActiveCategory] = useState<string>(TEMPLATE_CATEGORIES[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const currentCategory = TEMPLATE_CATEGORIES.find(c => c.id === activeCategory);

  const handleSelectTemplate = (templateId: string) => {
      navigate('/studio', { state: { initialTemplate: templateId } });
  };

  const handleCategoryClick = (id: string) => {
      setActiveCategory(id);
      setIsMobileMenuOpen(false); // Close menu on selection (mobile)
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-50 overflow-hidden relative">
        
        {/* MOBILE CATEGORY TOGGLE */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-20 shrink-0">
            <h2 className="font-serif font-bold text-slate-900 text-lg">{t.libraryTitle}</h2>
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center space-x-2 text-blue-600 font-bold bg-blue-50 px-3 py-2 rounded-lg text-sm"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                <span>{isMobileMenuOpen ? 'Yopish' : 'Kategoriyalar'}</span>
            </button>
        </div>

        {/* SIDEBAR (Responsive) */}
        <div className={`
            absolute md:relative inset-0 z-30 md:z-auto bg-white/95 backdrop-blur-sm md:bg-white md:border-r border-gray-200 
            flex flex-col h-full md:w-72 transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
             <div className="p-6 border-b border-gray-100 hidden md:block">
                <h2 className="text-xl font-serif font-bold text-slate-900">{t.libraryTitle}</h2>
                <p className="text-xs text-slate-500 mt-1">{t.librarySubtitle}</p>
             </div>
             
             <div className="p-4 space-y-2 overflow-y-auto flex-1">
                 <p className="md:hidden text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Hujjat turlari</p>
                 {TEMPLATE_CATEGORIES.map((cat) => (
                     <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
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
             
             {/* Mobile Close Button (Bottom) */}
             <div className="p-4 md:hidden border-t border-gray-100">
                 <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold"
                 >
                     Yopish
                 </button>
             </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto flex flex-col w-full">
            <div className="flex-1 p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                     {currentCategory && (
                         <div className="space-y-8 animate-fade-in">
                             {/* Header (Hidden on Mobile to save space, relies on top bar) */}
                             <div className="hidden md:flex items-center space-x-4 mb-8">
                                 <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                                     {currentCategory.icon}
                                 </div>
                                 <div>
                                     <h1 className="text-3xl font-serif font-bold text-slate-900">{currentCategory.title[language]}</h1>
                                     <p className="text-slate-500">{t.librarySelectPrompt}</p>
                                 </div>
                             </div>

                             {/* Mobile Category Title */}
                             <div className="md:hidden mb-4 flex items-center space-x-3">
                                 <span className="text-3xl">{currentCategory.icon}</span>
                                 <h1 className="text-xl font-bold text-slate-900">{currentCategory.title[language]}</h1>
                             </div>

                             {/* Subcategories */}
                             {currentCategory.subcategories.map((sub) => (
                                 <div key={sub.id} className="space-y-4">
                                     <h3 className="text-sm md:text-lg font-bold text-slate-700 border-l-4 border-blue-500 pl-3 uppercase tracking-wide">
                                         {sub.title[language]}
                                     </h3>
                                     
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                         {sub.templates.map((temp) => (
                                             <button
                                                key={temp.id}
                                                onClick={() => handleSelectTemplate(temp.templateId)}
                                                className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-300 transition-all text-left group relative overflow-hidden h-full flex flex-col active:scale-95"
                                             >
                                                 {temp.isPro && (
                                                     <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">PRO</div>
                                                 )}
                                                 
                                                 <div className="flex items-start space-x-3 mb-2">
                                                     <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                                                         <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                     </div>
                                                     <h4 className="font-bold text-sm md:text-base text-slate-800 group-hover:text-blue-700 transition-colors leading-tight pt-1">{temp.title}</h4>
                                                 </div>
                                                 
                                                 <p className="text-xs text-gray-500 line-clamp-2 pl-11 md:pl-0">{temp.description}</p>

                                                 <div className="mt-auto pt-3 flex items-center space-x-2 pl-11 md:pl-0">
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
                 <div className="mt-8 md:mt-12 p-4 md:p-6 bg-slate-100 rounded-xl text-center border-t border-slate-200 mb-20 md:mb-0">
                    <p className="text-xs md:text-sm text-slate-500">{t.libraryFooter}</p>
                </div>
            </div>
            <div className="hidden md:block">
                <Footer />
            </div>
        </div>
    </div>
  );
};

export default Library;
