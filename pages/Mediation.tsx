
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

  const [caseData, setCaseData] = useState<Partial<MediationCase>>({
    status: 'created',
    createdAt: Date.now(),
  });

  const [inputText, setInputText] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const L = {
    step1: language === Language.UZ ? 'Ma\'lumot' : language === Language.RU ? 'Детали' : 'Details',
    step2: language === Language.UZ ? 'Taklif' : language === Language.RU ? 'Приглашение' : 'Invite',
    step3: language === Language.UZ ? 'Muzokaralar' : language === Language.RU ? 'Переговоры' : 'Negotiate',
    step4: language === Language.UZ ? 'Natija' : language === Language.RU ? 'Результат' : 'Result',
    categories: [
      { key: 'Family', label: language === Language.UZ ? t.medCatFamily : language === Language.RU ? t.medCatFamily : 'Family', icon: '👨‍👩‍👧' },
      { key: 'Labor', label: language === Language.UZ ? t.medCatLabor : language === Language.RU ? t.medCatLabor : 'Labor', icon: '👷' },
      { key: 'Business', label: language === Language.UZ ? t.medCatBusiness : language === Language.RU ? t.medCatBusiness : 'Business', icon: '💼' },
      { key: 'Civil', label: language === Language.UZ ? t.medCatCivil : language === Language.RU ? t.medCatCivil : 'Civil', icon: '⚖️' },
    ],
    inputPlaceholder: t.medChatPlaceholder,
    mediatorActive: language === Language.UZ ? 'AI Mediator faol' : language === Language.RU ? 'AI Медиатор активен' : 'AI Mediator Active',
    forceFinish: language === Language.UZ ? 'Yakunlash (Demo)' : language === Language.RU ? 'Завершить (Demo)' : 'Force Finish (Demo)',
    mediatorThinking: language === Language.UZ ? 'Mediator fikrlamoqda...' : language === Language.RU ? 'Медиатор думает...' : 'Mediator is thinking...',
    noCases: language === Language.UZ ? 'Faol ishlar topilmadi.' : language === Language.RU ? 'Активных дел не найдено.' : 'No active cases found.',
  };

  const handleCreateCase = () => {
    if (!caseData.category || !caseData.initiatorName || !caseData.respondentName || !caseData.disputeSummary) {
      alert(language === Language.UZ ? "Barcha maydonlarni to'ldiring" : language === Language.RU ? "Заполните все поля" : "Please fill all fields");
      return;
    }
    setStep(2);
  };

  const handleSimulateHandshake = () => {
    setIsSimulatingRespondent(true);
    setTimeout(() => {
      setCaseData(prev => ({ ...prev, status: 'agreed' }));
      setStep(3);
      const initialMsg =
        language === 'uz'
          ? `Assalomu alaykum. Men AI Mediator. ${caseData.initiatorName} va ${caseData.respondentName} o'rtasidagi nizoni hal qilishga yordam beraman. Iltimos, har biringiz o'z talabingizni qisqacha yozing.`
          : language === 'ru'
          ? `Здравствуйте. Я AI Медиатор. Помогу урегулировать спор между ${caseData.initiatorName} и ${caseData.respondentName}. Пожалуйста, кратко изложите свои требования.`
          : `Hello. I am the AI Mediator. I will help resolve the dispute between ${caseData.initiatorName} and ${caseData.respondentName}. Please state your demands briefly.`;
      setMessages([{ id: 'init', role: 'model', text: initialMsg, timestamp: Date.now() }]);
    }, 2000);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText, timestamp: Date.now() };
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
        inputText, undefined, language,
        { answerLength: 'Medium', tone: 'Professional', outputStyle: 'Paragraphs', clarifyingQuestions: false, documentType: 'General', perspective: 'Neutral' },
        historyStr, context, true
      );
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text, timestamp: Date.now() + 1 }]);
      if (text.includes("AGREEMENT_REACHED")) setStep(4);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

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

    const lines = content.split('\n');
    const docChildren: any[] = [];
    let inSignatureBlock = false;
    let signatureLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) { docChildren.push(new Paragraph({ text: "" })); continue; }
      if (line.includes("IMZOLAR:")) {
        inSignatureBlock = true;
        docChildren.push(new Paragraph({ text: "IMZOLAR:", heading: HeadingLevel.HEADING_3, spacing: { before: 400, after: 200 }, run: { font: "Times New Roman", size: 24, bold: true, color: "000000" } }));
        continue;
      }
      if (inSignatureBlock) { signatureLines.push(line); continue; }
      if (i === 0) {
        docChildren.push(new Paragraph({ text: line.toUpperCase(), alignment: AlignmentType.CENTER, spacing: { after: 300 }, run: { font: "Times New Roman", size: 28, bold: true, color: "000000", allCaps: true } }));
        continue;
      }
      if (line.includes("Toshkent") && line.includes(new Date().getFullYear().toString())) {
        const [city, date] = line.split(/\s{4,}/);
        const dateText = date || new Date().toLocaleDateString();
        docChildren.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE } }, rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: city || "Toshkent sh", run: { font: "Times New Roman", size: 24 } })], width: { size: 50, type: WidthType.PERCENTAGE } }), new TableCell({ children: [new Paragraph({ text: dateText, alignment: AlignmentType.RIGHT, run: { font: "Times New Roman", size: 24 } })], width: { size: 50, type: WidthType.PERCENTAGE } })] })] }));
        continue;
      }
      docChildren.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 720 }, spacing: { after: 120 }, children: [new TextRun({ text: line, font: "Times New Roman", size: 24, color: "000000" })] }));
    }

    if (signatureLines.length > 0) {
      const leftSign = signatureLines[0] || "";
      const rightSign = signatureLines[1] || "";
      docChildren.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [new TableRow({ height: { value: 1500, rule: HeightRule.AT_LEAST }, children: [new TableCell({ borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [new Paragraph({ text: leftSign, run: { font: "Times New Roman", size: 24, bold: true } }), new Paragraph({ text: "____________________", spacing: { before: 600 } })], width: { size: 50, type: WidthType.PERCENTAGE } }), new TableCell({ borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [new Paragraph({ text: rightSign, alignment: AlignmentType.RIGHT, run: { font: "Times New Roman", size: 24, bold: true } }), new Paragraph({ text: "____________________", alignment: AlignmentType.RIGHT, spacing: { before: 600 } })], width: { size: 50, type: WidthType.PERCENTAGE } })] })] }));
    }

    const doc = new Document({ sections: [{ properties: {}, children: docChildren }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}.docx`);
  };

  const stepLabels = [L.step1, L.step2, L.step3, L.step4];
  const stepColors = ['#2563eb', '#7c3aed', '#059669', '#d97706'];

  return (
    <div className="h-full overflow-y-auto flex flex-col" style={{ background: '#f8fafc' }}>

      {/* ══ DARK HEADER ══════════════════════════════════════════════════════ */}
      <div
        className="shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 55%, #1e1b4b 100%)' }}
      >
        <div className="absolute pointer-events-none" style={{ top: '-50px', right: '10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-30px', left: '5%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(5,150,105,0.09) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="max-w-5xl mx-auto px-6 py-10 md:py-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-5"
                style={{ background: 'rgba(5,150,105,0.14)', border: '1px solid rgba(5,150,105,0.3)' }}
              >
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-300 font-bold text-xs uppercase tracking-widest">AI Mediator</span>
              </div>
              <h1
                className="gradient-text font-serif font-bold mb-3"
                style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', lineHeight: 1.15 }}
              >
                {t.medTitle}
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">{t.medSubtitle}</p>
            </div>
            <div
              className="hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-3xl shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span className="text-4xl">🤝</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">Murosa</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { key: 'new' as const, label: t.medNewCase, icon: '➕' },
              { key: 'cases' as const, label: t.medMyCases, icon: '📋' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center space-x-2 px-5 py-3 text-sm font-bold transition-all relative"
                style={
                  activeTab === tab.key
                    ? { color: 'white', borderBottom: '2px solid #2563eb', marginBottom: '-1px' }
                    : { color: 'rgba(148,163,184,0.7)', borderBottom: '2px solid transparent', marginBottom: '-1px' }
                }
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CONTENT ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 py-8">

        {activeTab === 'new' && (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden" style={{ border: '1px solid #e2e8f0', minHeight: '520px' }}>

            {/* Step Progress Bar */}
            <div
              className="px-8 py-5"
              style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderBottom: '1px solid #e2e8f0' }}
            >
              <div className="flex items-center justify-between relative">
                {/* Connecting line behind steps */}
                <div
                  className="absolute h-0.5 top-5 left-[12.5%] right-[12.5%]"
                  style={{ background: '#e2e8f0', zIndex: 0 }}
                />
                {/* Progress line */}
                <div
                  className="absolute h-0.5 top-5 left-[12.5%] transition-all duration-500"
                  style={{
                    width: step === 1 ? '0%' : step === 2 ? '33%' : step === 3 ? '66%' : '75%',
                    background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                    zIndex: 0,
                  }}
                />

                {stepLabels.map((label, i) => {
                  const s = i + 1;
                  const isCompleted = step > s;
                  const isActive = step === s;
                  return (
                    <div key={s} className="flex flex-col items-center relative z-10">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
                        style={
                          isCompleted
                            ? { background: '#059669', color: 'white', boxShadow: '0 0 16px rgba(5,150,105,0.35)' }
                            : isActive
                            ? { background: stepColors[i], color: 'white', boxShadow: `0 0 20px ${stepColors[i]}50` }
                            : { background: '#f1f5f9', color: '#94a3b8', border: '2px solid #e2e8f0' }
                        }
                      >
                        {isCompleted ? '✓' : s}
                      </div>
                      <span
                        className="text-[10px] mt-2 font-bold uppercase tracking-wide hidden md:block"
                        style={{ color: isActive ? stepColors[i] : isCompleted ? '#059669' : '#94a3b8' }}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 md:p-10 flex-1">

              {/* ── STEP 1: CREATE CASE ─────────────────────────── */}
              {step === 1 && (
                <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                  <div className="text-center mb-8">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                      style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)' }}
                    >
                      📋
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{t.medNewCase}</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {language === Language.UZ ? "Nizo turini va tomonlarni kiriting" : language === Language.RU ? "Выберите тип спора и укажите стороны" : "Select dispute type and enter parties"}
                    </p>
                  </div>

                  {/* Category selection */}
                  <div className="grid grid-cols-2 gap-3">
                    {L.categories.map(cat => (
                      <button
                        key={cat.key}
                        onClick={() => setCaseData({ ...caseData, category: cat.key as MediationCategory })}
                        className="flex items-center space-x-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                        style={
                          caseData.category === cat.key
                            ? { background: '#eff6ff', borderColor: '#2563eb', boxShadow: '0 4px 16px rgba(37,99,235,0.15)' }
                            : { background: '#f8fafc', borderColor: '#e2e8f0' }
                        }
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span
                          className="font-bold text-sm"
                          style={{ color: caseData.category === cat.key ? '#1d4ed8' : '#475569' }}
                        >
                          {cat.label}
                        </span>
                        {caseData.category === cat.key && (
                          <span className="ml-auto text-blue-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Name fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: t.medInitiator, key: 'initiatorName' as const },
                      { label: t.medRespondent, key: 'respondentName' as const },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{field.label}</label>
                        <input
                          className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 focus:outline-none transition-all"
                          style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                          value={(caseData[field.key] as string) || ''}
                          onChange={e => setCaseData({ ...caseData, [field.key]: e.target.value })}
                          onFocus={e => { e.target.style.borderColor = '#2563eb60'; e.target.style.background = 'white'; }}
                          onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Dispute summary */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t.medSummary}</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 focus:outline-none transition-all resize-none h-28"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                      value={caseData.disputeSummary || ''}
                      onChange={e => setCaseData({ ...caseData, disputeSummary: e.target.value })}
                      onFocus={e => { e.target.style.borderColor = '#2563eb60'; e.target.style.background = 'white'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                    />
                  </div>

                  <button
                    onClick={handleCreateCase}
                    className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 20px rgba(37,99,235,0.3)' }}
                  >
                    {t.medStart} →
                  </button>
                </div>
              )}

              {/* ── STEP 2: HANDSHAKE ───────────────────────────── */}
              {step === 2 && (
                <div className="flex flex-col items-center justify-center text-center space-y-8 animate-fade-in py-8">
                  <div>
                    <div
                      className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5"
                      style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)' }}
                    >
                      🔗
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{t.medHandshakeTitle}</h3>
                    <p className="text-slate-500 max-w-md mx-auto mt-2 text-sm leading-relaxed">{t.medHandshakeDesc}</p>
                  </div>

                  {/* Case summary card */}
                  <div
                    className="w-full max-w-md rounded-2xl p-5 text-left"
                    style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #e2e8f0' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Case Summary</span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: '#dbeafe', color: '#1d4ed8' }}
                      >
                        {caseData.category}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Initiator</p>
                        <p className="font-bold text-slate-700">{caseData.initiatorName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Respondent</p>
                        <p className="font-bold text-slate-700">{caseData.respondentName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Link */}
                  <div
                    className="flex items-center space-x-3 max-w-md w-full px-4 py-3 rounded-2xl"
                    style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
                  >
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-slate-500 text-sm truncate flex-1 font-mono">
                      lawify.uz/murosa/case-{Date.now().toString().slice(-6)}
                    </span>
                    <button
                      className="text-blue-600 font-bold text-xs hover:text-blue-700 shrink-0"
                    >
                      {t.medCopy}
                    </button>
                  </div>

                  {!isSimulatingRespondent ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-slate-400">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                        <span className="text-sm">{t.medWaiting}</span>
                      </div>
                      <button
                        onClick={handleSimulateHandshake}
                        className="text-xs font-bold text-blue-500 hover:text-blue-700 underline transition-colors"
                      >
                        {t.medSimulate}
                      </button>
                    </div>
                  ) : (
                    <div
                      className="flex items-center space-x-3 px-6 py-3 rounded-2xl"
                      style={{ background: '#dcfce7', border: '1px solid #bbf7d0' }}
                    >
                      <span className="text-2xl">🎉</span>
                      <span className="font-bold text-emerald-700">{t.medAgreed}</span>
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 3: NEGOTIATION ─────────────────────────── */}
              {step === 3 && (
                <div className="flex flex-col -m-6 md:-m-10" style={{ height: '520px' }}>
                  {/* Chat header */}
                  <div
                    className="shrink-0 flex items-center justify-between px-6 py-4"
                    style={{ background: 'linear-gradient(135deg, #0a0f1e, #0d1a3a)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: 'rgba(5,150,105,0.25)', border: '1px solid rgba(5,150,105,0.4)' }}
                      >
                        🤝
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm leading-none">{L.mediatorActive}</p>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                          <span className="text-emerald-400 text-[10px] font-bold">{caseData.initiatorName} · {caseData.respondentName}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(4)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                      style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(148,163,184,0.8)' }}
                    >
                      {L.forceFinish}
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ background: '#f8fafc' }}>
                    {messages.map(m => (
                      <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                        {m.role === 'model' && (
                          <div
                            className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
                            style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}
                          >
                            🤝
                          </div>
                        )}
                        <div
                          className="max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm"
                          style={
                            m.role === 'user'
                              ? { background: 'linear-gradient(135deg, #2563eb, #4f46e5)', color: 'white', borderBottomRightRadius: '4px' }
                              : { background: 'white', color: '#334155', border: '1px solid #e2e8f0', borderBottomLeftRadius: '4px' }
                          }
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-end gap-2 justify-start">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-xs text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}
                        >
                          🤝
                        </div>
                        <div className="px-4 py-3 rounded-2xl" style={{ background: 'white', border: '1px solid #e2e8f0', borderBottomLeftRadius: '4px' }}>
                          <div className="flex items-center space-x-1.5">
                            {[0, 1, 2].map(i => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#94a3b8', animationDelay: `${i * 0.15}s` }} />
                            ))}
                            <span className="text-xs text-slate-400 ml-1">{L.mediatorThinking}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="shrink-0 p-4 bg-white" style={{ borderTop: '1px solid #f1f5f9' }}>
                    <div
                      className="flex items-center gap-2 rounded-2xl px-4 py-2.5"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                    >
                      <input
                        className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                        placeholder={L.inputPlaceholder}
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputText.trim()}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 active:scale-95 shrink-0"
                        style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: RESOLUTION ──────────────────────────── */}
              {step === 4 && (
                <div className="flex flex-col items-center space-y-8 animate-fade-in py-4">
                  {/* Success animation */}
                  <div className="text-center">
                    <div
                      className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-5"
                      style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', boxShadow: '0 8px 32px rgba(5,150,105,0.25)' }}
                    >
                      🎉
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800">{t.medFinish}!</h3>
                    <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm leading-relaxed">{t.medDocuments}</p>
                  </div>

                  {/* Resolution summary */}
                  <div
                    className="flex items-center space-x-3 px-6 py-3 rounded-2xl max-w-md"
                    style={{ background: '#dcfce7', border: '1px solid #bbf7d0' }}
                  >
                    <span>✅</span>
                    <div className="text-left">
                      <p className="font-bold text-emerald-800 text-sm">{caseData.initiatorName} & {caseData.respondentName}</p>
                      <p className="text-emerald-600 text-xs">{caseData.category} dispute resolved</p>
                    </div>
                  </div>

                  {/* Document cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                    {[
                      { key: 'ENTRY_AGREEMENT', name: t.medDoc1, icon: '📄', gradient: 'linear-gradient(135deg, #eff6ff, #dbeafe)', accent: '#2563eb' },
                      { key: 'FINAL_AGREEMENT', name: t.medDoc2, icon: '📜', gradient: 'linear-gradient(135deg, #faf5ff, #ede9fe)', accent: '#7c3aed' },
                      { key: 'COURT_PETITION', name: t.medDoc3, icon: '⚖️', gradient: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', accent: '#059669' },
                    ].map(doc => (
                      <div
                        key={doc.key}
                        className="rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                        style={{ border: `1px solid ${doc.accent}30` }}
                      >
                        <div className="px-5 py-4 text-center" style={{ background: doc.gradient }}>
                          <span className="text-3xl">{doc.icon}</span>
                          <h4 className="font-bold text-sm text-slate-800 mt-2 leading-snug min-h-[2.5rem] flex items-center justify-center">{doc.name}</h4>
                        </div>
                        <div className="px-5 py-4 bg-white text-center">
                          <button
                            onClick={() => downloadDoc(doc.key, doc.name)}
                            className="inline-flex items-center space-x-1.5 text-xs font-bold transition-all hover:opacity-80"
                            style={{ color: doc.accent }}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>{t.medDownload}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 text-center max-w-md leading-relaxed">{t.medDisclaimer}</p>

                  <button
                    onClick={() => { setStep(1); setCaseData({ status: 'created', createdAt: Date.now() }); setMessages([]); setIsSimulatingRespondent(false); }}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
                    style={{ border: '1px solid #e2e8f0' }}
                  >
                    {language === Language.UZ ? '← Yangi ish boshlash' : language === Language.RU ? '← Начать новое дело' : '← Start New Case'}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div
            className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl shadow-sm"
            style={{ border: '1px solid #e2e8f0' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
              style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' }}
            >
              📋
            </div>
            <p className="text-slate-500 font-medium">{L.noCases}</p>
            <button
              onClick={() => setActiveTab('new')}
              className="mt-4 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
            >
              {t.medNewCase} →
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Mediation;
