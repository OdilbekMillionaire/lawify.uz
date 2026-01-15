

import React, { useState, useEffect } from 'react';
import { Language, UserSettings, Message, Attachment } from '../types';
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
}

const ChatPage: React.FC<ChatPageProps> = ({ 
    language, 
    settings, 
    setSettings, 
    onBack,
    initialPrompt,
    onPromptHandled,
    initialMessages,
    isPro
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const t = TRANSLATIONS[language];

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
        userProfileContext 
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

    addMessage(text, 'user', attachment);
    await generateAIResponse(messages, text, attachment);
  };

  const handleRegenerate = async () => {
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
                       <button 
                        onClick={handleClearChat}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Clear Chat"
                       >
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       </button>
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
            />
          </div>
       </div>
    </div>
  );
};

export default ChatPage;