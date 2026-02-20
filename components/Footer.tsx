
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const productLinks = [
    { label: 'AI Yurist', path: '/chat' },
    { label: 'AI Odilbek', path: '/odilbek' },
    { label: 'AI Kotib', path: '/studio' },
    { label: 'AI Mediator', path: '/mediation' },
    { label: 'AI Sharh Beruvchi', path: '/commentator' },
    { label: 'Mavzular', path: '/topics' },
  ];

  const helpLinks = [
    { label: 'Tarix', path: '/history' },
    { label: 'Rejalar', path: '/plans' },
    { label: 'Profil', path: '/profile' },
    { label: 'Shablonlar', path: '/library' },
  ];

  return (
    <footer
      className="w-full mt-auto text-slate-300"
      style={{
        background: 'linear-gradient(135deg, #060b18 0%, #0a0f1e 50%, #080d1c 100%)',
        borderTop: '1px solid rgba(59,130,246,0.15)',
      }}
    >
      {/* Glow accent line */}
      <div
        className="w-full h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5) 30%, rgba(139,92,246,0.5) 70%, transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* ── Column 1: Brand (spans 2 on lg) ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo + wordmark */}
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(124,58,237,0.25))',
                  border: '1px solid rgba(37,99,235,0.35)',
                }}
              >
                <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l9-3 9 3v6c0 5.25-4 9-9 10.5C7 18 3 14.25 3 9V6z"/>
                </svg>
              </div>
              <div>
                <div className="text-white font-serif font-bold text-lg leading-none">LAWIFY</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">by OXFORDER LLC</div>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              O'zbekistonning birinchi AI yuridik platformasi — real vaqt rejimida lex.uz va norma.uz'dan qonunlar asosida maslahat beradi.
            </p>

            {/* Social proof strip */}
            <div
              className="flex items-center space-x-4 px-4 py-3 rounded-2xl w-fit"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {[
                { n: '15k+', l: 'Foydalanuvchi' },
                { n: '85k+', l: 'Hujjat' },
                { n: '3', l: 'Til' },
              ].map((s, i) => (
                <React.Fragment key={i}>
                  <div className="text-center">
                    <div className="text-sm font-black text-white">{s.n}</div>
                    <div className="text-[9px] text-slate-600">{s.l}</div>
                  </div>
                  {i < 2 && <div className="w-px h-8 bg-slate-800" />}
                </React.Fragment>
              ))}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <div
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-sm">🎓</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Oxford Founded</span>
              </div>
              <div
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-sm">🏛️</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">TSUL Partner</span>
              </div>
              <div
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-sm">⚖️</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">lex.uz Certified</span>
              </div>
            </div>
          </div>

          {/* ── Column 2: Platforma ── */}
          <div className="space-y-4">
            <h4
              className="text-[10px] font-black uppercase tracking-widest pb-2"
              style={{ color: 'rgba(148,163,184,0.5)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              Platforma
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors group"
                  >
                    <span
                      className="w-1 h-1 rounded-full transition-all group-hover:w-2"
                      style={{ background: 'rgba(37,99,235,0.6)' }}
                    />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Yordam ── */}
          <div className="space-y-4">
            <h4
              className="text-[10px] font-black uppercase tracking-widest pb-2"
              style={{ color: 'rgba(148,163,184,0.5)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              Yordam
            </h4>
            <ul className="space-y-2.5">
              {helpLinks.map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors group"
                  >
                    <span
                      className="w-1 h-1 rounded-full transition-all group-hover:w-2"
                      style={{ background: 'rgba(139,92,246,0.6)' }}
                    />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <a
                href="mailto:ceo@oxforder.uz"
                className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors group"
              >
                <span
                  className="w-1 h-1 rounded-full transition-all group-hover:w-2"
                  style={{ background: 'rgba(5,150,105,0.6)' }}
                />
                <span>Bog'lanish</span>
              </a>
            </div>
          </div>

          {/* ── Column 4: Texnologiya ── */}
          <div className="space-y-4">
            <h4
              className="text-[10px] font-black uppercase tracking-widest pb-2"
              style={{ color: 'rgba(148,163,184,0.5)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              Texnologiya
            </h4>

            {/* Neural engine badge */}
            <div
              className="p-4 rounded-2xl group hover:border-blue-500/50 transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.08))',
                border: '1px solid rgba(37,99,235,0.2)',
              }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-sm opacity-30 rounded-full" />
                  <svg className="w-7 h-7 text-blue-400 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="5" r="2" strokeWidth="1.5"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 7v10M8 21h8M12 7l-6 2M12 7l6-2"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 9l-3 2v3m0-3l3 2v3m-3-5h3M18 9l3 2v3m0-3l-3 2v3m3-5h-3"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Lawify Neural Engine</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Specialized Legal AI</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Real-time RAG grounding from lex.uz & norma.uz. Zero hallucination protocol.
              </p>
            </div>

            {/* Security badges */}
            <div className="flex flex-wrap gap-2">
              <div
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg"
                style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)' }}
              >
                <span className="text-[10px]">🔒</span>
                <span className="text-[10px] font-bold text-emerald-400">256-bit TLS</span>
              </div>
              <div
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg"
                style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}
              >
                <span className="text-[10px]">🛡️</span>
                <span className="text-[10px] font-bold text-blue-400">SSL Secured</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="max-w-7xl mx-auto px-6 py-5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">© 2026 OXFORDER LLC. All rights reserved.</p>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-700">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="mailto:ceo@oxforder.uz" className="hover:text-slate-400 transition-colors">ceo@oxforder.uz</a>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-700">
            <span className="flex items-center space-x-1">
              <span>📍</span>
              <span>Toshkent, O'zbekiston</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
