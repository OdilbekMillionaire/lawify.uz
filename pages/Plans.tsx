
import React, { useState } from 'react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';
import PaymentModal from '../components/PaymentModal';
import Footer from '../components/Footer';

interface PlansProps {
  language: Language;
  userProfile: UserProfile | null;
  onLogin: () => void;
  refreshProfile: () => void;
}

const Plans: React.FC<PlansProps> = ({ language, userProfile, onLogin, refreshProfile }) => {
  const t = TRANSLATIONS[language];
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    key: 'day' | 'week' | 'month' | 'lawyer';
    name: string;
    price: string;
  } | null>(null);

  const handleSubscribe = (planKey: 'day' | 'week' | 'month' | 'lawyer', planName: string, planPrice: string) => {
    if (!userProfile) { onLogin(); return; }
    setSelectedPlan({ key: planKey, name: planName, price: planPrice });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    refreshProfile();
    alert("Welcome to Pro!");
  };

  const commentaryFeature = {
    free: language === Language.UZ ? '3 ta AI yuridik sharh / kun' : language === Language.RU ? '3 AI-комментария / день' : '3 AI commentaries / day',
    pro: language === Language.UZ ? 'Cheksiz AI yuridik sharh' : language === Language.RU ? 'Безлимитные AI-комментарии' : 'Unlimited AI commentaries',
  };

  const plans = [
    {
      key: 'free',
      name: t.pFreeName,
      price: t.pFreePrice,
      period: '',
      gradient: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
      accentColor: '#64748b',
      glowColor: 'rgba(100,116,139,0.2)',
      isCurrent: userProfile ? !userProfile.is_pro : true,
      features: [
        { text: `5 ${t.featRequestLimit}`, ok: true },
        { text: commentaryFeature.free, ok: true },
        { text: t.featNoDocs, ok: false },
        { text: t.deepAnalysis, ok: false },
        { text: t.featSpeedNormal, ok: true },
        { text: t.featLive, ok: false },
        { text: t.featHistory, ok: true },
      ],
    },
    {
      key: 'day',
      name: t.pDayName,
      price: t.pDayPrice,
      period: '/ 24h',
      gradient: 'linear-gradient(145deg, #0c1a2e 0%, #0a2540 100%)',
      accentColor: '#3b82f6',
      glowColor: 'rgba(59,130,246,0.25)',
      isCurrent: userProfile?.plan_type === 'day',
      features: [
        { text: t.featUnlimited, ok: true },
        { text: commentaryFeature.pro, ok: true },
        { text: `5 ${t.featDocs}`, ok: true },
        { text: t.deepAnalysis, ok: true },
        { text: t.featSpeedFast, ok: true },
        { text: `10 ${t.featLiveLimit} ${t.startLive}`, ok: true },
        { text: t.featSupport, ok: true },
      ],
    },
    {
      key: 'week',
      name: t.pWeekName,
      price: t.pWeekPrice,
      period: '/ 7d',
      gradient: 'linear-gradient(145deg, #0d1b3e 0%, #1e1b4b 100%)',
      accentColor: '#6366f1',
      glowColor: 'rgba(99,102,241,0.25)',
      isCurrent: userProfile?.plan_type === 'week',
      features: [
        { text: t.featUnlimited, ok: true },
        { text: commentaryFeature.pro, ok: true },
        { text: `20 ${t.featDocs}`, ok: true },
        { text: t.deepAnalysis, ok: true },
        { text: t.featSpeedFast, ok: true },
        { text: `30 ${t.featLiveLimit} ${t.startLive}`, ok: true },
        { text: t.featHistory, ok: true },
        { text: t.featExport, ok: true },
      ],
    },
    {
      key: 'month',
      name: t.pMonthName,
      price: t.pMonthPrice,
      period: '/ 30d',
      gradient: 'linear-gradient(145deg, #1a0a3e 0%, #2e0a5e 100%)',
      accentColor: '#a855f7',
      glowColor: 'rgba(168,85,247,0.3)',
      popular: true,
      isCurrent: userProfile?.plan_type === 'month',
      features: [
        { text: t.featUnlimited, ok: true },
        { text: commentaryFeature.pro, ok: true },
        { text: `100 ${t.featDocs}`, ok: true },
        { text: t.deepAnalysis, ok: true },
        { text: t.featSpeedFast, ok: true },
        { text: `Unlimited ${t.featLive}`, ok: true },
        { text: t.featReasoning, ok: true },
        { text: t.featAds, ok: true },
        { text: t.featExport, ok: true },
      ],
    },
    {
      key: 'lawyer',
      name: t.pLawyerName,
      price: t.pLawyerPrice,
      period: '/ 30d',
      gradient: 'linear-gradient(145deg, #0a1f0a 0%, #0f2e0f 100%)',
      accentColor: '#10b981',
      glowColor: 'rgba(16,185,129,0.25)',
      isCurrent: userProfile?.plan_type === 'lawyer',
      features: [
        { text: t.featUnlimited, ok: true },
        { text: commentaryFeature.pro, ok: true },
        { text: `Unlimited ${t.featDocs}`, ok: true },
        { text: 'Priority Reasoning API', ok: true },
        { text: t.deepAnalysis, ok: true },
        { text: 'Case Strategy Mode', ok: true },
        { text: t.featAds, ok: true },
        { text: t.featSupport, ok: true },
        { text: 'API Access', ok: true },
      ],
    },
  ];

  return (
    <div className="h-full overflow-y-auto flex flex-col" style={{ background: '#f8fafc' }}>

      {/* DARK HEADER */}
      <div className="shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 55%, #1e1b4b 100%)' }}>
        <div className="absolute pointer-events-none" style={{ top: '-60px', right: '8%', width: '400px', height: '350px', background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-30px', left: '5%', width: '300px', height: '250px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(50px)' }} />

        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(124,58,237,0.14)', border: '1px solid rgba(124,58,237,0.3)' }}>
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-purple-300 font-bold text-xs uppercase tracking-widest">
              {language === Language.UZ ? 'Obuna rejalari' : language === Language.RU ? 'Тарифные планы' : 'Subscription Plans'}
            </span>
          </div>
          <h1 className="gradient-text font-serif font-bold mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.15 }}>
            {t.plansTitle}
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">{t.plansSubtitle}</p>
        </div>
      </div>

      {/* PLANS GRID */}
      <div className="flex-1 max-w-[90rem] mx-auto w-full px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 items-stretch">
          {plans.map((plan, idx) => (
            <div key={idx} className="relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{
                background: plan.gradient,
                border: `1px solid rgba(255,255,255,0.08)`,
                boxShadow: `0 8px 32px ${plan.glowColor}, 0 2px 8px rgba(0,0,0,0.2)`,
                animationDelay: `${idx * 80}ms`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px ${plan.glowColor}, 0 4px 16px rgba(0,0,0,0.25)`; (e.currentTarget as HTMLElement).style.borderColor = `${plan.accentColor}30`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${plan.glowColor}, 0 2px 8px rgba(0,0,0,0.2)`; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}>

              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1 rounded-b-xl text-xs font-black uppercase tracking-wider text-white"
                    style={{ background: `linear-gradient(135deg, ${plan.accentColor}, ${plan.accentColor}cc)` }}>
                    {t.bestValue}
                  </div>
                </div>
              )}

              {/* Current plan badge */}
              {plan.isCurrent && (
                <div className="absolute top-3 right-3">
                  <div className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                    style={{ background: `${plan.accentColor}25`, color: plan.accentColor, border: `1px solid ${plan.accentColor}40` }}>
                    {t.currentPlan}
                  </div>
                </div>
              )}

              {/* Card header */}
              <div className="px-6 pt-8 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${plan.accentColor}20`, border: `1px solid ${plan.accentColor}30` }}>
                  <div className="w-4 h-4 rounded-full" style={{ background: plan.accentColor }} />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-xs font-semibold uppercase" style={{ color: `${plan.accentColor}cc` }}>
                    {plan.price !== '0' && plan.price !== t.pFreePrice ? t.currency : ''} {plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="px-6 py-5 flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2.5 text-sm">
                      {feat.ok ? (
                        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: plan.accentColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mt-0.5 shrink-0 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span style={{ color: feat.ok ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)' }}
                        className={feat.ok ? '' : 'line-through'}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA button */}
              <div className="px-6 pb-6">
                <button
                  disabled={plan.isCurrent || plan.key === 'free'}
                  onClick={() => handleSubscribe(plan.key as any, plan.name, plan.price)}
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: plan.isCurrent || plan.key === 'free'
                      ? 'rgba(255,255,255,0.08)'
                      : `linear-gradient(135deg, ${plan.accentColor}, ${plan.accentColor}cc)`,
                    color: plan.isCurrent || plan.key === 'free' ? 'rgba(255,255,255,0.4)' : 'white',
                    border: plan.isCurrent || plan.key === 'free' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    boxShadow: plan.isCurrent || plan.key === 'free' ? 'none' : `0 4px 16px ${plan.glowColor}`,
                  }}
                >
                  {plan.isCurrent ? t.currentPlan : plan.key === 'free' ? (language === Language.UZ ? 'Joriy reja' : language === Language.RU ? 'Текущий план' : 'Current plan') : t.subscribe}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust section */}
        <div className="mt-12 flex flex-col items-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { icon: '🔒', label: language === Language.UZ ? 'Xavfsiz to\'lov' : language === Language.RU ? 'Безопасная оплата' : 'Secure payment' },
              { icon: '⚡', label: language === Language.UZ ? 'Tezkor aktivatsiya' : language === Language.RU ? 'Мгновенная активация' : 'Instant activation' },
              { icon: '🔄', label: language === Language.UZ ? 'Istalgan vaqtda bekor qilish' : language === Language.RU ? 'Отмена в любое время' : 'Cancel anytime' },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-2 px-4 py-2 rounded-xl"
                style={{ background: 'white', border: '1px solid #e2e8f0' }}>
                <span>{item.icon}</span>
                <span className="text-xs font-medium text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center max-w-xl leading-relaxed">
            {language === Language.UZ
              ? "Barcha narxlar soliqlarni o'z ichiga oladi. To'lovlar Payme/Click orqali xavfsiz amalga oshiriladi."
              : language === Language.RU
              ? "Все цены включают налоги. Платежи обрабатываются безопасно через Payme/Click."
              : "All prices include taxes. Secure payment processing via Payme/Click."}
          </p>
        </div>
      </div>

      <Footer />

      {selectedPlan && userProfile && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
          planKey={selectedPlan.key}
          userId={userProfile.id}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Plans;
