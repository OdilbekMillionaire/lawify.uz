
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';

interface AvatarModalProps {
  text: string;
  language: Language;
  onClose: () => void;
}

type AvatarStatus = 'creating' | 'processing' | 'ready' | 'error';

const LABELS = {
  uz: {
    title: 'AI Yurist Avatar',
    creating: 'Avatar sozlanmoqda...',
    processing: 'Video tayyorlanmoqda...',
    eta: 'Bu 30–60 soniya vaqt olishi mumkin',
    ready: "Video tayyor. Kuzatishingiz mumkin.",
    error: 'Xatolik yuz berdi. Qayta urinib ko\'ring.',
    footer: 'Lawify AI Yurist tomonidan taqdim etilmoqda',
    close: 'Yopish',
  },
  ru: {
    title: 'Аватар AI-Юриста',
    creating: 'Аватар настраивается...',
    processing: 'Видео генерируется...',
    eta: 'Это может занять 30–60 секунд',
    ready: 'Видео готово. Приятного просмотра.',
    error: 'Произошла ошибка. Попробуйте снова.',
    footer: 'Представлено AI-Юристом Lawify',
    close: 'Закрыть',
  },
  en: {
    title: 'AI Lawyer Avatar',
    creating: 'Setting up avatar...',
    processing: 'Generating video...',
    eta: 'This may take 30–60 seconds',
    ready: 'Video is ready. Enjoy.',
    error: 'An error occurred. Please try again.',
    footer: 'Presented by Lawify AI Lawyer',
    close: 'Close',
  },
};

const AvatarModal: React.FC<AvatarModalProps> = ({ text, language, onClose }) => {
  const [status, setStatus] = useState<AvatarStatus>('creating');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lang = (LABELS as any)[language] ?? LABELS['en'];

  useEffect(() => {
    let cancelled = false;

    async function startAvatar() {
      try {
        // Step 1: Create the D-ID talk
        const createRes = await fetch('/api/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, language }),
        });

        if (!createRes.ok || cancelled) {
          const err = await createRes.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to create avatar');
        }

        const { talkId } = await createRes.json();
        if (!talkId || cancelled) throw new Error('No talk ID received');

        setStatus('processing');

        // Step 2: Poll for completion every 2.5s
        pollRef.current = setInterval(async () => {
          if (cancelled) { clearInterval(pollRef.current!); return; }
          try {
            const pollRes = await fetch(`/api/avatar-status?id=${talkId}`);
            if (!pollRes.ok) return;
            const { status: s, videoUrl: url } = await pollRes.json();

            if (s === 'done' && url) {
              clearInterval(pollRef.current!);
              setVideoUrl(url);
              setStatus('ready');
            } else if (s === 'error' || s === 'rejected') {
              clearInterval(pollRef.current!);
              setStatus('error');
              setErrorMsg(lang.error);
            }
          } catch { /* retry on next interval */ }
        }, 2500);

      } catch (err: any) {
        if (!cancelled) {
          setStatus('error');
          setErrorMsg(err.message || lang.error);
        }
      }
    }

    startAvatar();
    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Auto-play when video is ready
  useEffect(() => {
    if (status === 'ready' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [status]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative bg-[#080d1c] rounded-2xl shadow-2xl overflow-hidden w-full max-w-[480px] mx-4 border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/5">
          <div className="flex items-center space-x-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
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

        {/* Video / Loading area */}
        <div className="relative bg-gradient-to-b from-[#0d1a40] to-[#080d1c] aspect-video flex items-center justify-center overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-blue-900/10 blur-3xl" />

          {status === 'ready' && videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className="relative w-full h-full object-cover"
            />
          ) : (
            <div className="relative flex flex-col items-center space-y-5 text-center px-10 py-8">
              {/* Avatar silhouette */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-blue-900/60 border border-blue-500/30">
                  <svg className="w-14 h-14 text-white/75" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
                {/* Animated ring */}
                {status !== 'error' && (
                  <div className="absolute -inset-2 rounded-full border-2 border-blue-500/40 animate-ping" />
                )}
              </div>

              {status !== 'error' ? (
                <>
                  {/* Bouncing dots */}
                  <div className="flex space-x-1.5">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.18}s` }}
                      />
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-blue-200 text-sm font-medium">
                      {status === 'creating' ? lang.creating : lang.processing}
                    </p>
                    <p className="text-gray-500 text-xs">{lang.eta}</p>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-red-900/40 flex items-center justify-center mx-auto">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-400 text-sm">{errorMsg || lang.error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-white/5 flex items-center space-x-2">
          {status === 'ready' ? (
            <>
              <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="text-gray-400 text-xs">{lang.footer}</p>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="text-gray-500 text-xs">Powered by D-ID · {lang.footer}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
