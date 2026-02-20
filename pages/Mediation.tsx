
import React, { useState, useRef, useEffect } from 'react';
import { Language, MediationCase, MediationCategory, Message } from '../types';
import { TRANSLATIONS } from '../constants';
import { MEDIATION_TEMPLATES } from '../data/mediation_templates';
import { generateLegalResponse } from '../services/geminiService';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, HeightRule } from 'docx';
import saveAs from 'file-saver';

interface MediationProps {
  language: Language;
}

const Mediation: React.FC<MediationProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'new' | 'cases'>('new');
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSimulatingRespondent, setIsSimulatingRespondent] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Case Data State
  const [caseData, setCaseData] = useState<Partial<MediationCase>>({
      status: 'created',
      createdAt: Date.now()
  });

  // Chat Input
  const [inputText, setInputText] = useState('');

  // Auto-scroll chat
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- HANDLERS ---

  const handleCreateCase = () => {
      if (!caseData.category || !caseData.initiatorName || !caseData.respondentName || !caseData.disputeSummary) {
          alert("Please fill all fields");
          return;
      }
      setStep(2);
  };

  const handleSimulateHandshake = () => {
      setIsSimulatingRespondent(true);
      setTimeout(() => {
          setCaseData(prev => ({ ...prev, status: 'agreed' }));
          setStep(3);
          
          // Initial AI Message
          const initialMsg = language === 'uz' 
              ? `Assalomu alaykum. Men AI Mediator. ${caseData.initiatorName} va ${caseData.respondentName} o'rtasidagi nizoni hal qilishga yordam beraman. Iltimos, har biringiz o'z talabingizni qisqacha yozing.`
              : "Hello. I am the AI Mediator. I will help resolve the dispute. Please state your demands briefly.";
          
          setMessages([{
              id: 'init',
              role: 'model',
              text: initialMsg,
              timestamp: Date.now()
          }]);
      }, 2000);
  };

  const handleSendMessage = async () => {
      if (!inputText.trim()) return;
      
      const newMsg: Message = {
          id: Date.now().toString(),
          role: 'user',
          text: inputText,
          timestamp: Date.now()
      };
      setMessages(prev => [...prev, newMsg]);
      setInputText('');
      setIsLoading(true);

      try {
          const historyStr = messages.map(m => `${m.role}: ${m.text}`).join('\n');
          const context = `
              Role: AI Mediator (Neutral Third Party).
              Case: ${caseData.category} Dispute.
              Parties: ${caseData.initiatorName} vs ${caseData.respondentName}.
              Summary: ${caseData.disputeSummary}.
              Goal: Find a middle ground. Suggest compromises. Be calm and professional.
              If agreement reached, say "AGREEMENT_REACHED".
          `;

          const { text } = await generateLegalResponse(
              inputText, 
              undefined, 
              language, 
              { answerLength: 'Medium', tone: 'Professional', outputStyle: 'Paragraphs', clarifyingQuestions: false, documentType: 'General', perspective: 'Neutral' }, 
              historyStr, 
              context,
              true // Use Pro model for better reasoning
          );

          setMessages(prev => [...prev, {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: text,
              timestamp: Date.now() + 1
          }]);

          if (text.includes("AGREEMENT_REACHED")) {
              setStep(4);
          }

      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  };

  // Improved Document Generator
  const downloadDoc = async (templateKey: string, filename: string) => {
      const template = MEDIATION_TEMPLATES[templateKey as keyof typeof MEDIATION_TEMPLATES];
      let content = template
          .replace(/\[Shahar\]/g, 'Toshkent sh')
          .replace(/\[Sana\]/g, new Date().toLocaleDateString())
          .replace(/\[Initiator Name\]/g, caseData.initiatorName || '')
          .replace(/\[Respondent Name\]/g, caseData.respondentName || '')
          .replace(/\[Dispute Category\]/g, caseData.category || '')
          .replace(/\[Dispute Summary\]/g, caseData.disputeSummary || '')
          .replace(/\[Resolution Terms\]/g, "Taraflar ushbu nizoni to'liq hal qilishga va bir-birlariga nisbatan da'volaridan voz kechishga kelishdilar.")
          .replace(/\[To'lov Grafigi \/ Muddatlari\]/g, "To'lov bir oy muddat ichida amalga oshiriladi.");

      // Split content into lines
      const lines = content.split('\n');
      const docChildren: any[] = [];
      
      let inSignatureBlock = false;
      let signatureLines: string[] = [];

      for (let i = 0; i < lines.length; i++) {
          let line = lines[i].trim();
          if (!line) {
              docChildren.push(new Paragraph({ text: "" }));
              continue;
          }

          // 1. Detect Signature Block Start
          if (line.includes("IMZOLAR:")) {
              inSignatureBlock = true;
              docChildren.push(
                  new Paragraph({
                      text: "IMZOLAR:",
                      heading: HeadingLevel.HEADING_3,
                      spacing: { before: 400, after: 200 },
                      run: { font: "Times New Roman", size: 24, bold: true, color: "000000" }
                  })
              );
              continue;
          }

          if (inSignatureBlock) {
              signatureLines.push(line);
              continue;
          }

          // 2. Title (First Line)
          if (i === 0) {
              docChildren.push(
                  new Paragraph({
                      text: line.toUpperCase(),
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 300 },
                      run: {
                          font: "Times New Roman",
                          size: 28, // 14pt
                          bold: true,
                          color: "000000", 
                          allCaps: true
                      }
                  })
              );
              continue;
          }

          // 3. City and Date (Line containing 'Toshkent' or '[Sana]')
          if (line.includes("Toshkent") && line.includes(new Date().getFullYear().toString())) {
              // Create a 2-column table for City (Left) and Date (Right)
              const [city, date] = line.split(/\s{4,}/); // Split by multiple spaces
              const dateText = date || new Date().toLocaleDateString();

              docChildren.push(
                  new Table({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                          insideVertical: { style: BorderStyle.NONE },
                          insideHorizontal: { style: BorderStyle.NONE },
                      },
                      rows: [
                          new TableRow({
                              children: [
                                  new TableCell({
                                      children: [new Paragraph({ text: city || "Toshkent sh", run: { font: "Times New Roman", size: 24 } })],
                                      width: { size: 50, type: WidthType.PERCENTAGE }
                                  }),
                                  new TableCell({
                                      children: [new Paragraph({ text: dateText, alignment: AlignmentType.RIGHT, run: { font: "Times New Roman", size: 24 } })],
                                      width: { size: 50, type: WidthType.PERCENTAGE }
                                  }),
                              ]
                          })
                      ]
                  })
              );
              continue;
          }

          // 4. Standard Paragraphs
          docChildren.push(
              new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  indent: { firstLine: 720 }, // 0.5 inch indent
                  spacing: { after: 120 },
                  children: [
                      new TextRun({
                          text: line,
                          font: "Times New Roman",
                          size: 24, // 12pt
                          color: "000000"
                      })
                  ]
              })
          );
      }

      // 5. Build Signature Table
      if (signatureLines.length > 0) {
          const leftSign = signatureLines[0] || "";
          const rightSign = signatureLines[1] || "";

          docChildren.push(
              new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  rows: [
                      new TableRow({
                          height: { value: 1500, rule: HeightRule.AT_LEAST }, // Space for signature
                          children: [
                              new TableCell({
                                  borders: {
                                      top: { style: BorderStyle.NONE },
                                      bottom: { style: BorderStyle.NONE },
                                      left: { style: BorderStyle.NONE },
                                      right: { style: BorderStyle.NONE },
                                  },
                                  children: [
                                      new Paragraph({ 
                                          text: leftSign, 
                                          run: { font: "Times New Roman", size: 24, bold: true } 
                                      }),
                                      new Paragraph({ text: "____________________", spacing: { before: 600 } })
                                  ],
                                  width: { size: 50, type: WidthType.PERCENTAGE }
                              }),
                              new TableCell({
                                  borders: {
                                      top: { style: BorderStyle.NONE },
                                      bottom: { style: BorderStyle.NONE },
                                      left: { style: BorderStyle.NONE },
                                      right: { style: BorderStyle.NONE },
                                  },
                                  children: [
                                      new Paragraph({ 
                                          text: rightSign, 
                                          alignment: AlignmentType.RIGHT,
                                          run: { font: "Times New Roman", size: 24, bold: true } 
                                      }),
                                      new Paragraph({ text: "____________________", alignment: AlignmentType.RIGHT, spacing: { before: 600 } })
                                  ],
                                  width: { size: 50, type: WidthType.PERCENTAGE }
                              })
                          ]
                      })
                  ]
              })
          );
      }

      const doc = new Document({
          sections: [{
              properties: {},
              children: docChildren
          }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${filename}.docx`);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{t.medTitle}</h1>
                <p className="text-slate-500">{t.medSubtitle}</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center space-x-4 border-b border-gray-200 pb-1">
                <button 
                    onClick={() => setActiveTab('new')}
                    className={`pb-2 px-4 font-bold text-sm transition-colors ${activeTab === 'new' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                >
                    {t.medNewCase}
                </button>
                <button 
                    onClick={() => setActiveTab('cases')}
                    className={`pb-2 px-4 font-bold text-sm transition-colors ${activeTab === 'cases' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                >
                    {t.medMyCases}
                </button>
            </div>

            {activeTab === 'new' && (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
                    
                    {/* Progress Bar */}
                    <div className="bg-slate-50 border-b border-gray-100 p-4 flex justify-between items-center px-10">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex flex-col items-center relative z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {s}
                                </div>
                                <span className="text-[10px] mt-1 font-bold text-gray-400 hidden md:block">
                                    {s === 1 ? 'Details' : s === 2 ? 'Invite' : s === 3 ? 'Negotiate' : 'Result'}
                                </span>
                            </div>
                        ))}
                        {/* Line */}
                        <div className="absolute left-10 right-10 top-8 h-0.5 bg-gray-200 -z-0 hidden md:block"></div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                        
                        {/* STEP 1: CREATE */}
                        {step === 1 && (
                            <div className="space-y-6 max-w-2xl mx-auto w-full animate-fade-in">
                                <h3 className="text-xl font-bold text-slate-800 text-center">{t.medNewCase}</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    {['Family', 'Labor', 'Business', 'Civil'].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setCaseData({...caseData, category: cat as MediationCategory})}
                                            className={`p-4 rounded-xl border text-center font-bold transition-all ${
                                                caseData.category === cat 
                                                ? 'bg-blue-50 border-blue-500 text-blue-700' 
                                                : 'border-gray-200 hover:border-blue-300 text-gray-600'
                                            }`}
                                        >
                                            {cat === 'Family' ? t.medCatFamily : cat === 'Labor' ? t.medCatLabor : cat === 'Business' ? t.medCatBusiness : t.medCatCivil}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.medInitiator}</label>
                                        <input 
                                            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50"
                                            value={caseData.initiatorName || ''}
                                            onChange={(e) => setCaseData({...caseData, initiatorName: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.medRespondent}</label>
                                        <input 
                                            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50"
                                            value={caseData.respondentName || ''}
                                            onChange={(e) => setCaseData({...caseData, respondentName: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.medSummary}</label>
                                    <textarea 
                                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 h-24"
                                        value={caseData.disputeSummary || ''}
                                        onChange={(e) => setCaseData({...caseData, disputeSummary: e.target.value})}
                                    />
                                </div>

                                <button 
                                    onClick={handleCreateCase}
                                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
                                >
                                    {t.medStart}
                                </button>
                            </div>
                        )}

                        {/* STEP 2: HANDSHAKE */}
                        {step === 2 && (
                            <div className="text-center space-y-8 animate-fade-in flex flex-col items-center justify-center flex-1">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{t.medHandshakeTitle}</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mt-2">{t.medHandshakeDesc}</p>
                                </div>

                                <div className="bg-gray-100 p-4 rounded-xl flex items-center space-x-3 max-w-md w-full">
                                    <span className="text-gray-500 text-sm truncate flex-1 font-mono">lawify.uz/murosa/case-{Date.now()}</span>
                                    <button className="text-blue-600 font-bold text-sm hover:underline">{t.medCopy}</button>
                                </div>

                                {!isSimulatingRespondent ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center space-x-2 text-gray-400 animate-pulse">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            <span>{t.medWaiting}</span>
                                        </div>
                                        <button 
                                            onClick={handleSimulateHandshake}
                                            className="text-xs text-gray-400 underline hover:text-blue-500"
                                        >
                                            {t.medSimulate}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-green-600 font-bold flex items-center justify-center space-x-2 animate-bounce">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        <span>{t.medAgreed}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 3: NEGOTIATION */}
                        {step === 3 && (
                            <div className="flex flex-col h-[500px] -m-8">
                                <div className="bg-slate-100 p-3 border-b flex justify-between items-center px-6">
                                    <span className="font-bold text-slate-700 flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        AI Mediator Active
                                    </span>
                                    <button onClick={() => setStep(4)} className="text-xs bg-white border px-2 py-1 rounded hover:bg-gray-50">Force Finish (Demo)</button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                                    {messages.map(m => (
                                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
                                                m.role === 'user' 
                                                ? 'bg-blue-600 text-white rounded-br-none' 
                                                : 'bg-white border border-gray-200 text-slate-800 rounded-bl-none'
                                            }`}>
                                                {m.text}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border p-3 rounded-xl rounded-bl-none shadow-sm">
                                                <span className="text-xs text-gray-400">Mediator is thinking...</span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="p-4 bg-white border-t">
                                    <div className="flex space-x-2">
                                        <input 
                                            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={t.medChatPlaceholder}
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        />
                                        <button 
                                            onClick={handleSendMessage}
                                            disabled={isLoading}
                                            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: RESOLUTION */}
                        {step === 4 && (
                            <div className="space-y-8 animate-fade-in flex flex-col items-center justify-center flex-1">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                                        🎉
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">{t.medFinish}!</h3>
                                    <p className="text-gray-500 mt-2">{t.medDocuments}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                    {[
                                        { key: 'ENTRY_AGREEMENT', name: t.medDoc1, icon: '📄' },
                                        { key: 'FINAL_AGREEMENT', name: t.medDoc2, icon: '📜' },
                                        { key: 'COURT_PETITION', name: t.medDoc3, icon: '⚖️' }
                                    ].map((doc) => (
                                        <div key={doc.key} className="bg-gray-50 border border-gray-200 p-6 rounded-2xl flex flex-col items-center text-center hover:shadow-md transition-all">
                                            <span className="text-3xl mb-3">{doc.icon}</span>
                                            <h4 className="font-bold text-sm text-slate-800 mb-4 h-10 flex items-center justify-center">{doc.name}</h4>
                                            <button 
                                                onClick={() => downloadDoc(doc.key, doc.name)}
                                                className="text-blue-600 text-xs font-bold hover:underline flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                {t.medDownload}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-xs text-gray-400 text-center max-w-md">{t.medDisclaimer}</p>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {activeTab === 'cases' && (
                <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-gray-100">
                    <p>No active cases found.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Mediation;
