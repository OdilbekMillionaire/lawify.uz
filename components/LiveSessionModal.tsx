
import React, { useEffect, useState, useRef } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { LiveSessionManager } from '../services/geminiService';

interface LiveSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const LiveSessionModal: React.FC<LiveSessionModalProps> = ({ isOpen, onClose, language }) => {
  const [status, setStatus] = useState<'listening' | 'processing' | 'speaking' | 'idle'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const managerRef = useRef<LiveSessionManager | null>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      managerRef.current = new LiveSessionManager(
          (newStatus) => setStatus(newStatus),
          (err) => {
              console.error(err);
              setErrorMessage(err);
          }
      );
      managerRef.current.start(language);
    } else {
        managerRef.current?.stop();
        managerRef.current = null;
        setStatus('idle');
    }

    return () => {
        managerRef.current?.stop();
    };
  }, [isOpen, language]);

  const handleManualSend = () => {
      // User indicates they are done speaking
      if (status === 'listening') {
          managerRef.current?.stopRecordingAndProcess();
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-md flex flex-col items-center relative p-6">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 z-20"
        >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h3 className="text-white/80 text-lg font-medium mb-12 tracking-wide uppercase">{t.startLive} (Secure Mode)</h3>

        {/* Visualizer Circle */}
        <div className="relative mb-12">
            {/* Status Rings */}
            {status === 'speaking' && (
                <>
                    <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl animate-ping"></div>
                    <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-2xl animate-pulse delay-75"></div>
                </>
            )}
            {status === 'processing' && (
                <div className="absolute inset-0 rounded-full bg-amber-500/30 blur-xl animate-pulse"></div>
            )}
            {status === 'listening' && (
                 <div className="absolute inset-0 rounded-full bg-green-500/20 blur-lg animate-pulse"></div>
            )}

            {/* Main Interactive Button */}
            <button 
                onClick={handleManualSend}
                disabled={status !== 'listening'}
                className={`relative z-10 w-48 h-48 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-2xl ${
                    status === 'listening' ? 'border-green-400 bg-gray-800 scale-100 cursor-pointer hover:bg-gray-700 hover:scale-105 active:scale-95' :
                    status === 'processing' ? 'border-amber-400 bg-gray-800 scale-95' :
                    status === 'speaking' ? 'border-blue-400 bg-gray-800 scale-105' :
                    'border-gray-600 bg-gray-900'
                }`}
            >
                 {status === 'listening' && (
                     <div className="flex flex-col items-center animate-pulse">
                         <svg className="w-16 h-16 text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                         <span className="text-xs text-green-200 uppercase font-bold tracking-widest">Tap to Send</span>
                     </div>
                 )}
                 {status === 'processing' && (
                     <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-amber-400 animate-spin mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        <span className="text-xs text-amber-200 uppercase font-bold">Thinking...</span>
                     </div>
                 )}
                 {status === 'speaking' && (
                     <div className="flex space-x-2 items-end h-12">
                         <div className="w-2 h-4 bg-blue-400 rounded-full animate-[bounce_1s_infinite]"></div>
                         <div className="w-2 h-8 bg-blue-400 rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
                         <div className="w-2 h-12 bg-blue-400 rounded-full animate-[bounce_1s_infinite_0.4s]"></div>
                         <div className="w-2 h-6 bg-blue-400 rounded-full animate-[bounce_1s_infinite_0.1s]"></div>
                     </div>
                 )}
            </button>
        </div>

        <div className="text-center px-6 h-20">
            {errorMessage ? (
                <p className="text-red-400 font-bold">{errorMessage}</p>
            ) : (
                <>
                    <p className="text-2xl font-light text-white mb-2 transition-all">
                        {status === 'listening' ? "I'm Listening..." :
                         status === 'processing' ? "Analyzing Law..." :
                         status === 'speaking' ? "Speaking..." :
                         "Initializing..."}
                    </p>
                    {status === 'listening' && (
                        <p className="text-xs text-gray-400 uppercase tracking-widest animate-pulse">Speak now, tap circle when done</p>
                    )}
                </>
            )}
        </div>

        <button 
            onClick={onClose}
            className="mt-8 px-8 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors font-medium backdrop-blur-sm border border-white/10"
        >
            {t.stopLive}
        </button>
      </div>
    </div>
  );
};

export default LiveSessionModal;
