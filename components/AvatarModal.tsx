
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../types';
import { textToSpeech } from '../services/geminiService';

interface AvatarModalProps {
  text: string;
  language: Language;
  onClose: () => void;
}

const LABELS = {
  uz: {
    title: 'AI Yurist Avatar',
    loading: 'Avatar tayyorlanmoqda...',
    speaking: 'Javob aytilmoqda...',
    done: "Tugadi. Yana savollaringiz bo'lsa, yozing!",
    error: 'TTS xatoligi. Qayta urinib ko\'ring.',
    footer: 'Lawify AI Yurist tomonidan taqdim etilmoqda',
    close: 'Yopish',
  },
  ru: {
    title: 'Аватар AI-Юриста',
    loading: 'Аватар подготавливается...',
    speaking: 'Ответ зачитывается...',
    done: 'Готово. Если есть ещё вопросы — пишите!',
    error: 'Ошибка синтеза речи. Попробуйте снова.',
    footer: 'Представлено AI-Юристом Lawify',
    close: 'Закрыть',
  },
  en: {
    title: 'AI Lawyer Avatar',
    loading: 'Preparing avatar...',
    speaking: 'Reading response...',
    done: 'Done. Feel free to ask more questions!',
    error: 'TTS error. Please try again.',
    footer: 'Presented by Lawify AI Lawyer',
    close: 'Close',
  },
};

type Status = 'loading' | 'speaking' | 'done' | 'error';

// ----------------------------
// SVG Animated Avatar
// ----------------------------
interface AvatarFaceProps {
  mouthOpen: number;  // 0 = closed, 1 = fully open
  blinking: boolean;
  speaking: boolean;
}

const AvatarFace: React.FC<AvatarFaceProps> = ({ mouthOpen, blinking, speaking }) => {
  const eyeRY = blinking ? 1 : 9;
  const pupilR = blinking ? 0 : 5;
  const mouthRY = 2 + mouthOpen * 13;

  return (
    <svg viewBox="0 0 220 300" className="w-full h-full" style={{ maxWidth: 220 }}>
      {/* Suit body */}
      <rect x="20" y="210" width="180" height="100" rx="12" fill="#1a237e" />
      {/* Shirt */}
      <rect x="88" y="210" width="44" height="100" fill="#ffffff" />
      {/* Tie */}
      <polygon points="103,210 117,210 113,265 110,285 107,265" fill="#b71c1c" />
      {/* Suit lapels */}
      <polygon points="88,210 20,230 20,210" fill="#283593" />
      <polygon points="132,210 200,230 200,210" fill="#283593" />
      {/* Collar */}
      <polygon points="88,210 110,226 88,240" fill="#eeeeee" />
      <polygon points="132,210 110,226 132,240" fill="#eeeeee" />

      {/* Neck */}
      <rect x="95" y="192" width="30" height="25" rx="4" fill="#f3c9b5" />

      {/* Head */}
      <ellipse cx="110" cy="148" rx="62" ry="70" fill="#f3c9b5" />

      {/* Hair */}
      <ellipse cx="110" cy="90" rx="62" ry="30" fill="#3e2010" />
      <rect x="48" y="90" width="124" height="35" fill="#3e2010" />
      {/* Side hair */}
      <ellipse cx="50" cy="130" rx="10" ry="30" fill="#3e2010" />
      <ellipse cx="170" cy="130" rx="10" ry="30" fill="#3e2010" />

      {/* Ears */}
      <ellipse cx="48" cy="152" rx="9" ry="14" fill="#f3c9b5" />
      <ellipse cx="172" cy="152" rx="9" ry="14" fill="#f3c9b5" />
      <ellipse cx="48" cy="152" rx="5" ry="8" fill="#eab8a5" />
      <ellipse cx="172" cy="152" rx="5" ry="8" fill="#eab8a5" />

      {/* Eyebrows */}
      <path d="M78 118 Q90 112 102 118" stroke="#3e2010" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M118 118 Q130 112 142 118" stroke="#3e2010" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Eyes — white */}
      <ellipse cx="90" cy="138" rx="13" ry={eyeRY} fill="white" />
      <ellipse cx="130" cy="138" rx="13" ry={eyeRY} fill="white" />
      {/* Iris */}
      <ellipse cx="90" cy="138" rx="8" ry={Math.min(eyeRY * 0.88, 8)} fill="#3d5afe" />
      <ellipse cx="130" cy="138" rx="8" ry={Math.min(eyeRY * 0.88, 8)} fill="#3d5afe" />
      {/* Pupil */}
      <circle cx="90" cy="138" r={pupilR} fill="#111" />
      <circle cx="130" cy="138" r={pupilR} fill="#111" />
      {/* Eye shine */}
      {!blinking && <><circle cx="94" cy="134" r="2.5" fill="white" /><circle cx="134" cy="134" r="2.5" fill="white" /></>}

      {/* Nose */}
      <ellipse cx="110" cy="168" rx="7" ry="5" fill="#e8a898" />
      <path d="M104 172 Q110 176 116 172" stroke="#d4917a" strokeWidth="1.5" fill="none" />

      {/* Mouth */}
      <ellipse cx="110" cy="192" rx="18" ry={mouthRY} fill="#c62828" />
      {/* Upper teeth (visible when mouth open) */}
      {mouthOpen > 0.3 && (
        <rect x="97" y="187" width="26" height={5 + mouthOpen * 4} rx="2" fill="white" />
      )}
      {/* Lip lines */}
      <path d={`M92 192 Q110 ${192 - mouthRY * 0.3} 128 192`} stroke="#a52714" strokeWidth="1" fill="none" />

      {/* Speaking animation: subtle glow when speaking */}
      {speaking && (
        <circle cx="110" cy="148" r="75" fill="none" stroke="#42a5f5" strokeWidth="2" opacity="0.3">
          <animate attributeName="r" from="75" to="85" dur="1s" repeatCount="indefinite" begin="0s" />
          <animate attributeName="opacity" from="0.3" to="0" dur="1s" repeatCount="indefinite" begin="0s" />
        </circle>
      )}
    </svg>
  );
};

// ----------------------------
// Main Modal
// ----------------------------
const AvatarModal: React.FC<AvatarModalProps> = ({ text, language, onClose }) => {
  const [status, setStatus] = useState<Status>('loading');
  const [mouthOpen, setMouthOpen] = useState(0);
  const [blinking, setBlinking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const animRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lang = (LABELS as any)[language] ?? LABELS['en'];

  // Blink loop
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 2500 + Math.random() * 3000;
      return setTimeout(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 120);
        blinkTimeoutRef.current = scheduleBlink();
      }, delay);
    };
    const blinkTimeoutRef = { current: scheduleBlink() };
    return () => clearTimeout(blinkTimeoutRef.current);
  }, []);

  const startSpeaking = useCallback(async () => {
    try {
      // Clean text for TTS (remove markdown, limit length)
      const cleaned = text
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*/g, '').replace(/\*/g, '')
        .replace(/`/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\n{2,}/g, '. ')
        .replace(/\n/g, ' ')
        .trim()
        .slice(0, 600);

      const voiceName = language === 'uz' || language === 'en' ? 'Kore' : 'Charon';
      const audioBuffer = await textToSpeech(cleaned, voiceName);

      if (!audioBuffer) {
        throw new Error('TTS returned empty audio');
      }

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyser);
      analyser.connect(ctx.destination);

      setStatus('speaking');
      source.start(0);

      const animate = () => {
        analyser.getByteFrequencyData(dataArray);
        // Voice frequencies are roughly bins 2–15
        let sum = 0;
        for (let i = 2; i < 16; i++) sum += dataArray[i];
        const avg = sum / 14 / 255;
        setMouthOpen(Math.min(avg * 2.5, 1)); // amplify for visibility
        animRef.current = requestAnimationFrame(animate);
      };
      animate();

      source.onended = () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
        setMouthOpen(0);
        setStatus('done');
      };

    } catch (e: any) {
      console.error('Avatar TTS error:', e);
      setErrorMsg(lang.error);
      setStatus('error');
    }
  }, [text, language]);

  useEffect(() => {
    startSpeaking();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  const statusLabel =
    status === 'loading' ? lang.loading :
    status === 'speaking' ? lang.speaking :
    status === 'done' ? lang.done :
    errorMsg;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative bg-[#080d1c] rounded-2xl shadow-2xl overflow-hidden w-full max-w-[400px] mx-4 border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/5">
          <div className="flex items-center space-x-2.5">
            <div className={`w-2 h-2 rounded-full ${status === 'speaking' ? 'bg-green-400 animate-pulse' : status === 'loading' ? 'bg-yellow-400 animate-pulse' : 'bg-blue-400'}`} />
            <span className="text-white font-semibold text-sm tracking-wide">{lang.title}</span>
            <span className="text-[10px] bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-extrabold px-2 py-0.5 rounded-full tracking-wider">PRO</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            title={lang.close}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Avatar area */}
        <div className="bg-gradient-to-b from-[#0d1a40] to-[#080d1c] flex flex-col items-center justify-center py-8 px-6 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-blue-900/10 blur-3xl pointer-events-none" />

          {/* The avatar face */}
          <div className="relative w-44 h-56">
            {status === 'error' ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-900/40 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-400 text-sm text-center">{errorMsg}</p>
              </div>
            ) : (
              <AvatarFace
                mouthOpen={mouthOpen}
                blinking={blinking}
                speaking={status === 'speaking'}
              />
            )}
          </div>

          {/* Status text */}
          <div className="mt-4 text-center space-y-1.5 relative">
            <p className={`text-sm font-medium ${
              status === 'speaking' ? 'text-green-300' :
              status === 'done' ? 'text-blue-300' :
              status === 'error' ? 'text-red-400' :
              'text-yellow-300'
            }`}>
              {statusLabel}
            </p>

            {/* Loading dots */}
            {status === 'loading' && (
              <div className="flex justify-center space-x-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
            )}

            {/* Soundwave bars when speaking */}
            {status === 'speaking' && (
              <div className="flex items-end justify-center space-x-0.5 h-5">
                {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-green-400 rounded-full"
                    style={{
                      height: `${(0.3 + mouthOpen * 0.7) * h * 20}px`,
                      transition: 'height 0.05s ease',
                      opacity: 0.7 + mouthOpen * 0.3,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-white/5 flex items-center space-x-2">
          <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-gray-400 text-xs">{lang.footer}</p>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
