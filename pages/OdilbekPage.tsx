
import React, { useState, useEffect } from 'react';
import { Language, Message, Attachment } from '../types';
import { TRANSLATIONS } from '../constants';
import ChatInterface from '../components/ChatInterface';
import { generateOdilbekResponse, textToSpeech } from '../services/geminiService';
import { saveSession } from '../services/storage';

interface OdilbekPageProps {
  language: Language;
  onBack: () => void;
  initialMessages?: Message[];
}

const OdilbekPage: React.FC<OdilbekPageProps> = ({ 
    language, 
    onBack,
    initialMessages
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const t = TRANSLATIONS[language];

  // Load initial session state
  useEffect(() => {
      if (initialMessages && initialMessages.length > 0) {
          setMessages(initialMessages);
      } else {
          // If no history passed, default init with a welcome message
          const welcomeMsg: Message = {
            id: Date.now().toString(),
            role: 'model',
            text: t.odilbekWelcome,
            timestamp: Date.now()
          };
          setMessages([welcomeMsg]);
      }
  }, [initialMessages, t]);

  // Auto-save history for Odilbek sessions
  useEffect(() => {
    if (messages.length > 0) {
        saveSession(messages, 'odilbek');
    }
  }, [messages]);

  const addMessage = (text: string, role: 'user' | 'model', attachment?: Attachment) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      role,
      timestamp: Date.now(),
      attachment,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async (text: string, attachment?: Attachment) => {
    addMessage(text, 'user', attachment);
    setIsLoading(true);

    try {
        const historyStr = messages.map(m => `${m.role}: ${m.text}`).join('\n');
        
        // We assume the context is embedded in the first message(s) of the history
        // so we just pass the history string which contains the context.
        const responseText = await generateOdilbekResponse(
            text, 
            language, 
            historyStr,
            "" // Context is already in historyStr thanks to initialization in App.tsx
        );

        addMessage(responseText, 'model');
    } catch (error) {
        console.error(error);
        addMessage("Sorry, I'm having trouble connecting right now.", 'model');
    } finally {
        setIsLoading(false);
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
    <div className="flex h-full relative bg-amber-50/30">
       <div className="flex-1 flex flex-col h-full relative">
          <div className="h-14 border-b border-amber-100 flex items-center justify-between px-6 bg-white/60 backdrop-blur-sm shrink-0">
               <button 
                   onClick={onBack}
                   className="flex items-center text-gray-500 hover:text-amber-600 transition-colors font-medium text-sm"
               >
                   <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                   Back
               </button>
               <h2 className="font-serif font-bold text-amber-900 flex items-center">
                   <span className="text-xl mr-2">🧑‍🏫</span>
                   Odilbek AI
               </h2>
               <div className="w-16"></div>
          </div>

          <div className="flex-1 overflow-hidden p-4 md:p-6 w-full"> 
            <ChatInterface 
                messages={messages} 
                language={language} 
                isLoading={isLoading} 
                onSendMessage={handleSendMessage}
                onEditMessage={() => {}} 
                onTTS={handleTTS}
                isOdilbekMode={true}
                isPro={true} // Odilbek is unlimited for everyone
                usageCount={0} 
            />
          </div>
       </div>
    </div>
  );
};

export default OdilbekPage;
