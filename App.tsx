import React, { useState, useEffect } from 'react';
import { Language, UserSettings, View, Message, UserProfile } from './types';
import { INITIAL_SETTINGS } from './constants';
import Layout from './components/Layout';
import LiveSessionModal from './components/LiveSessionModal';
import AuthModal from './components/AuthModal';
import { supabase } from './services/supabaseClient';

// Pages
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import Library from './pages/Library';
import History from './pages/History';
import Topics from './pages/Topics';
import Profile from './pages/Profile';
import Plans from './pages/Plans';

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
        // 1. Try to get the profile
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
            
        if (data) {
            setUserProfile(data);
        } else {
            // 2. If profile doesn't exist (First time login), create it!
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

  const handleRestoreSession = (messages: Message[]) => {
      setRestoredMessages(messages);
      setInitialPrompt('');
      setCurrentView(View.CHAT);
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