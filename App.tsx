import React, { useState } from 'react';
import { Language, UserSettings, View, Message } from './types';
import { INITIAL_SETTINGS } from './constants';
import Layout from './components/Layout';
import LiveSessionModal from './components/LiveSessionModal';

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
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [restoredMessages, setRestoredMessages] = useState<Message[] | undefined>(undefined);
  
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

  // Render current view
  const renderView = () => {
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
                />
              );
          case View.PLANS:
              return <Plans onNavigate={setCurrentView} language={language} />;
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
            onStartLive={() => setIsLiveOpen(true)}
        >
            {renderView()}
        </Layout>

        <LiveSessionModal 
            isOpen={isLiveOpen} 
            onClose={() => setIsLiveOpen(false)} 
            language={language} 
        />
    </>
  );
};

export default App;