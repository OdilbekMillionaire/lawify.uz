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
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const managerRef = useRef<LiveSessionManager | null>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (isOpen) {
      setStatus('connecting');
      setErrorMessage(null);
      managerRef.current = new LiveSessionManager(
          (connected, speaking) => {
              if (connected) setStatus('connected');
              setIsSpeaking(speaking);
          },
          (err) => {
              console.error(err);
              setErrorMessage(err);
              setStatus('error');
          }
      );
      managerRef.current.start(language);
    } else {
        // Cleanup if closed
        managerRef.current?.stop();
        managerRef.current = null;
    }

    return () => {
        managerRef.current?.stop();
    };
  }, [isOpen, language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity">
      <div className="bg-gray-900 w-full max-w-md rounded-3xl p-8 flex flex-col items-center shadow-2xl border border-gray-700 relative">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h3 className="text-white text-xl font-semibold mb-8">{t.startLive}</h3>

        {/* Visualizer */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
            {/* Outer Glow */}
            <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                status === 'connected' 
                    ? isSpeaking 
                        ? 'bg-blue-500/30 blur-xl scale-110 animate-pulse' 
                        : 'bg-green-500/20 blur-lg scale-100'
                    : 'bg-red-500/20 blur-md'
            }`}></div>

            {/* Core Circle */}
            <div className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                status === 'connected'
                    ? isSpeaking
                        ? 'border-blue-400 bg-gray-800'
                        : 'border-green-400 bg-gray-800'
                    : 'border-red-400 bg-gray-800'
            }`}>
                 <svg className={`w-12 h-12 text-white ${status === 'connecting' ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     {status === 'connecting' && (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                     )}
                     {status === 'connected' && (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                     )}
                     {status === 'error' && (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                     )}
                 </svg>
            </div>
        </div>

        <div className="text-center px-4">
            {status === 'connecting' && <p className="text-gray-400">{t.listening}</p>}
            {status === 'error' && (
                <div className="flex flex-col items-center">
                    <p className="text-red-400 font-bold mb-1">Connection Failed</p>
                    <p className="text-red-300 text-xs">{errorMessage || "Unknown error occurred"}</p>
                </div>
            )}
            {status === 'connected' && (
                <p className={`text-lg font-medium transition-colors ${isSpeaking ? 'text-blue-400' : 'text-green-400'}`}>
                    {isSpeaking ? t.speaking : t.listening}
                </p>
            )}
        </div>

        <button 
            onClick={onClose}
            className="mt-8 px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-full hover:bg-red-500/20 transition-colors"
        >
            {t.stopLive}
        </button>
      </div>
    </div>
  );
};

export default LiveSessionModal;