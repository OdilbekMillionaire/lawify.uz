
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Language, UserSettings, Message, Attachment } from '../types';
import { TRANSLATIONS } from '../constants';
import ChatInterface from '../components/ChatInterface';
import { generateLegalResponse, textToSpeech } from '../services/geminiService';
import { saveSession } from '../services/storage';

interface ChatPageProps {
  language: Language;
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
  isPro: boolean;
}

const SESSION_STORAGE_KEY = 'lawify_current_session';

const ChatPage: React.FC<ChatPageProps> = ({ 
    language, 
    settings, 
    setSettings, 
    isPro
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const t = TRANSLATIONS[language];
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [prefilledPrompt, setPrefilledPrompt] = useState<string>('');

  // Handle Location State (Prompt or Restored Messages)
  useEffect(() => {
    const state = location.state as { initialPrompt?: string; restoredMessages?: Message[] } | null;
    
    if (state?.restoredMessages) {
        // Restoring from History: Overwrite everything
        setMessages(state.restoredMessages);
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state.restoredMessages));
    } else if (state?.initialPrompt) {
        // Coming from Quick Link
        setPrefilledPrompt(state.initialPrompt);
        // Do NOT clear messages immediately if coming from quick link, might want to append? 
        // Design choice: Quick Link usually starts fresh.
        setMessages([]); 
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        
        // Clear history state to prevent re-filling on refresh
        navigate('.', { replace: true, state: {} });
    } else {
        // Normal Load / Refresh: Check SessionStorage
        const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (savedSession) {
            try {
                const parsed = JSON.parse(savedSession);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMessages(parsed);
                }
            } catch (e) {
                console.error("Failed to restore session", e);
            }
        }
    }
  }, [location.state, navigate]);

  // Initialize usage count on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const usageData = localStorage.getItem('lawify_daily_usage');
    if (usageData) {
         const parsed = JSON.parse(usageData);
         if (parsed.date === today) {
             setUsageCount(parsed.count);
         } else {
             setUsageCount(0); // New day
         }
    }
  }, []);

  // Auto-save history & session persistence when messages change
  useEffect(() => {
    if (messages.length > 0) {
        // 1. Save to History (Long-term)
        saveSession(messages);
        // 2. Save to Session (Short-term, for refresh)
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const addMessage = (text: string, role: 'user' | 'model', attachment?: Attachment, sources?: any[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      role,
      timestamp: Date.now(),
      attachment,
      sources
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const checkUsageLimit = (): boolean => {
      if (isPro) return true; // No limits for Pro

      const today = new Date().toISOString().split('T')[0];
      const usageData = localStorage.getItem('lawify_daily_usage');
      let currentUsage = { date: today, count: 0 };

      if (usageData) {
          const parsed = JSON.parse(usageData);
          if (parsed.date === today) {
              currentUsage = parsed;
          }
      }

      if (currentUsage.count >= 5) { // LIMIT: 5 REQUESTS PER DAY
          setShowLimitModal(true);
          return false;
      }

      currentUsage.count += 1;
      localStorage.setItem('lawify_daily_usage', JSON.stringify(currentUsage));
      setUsageCount(currentUsage.count);
      return true;
  };

  const generateAIResponse = async (historyMessages: Message[], userPrompt: string, attachment?: Attachment) => {
    setIsLoading(true);
    try {
      const historyStr = historyMessages.filter(m => m.role !== 'model' || !m.isThinking).map(m => `${m.role}: ${m.text}`).join('\n');
      const userProfileContext = isPro ? "User is a PREMIUM PRO member. Provide detailed, priority legal analysis." : "User is a Free plan member.";

      const { text: responseText, sources } = await generateLegalResponse(
        userPrompt, 
        attachment, 
        language, 
        settings, 
        historyStr,
        userProfileContext,
        isPro
      );

      addMessage(responseText, 'model', undefined, sources);

    } catch (error) {
      console.error(error);
      addMessage("Sorry, connection failed. Please try again.", 'model');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text: string, attachment?: Attachment) => {
    if (attachment && !isPro) {
        alert(language === Language.UZ 
            ? "Hujjatlarni tahlil qilish faqat Pro foydalanuvchilar uchun! Iltimos, obuna bo'ling."
            : "Document analysis is a Pro feature! Please upgrade to Pro to upload files.");
        return;
    }
    if (!checkUsageLimit()) return;

    addMessage(text, 'user', attachment);
    await generateAIResponse(messages, text, attachment);
  };

  const handleRegenerate = async () => {
      if (!checkUsageLimit()) return;
      const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === 'user');
      if (lastUserMessageIndex !== -1) {
          const realIndex = messages.length - 1 - lastUserMessageIndex;
          const userMsg = messages[realIndex];
          const newHistory = messages.slice(0, realIndex + 1);
          setMessages(newHistory);
          await generateAIResponse(newHistory.slice(0, -1), userMsg.text, userMsg.attachment);
      }
  };

  const handleEditMessage = async (messageId: string, newText: string) => {
      if (!checkUsageLimit()) return;
      const msgIndex = messages.findIndex(m => m.id === messageId);
      if (msgIndex === -1) return;
      
      const newHistory = messages.slice(0, msgIndex);
      const updatedMessage: Message = { ...messages[msgIndex], text: newText, timestamp: Date.now() };
      
      setMessages([...newHistory, updatedMessage]);
      await generateAIResponse(newHistory, newText, updatedMessage.attachment);
  };

  const handleFeedback = (messageId: string, type: 'like' | 'dislike') => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, feedback: type } : m));
  };

  const handleClearChat = () => {
      if (window.confirm("Are you sure you want to clear this conversation?")) {
          setMessages([]);
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
  };

  const handleTTS = async (text: string) => {
      const buffer = await textToSpeech(text);
      if (buffer) {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.start();
      }
  };

  const handleAskOdilbek = (context: string) => {
      // Pass the full text to Odilbek page for explanation
      navigate('/odilbek', { state: { legalContext: context } });
  };

  return (
    <div className="flex h-full relative">
       {/* Settings Sidebar */}
       <div className={`fixed inset-y-0 right-0 z-20 w-80 bg-white border-l border-gray-200 transform transition-transform duration-300 ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
          <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="font-serif font-bold text-lg text-slate-800">{t.settings}</h3>
                  <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
              </div>
              
              <div className="space-y-8 flex-1">
                 <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.length}</label>
                    <div className="grid grid-cols-3 gap-2">
                         {['Short', 'Medium', 'Detailed'].map((l) => (
                            <button
                                key={l}
                                onClick={() => setSettings({...settings, answerLength: l as any})}
                                className={`py-2 text-[10px] uppercase font-bold rounded-lg border transition-all ${
                                    settings.answerLength === l 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {l === 'Short' ? t.short : l === 'Medium' ? t.medium : t.detailed}
                            </button>
                        ))}
                    </div>
                 </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center mt-6">
                  {t.disclaimer}
              </div>
          </div>
       </div>

       {isSettingsOpen && (
           <div onClick={() => setIsSettingsOpen(false)} className="fixed inset-0 bg-black/10 backdrop-blur-sm z-10"></div>
       )}
       
       {showLimitModal && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⏳</div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">{t.limitReachedTitle}</h3>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">{t.limitReachedBody}</p>
                    <div className="space-y-3">
                        <button onClick={() => navigate('/plans')} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">{t.limitUpgrade}</button>
                        <button onClick={() => setShowLimitModal(false)} className="w-full py-3 text-gray-500 font-medium hover:text-gray-700">{t.limitReturn}</button>
                    </div>
                </div>
           </div>
       )}

       <div className="flex-1 flex flex-col h-full bg-white/50 relative">
          <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
               <h2 className="font-serif font-bold text-slate-800 flex items-center">
                   <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                   Online Consultation
                   {isPro && <span className="ml-2 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">PRO</span>}
               </h2>
               <div className="flex items-center space-x-2">
                   {messages.length > 0 && (
                       <button onClick={handleClearChat} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       </button>
                   )}
                   <button onClick={() => setIsSettingsOpen(true)} className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50">
                       <span className="text-xs font-semibold hidden md:inline">{t.settings}</span>
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                   </button>
               </div>
          </div>

          <div className="flex-1 overflow-hidden p-4 md:p-6 w-full"> 
            <ChatInterface 
                messages={messages} 
                language={language} 
                isLoading={isLoading} 
                onSendMessage={handleSendMessage}
                onEditMessage={handleEditMessage}
                onRegenerate={handleRegenerate}
                onFeedback={handleFeedback}
                onTTS={handleTTS}
                isPro={isPro}
                usageCount={usageCount}
                onAskOdilbek={handleAskOdilbek}
                initialInputValue={prefilledPrompt}
            />
          </div>
       </div>
    </div>
  );
};

export default ChatPage;
