
export enum Language {
  UZ = 'uz',
  RU = 'ru',
  EN = 'en'
}

export enum View {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  LIBRARY = 'library',
  HISTORY = 'history',
  TOPICS = 'topics',
  PROFILE = 'profile',
  PLANS = 'plans'
}

export enum LegalArea {
  FAMILY = 'Family',
  CRIMINAL = 'Criminal',
  CIVIL = 'Civil',
  LABOR = 'Labor',
  TAX = 'Tax',
  ADMINISTRATIVE = 'Administrative',
  PROCEDURAL = 'Procedural',
  OTHER = 'Other'
}

export interface UserSettings {
  answerLength: 'Short' | 'Medium' | 'Detailed';
  tone: 'Simple' | 'Professional';
  outputStyle: 'Bullet points' | 'Step-by-step' | 'Paragraphs';
  clarifyingQuestions: boolean;
  documentType: 'General' | 'Contract' | 'Letter' | 'Application';
  perspective: 'Neutral' | 'Pro-Consumer' | 'Pro-Business';
}

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // base64
}

export interface Source {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  attachment?: Attachment;
  isThinking?: boolean;
  sources?: Source[];
  feedback?: 'like' | 'dislike';
}

export interface ChatSession {
  id: string;
  title: string;
  date: number;
  preview: string;
  messages: Message[];
}

export interface LiveConnectionState {
  isConnected: boolean;
  isSpeaking: boolean;
}