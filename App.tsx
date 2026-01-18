import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Language, UserSettings, UserProfile } from './types';
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
import OdilbekPage from './pages/OdilbekPage';
import DocumentStudio from './pages/DocumentStudio';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>(Language.UZ);
  const [settings, setSettings] = useState<UserSettings>(INITIAL_SETTINGS);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Initialize Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user);
      else setAuthLoading(false);
    });

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
      navigate('/');
  };

  const handleStartLive = () => {
      if (!userProfile?.is_pro) {
          alert(language === Language.UZ 
              ? "Jonli suhbat faqat Pro foydalanuvchilar uchun! Iltimos, obuna bo'ling."
              : "Live chat is only for Pro users! Please upgrade.");
          navigate('/plans');
          return;
      }
      setIsLiveOpen(true);
  };

  if (authLoading) {
      return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <>
        <Layout 
            language={language}
            onLanguageChange={setLanguage}
            onStartLive={handleStartLive}
            userProfile={userProfile}
            onLogin={handleLogin}
        >
            <Routes>
                <Route path="/" element={<Dashboard language={language} />} />
                <Route path="/chat" element={
                    <ChatPage 
                        language={language} 
                        settings={settings} 
                        setSettings={setSettings}
                        isPro={userProfile?.is_pro || false}
                    />
                } />
                <Route path="/odilbek" element={<OdilbekPage language={language} />} />
                <Route path="/library" element={<Library language={language} />} />
                <Route path="/studio" element={
                    <DocumentStudio 
                        language={language}
                        isPro={userProfile?.is_pro || false}
                    />
                } />
                <Route path="/topics" element={<Topics language={language} />} />
                <Route path="/history" element={<History language={language} />} />
                <Route path="/profile" element={
                    <Profile 
                        language={language} 
                        settings={settings} 
                        setSettings={setSettings}
                        userProfile={userProfile}
                        onLogin={handleLogin}
                        onLogout={handleLogout}
                        refreshProfile={() => user && fetchProfile(user)}
                    />
                } />
                <Route path="/plans" element={
                    <Plans 
                        language={language} 
                        userProfile={userProfile}
                        onLogin={handleLogin}
                        refreshProfile={() => user && fetchProfile(user)}
                    />
                } />
                {/* Fallback */}
                <Route path="*" element={<Dashboard language={language} />} />
            </Routes>
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