
import React, { useState, useEffect } from 'react';
import { Language, UserSettings, View, Message, UserProfile } from './types';
import { INITIAL_SETTINGS } from './constants';
import Layout from './components/Layout';
import LiveSessionModal from './components/LiveSessionModal';
import AuthModal from './components/AuthModal';
import { supabase } from './services/supabaseClient';
import { saveSession } from './services/storage'; // Import saveSession

// Pages
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import Library from './pages/Library';
import History from './pages/History';
import Topics from './pages/Topics';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import OdilbekPage from './pages/OdilbekPage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [language, setLanguage] = useState<Language>(Language.UZ);
  const [settings, setSettings] = useState<UserSettings>(INITIAL_SETTINGS);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [restoredMessages, setRestoredMessages] = useState<Message[] | undefined>(undefined);
  
  // Auth State
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Initialize Auth
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user);
      else setAuthLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
          fetchProfile(session.user);
          setIsAuthModalOpen(false);
      } else {
          setUserProfile(null);
          setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (currentUser: any) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
            
        if (data) {
            setUserProfile(data);
        } else {
            const newProfile = {
                id: currentUser.id,
                email: currentUser.email,
                full_name: currentUser.email?.split('@')[0] || 'User',
                is_pro: false,
                plan_type: 'free'
            };
            
            const { data: createdProfile, error: createError } = await supabase
                .from('profiles')
                .insert([newProfile])
                .select()
                .single();
            
            if (!createError && createdProfile) {
                setUserProfile(createdProfile);
            }
        }
    } catch (e) {
        console.error("Profile fetch error", e);
    } finally {
        setAuthLoading(false);
    }
  };

  const handleLogin = () => {
      setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setCurrentView(View.DASHBOARD);
  };

  const handleTemplateSelect = (prompt: string) => {
      setInitialPrompt(prompt);
      setRestoredMessages(undefined);
      setCurrentView(View.CHAT);
  };

  const handleTopicSelect = (prompt: string) => {
    setInitialPrompt(prompt);
    setRestoredMessages(undefined);
    setCurrentView(View.CHAT);
  };

  const handleRestoreSession = (messages: Message[], type: 'lawyer' | 'odilbek') => {
      setRestoredMessages(messages);
      setInitialPrompt('');
      if (type === 'odilbek') {
          setCurrentView(View.ODILBEK);
      } else {
          setCurrentView(View.CHAT);
      }
  };

  const handleStartLive = () => {
      if (!userProfile?.is_pro) {
          alert(language === Language.UZ 
              ? "Jonli suhbat faqat Pro foydalanuvchilar uchun! Iltimos, obuna bo'ling."
              : "Live chat is only for Pro users! Please upgrade.");
          setCurrentView(View.PLANS);
          return;
      }
      setIsLiveOpen(true);
  };

  const handleOpenOdilbek = (context: string) => {
      // Create a new session for Odilbek with the context pre-loaded
      const sessionId = Date.now().toString();
      const initialMsgs: Message[] = [
          {
              id: sessionId,
              role: 'user',
              text: `Please explain this context: "${context.slice(0, 100)}..."`, // Hidden prompt basically
              timestamp: Date.now() - 1000
          },
          {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: language === Language.UZ 
                ? `Assalomu alaykum! Men Odilbekman. Advokatimizning maslahatini tushunishga qiynalyapsizmi? Menga yuboring, oddiy qilib tushuntirib beraman.\n\n**Advice Context:**\n> *${context.slice(0, 300)}...*`
                : `Hello! I'm Odilbek. Is the lawyer's advice a bit complex? Let me break it down for you.\n\n**Advice Context:**\n> *${context.slice(0, 300)}...*`,
              timestamp: Date.now()
          }
      ];
      
      // Save immediately to history so it persists
      saveSession(initialMsgs, 'odilbek', `Explanation: ${context.slice(0, 30)}...`);
      setRestoredMessages(initialMsgs);
      setCurrentView(View.ODILBEK);
  };

  // Render current view
  const renderView = () => {
      if (authLoading) {
          return <div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
      }

      switch(currentView) {
          case View.DASHBOARD:
              return (
                <Dashboard 
                    onNavigate={setCurrentView} 
                    language={language} 
                    onSelectQuickLink={handleTopicSelect} 
                />
              );
          case View.CHAT:
              return (
                <ChatPage 
                    language={language} 
                    settings={settings} 
                    setSettings={setSettings}
                    onBack={() => setCurrentView(View.DASHBOARD)}
                    initialPrompt={initialPrompt}
                    onPromptHandled={() => setInitialPrompt('')}
                    initialMessages={restoredMessages}
                    isPro={userProfile?.is_pro || false}
                    onAskOdilbek={handleOpenOdilbek}
                />
              );
          case View.ODILBEK:
              return (
                  <OdilbekPage
                      language={language}
                      onBack={() => setCurrentView(View.CHAT)}
                      initialMessages={restoredMessages} // Pass restored/new session
                  />
              );
          case View.LIBRARY:
              return <Library onNavigate={setCurrentView} onSelectTemplate={handleTemplateSelect} language={language} />;
          case View.TOPICS:
              return <Topics onNavigate={setCurrentView} onSelectTopic={handleTopicSelect} language={language} />;
          case View.HISTORY:
              return <History onNavigate={setCurrentView} language={language} onRestore={handleRestoreSession} />;
          case View.PROFILE:
              return (
                <Profile 
                    onNavigate={setCurrentView} 
                    language={language} 
                    settings={settings} 
                    setSettings={setSettings}
                    userProfile={userProfile}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                    refreshProfile={() => user && fetchProfile(user)}
                />
              );
          case View.PLANS:
              return (
                <Plans 
                    onNavigate={setCurrentView} 
                    language={language} 
                    userProfile={userProfile}
                    onLogin={handleLogin}
                    refreshProfile={() => user && fetchProfile(user)}
                />
              );
          default:
              return <Dashboard onNavigate={setCurrentView} language={language} onSelectQuickLink={handleTopicSelect} />;
      }
  };

  return (
    <>
        <Layout 
            currentView={currentView} 
            onNavigate={setCurrentView}
            language={language}
            onLanguageChange={setLanguage}
            onStartLive={handleStartLive}
            userProfile={userProfile}
            onLogin={handleLogin}
        >
            {renderView()}
        </Layout>

        <LiveSessionModal 
            isOpen={isLiveOpen} 
            onClose={() => setIsLiveOpen(false)} 
            language={language} 
        />

        <AuthModal 
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            language={language}
        />
    </>
  );
};

export default App;
