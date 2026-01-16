
import React, { useState, useEffect } from 'react';
import { Language, UserSettings, Message, Attachment, View } from '../types';
import { TRANSLATIONS } from '../constants';
import ChatInterface from '../components/ChatInterface';
import { generateLegalResponse, textToSpeech } from '../services/geminiService';
import { saveSession, logFeedback } from '../services/storage';

interface ChatPageProps {
  language: Language;
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
  onBack: () => void;
  initialPrompt?: string;
  onPromptHandled?: () => void;
  initialMessages?: Message[];
  isPro: boolean;
  onAskOdilbek?: (context: string) => void; // New Prop
}

const ChatPage: React.FC<ChatPageProps> = ({ 
    language, 
    settings, 
    setSettings, 
    onBack,
    initialPrompt,
    onPromptHandled,
    initialMessages,
    isPro,
    onAskOdilbek
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  
  const t = TRANSLATIONS[language];

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

  // Initialize with restored messages if available
  useEffect(() => {
      if (initialMessages) {
          setMessages(initialMessages);
      } else {
          setMessages([]); // Clear if new chat
      }
  }, [initialMessages]);

  // Auto-save history when messages change
  useEffect(() => {
    if (messages.length > 0) {
        saveSession(messages);
    }
  }, [messages]);

  // Handle Initial Prompt (from Template/Topic)
  useEffect(() => {
      if (initialPrompt && initialPrompt.trim() !== '') {
          if (onPromptHandled) onPromptHandled();
      }
  }, [initialPrompt]);

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

  // --- USAGE LIMIT CHECKER (Local Enforcement) ---
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

      // Increment
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
        isPro // PASS PRO FLAG TO SWITCH MODELS
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
    // Feature Gate: Document Uploads
    if (attachment && !isPro) {
        alert(language === Language.UZ 
            ? "Hujjatlarni tahlil qilish faqat Pro foydalanuvchilar uchun! Iltimos, obuna bo'ling."
            : "Document analysis is a Pro feature! Please upgrade to Pro to upload files.");
        return;
    }

    // Feature Gate: Daily Usage Limit
    if (!checkUsageLimit()) {
        return;
    }

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
      
      const updatedMessage: Message = {
          ...messages[msgIndex],
          text: newText,
          timestamp: Date.now()
      };
      
      setMessages([...newHistory, updatedMessage]);
      await generateAIResponse(newHistory, newText, updatedMessage.attachment);
  };

  const handleFeedback = (messageId: string, type: 'like' | 'dislike') => {
      setMessages(prev => prev.map(m => 
          m.id === messageId ? { ...m, feedback: type } : m
      ));
  };

  const handleClearChat = () => {
      if (window.confirm("Are you sure you want to clear this conversation?")) {
          setMessages([]);
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

  // --- PDF EXPORT FUNCTION ---
  const handleExportPDF = () => {
      if (!isPro) {
          alert(language === Language.UZ 
              ? "PDF eksport qilish faqat Pro foydalanuvchilar uchun!" 
              : "Export to PDF is a Pro feature!");
          return;
      }
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
          const content = messages.map(m => `
              <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                  <strong style="color: ${m.role === 'user' ? '#2563eb' : '#059669'};">
                      ${m.role === 'user' ? 'YOU' : 'AI LAWYER'}:
                  </strong>
                  <div style="white-space: pre-wrap; font-family: sans-serif; margin-top: 5px;">
                      ${m.text.replace(/\n/g, '<br/>')}
                  </div>
              </div>
          `).join('');

          printWindow.document.write(`
              <html>
                  <head>
                      <title>Legal Consultation Export - LAWIFY</title>
                      <style>
                          body { font-family: 'Times New Roman', serif; padding: 40px; color: #333; }
                          h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
                          .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #666; }
                      </style>
                  </head>
                  <body>
                      <h1>LAWIFY - Legal Consultation Transcript</h1>
                      <div class="content">${content}</div>
                      <div class="footer">Generated by Lawify AI Legal Assistant. Not a substitute for professional legal counsel.</div>
                      <script>window.print();</script>
                  </body>
              </html>
          `);
          printWindow.document.close();
      }
  };

  return (
    <div className="flex h-full relative">
       {/* Chat Settings Sidebar (Right side, collapsible) */}
       <div className={`fixed inset-y-0 right-0 z-20 w-80 bg-white border-l border-gray-200 transform transition-transform duration-300 ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
          <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="font-serif font-bold text-lg text-slate-800">{t.settings}</h3>
                  <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
              </div>

              {/* Settings Controls */}
              <div className="space-y-8 flex-1">
                 
                 {/* Length */}
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

                 {/* Document Type */}
                 <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.docType}</label>
                    <select 
                        value={settings.documentType}
                        onChange={(e) => setSettings({...settings, documentType: e.target.value as any})}
                        className="w-full text-sm p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 outline-none"
                    >
                        <option value="General">{t.docGeneral}</option>
                        <option value="Contract">{t.docContract}</option>
                        <option value="Letter">{t.docLetter}</option>
                        <option value="Application">{t.docApp}</option>
                    </select>
                 </div>

                 {/* Perspective */}
                 <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.perspective}</label>
                    <div className="flex flex-col space-y-2">
                        {['Neutral', 'Pro-Consumer', 'Pro-Business'].map((p) => (
                             <label key={p} className="flex items-center space-x-3 cursor-pointer group">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${settings.perspective === p ? 'border-blue-600' : 'border-gray-300'}`}>
                                    {settings.perspective === p && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                                </div>
                                <input 
                                    type="radio" 
                                    name="perspective" 
                                    className="hidden" 
                                    checked={settings.perspective === p}
                                    onChange={() => setSettings({...settings, perspective: p as any})} 
                                />
                                <span className={`text-sm ${settings.perspective === p ? 'text-blue-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                    {p === 'Neutral' ? t.persNeutral : p === 'Pro-Consumer' ? t.persConsumer : t.persBusiness}
                                </span>
                             </label>
                        ))}
                    </div>
                 </div>

                 {/* Tone */}
                 <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.tone}</label>
                     <div className="grid grid-cols-2 gap-2">
                         {['Simple', 'Professional'].map((tone) => (
                            <button
                                key={tone}
                                onClick={() => setSettings({...settings, tone: tone as any})}
                                className={`py-2 text-xs rounded-lg border transition-all ${
                                    settings.tone === tone 
                                    ? 'bg-slate-700 border-slate-700 text-white' 
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {tone === 'Simple' ? t.simple : t.professional}
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

       {/* Overlay for settings */}
       {isSettingsOpen && (
           <div onClick={() => setIsSettingsOpen(false)} className="fixed inset-0 bg-black/10 backdrop-blur-sm z-10"></div>
       )}
       
       {/* Limit Reached Modal (Polite) */}
       {showLimitModal && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        ⏳
                    </div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">{t.limitReachedTitle}</h3>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        {t.limitReachedBody}
                    </p>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={() => {
                                // Navigate to plans logic would go here, effectively we rely on user clicking "Plans" in sidebar
                                // but we can simulate navigation if we had access to setCurrentView or just close and let them navigate
                                setShowLimitModal(false);
                                // Hacky way to switch view if needed or just close
                            }} 
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
                        >
                            {t.limitUpgrade}
                        </button>
                        <button 
                            onClick={() => setShowLimitModal(false)}
                            className="w-full py-3 text-gray-500 font-medium hover:text-gray-700"
                        >
                            {t.limitReturn}
                        </button>
                    </div>
                </div>
           </div>
       )}

       {/* Chat Area */}
       <div className="flex-1 flex flex-col h-full bg-white/50 relative">
          {/* Chat Toolbar */}
          <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
               <h2 className="font-serif font-bold text-slate-800 flex items-center">
                   <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                   Online Consultation
                   {isPro && <span className="ml-2 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">PRO</span>}
               </h2>
               <div className="flex items-center space-x-2">
                   {messages.length > 0 && (
                       <>
                           {/* PDF EXPORT BUTTON */}
                           <button 
                                onClick={handleExportPDF}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Export to PDF (Pro)"
                           >
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                           </button>
                           
                           <button 
                            onClick={handleClearChat}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Clear Chat"
                           >
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                           </button>
                       </>
                   )}
                   <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
                   >
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
                initialInputValue={initialPrompt}
                isPro={isPro}
                usageCount={usageCount}
                onAskOdilbek={onAskOdilbek}
            />
          </div>
       </div>
    </div>
  );
};

export default ChatPage;
