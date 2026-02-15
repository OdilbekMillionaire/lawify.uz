
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS, DID_YOU_KNOW_FACTS } from '../constants';
import Footer from '../components/Footer';

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
      }, 10000); // 10s duration for comfortable reading
      return () => clearInterval(interval);
  }, [facts.length]);

  const quickLinks = [
    { label: t.qlFamily, icon: "👨‍👩‍👧‍👦", prompt: t.qlFamilyPrompt },
    { label: t.qlLabor, icon: "👷‍♂️", prompt: t.qlLaborPrompt },
    { label: t.qlCriminal, icon: "⚖️", prompt: t.qlCriminalPrompt },
    { label: t.qlHousing, icon: "🏠", prompt: t.qlHousingPrompt },
    { label: t.qlBusiness, icon: "💼", prompt: t.qlBusinessPrompt },
    { label: t.qlAdmin, icon: "📋", prompt: t.qlAdminPrompt },
    { label: t.qlBank, icon: "🏦", prompt: t.qlBankPrompt },
    { label: t.qlHealth, icon: "🏥", prompt: t.qlHealthPrompt },
    { label: t.qlEdu, icon: "🎓", prompt: t.qlEduPrompt },
    { label: t.qlCustoms, icon: "🛃", prompt: t.qlCustomsPrompt },
    { label: t.qlTax, icon: "💸", prompt: t.qlTaxPrompt },
    { label: t.qlPension, icon: "👴", prompt: t.qlPensionPrompt },
  ];

  const handleQuickLink = (prompt: string) => {
      navigate('/chat', { state: { initialPrompt: prompt } });
  };

  const handleFactClick = (fact: any) => {
      let prompt = "";
      if (language === Language.UZ) {
          prompt = `Men "${fact.title}" haqida batafsil ma'lumot olmoqchiman.`;
      } else if (language === Language.RU) {
          prompt = `Я хочу узнать подробнее о теме: "${fact.title}".`;
      } else {
          prompt = `I would like to know more about "${fact.title}".`;
      }
      navigate('/chat', { state: { initialPrompt: prompt } });
  };

  const nextFact = () => setCurrentFactIndex((prev) => (prev + 1) % facts.length);
  const prevFact = () => setCurrentFactIndex((prev) => (prev - 1 + facts.length) % facts.length);

  const AppCard = ({ title, desc, icon, path, color, gradient, delayClass }: any) => (
      <button 
        onClick={() => navigate(path)}
        className={`relative overflow-hidden group flex flex-col items-start text-left bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 transform md:hover:-translate-y-1 active:scale-95 animate-fade-in-up ${delayClass}`}
      >
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full transition-transform group-hover:scale-125`}></div>
          
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform`}>
              {icon}
          </div>
          
          <h3 className="font-serif font-bold text-xl md:text-2xl text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[90%]">{desc}</p>
          
          <div className="mt-6 flex items-center text-sm font-semibold text-gray-400 group-hover:text-blue-600 transition-colors">
              <span>{t.openApp}</span>
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </div>
      </button>
  );

  return (
    <div className="h-full overflow-y-auto bg-slate-50 flex flex-col">
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-12 md:space-y-16 pb-24">
            
            <div className="space-y-4 animate-fade-in pt-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 pb-2">
                    {t.dashboardWelcome}
                </h1>
                <p className="text-base md:text-xl text-slate-500 max-w-3xl font-light leading-relaxed border-l-4 border-blue-500 pl-4 md:pl-6">
                    {t.dashboardSubtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <AppCard 
                    title={t.navChat}
                    desc={t.quickChatDesc}
                    path="/chat"
                    color="bg-blue-600 text-white"
                    gradient="from-blue-400 to-indigo-600"
                    icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>}
                    delayClass="delay-100"
                />
                 <AppCard 
                    title={t.odilbekTitle}
                    desc={t.odilbekSubtitle}
                    path="/odilbek"
                    color="bg-amber-500 text-white"
                    gradient="from-amber-400 to-orange-600"
                    icon={
                        <span className="text-4xl" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }}>👨‍🏫</span>
                    }
                    delayClass="delay-200"
                />
                 <AppCard 
                    title={t.navTemplates}
                    desc={t.quickTemplatesDesc}
                    path="/library"
                    color="bg-emerald-600 text-white"
                    gradient="from-emerald-400 to-green-600"
                    icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                    delayClass="delay-300"
                />
            </div>

            <div className="space-y-6 animate-fade-in-up delay-200">
                <div className="flex items-center space-x-4">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 uppercase tracking-wide">{t.quickLinksTitle}</h3>
                    <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                    {quickLinks.map((link, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleQuickLink(link.prompt)}
                            className="flex flex-col items-center justify-center p-3 md:p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-lg hover:bg-blue-50 transition-all group h-28 md:h-32 active:scale-95"
                        >
                            <span className="text-2xl md:text-3xl mb-2 md:mb-3 group-hover:scale-125 transition-transform duration-300 filter drop-shadow-sm">{link.icon}</span>
                            <span className="text-[10px] md:text-xs font-bold text-slate-600 group-hover:text-blue-800 text-center leading-tight px-1">{link.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Facts Carousel with 80 Tiny Moving Dots */}
            <div className="relative h-96 md:h-72 overflow-hidden rounded-3xl shadow-2xl animate-fade-in-up delay-300 group">
                {facts.map((fact, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 p-6 md:p-10 text-white flex flex-col justify-center ${index === currentFactIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
                        
                        <div className="relative z-10 max-w-4xl">
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full border border-blue-500/30 backdrop-blur-sm flex items-center">
                                    <span className="mr-2 text-base md:text-lg">💡</span>
                                    {t.didYouKnowTag}
                                </span>
                            </div>
                            <h3 className="text-xl md:text-3xl font-serif font-bold mb-3 md:mb-4 leading-tight">{fact.title}</h3>
                            <p className="text-slate-300 text-sm md:text-lg leading-relaxed mb-6 md:mb-8 border-l-2 border-slate-600 pl-4 line-clamp-4 md:line-clamp-2">
                                {fact.content}
                            </p>
                            <div className="flex items-center space-x-6">
                                <button 
                                    onClick={() => handleFactClick(fact)}
                                    className="inline-flex items-center space-x-2 text-white font-bold hover:text-blue-300 transition-colors group-hover:translate-x-2 duration-300 text-sm md:text-base"
                                >
                                    <span>{fact.button}</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </button>
                                
                                {/* Quick Manual Nav */}
                                <div className="hidden md:flex items-center space-x-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={prevFact} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button>
                                    <button onClick={nextFact} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* High-Density Dot Indicator Container - Hidden on mobile to save vertical space */}
                <div className="absolute bottom-4 left-6 right-6 flex-wrap justify-center gap-1 z-20 pointer-events-auto hidden md:flex">
                    {facts.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentFactIndex(idx)}
                            className={`h-1 rounded-full transition-all duration-300 flex-shrink-0 shadow-sm ${
                                idx === currentFactIndex 
                                    ? 'bg-white w-4 shadow-white/50' 
                                    : 'bg-white/20 w-1 hover:bg-white/40'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up delay-300">
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 flex items-center">
                        <span className="w-2 h-8 bg-blue-50 rounded-full mr-3 border-l-4 border-blue-500"></span>
                        {t.techTitle}
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{t.statAccuracy}</p>
                                <p className="text-xs text-slate-500">99.8% based on lex.uz</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{t.techSecure}</p>
                                <p className="text-xs text-slate-500">End-to-End Encryption</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{t.techModel}</p>
                                <p className="text-xs text-slate-500">{t.techModelSub}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">{t.statPlatformImpact}</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-3xl md:text-4xl font-bold text-white mb-1">15k+</p>
                                    <p className="text-xs text-slate-400">{t.statUsers}</p>
                                </div>
                                <div>
                                    <p className="text-3xl md:text-4xl font-bold text-white mb-1">85k+</p>
                                    <p className="text-xs text-slate-400">{t.statDocs}</p>
                                </div>
                                <div>
                                    <p className="text-3xl md:text-4xl font-bold text-white mb-1">24/7</p>
                                    <p className="text-xs text-slate-400">{t.statAIAvailability}</p>
                                </div>
                                <div>
                                    <p className="text-3xl md:text-4xl font-bold text-white mb-1">3</p>
                                    <p className="text-xs text-slate-400">{t.statLanguages}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-800 flex justify-between items-center">
                            <span className="text-xs text-slate-500">{t.footerCopyright}</span>
                            <div className="flex space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-green-400 font-bold">{t.statSystemOp}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8 animate-fade-in-up delay-300">
                <div className="flex items-center space-x-4">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 uppercase tracking-wide">{t.visTitle}</h3>
                    <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start group">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors uppercase text-sm tracking-wide">{t.visAutoAgents}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">{t.visAutoAgentsDesc}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start group">
                        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors uppercase text-sm tracking-wide">{t.visCourtAPI}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">{t.visCourtAPIDesc}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start group">
                        <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2 group-hover:text-green-700 transition-colors uppercase text-sm tracking-wide">{t.visBlockchain}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">{t.visBlockchainDesc}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start group">
                        <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2 group-hover:text-orange-700 transition-colors uppercase text-sm tracking-wide">{t.visAIJudge}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">{t.visAIJudgeDesc}</p>
                    </div>
                </div>
            </div>

        </div>
        <Footer />
    </div>
  );
};

export default Dashboard;
