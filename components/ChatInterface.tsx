import React, { useRef, useEffect, useState, useMemo } from 'react';
import { parse } from 'marked';
import { Message, Language, Attachment } from '../types';
import { TRANSLATIONS } from '../constants';

interface ChatInterfaceProps {
  messages: Message[];
  language: Language;
  isLoading: boolean;
  onSendMessage: (text: string, attachment?: Attachment) => void;
  onEditMessage: (id: string, newText: string) => void;
  onTTS: (text: string) => void;
  onRegenerate?: () => void;
  onFeedback?: (messageId: string, type: 'like' | 'dislike') => void;
  initialInputValue?: string;
}

// Utility to escape regex characters
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  language, 
  isLoading, 
  onSendMessage,
  onEditMessage,
  onTTS,
  onRegenerate,
  onFeedback,
  initialInputValue
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'model'>('all');
  const [filterDate, setFilterDate] = useState<'all' | '24h' | 'week'>('all');

  // Editing state
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInputText, setEditInputText] = useState('');

  // Expansion state for Read More
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  // Copy Feedback State
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const t = TRANSLATIONS[language];

  // Effect to handle pre-filling the input
  useEffect(() => {
    if (initialInputValue) {
      setInputText(initialInputValue);
    }
  }, [initialInputValue]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Only scroll to bottom if not searching and not editing
    if (!searchQuery && !editingMessageId && filterRole === 'all' && filterDate === 'all') {
        scrollToBottom();
    }
  }, [messages, isLoading, searchQuery, editingMessageId, filterRole, filterDate]);

  const handleSend = () => {
    if (!inputText.trim() && !selectedAttachment) return;
    onSendMessage(inputText, selectedAttachment || undefined);
    setInputText('');
    setSelectedAttachment(null);
    setUploadError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Edit Handlers
  const startEditing = (msg: Message) => {
      setEditingMessageId(msg.id);
      setEditInputText(msg.text);
  };

  const cancelEditing = () => {
      setEditingMessageId(null);
      setEditInputText('');
  };

  const saveEdit = (id: string) => {
      if (editInputText.trim()) {
          onEditMessage(id, editInputText);
          setEditingMessageId(null);
          setEditInputText('');
      }
  };

  // Read More Handlers
  const toggleExpand = (id: string) => {
      const newExpanded = new Set(expandedMessages);
      if (newExpanded.has(id)) {
          newExpanded.delete(id);
      } else {
          newExpanded.add(id);
      }
      setExpandedMessages(newExpanded);
  };

  const handleShare = async (text: string) => {
      if (navigator.share) {
          try {
              await navigator.share({
                  title: 'Lawify Legal Advice',
                  text: text,
              });
          } catch (error) {
              console.log('Error sharing', error);
          }
      } else {
          handleCopy(text, 'share_fallback');
      }
  };

  const handleCopy = (text: string, messageId: string) => {
      navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000); // Reset after 2 seconds
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isDoc: boolean) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (file) {
      // Size check (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
          setUploadError("File is too large. Max size is 5MB.");
          e.target.value = ''; // Reset input
          return;
      }

      // Valid mime types
      const validTypes = isDoc 
        ? ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'] 
        : ['image/jpeg', 'image/png', 'image/webp'];

      if (!validTypes.includes(file.type) && !file.name.endsWith('.docx')) { // Basic check for docx sometimes missing mime type
          setUploadError(isDoc ? "Invalid document type. PDF, DOCX, TXT only." : "Invalid image type. JPG, PNG, WEBP only.");
          e.target.value = '';
          return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        try {
            const base64String = (reader.result as string).split(',')[1];
            setSelectedAttachment({
                name: file.name,
                mimeType: file.type || (file.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/octet-stream'),
                data: base64String
            });
        } catch (err) {
            setUploadError("Failed to read file.");
            console.error("File read error", err);
        }
      };
      reader.onerror = () => {
          setUploadError("Error reading file.");
      }
      reader.readAsDataURL(file);
    }
  };

  // --- Voice Recording Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
           const base64String = (reader.result as string).split(',')[1];
           onSendMessage("", {
               name: "voice_message.webm",
               mimeType: "audio/webm",
               data: base64String
           });
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert(t.audioPermission); 
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
      if (isRecording) {
          stopRecording();
      } else {
          startRecording();
      }
  };

  // --- Highlighting Logic ---
  const highlightText = (text: string, query: string) => {
      if (!query.trim()) return text;
      const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
      return parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
              ? <span key={i} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">{part}</span> 
              : part
      );
  };

  const highlightHtml = (htmlContent: string, query: string) => {
      if (!query.trim()) return htmlContent;
      // Regex to match text content that is NOT inside an HTML tag
      const regex = new RegExp(`(${escapeRegExp(query)})(?![^<]*>)`, 'gi');
      return htmlContent.replace(regex, '<mark class="bg-yellow-200 text-gray-900 rounded-sm">$1</mark>');
  };

  // Helper to categorize sources
  const renderSources = (sources: any[]) => {
      const officialSources = sources.filter(s => s.uri.includes('lex.uz') || s.uri.includes('norma.uz') || s.uri.includes('gov.uz'));
      const otherSources = sources.filter(s => !s.uri.includes('lex.uz') && !s.uri.includes('norma.uz') && !s.uri.includes('gov.uz'));
      
      return (
          <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                  {t.sourcesTitle}
              </p>
              
              {officialSources.length > 0 && (
                  <div className="flex flex-col space-y-1">
                      <span className="text-[10px] font-semibold text-green-800 bg-green-50 px-2 py-0.5 rounded w-fit">Government Sources</span>
                      <div className="flex flex-wrap gap-2">
                        {officialSources.map((source, idx) => (
                            <a 
                                key={`off-${idx}`} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-xs border border-blue-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label={`Source: ${source.title}`}
                            >
                                <span className="font-semibold truncate max-w-[200px]">{source.title}</span>
                                <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                        ))}
                      </div>
                  </div>
              )}

              {otherSources.length > 0 && (
                  <div className="flex flex-col space-y-1 mt-2">
                      <span className="text-[10px] font-semibold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded w-fit">Reference Material</span>
                      <div className="flex flex-wrap gap-2">
                        {otherSources.map((source, idx) => (
                            <a 
                                key={`oth-${idx}`} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg text-xs border border-indigo-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label={`Reference: ${source.title}`}
                            >
                                <span className="truncate max-w-[200px] font-medium">{source.title}</span>
                                <svg className="w-3 h-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                        ))}
                      </div>
                  </div>
              )}
          </div>
      );
  }

  // Filter messages based on search, role, and date
  const filteredMessages = useMemo(() => {
      let filtered = messages;

      // 1. Search Query
      if (searchQuery) {
          filtered = filtered.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      // 2. Role Filter
      if (filterRole !== 'all') {
          filtered = filtered.filter(m => m.role === filterRole);
      }

      // 3. Date Filter
      if (filterDate !== 'all') {
          const now = Date.now();
          const oneDay = 24 * 60 * 60 * 1000;
          const oneWeek = 7 * oneDay;
          
          if (filterDate === '24h') {
              filtered = filtered.filter(m => (now - m.timestamp) < oneDay);
          } else if (filterDate === 'week') {
              filtered = filtered.filter(m => (now - m.timestamp) < oneWeek);
          }
      }

      return filtered;
  }, [messages, searchQuery, filterRole, filterDate]);

  return (
    <div className="flex flex-col h-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
      
      {/* Search and Filter Bar */}
      {messages.length > 0 && (
          <div className="px-4 py-2 border-b border-gray-100 bg-white flex items-center space-x-2">
              <div className="relative flex-1">
                  <input
                      type="text"
                      placeholder="Search in chat..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-300 transition-colors text-gray-800 placeholder-gray-500"
                      aria-label="Search chat history"
                  />
                  <svg className="w-4 h-4 text-gray-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                      >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                  )}
              </div>
              
              <div className="relative flex items-center space-x-2">
                  <div className="relative group">
                      <svg className="w-5 h-5 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                          Filters apply to the current session only.
                      </div>
                  </div>

                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg border transition-colors ${showFilters || filterRole !== 'all' || filterDate !== 'all' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    aria-label="Filter options"
                    aria-expanded={showFilters}
                  >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                  </button>

                  {/* Filter Popover */}
                  {showFilters && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-3 animate-fade-in">
                          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">{t.filterTitle}</h4>
                          
                          <div className="mb-3">
                              <label className="text-xs text-gray-500 block mb-1">{t.filterRole}</label>
                              <select 
                                value={filterRole} 
                                onChange={(e) => setFilterRole(e.target.value as any)}
                                className="w-full text-xs border border-gray-200 rounded p-1 text-gray-700 bg-gray-50"
                              >
                                  <option value="all">{t.filterAll}</option>
                                  <option value="user">{t.filterUser}</option>
                                  <option value="model">{t.filterAI}</option>
                              </select>
                          </div>

                          <div>
                              <label className="text-xs text-gray-500 block mb-1">{t.filterDate}</label>
                              <select 
                                value={filterDate} 
                                onChange={(e) => setFilterDate(e.target.value as any)}
                                className="w-full text-xs border border-gray-200 rounded p-1 text-gray-700 bg-gray-50"
                              >
                                  <option value="all">{t.filterAllTime}</option>
                                  <option value="24h">{t.filterLast24h}</option>
                                  <option value="week">{t.filterLastWeek}</option>
                              </select>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-6 animate-fade-in-up">
            <div className="bg-white p-6 rounded-full shadow-sm border border-gray-100">
                 <svg className="w-16 h-16 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="5" r="2" strokeWidth="1" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 7v10M8 21h8M12 17l-4 4M12 17l4 4" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 9l-3 2v3m0-3l3 2v3m-3-5h3" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 7l-6 2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 7l6-2v-2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M18 5v6l-1 1m2-1l1 1m-1-1v4" />
                   </svg>
            </div>
            <div className="text-center max-w-sm">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">{t.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t.subtitle}</p>
            </div>
            {/* Connected Sources Badge */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-emerald-50 to-green-50 px-5 py-3 rounded-xl shadow-sm border border-emerald-100">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <div className="flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                        {language === Language.UZ ? "O'ZBEKISTONNING ENG YAXSHI RASMIY AI YURISTI" : "UZBEKISTAN'S PREMIER AI LEGAL ADVISOR"}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">
                        {language === Language.UZ ? "100% O'zbekiston qonunchiligi asosida" : "100% Based on Uzbekistan Legislation"}
                    </span>
                </div>
                 <svg className="w-6 h-6 text-emerald-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
        )}
        
        {filteredMessages.map((msg) => {
            const isEditing = editingMessageId === msg.id;
            const isExpanded = expandedMessages.has(msg.id);
            const isLongMessage = msg.text.length > 500;
            
            // Only truncate plain text logic if we aren't using CSS expansion
            // But we will use CSS expansion now, so we render full text hidden by CSS
            
            return (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-message-in`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-sm relative group ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}
                >
                  {/* EDIT MODE (User) */}
                  {isEditing ? (
                      <div className="w-full min-w-[300px]">
                          <textarea 
                             value={editInputText}
                             onChange={(e) => setEditInputText(e.target.value)}
                             className="w-full p-2 text-slate-800 bg-white rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                             rows={3}
                             aria-label="Edit message"
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                              <button onClick={cancelEditing} className="px-3 py-1 text-xs bg-white/20 hover:bg-white/30 rounded text-white border border-white/50">Cancel</button>
                              <button onClick={() => saveEdit(msg.id)} className="px-3 py-1 text-xs bg-white text-blue-600 font-bold rounded shadow-sm">Save & Regenerate</button>
                          </div>
                      </div>
                  ) : (
                      <>
                          {/* Attachments */}
                          {msg.attachment && msg.attachment.mimeType.startsWith('image/') && (
                             <img src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} alt="User upload" className="max-w-full h-auto rounded-lg mb-3 border border-blue-400/30" />
                          )}
                          {msg.attachment && msg.attachment.mimeType.startsWith('audio/') && (
                             <div className="flex items-center space-x-2 bg-white/20 p-2 rounded-lg mb-3 border border-white/20">
                                 <svg className="w-5 h-5 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                 <span className="text-xs font-medium">Voice Message</span>
                             </div>
                          )}
                          {msg.attachment && !msg.attachment.mimeType.startsWith('image/') && !msg.attachment.mimeType.startsWith('audio/') && (
                             <div className="flex items-center space-x-2 bg-white/10 p-2 rounded-lg mb-3 border border-white/20">
                                 <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                 <span className="text-xs truncate max-w-[150px] font-medium">{msg.attachment.name}</span>
                             </div>
                          )}

                          {/* Render content based on role: User gets plain text, Model gets Markdown */}
                          {msg.role === 'user' ? (
                             <div className="whitespace-pre-wrap">
                                 {highlightText(msg.text || (msg.attachment?.mimeType.startsWith('audio/') ? "(Audio sent)" : ""), searchQuery)}
                                 {/* Edit Button for User */}
                                 <button 
                                    onClick={() => startEditing(msg)}
                                    className="absolute -left-8 top-2 text-gray-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    title="Edit Message"
                                    aria-label="Edit message"
                                 >
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                 </button>
                             </div>
                          ) : (
                            <div className="relative">
                                {/* Animated Container */}
                                <div 
                                    className={`relative transition-[max-height] duration-500 ease-in-out overflow-hidden ${isExpanded || !isLongMessage ? 'max-h-[5000px]' : 'max-h-[200px]'}`}
                                >
                                    <div 
                                        className="prose prose-sm prose-slate max-w-none break-words leading-relaxed prose-p:my-2 prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mt-4 prose-headings:mb-2 prose-a:text-blue-600 prose-a:font-medium prose-strong:text-slate-900 prose-ul:my-2 prose-li:my-1"
                                        dangerouslySetInnerHTML={{ __html: highlightHtml(parse(msg.text) as string, searchQuery) }} 
                                    />
                                    {/* Gradient overlay when collapsed */}
                                    {isLongMessage && !isExpanded && (
                                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                                    )}
                                </div>

                                {isLongMessage && (
                                    <button 
                                        onClick={() => toggleExpand(msg.id)}
                                        className="text-blue-600 text-xs font-semibold hover:underline mt-2 inline-flex items-center z-10 relative"
                                        aria-expanded={isExpanded}
                                    >
                                        {isExpanded ? "Show Less" : "Read More"}
                                        <svg className={`w-3 h-3 ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </button>
                                )}
                            </div>
                          )}
                          
                          {/* SOURCES SECTION */}
                          {msg.role === 'model' && msg.sources && msg.sources.length > 0 && renderSources(msg.sources)}

                          {msg.role === 'model' && (
                            <div className="mt-4 pt-2 border-t border-gray-50 flex items-center justify-between">
                                 {/* Feedback Actions */}
                                 <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={() => onFeedback && onFeedback(msg.id, 'like')}
                                        className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                                            msg.feedback === 'like' 
                                            ? 'text-green-600 bg-green-100 shadow-sm ring-1 ring-green-200' 
                                            : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                                        }`} 
                                        title="Helpful"
                                        aria-label="Mark as helpful"
                                        aria-pressed={msg.feedback === 'like'}
                                    >
                                        <svg className="w-4 h-4" fill={msg.feedback === 'like' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                                    </button>
                                    <button 
                                        onClick={() => onFeedback && onFeedback(msg.id, 'dislike')}
                                        className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                                            msg.feedback === 'dislike' 
                                            ? 'text-red-600 bg-red-100 shadow-sm ring-1 ring-red-200' 
                                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                        }`}
                                        title="Not Helpful"
                                        aria-label="Mark as not helpful"
                                        aria-pressed={msg.feedback === 'dislike'}
                                    >
                                        <svg className="w-4 h-4" fill={msg.feedback === 'dislike' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>
                                    </button>
                                    <button 
                                        onClick={onRegenerate}
                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all transform hover:scale-110" 
                                        title="Regenerate"
                                        aria-label="Regenerate response"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                    </button>
                                 </div>

                                 {/* Utility Actions */}
                                 <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={() => handleShare(msg.text)}
                                        className="text-gray-400 hover:text-blue-600 transition-colors text-xs flex items-center px-2 py-1 rounded hover:bg-gray-50"
                                        title="Share"
                                        aria-label="Share message"
                                    >
                                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                         Share
                                    </button>
                                    <button 
                                        className={`text-xs flex items-center px-2 py-1 rounded transition-colors ${
                                            copiedMessageId === msg.id 
                                            ? 'text-green-600 bg-green-50' 
                                            : 'text-gray-400 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                        title="Copy to clipboard"
                                        onClick={() => handleCopy(msg.text, msg.id)}
                                        aria-label="Copy to clipboard"
                                    >
                                        {copiedMessageId === msg.id ? (
                                            <>
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                                Copy
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        onClick={() => onTTS(msg.text)}
                                        className="text-gray-400 hover:text-blue-600 transition-colors text-xs flex items-center px-2 py-1 rounded hover:bg-gray-50"
                                        title="Speak"
                                        aria-label="Listen to message"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                                        Listen
                                    </button>
                                </div>
                            </div>
                          )}
                      </>
                  )}
                </div>
              </div>
            );
        })}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-none px-6 py-4 border border-gray-100 shadow-sm flex items-center space-x-3 animate-message-in">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></div>
              </div>
              <span className="text-sm font-medium text-gray-600">{t.thinking}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-100">
        {selectedAttachment && (
            <div className="flex items-center mb-2 p-2 bg-blue-50 rounded-lg border border-blue-100 animate-slide-up">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                <span className="text-xs text-blue-700 font-medium flex-1 truncate">{selectedAttachment.name}</span>
                <button onClick={() => setSelectedAttachment(null)} className="text-red-400 hover:text-red-600" aria-label="Remove attachment">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        )}
        
        {/* Error Feedback */}
        {uploadError && (
            <div className="mb-2 px-3 py-2 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200 flex items-center animate-fade-in">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {uploadError}
                <button onClick={() => setUploadError(null)} className="ml-auto text-red-400 hover:text-red-800">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        )}

        <div className="flex items-end space-x-2">
          <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all flex items-center p-2">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => handleFileChange(e, false)} 
                accept="image/jpeg,image/png,image/webp" 
                className="hidden" 
            />
             <input 
                type="file" 
                ref={docInputRef} 
                onChange={(e) => handleFileChange(e, true)} 
                accept=".pdf,.doc,.docx,.txt" 
                className="hidden" 
            />
            
            {/* Upload Buttons */}
            <div className="flex space-x-1 border-r border-gray-200 pr-2 mr-2">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-gray-500 hover:text-blue-600 transition-colors rounded-xl hover:bg-gray-100"
                    title={t.uploadImage}
                    aria-label={t.uploadImage}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </button>
                <button 
                    onClick={() => docInputRef.current?.click()}
                    className="p-3 text-gray-500 hover:text-blue-600 transition-colors rounded-xl hover:bg-gray-100"
                    title={t.uploadDoc}
                    aria-label={t.uploadDoc}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Listening..." : t.inputPlaceholder}
              rows={1}
              className={`flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 py-3 px-2 text-slate-800 placeholder-gray-500 scrollbar-hide text-base ${isRecording ? 'animate-pulse text-red-500' : ''}`}
              style={{ minHeight: '48px' }}
              disabled={isRecording}
              aria-label="Message input"
            />
          </div>

          {/* Record Button */}
           <button
            onClick={toggleRecording}
            disabled={isLoading}
            className={`p-4 rounded-full flex items-center justify-center transition-all shadow-md border ${
              isRecording
                ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' 
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
             {isRecording ? (
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
             ) : (
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
             )}
          </button>

          <button
            onClick={handleSend}
            disabled={(!inputText.trim() && !selectedAttachment) || isLoading || isRecording}
            className={`p-4 rounded-full flex items-center justify-center transition-all shadow-md ${
              (!inputText.trim() && !selectedAttachment) || isLoading || isRecording
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
            }`}
            aria-label="Send message"
          >
            <svg className="w-6 h-6 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;