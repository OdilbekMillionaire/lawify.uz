import React from 'react';
import { View, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LibraryProps {
  onNavigate: (view: View) => void;
  onSelectTemplate: (prompt: string) => void;
  language: Language;
}

const Library: React.FC<LibraryProps> = ({ onNavigate, onSelectTemplate, language }) => {
  const t = TRANSLATIONS[language];
  
  const templates = [
      { id: 1, title: t.tDebtTitle, desc: t.tDebtDesc, category: t.catCivil, difficulty: t.diffEasy, prompt: t.tDebtPrompt },
      { id: 2, title: t.tRentTitle, desc: t.tRentDesc, category: t.catProperty, difficulty: t.diffMedium, prompt: t.tRentPrompt },
      { id: 3, title: t.tDivorceTitle, desc: t.tDivorceDesc, category: t.catFamily, difficulty: t.diffMedium, prompt: t.tDivorcePrompt },
      { id: 4, title: t.tLaborTitle, desc: t.tLaborDesc, category: t.catBusiness, difficulty: t.diffHard, prompt: t.tLaborPrompt },
      { id: 5, title: t.tPowerTitle, desc: t.tPowerDesc, category: t.catCivil, difficulty: t.diffEasy, prompt: t.tPowerPrompt },
      { id: 6, title: t.tComplaintTitle, desc: t.tComplaintDesc, category: t.catAdmin, difficulty: t.diffMedium, prompt: t.tComplaintPrompt },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-8">
             <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold text-slate-900">{t.libraryTitle}</h2>
                <p className="text-slate-500">{t.librarySubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                    <div 
                        key={template.id} 
                        onClick={() => onSelectTemplate(template.prompt)}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden group"
                    >
                        <div className="absolute top-3 right-3 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">{template.category}</div>
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-1">{template.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{template.desc}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span className="font-semibold">{t.libraryDifficulty}:</span>
                            <span className={`px-2 py-0.5 rounded-md ${
                                template.difficulty === t.diffEasy ? 'bg-green-100 text-green-700' :
                                template.difficulty === t.diffMedium ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {template.difficulty}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
             <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                <p className="text-blue-800 font-medium">{t.libraryFooter}</p>
            </div>
        </div>
    </div>
  );
};

export default Library;