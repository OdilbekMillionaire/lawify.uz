import React, { useState } from 'react';
import { Language } from '../types';
import { signUpNewUser, signInWithPassword } from '../services/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, language }) => {
  // Email State
  const [emailMode, setEmailMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setMessage(null);

      try {
          if (emailMode === 'signup') {
              const data = await signUpNewUser(email, password);
              if (data.session) {
                  onClose();
              } else {
                  setMessage(
                      language === Language.UZ 
                      ? "Ro'yxatdan o'tish muvaffaqiyatli! Iltimos, kompyuteringizda emailingizni tekshiring." 
                      : "Registration successful! Please check your email on THIS computer to confirm."
                  );
              }
          } else {
              await signInWithPassword(email, password);
              onClose();
          }
      } catch (err: any) {
          setError(err.message || "An error occurred");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative flex flex-col">
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="p-8 pb-4">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-serif font-bold text-slate-800">
                        {language === Language.UZ ? "Tizimga kirish" : "Welcome Back"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                         {language === Language.UZ ? "Yuridik yordamchingizga ulaning" : "Access your legal assistant"}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl flex items-center">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {message}
                    </div>
                )}

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-6"
                    >
                        {loading ? (
                            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                        ) : (
                            emailMode === 'signin' ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-6 text-center border-t border-gray-100 mt-auto">
                <p className="text-sm text-gray-600">
                    {emailMode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={() => { setEmailMode(emailMode === 'signin' ? 'signup' : 'signin'); setError(null); }}
                        className="ml-2 font-bold text-blue-600 hover:underline focus:outline-none"
                    >
                        {emailMode === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    </div>
  );
};

export default AuthModal;