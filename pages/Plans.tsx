import React from 'react';
import { View, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface PlansProps {
  onNavigate: (view: View) => void;
  language: Language;
}

const Plans: React.FC<PlansProps> = ({ onNavigate, language }) => {
  const t = TRANSLATIONS[language];

  // Feature Icons
  const CheckIcon = () => (
      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
  );
  
  const XIcon = () => (
      <svg className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
  );

  const plans = [
    {
        name: t.pFreeName,
        price: t.pFreePrice,
        period: "", // One-time or forever
        color: "bg-white",
        border: "border-gray-200",
        btnColor: "bg-gray-100 text-gray-600 hover:bg-gray-200",
        isCurrent: true,
        features: [
            { text: `3 ${t.featRequestLimit}`, included: true },
            { text: t.featNoDocs, included: false },
            { text: t.featSpeedNormal, included: true },
            { text: t.featLive, included: false },
            { text: t.featHistory, included: true },
            { text: t.featAds, included: false },
        ]
    },
    {
        name: t.pDayName,
        price: t.pDayPrice,
        period: "/ 24h",
        color: "bg-blue-50",
        border: "border-blue-200",
        btnColor: "bg-blue-600 text-white hover:bg-blue-700",
        popular: false,
        features: [
            { text: t.featUnlimited, included: true },
            { text: `5 ${t.featDocs}`, included: true },
            { text: t.featSpeedFast, included: true },
            { text: `10 ${t.featLiveLimit}`, included: true },
            { text: t.featMobile, included: true },
            { text: t.featSupport, included: true },
        ]
    },
    {
        name: t.pWeekName,
        price: t.pWeekPrice,
        period: "/ 7d",
        color: "bg-white",
        border: "border-gray-200",
        btnColor: "bg-blue-600 text-white hover:bg-blue-700",
        features: [
            { text: t.featUnlimited, included: true },
            { text: `20 ${t.featDocs}`, included: true },
            { text: t.featSpeedFast, included: true },
            { text: `30 ${t.featLiveLimit}`, included: true },
            { text: t.featHistory, included: true },
            { text: t.featExport, included: true },
            { text: t.featSupport, included: true },
        ]
    },
    {
        name: t.pMonthName,
        price: t.pMonthPrice,
        period: "/ 30d",
        color: "bg-slate-900 text-white",
        border: "border-slate-800",
        btnColor: "bg-blue-500 text-white hover:bg-blue-600",
        textInverse: true,
        popular: true,
        features: [
            { text: t.featUnlimited, included: true },
            { text: `100 ${t.featDocs}`, included: true },
            { text: t.featSpeedFast, included: true },
            { text: `Unlimited ${t.featLive}`, included: true },
            { text: t.featReasoning, included: true },
            { text: t.featMobile, included: true },
            { text: t.featAds, included: true },
            { text: t.featExport, included: true },
        ]
    },
    {
        name: t.pLawyerName,
        price: t.pLawyerPrice,
        period: "/ 30d",
        color: "bg-gradient-to-br from-yellow-50 to-amber-50",
        border: "border-amber-200",
        btnColor: "bg-amber-600 text-white hover:bg-amber-700",
        features: [
            { text: t.featUnlimited, included: true },
            { text: `Unlimited ${t.featDocs}`, included: true },
            { text: "Priority Reasoning API", included: true },
            { text: "Citation Export", included: true },
            { text: "Case Strategy Mode", included: true },
            { text: t.featAds, included: true },
            { text: t.featSupport, included: true },
            { text: "API Access", included: true },
        ]
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10 bg-slate-50">
        <div className="max-w-[90rem] mx-auto space-y-10">
             <div className="text-center space-y-4 animate-fade-in-up">
                <h2 className="text-4xl font-serif font-bold text-slate-900">{t.plansTitle}</h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">{t.plansSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
                {plans.map((plan, idx) => (
                    <div 
                        key={idx} 
                        className={`relative rounded-3xl p-6 shadow-sm border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up flex flex-col h-full ${plan.color} ${plan.border} ${plan.textInverse ? 'text-white' : 'text-slate-800'}`}
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                                {t.bestValue}
                            </div>
                        )}
                        
                        <div className="mb-6 pb-6 border-b border-opacity-10 border-current">
                            <h3 className={`font-bold text-xl mb-2 ${plan.textInverse ? 'text-gray-200' : 'text-slate-600'}`}>{plan.name}</h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-extrabold tracking-tight">{plan.price}</span>
                                <span className={`ml-1 text-xs font-semibold uppercase ${plan.textInverse ? 'text-gray-400' : 'text-gray-500'}`}>{t.currency} {plan.period}</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {plan.features.map((feat, fIdx) => (
                                <li key={fIdx} className="flex items-center text-sm group">
                                    {feat.included ? <CheckIcon /> : <XIcon />}
                                    <span className={`transition-opacity ${!feat.included ? 'text-gray-400 line-through opacity-70' : ''} ${plan.textInverse && feat.included ? 'text-gray-100' : ''}`}>
                                        {feat.text}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button 
                            className={`w-full py-4 rounded-xl font-bold transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-opacity-50 ${plan.btnColor}`}
                            disabled={plan.isCurrent}
                        >
                            {plan.isCurrent ? t.currentPlan : t.subscribe}
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 text-center text-sm text-gray-400">
                <p>Prices include all applicable taxes. Secure payment processing provided by Payme/Click (Coming Soon).</p>
            </div>
        </div>
    </div>
  );
};

export default Plans;