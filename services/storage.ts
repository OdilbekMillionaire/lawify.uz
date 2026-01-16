
import { ChatSession, Message } from "../types";

const STORAGE_KEY = 'lawify_history';

export const saveSession = (messages: Message[], type: 'lawyer' | 'odilbek' = 'lawyer', customTitle?: string) => {
  if (messages.length === 0) return;

  const history = getHistory();
  // We use the timestamp of the FIRST message as the unique Session ID
  const sessionId = messages[0].timestamp.toString(); 
  
  // Create a title from the first user message if not provided
  let title = customTitle;
  if (!title) {
    const firstUserMsg = messages.find(m => m.role === 'user');
    title = firstUserMsg ? firstUserMsg.text.slice(0, 40) + (firstUserMsg.text.length > 40 ? '...' : '') : 'New Consultation';
  }

  const lastMsg = messages[messages.length - 1];
  const preview = lastMsg ? (lastMsg.text.slice(0, 60) + '...') : '';

  const newSession: ChatSession = {
    id: sessionId,
    title: title,
    date: Date.now(),
    preview: preview,
    messages: messages,
    type: type
  };

  // Check if session exists, update it, otherwise add to top
  const existingIndex = history.findIndex(s => s.id === sessionId);
  if (existingIndex >= 0) {
    history[existingIndex] = newSession;
  } else {
    history.unshift(newSession);
  }

  // Limit to 50 saved sessions to prevent overflow, but keep more than before since we have 2 types now
  if (history.length > 50) history.pop();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getHistory = (): ChatSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw);
    // Migration for old data that didn't have 'type'
    return parsed.map((s: any) => ({
        ...s,
        type: s.type || 'lawyer'
    }));
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
};

export const getSessionById = (id: string): ChatSession | undefined => {
    const history = getHistory();
    return history.find(s => s.id === id);
}

export const logFeedback = async (messageId: string, userPrompt: string, aiResponse: string, feedbackType: 'like' | 'dislike') => {
    console.group("📝 [Feedback Logged]");
    console.log("Message ID:", messageId);
    console.log("User Input:", userPrompt);
    console.log("AI Response:", aiResponse);
    console.log("Rating:", feedbackType === 'like' ? '👍' : '👎');
    console.log("Timestamp:", new Date().toISOString());
    console.groupEnd();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
};
