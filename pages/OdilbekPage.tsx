
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Language, Message, Attachment } from '../types';
import { TRANSLATIONS } from '../constants';
import ChatInterface from '../components/ChatInterface';
import { generateOdilbekResponse, textToSpeech } from '../services/geminiService';
import { saveSession, cleanText, logFeedback } from '../services/storage';

interface OdilbekPageProps {
  language: Language;
}

const OdilbekPage: React.FC<OdilbekPageProps> = ({ language }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const t = TRANSLATIONS[language];
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial session state
  useEffect(() => {
      const state = location.state as { restoredMessages?: Message[], legalContext?: string } | null;

      if (state?.restoredMessages && state.restoredMessages.length > 0) {
          setMessages(state.restoredMessages);
      } else if (state?.legalContext) {
          // New explanation session from ChatPage
          
          // CLEAN THE TEXT before displaying in the User Bubble
          const displayContext = cleanText(state.legalContext);

          const contextMsg: Message = {
              id: Date.now().toString(),
              role: 'user',
              text: displayContext,
              timestamp: Date.now()
          };
          setMessages([contextMsg]);
          
          // Trigger generation immediately
          const generate = async () => {
              setIsLoading(true);
              try {
                  const responseText = await generateOdilbekResponse(
                      displayContext, 
                      language, 
                      "", 
                      displayContext
                  );
                  
                  const responseMsg: Message = {
                      id: (Date.now() + 1).toString(),
                      role: 'model',
                      text: responseText,
                      timestamp: Date.now() + 1
                  };
                  setMessages(prev => [...prev, responseMsg]);
              } catch (error) {
                  console.error(error);
                  const errorMsg: Message = {
                      id: (Date.now() + 1).toString(),
                      role: 'model',
                      text: "Sorry, I'm having trouble explaining right now.",
                      timestamp: Date.now() + 1
                  };
                  setMessages(prev => [...prev, errorMsg]);
              } finally {
                  setIsLoading(false);
              }
          };
          generate();

      } else {
          // Default welcome message if opened directly
          const welcomeMsg: Message = {
            id: Date.now().toString(),
            role: 'model',
            text: t.odilbekWelcome,
            timestamp: Date.now()
          };
          setMessages([welcomeMsg]);
      }
  }, [location.state, t, language]);

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
        
        const responseText = await generateOdilbekResponse(
            text, 
            language, 
            historyStr,
            "" 
        );

        addMessage(responseText, 'model');
    } catch (error) {
        console.error(error);
        addMessage("Sorry, I'm having trouble connecting right now.", 'model');
    } finally {
        setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
      // Find the last user message
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      if (!lastUserMsg) return;

      setIsLoading(true);
      
      // Keep messages up to the last user message
      const newMessages = messages.filter(m => m.timestamp <= lastUserMsg.timestamp);
      setMessages(newMessages);

      try {
          const historyStr = newMessages.slice(0, -1).map(m => `${m.role}: ${m.text}`).join('\n');
          const responseText = await generateOdilbekResponse(
              lastUserMsg.text,
              language,
              historyStr,
              "" // Context is implicitly in history if it was the first message
          );
          
          const responseMsg: Message = {
              id: Date.now().toString(),
              role: 'model',
              text: responseText,
              timestamp: Date.now()
          };
          setMessages(prev => [...prev, responseMsg]);
      } catch (error) {
          console.error(error);
          addMessage("Sorry, regeneration failed.", 'model');
      } finally {
          setIsLoading(false);
      }
  };

  const handleFeedback = (messageId: string, type: 'like' | 'dislike') => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, feedback: type } : m));
      const msg = messages.find(m => m.id === messageId);
      if (msg) {
          logFeedback(messageId, "Odilbek Chat", msg.text, type);
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
          <div className="border-b border-amber-100 bg-white/60 backdrop-blur-sm shrink-0 flex flex-col">
               <div className="h-14 flex items-center justify-between px-6">
                   <button 
                       onClick={() => navigate('/chat')}
                       className="flex items-center text-gray-500 hover:text-amber-600 transition-colors font-medium text-sm"
                   >
                       <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                       {language === Language.UZ ? "Yuristga qaytish" : "Back to Lawyer"}
                   </button>
                   <h2 className="font-serif font-bold text-amber-900 flex items-center">
                       <span className="text-xl mr-2">🧑‍🏫</span>
                       Odilbek AI
                   </h2>
                   <div className="w-16"></div>
               </div>
               
               {/* Welcome / Instruction Banner */}
               <div className="px-6 pb-4">
                   <div className="bg-amber-100/80 border border-amber-200 rounded-xl p-3 text-center shadow-sm">
                       <p className="text-xs md:text-sm text-amber-900 font-medium">
                           {language === Language.UZ 
                               ? "Yuristning javobi tushunarsiz bo'ldimi? Matnni shu yerga nusxalab tashlang, men oddiy so'zlar bilan tushuntirib beraman." 
                               : language === Language.RU
                               ? "Совет юриста показался сложным? Скопируйте текст сюда, и я объясню всё простыми словами."
                               : "Was the lawyer's advice confusing? Paste it here, and I'll explain it in simple terms."}
                       </p>
                   </div>
               </div>
          </div>

          <div className="flex-1 overflow-hidden p-4 md:p-6 w-full"> 
            <ChatInterface 
                messages={messages} 
                language={language} 
                isLoading={isLoading} 
                onSendMessage={handleSendMessage}
                onEditMessage={() => {}} 
                onRegenerate={handleRegenerate}
                onFeedback={handleFeedback}
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
