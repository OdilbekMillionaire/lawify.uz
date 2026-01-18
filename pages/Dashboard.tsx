import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS, DID_YOU_KNOW_FACTS } from '../constants';

interface DashboardProps {
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];
  const facts = DID_YOU_KNOW_FACTS[language];
  
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
      const interval = setInterval(() => {
          setCurrentFactIndex((prev) => (prev + 1) % facts.length);
      }, 8000);
      return () => clearInterval(interval);
  }, [facts.length]);

  const quickLinks = [
    { label: t.qlFamily, icon: "👨‍👩‍👧‍👦", prompt: t.qlFamilyPrompt },
    { label: t.qlLabor, icon: "👷‍♂️", prompt: t.qlLaborPrompt },
    { label: t.qlCriminal, icon: "⚖️", prompt: t.qlCriminalPrompt },
    { label: t.qlHousing, icon: "🏠", prompt: t.qlHousingPrompt },
    { label: t.qlBusiness, icon: "💼", prompt: t.qlBusinessPrompt },
    { label: t.qlAdmin, icon: "📋", prompt: t.qlAdminPrompt },
  ];

  const handleQuickLink = (prompt: string) => {
      navigate('/chat', { state: { initialPrompt: prompt } });
  };

  const ActionCard = ({ title, desc, icon, path, color, delayClass }: any) => (
      <button 
        onClick={() => navigate(path)}
        className={`flex flex-col text-left bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group animate-fade-in-up ${delayClass} focus:outline-none focus:ring-2 focus:ring-blue-400`}
        aria-label={`${title}: ${desc}`}
      >
          <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {icon}
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{desc}</p>
      </button>
  );

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-10">
            {/* Header Section */}
            <div className="space-y-2 animate-fade-in">
                <h2 className="text-4xl font-serif font-bold text-slate-900">{t.dashboardWelcome}</h2>
                <p className="text-lg text-slate-500 max-w-2xl">{t.dashboardSubtitle}</p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ActionCard 
                    title={t.quickChat}
                    desc={t.quickChatDesc}
                    path="/chat"
                    color="bg-blue-100 text-blue-600"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>}
                    delayClass="delay-100"
                />
                 <ActionCard 
                    title={t.quickContracts}
                    desc={t.quickContractsDesc}
                    path="/chat"
                    color="bg-purple-100 text-purple-600"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                    delayClass="delay-200"
                />
                 <ActionCard 
                    title={t.quickTemplates}
                    desc={t.quickTemplatesDesc}
                    path="/library"
                    color="bg-green-100 text-green-600"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}
                    delayClass="delay-300"
                />
            </div>

            {/* Quick Links Section */}
            <div className="space-y-4 animate-fade-in-up delay-200">
                <h3 className="text-xl font-serif font-bold text-slate-800 flex items-center">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
                    {t.quickLinksTitle}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {quickLinks.map((link, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleQuickLink(link.prompt)}
                            className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label={link.label}
                        >
                            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{link.icon}</span>
                            <span className="text-xs font-semibold text-center text-slate-600 group-hover:text-blue-700">{link.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Fact Carousel Section */}
            <div className="relative h-64 overflow-hidden rounded-3xl shadow-xl animate-fade-in-up delay-300">
                {facts.map((fact, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white flex flex-col justify-center ${index === currentFactIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-2 mb-4 text-blue-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span className="text-sm font-semibold uppercase tracking-wider">{t.didYouKnowTag}</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-3">{fact.title}</h3>
                            <p className="text-slate-300 max-w-xl leading-relaxed">
                                {fact.content}
                            </p>
                            <button 
                                onClick={() => navigate('/chat')}
                                className="mt-6 bg-white text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                                aria-label={fact.button}
                            >
                                {fact.button}
                            </button>
                        </div>
                    </div>
                ))}
                
                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {facts.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentFactIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentFactIndex ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/60'}`}
                            aria-label={`Show fact ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;