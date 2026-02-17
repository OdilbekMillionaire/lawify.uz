
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand & Founder */}
        <div className="col-span-1 md:col-span-2 space-y-5">
            <div>
                <h3 className="text-white text-xl font-serif font-bold tracking-wide flex items-center space-x-2">
                    <span>OXFORDER LLC</span>
                </h3>
                <p className="text-sm text-slate-400 font-medium mt-1">Leading AI LegalTech in Central Asia.</p>
            </div>
            
            <div className="flex items-start space-x-2 bg-slate-800/30 p-3 rounded-lg w-fit border border-slate-800">
                <span className="text-lg">🎓</span>
                <div>
                    <p className="text-xs text-slate-300 font-bold">Founder Information</p>
                    <p className="text-xs text-slate-500 italic">
                        Founded by an Oxford University Law Magistrant.
                    </p>
                </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 inline-block">
                <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Institutional Partner</span>
                </div>
                <p className="text-xs text-slate-400 leading-tight max-w-sm">
                    Proudly supporting students and faculty at <span className="text-slate-200 font-medium">Tashkent State University of Law (TSUL)</span>.
                </p>
            </div>
        </div>

        {/* Links */}
        <div className="space-y-4">
            <h4 className="text-white font-bold uppercase text-xs tracking-wider border-b border-slate-800 pb-2 w-fit">Legal & Contact</h4>
            <ul className="space-y-3 text-sm">
                <li>
                    <a href="#" className="hover:text-blue-400 transition-colors flex items-center group">
                        <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                        Privacy Policy
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-blue-400 transition-colors flex items-center group">
                        <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                        Terms of Service
                    </a>
                </li>
                <li className="pt-2">
                    <a href="mailto:ceo@oxforder.uz" className="flex items-center text-slate-300 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-lg w-fit border border-slate-700 hover:border-blue-500 group">
                        <svg className="w-4 h-4 mr-2 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        ceo@oxforder.uz
                    </a>
                </li>
            </ul>
        </div>

        {/* Tech Badge */}
        <div className="space-y-4">
             <h4 className="text-white font-bold uppercase text-xs tracking-wider border-b border-slate-800 pb-2 w-fit">Technology</h4>
             <div className="group p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all shadow-lg">
                 <div className="flex items-center space-x-3 mb-2">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-sm opacity-40 rounded-full"></div>
                        {/* Custom Lady Justice Logo - REPLACES GEMINI SPARKLE */}
                        <svg className="w-8 h-8 text-blue-400 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="5" r="2" strokeWidth="1.5" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 7v10M8 21h8M12 17l-4 4M12 17l4 4" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 9l-3 2v3m0-3l3 2v3m-3-5h3" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 7l-6 2" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 7l6-2v-2" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 5v6l-1 1m2-1l1 1m-1-1v4" />
                        </svg>
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-white group-hover:text-blue-300 transition-colors">Lawify Neural Engine</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">Specialized Legal Model</span>
                    </div>
                 </div>
                 <p className="text-[11px] text-slate-500 leading-relaxed">
                    Powered by advanced reasoning models for precise legal analysis.
                 </p>
             </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>© 2026 OXFORDER LLC. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="flex items-center"><span className="w-1 h-1 bg-slate-600 rounded-full mr-2"></span>Tashkent, Uzbekistan</span>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
