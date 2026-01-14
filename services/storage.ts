
import { ChatSession, Message } from "../types";

const STORAGE_KEY = 'lawify_history';

export const saveSession = (messages: Message[]) => {
  if (messages.length === 0) return;

  const history = getHistory();
  const sessionId = messages[0].timestamp.toString(); // Use first message timestamp as ID
  
  // Create a title from the first user message
  const firstUserMsg = messages.find(m => m.role === 'user');
  const title = firstUserMsg ? firstUserMsg.text.slice(0, 40) + (firstUserMsg.text.length > 40 ? '...' : '') : 'New Consultation';

  const newSession: ChatSession = {
    id: sessionId,
    title: title,
    date: Date.now(),
    preview: messages[messages.length - 1].text.slice(0, 60) + '...',
    messages: messages
  };

  // Check if session exists, update it, otherwise add to top
  const existingIndex = history.findIndex(s => s.id === sessionId);
  if (existingIndex >= 0) {
    history[existingIndex] = newSession;
  } else {
    history.unshift(newSession);
  }

  // Limit to 20 saved sessions for local storage sanity
  if (history.length > 20) history.pop();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getHistory = (): ChatSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
};

export const logFeedback = async (messageId: string, userPrompt: string, aiResponse: string, feedbackType: 'like' | 'dislike') => {
    // In a real app, this would send data to an analytics backend (e.g., Supabase, Firebase)
    // for fine-tuning the model later.
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
