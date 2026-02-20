
import React, { useEffect, useState, useRef } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { LiveSessionManager } from '../services/geminiService';

interface LiveSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  isPro: boolean;
}

const VOICES = [
  { id: 'Kore',   label: 'Kore',   gender: 'Female', style: 'Professional', color: '#2563eb' },
  { id: 'Aoede',  label: 'Aoede',  gender: 'Female', style: 'Warm',         color: '#7c3aed' },
  { id: 'Zephyr', label: 'Zephyr', gender: 'Female', style: 'Energetic',    color: '#0891b2' },
  { id: 'Puck',   label: 'Puck',   gender: 'Male',   style: 'Friendly',     color: '#059669' },
  { id: 'Fenrir', label: 'Fenrir', gender: 'Male',   style: 'Deep',         color: '#d97706' },
  { id: 'Charon', label: 'Charon', gender: 'Male',   style: 'Authoritative',color: '#dc2626' },
];

const LiveSessionModal: React.FC<LiveSessionModalProps> = ({ isOpen, onClose, language, isPro }) => {
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>(() =>
    localStorage.getItem('lawify_voice_preference') || 'Kore'
  );
  const managerRef = useRef<LiveSessionManager | null>(null);
  const t = TRANSLATIONS[language];

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      managerRef.current?.stop();
      managerRef.current = null;
      setStatus('idle');
      setSessionStarted(false);
      setErrorMessage(null);
    }
  }, [isOpen]);

  const handleStartSession = () => {
    const voice = isPro ? selectedVoice : 'Kore';
    if (isPro) {
      localStorage.setItem('lawify_voice_preference', voice);
    }
    setErrorMessage(null);
    setSessionStarted(true);

    managerRef.current = new LiveSessionManager(
      (newStatus) => setStatus(newStatus),
      (err) => {
        console.error(err);
        setErrorMessage(err);
      }
    );
    managerRef.current.start(language, voice);
  };

  const handleManualSend = () => {
    if (status === 'listening') {
      managerRef.current?.stopRecordingAndProcess();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity">
      <div
        className="w-full max-w-md mx-4 rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0d1a3a 0%, #0a0f1e 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
      >

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <span className="text-red-400 text-sm">🎙️</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                {language === 'uz' ? 'Jonli Suhbat' : language === 'ru' ? 'Живой Чат' : 'Live Session'}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Secure Mode · Pro</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          {!sessionStarted ? (
            /* ── Voice Picker (pre-session) ── */
            <div className="space-y-5">
              <div className="text-center mb-2">
                <p className="text-slate-300 text-sm">
                  {language === 'uz' ? 'AI ovozini tanlang' : language === 'ru' ? 'Выберите голос AI' : 'Choose AI voice'}
                </p>
                {!isPro && (
                  <p className="text-[11px] text-amber-400 mt-1">
                    {language === 'uz' ? 'Pro foydalanuvchilar ovoz tanlashi mumkin.' : 'Pro users can select a voice.'}
                  </p>
                )}
              </div>

              {/* Voice grid */}
              <div className="grid grid-cols-2 gap-3">
                {VOICES.map((v) => {
                  const isSelected = selectedVoice === v.id;
                  const isDisabled = !isPro;
                  return (
                    <button
                      key={v.id}
                      onClick={() => isPro && setSelectedVoice(v.id)}
                      className={`relative p-3.5 rounded-2xl text-left transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                      style={{
                        background: isSelected
                          ? `linear-gradient(135deg, ${v.color}22, ${v.color}11)`
                          : 'rgba(255,255,255,0.04)',
                        border: isSelected
                          ? `1.5px solid ${v.color}88`
                          : '1.5px solid rgba(255,255,255,0.07)',
                        boxShadow: isSelected ? `0 0 16px ${v.color}22` : 'none',
                      }}
                    >
                      {isSelected && (
                        <div
                          className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white"
                          style={{ background: v.color }}
                        >✓</div>
                      )}
                      <div className="flex items-center space-x-2 mb-1">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-xs"
                          style={{ background: `${v.color}22`, border: `1px solid ${v.color}44` }}
                        >
                          {v.gender === 'Female' ? '👩' : '👨'}
                        </div>
                        <div>
                          <div className="text-white text-xs font-bold">{v.label}</div>
                          <div
                            className="text-[9px] font-bold uppercase tracking-wider"
                            style={{ color: v.color }}
                          >{v.gender}</div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500">{v.style}</div>
                    </button>
                  );
                })}
              </div>

              {/* Start button */}
              <button
                onClick={handleStartSession}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #9f1239)',
                  boxShadow: '0 4px 24px rgba(220,38,38,0.35)',
                }}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🎙️</span>
                  <span>
                    {language === 'uz' ? 'Suhbatni boshlash' : language === 'ru' ? 'Начать сеанс' : 'Start Session'}
                  </span>
                </span>
              </button>
            </div>
          ) : (
            /* ── Active Session ── */
            <div className="flex flex-col items-center">

              {/* Status rings + button */}
              <div className="relative mb-8">
                {status === 'speaking' && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl animate-ping" />
                    <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-2xl animate-pulse" style={{ animationDelay: '0.1s' }} />
                  </>
                )}
                {status === 'processing' && (
                  <div className="absolute inset-0 rounded-full bg-amber-500/30 blur-xl animate-pulse" />
                )}
                {status === 'listening' && (
                  <div className="absolute inset-0 rounded-full bg-green-500/20 blur-lg animate-pulse" />
                )}

                <button
                  onClick={handleManualSend}
                  disabled={status !== 'listening'}
                  className={`relative z-10 w-40 h-40 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-2xl ${
                    status === 'listening'  ? 'border-green-400 bg-slate-800/90 cursor-pointer hover:bg-slate-700/90 hover:scale-105 active:scale-95' :
                    status === 'processing' ? 'border-amber-400 bg-slate-800/90 scale-95 cursor-wait' :
                    status === 'speaking'   ? 'border-blue-400 bg-slate-800/90 scale-105' :
                    'border-slate-600 bg-slate-900 cursor-wait'
                  }`}
                >
                  {status === 'listening' && (
                    <div className="flex flex-col items-center animate-pulse">
                      <svg className="w-12 h-12 text-green-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                      </svg>
                      <span className="text-[10px] text-green-300 font-bold uppercase tracking-widest">Tap to Send</span>
                    </div>
                  )}
                  {status === 'processing' && (
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-amber-400 animate-spin mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                      <span className="text-[10px] text-amber-300 font-bold uppercase">Thinking...</span>
                    </div>
                  )}
                  {status === 'speaking' && (
                    <div className="flex space-x-1.5 items-end h-10">
                      {[4, 8, 12, 6, 10].map((h, i) => (
                        <div
                          key={i}
                          className="w-2 rounded-full animate-bounce bg-blue-400"
                          style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  )}
                  {status === 'idle' && (
                    <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-blue-400 animate-spin" />
                  )}
                </button>
              </div>

              {/* Status text */}
              <div className="text-center h-14">
                {errorMessage ? (
                  <p className="text-red-400 font-bold text-sm">{errorMessage}</p>
                ) : (
                  <>
                    <p className="text-xl font-light text-white mb-1">
                      {status === 'listening'  ? (language === 'uz' ? 'Tinglamoqdaman...' : "I'm Listening...") :
                       status === 'processing' ? (language === 'uz' ? 'Tahlil qilmoqda...' : "Analyzing Law...") :
                       status === 'speaking'   ? (language === 'uz' ? 'Javob bermoqda...' : "Speaking...") :
                       (language === 'uz' ? 'Ishga tushmoqda...' : "Initializing...")}
                    </p>
                    {status === 'listening' && (
                      <p className="text-[11px] text-slate-500 uppercase tracking-widest animate-pulse">
                        {language === 'uz' ? 'Gapiring, tugagach doirani bosing' : 'Speak now, tap circle when done'}
                      </p>
                    )}
                    {isPro && (
                      <p className="text-[10px] text-slate-600 mt-1">
                        {language === 'uz' ? `Ovoz: ${selectedVoice}` : `Voice: ${selectedVoice}`}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Stop button */}
              <button
                onClick={onClose}
                className="mt-4 px-8 py-3 rounded-full font-medium text-sm transition-all hover:bg-white/20"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
              >
                {t.stopLive}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveSessionModal;
