
export enum Language {
  UZ = 'uz',
  RU = 'ru',
  EN = 'en'
}

export enum View {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  ODILBEK = 'odilbek',
  DOCUMENT_STUDIO = 'document_studio', 
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

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_pro: boolean;
  plan_type: 'free' | 'day' | 'week' | 'month' | 'lawyer';
  subscription_end_date: string | null;
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
  type: 'lawyer' | 'odilbek' | 'drafter';
  customData?: any; // Stores document state for drafter
}

// --- DOCUMENT STUDIO TYPES ---

export interface DocSection {
  heading: string;
  content: string;
}

export interface GeneratedDocument {
  title: string;
  sections: DocSection[];
  isComplete: boolean;
}

export interface DrafterResponse {
  chatResponse: string; 
  documentUpdate: GeneratedDocument | null; 
}

// --- NEW TEMPLATE HIERARCHY ---

export interface LegalTemplate {
  id: string;
  title: string;
  description: string;
  templateId: string; // The key to look up in LEGAL_TEMPLATES
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isPro?: boolean;
}

export interface TemplateSubcategory {
  id: string;
  title: { [key in Language]: string };
  templates: LegalTemplate[];
}

export interface TemplateCategory {
  id: string;
  title: { [key in Language]: string };
  icon: string; // Emoji or SVG path
  subcategories: TemplateSubcategory[];
}
