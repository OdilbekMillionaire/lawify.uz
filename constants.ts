import { Language, UserSettings } from './types';

export const TRANSLATIONS = {
  [Language.UZ]: {
    title: "LAWIFY",
    subtitle: "O'zbekiston bo'yicha huquqiy yordamchi",
    settings: "Sozlamalar",
    length: "Javob uzunligi",
    tone: "Ohang",
    style: "Uslub",
    clarify: "Aniqlovchi savollar",
    
    // Settings Options
    short: "Qisqa",
    medium: "O'rtacha",
    detailed: "Batafsil",
    simple: "Oddiy",
    professional: "Rasmiy",
    bullets: "Belgilar bilan",
    steps: "Qadamma-qadam",
    paragraphs: "Matn ko'rinishida",
    docType: "Hujjat turi",
    docGeneral: "Umumiy Maslahat",
    docContract: "Shartnoma",
    docLetter: "Rasmiy Xat",
    docApp: "Ariza",
    perspective: "Yondashuv",
    persNeutral: "Xolis",
    persConsumer: "Mijoz himoyasi",
    persBusiness: "Biznes himoyasi",

    inputPlaceholder: "Huquqiy savolingizni yozing...",
    disclaimer: "Bu yuridik maslahat emas. Shoshilinch hollarda advokatga murojaat qiling.",
    startLive: "Jonli suhbat",
    stopLive: "Suhbatni tugatish",
    speaking: "Gapirilmoqda...",
    listening: "Eshitilmoqda...",
    send: "Yuborish",
    uploadImage: "Rasm yuklash",
    uploadDoc: "Hujjat yuklash",
    audioPermission: "Mikrofon ruxsati kerak",
    thinking: "O'ylanmoqda...",
    fileSelected: "Hujjat tanlandi",
    connectedSources: "Ulangan manbalar: 19 Kodeks & Lex.uz",
    sourcesTitle: "RASMIY MANBALAR",
    
    // Navigation
    navDashboard: "Bosh sahifa",
    navChat: "AI Yurist",
    navTemplates: "Andozalar",
    navHistory: "Tarix",
    navTopics: "Mavzular",
    navProfile: "Profil",
    navPlans: "Tariflar",
    upgradeBtn: "Premiumga o'tish",

    // Dashboard
    dashboardWelcome: "Xush kelibsiz",
    dashboardSubtitle: "Bugun sizga qanday yuridik yordam bera olaman?",
    quickChat: "Yangi suhbat",
    quickChatDesc: "AI bilan huquqiy maslahat",
    quickContracts: "Hujjat tekshirish",
    quickContractsDesc: "Shartnomalarni tahlil qilish",
    quickTemplates: "Andozalar",
    quickTemplatesDesc: "Tayyor arizalar va aktlar",
    didYouKnowTitle: "O'zbekistonning Yangi Mehnat Kodeksi",
    didYouKnowContent: "2023-yilgi yangi Mehnat kodeksi xodimlar huquqlari, ta'til hisoblash va masofaviy ishlash bo'yicha muhim o'zgarishlarni kiritdi. Lawify barcha o'zgarishlardan xabardor.",
    didYouKnowButton: "Batafsil so'rash",
    didYouKnowTag: "Bilasizmi?",
    
    // Quick Links
    quickLinksTitle: "Tezkor Havolalar",
    qlFamily: "Oila Huquqi",
    qlLabor: "Mehnat Kodeksi",
    qlCriminal: "Jinoyat Kodeksi",
    qlBusiness: "Biznes Huquqi",
    qlHousing: "Uy-joy Huquqi",
    qlAdmin: "Ma'muriy Javobgarlik",
    
    // Quick Link Prompts
    qlFamilyPrompt: "Oila huquqi bo'yicha savolim bor.",
    qlLaborPrompt: "Mehnat kodeksi bo'yicha ma'lumot kerak.",
    qlCriminalPrompt: "Jinoyat kodeksi bo'yicha savolim bor.",
    qlHousingPrompt: "Uy-joy huquqi bo'yicha savolim bor.",
    qlBusinessPrompt: "Biznes bo'yicha yuridik maslahat kerak.",
    qlAdminPrompt: "Ma'muriy javobgarlik bo'yicha savol.",

    // Library
    libraryTitle: "Yuridik Hujjatlar Kutubxonasi",
    librarySubtitle: "O'zbekiston qonunchiligiga mos AI yordamida tayyorlangan andozalar.",
    libraryDifficulty: "Murakkablik",
    libraryComingSoon: "Tez orada",
    libraryFooter: "Yangi Lex.uz o'zgarishlari asosida har hafta yangi andozalar qo'shilmoqda.",
    
    // Library Categories
    catCivil: "Fuqarolik",
    catProperty: "Mulkiy",
    catFamily: "Oila",
    catBusiness: "Biznes",
    catAdmin: "Ma'muriy",

    // Templates
    tDebtTitle: "Qarz Tilxati",
    tDebtDesc: "Qarz berish yoki olishni rasmiylashtirish uchun.",
    tRentTitle: "Ijara Shartnomasi",
    tRentDesc: "Turar joy yoki ofis ijarasi uchun.",
    tDivorceTitle: "Ajrashish uchun Ariza",
    tDivorceDesc: "Sudga taqdim etiladigan rasmiy ariza.",
    tLaborTitle: "Mehnat Shartnomasi",
    tLaborDesc: "Ish beruvchi va xodim o'rtasidagi kelishuv.",
    tPowerTitle: "Ishonchnoma",
    tPowerDesc: "Avtomobil yoki mulkni boshqarish huquqi.",
    tComplaintTitle: "Shikoyat Ariza",
    tComplaintDesc: "Davlat organlari ustidan shikoyat.",

    // Localized Prompts
    tDebtPrompt: "Men qarz tilxatini yozmoqchiman. Iltimos, huquqiy jihatdan to'g'ri hujjat tayyorlash uchun mendan kerakli barcha ma'lumotlarni (tomonlar, summa, muddat) so'rang.",
    tRentPrompt: "Men turar joy ijara shartnomasini tuzmoqchiman. Iltimos, shartnoma qonuniy bo'lishi uchun mendan kerakli ma'lumotlarni so'rang va keyin shartnoma matnini tayyorlab bering.",
    tDivorcePrompt: "Men sudga ajrashish uchun ariza yozmoqchiman. Iltimos, arizani to'g'ri shakllantirish uchun mendan talab qilinadigan ma'lumotlarni so'rang.",
    tLaborPrompt: "Men yangi Mehnat kodeksi bo'yicha mehnat shartnomasini tuzmoqchiman. Iltimos, ish beruvchi va xodim haqidagi kerakli ma'lumotlarni so'rang.",
    tPowerPrompt: "Menga avtomobil yoki mulkni boshqarish uchun ishonchnoma kerak. Iltimos, ishonchnoma turini va taraflar ma'lumotlarini mendan so'rang.",
    tComplaintPrompt: "Men davlat organiga shikoyat yozmoqchiman. Iltimos, vaziyatni o'rganish uchun mendan kerakli savollarni so'rang, so'ngra shikoyat matnini yozib bering.",

    diffEasy: "Oson",
    diffMedium: "O'rta",
    diffHard: "Qiyin",

    // Topics Page
    topicsTitle: "Umumiy Huquqiy Mavzular",
    topicsSubtitle: "Formani oldindan to'ldirish uchun mavzuni tanlang",

    // History
    historyTitle: "Murojaatlar Tarixi",
    historySubtitle: "Sizning avvalgi suhbatlaringiz ushbu qurilmada saqlanadi.",
    historyClear: "Tarixni tozalash",
    historyEmpty: "Hozircha tarix yo'q. Yangi suhbat boshlang.",
    historyMessages: "xabar",

    // Profile
    profileTitle: "Foydalanuvchi Profili",
    profileSubtitle: "Shaxsiy ma'lumotlar va sozlamalarni boshqarish",
    profileName: "Ism",
    profileEmail: "Email",
    profileStats: "Statistika",
    profileConsultations: "Konsultatsiyalar",
    profileSavedDocs: "Saqlangan Hujjatlar",
    profileSave: "Saqlash",
    
    // Chat Filters
    filterTitle: "Filtrlash",
    filterDate: "Sana",
    filterRole: "Kimdan",
    filterAll: "Barchasi",
    filterUser: "Foydalanuvchi",
    filterAI: "AI Yurist",
    filterLast24h: "Oxirgi 24 soat",
    filterLastWeek: "Oxirgi hafta",
    filterAllTime: "Barcha vaqt",

    // PLANS
    plansTitle: "Tarif Rejalari",
    plansSubtitle: "Ehtiyojingizga mos tarifni tanlang. Istalgan vaqtda bekor qilish mumkin.",
    currentPlan: "Joriy Tarif",
    subscribe: "Tanlash",
    
    // Features
    featRequestLimit: "so'rov / kun",
    featUnlimited: "Cheksiz so'rovlar",
    featDocs: "ta hujjat tahlili",
    featNoDocs: "Hujjat yuklab bo'lmaydi",
    featSpeedNormal: "Standart tezlik",
    featSpeedFast: "Yuqori tezlik (Pro)",
    featLive: "Jonli ovozli suhbat",
    featLiveLimit: "daq/kun",
    featReasoning: "Chuqur huquqiy tahlil",
    featSupport: "Mijozlarni qo'llab-quvvatlash",
    featMobile: "Mobil qurilmalarda ishlash",
    featHistory: "Tarixni saqlash",
    featAds: "Reklamasiz interfeys",
    featExport: "Hujjatlarni PDF formatda yuklash",
    
    // Plan Names & Prices
    pFreeName: "Bepul",
    pFreePrice: "0",
    pDayName: "Kunlik Pro",
    pDayPrice: "15 000",
    pWeekName: "Haftalik Pro",
    pWeekPrice: "49 000",
    pMonthName: "Oylik Pro",
    pMonthPrice: "119 000",
    pLawyerName: "Yurist Pro",
    pLawyerPrice: "299 000",
    
    currency: "so'm",
    bestValue: "Eng Foydali",
  },
  [Language.RU]: {
    title: "LAWIFY",
    subtitle: "Юридический помощник по Узбекистану",
    settings: "Настройки",
    length: "Длина ответа",
    tone: "Тон",
    style: "Стиль",
    clarify: "Уточняющие вопросы",
    
    short: "Краткий",
    medium: "Средний",
    detailed: "Подробный",
    simple: "Простой",
    professional: "Профессиональный",
    bullets: "Маркированный список",
    steps: "Пошагово",
    paragraphs: "Текстом",
    docType: "Тип документа",
    docGeneral: "Общая консультация",
    docContract: "Договор",
    docLetter: "Официальное письмо",
    docApp: "Заявление",
    perspective: "Позиция",
    persNeutral: "Нейтральная",
    persConsumer: "Защита потребителя",
    persBusiness: "Защита бизнеса",

    inputPlaceholder: "Задайте ваш юридический вопрос...",
    disclaimer: "Это информационная справка, а не замена юристу. В срочных случаях обратитесь к адвокату.",
    startLive: "Живой чат",
    stopLive: "Завершить",
    speaking: "Говорит...",
    listening: "Слушает...",
    send: "Отправить",
    uploadImage: "Загрузить фото",
    uploadDoc: "Загрузить документ",
    audioPermission: "Требуется разрешение на микрофон",
    thinking: "Думаю...",
    fileSelected: "Документ выбран",
    connectedSources: "Источники: 19 Кодексов & Lex.uz",
    sourcesTitle: "ОФИЦИАЛЬНЫЕ ИСТОЧНИКИ",

    // Navigation
    navDashboard: "Главная",
    navChat: "AI Юрист",
    navTemplates: "Шаблоны",
    navHistory: "История",
    navTopics: "Темы",
    navProfile: "Профиль",
    navPlans: "Тарифы",
    upgradeBtn: "Купить Premium",

    // Dashboard
    dashboardWelcome: "Добро пожаловать",
    dashboardSubtitle: "Чем я могу помочь вам сегодня в правовых вопросах?",
    quickChat: "Новый чат",
    quickChatDesc: "Консультация с ИИ",
    quickContracts: "Анализ документов",
    quickContractsDesc: "Проверка договоров",
    quickTemplates: "Шаблоны",
    quickTemplatesDesc: "Готовые заявления и акты",
    didYouKnowTitle: "Новый Трудовой Кодекс Узбекистана",
    didYouKnowContent: "Новый Трудовой кодекс 2023 года внес значительные изменения в права работников, расчет отпусков и правила удаленной работы.",
    didYouKnowButton: "Узнать подробнее",
    didYouKnowTag: "Знаете ли вы?",

    // Quick Links
    quickLinksTitle: "Быстрые Ссылки",
    qlFamily: "Семейное Право",
    qlLabor: "Трудовой Кодекс",
    qlCriminal: "Уголовный Кодекс",
    qlBusiness: "Бизнес Право",
    qlHousing: "Жилищное Право",
    qlAdmin: "Админ. Право",

    // Quick Link Prompts
    qlFamilyPrompt: "У меня вопрос по семейному праву.",
    qlLaborPrompt: "Мне нужна информация по Трудовому кодексу.",
    qlCriminalPrompt: "У меня вопрос по Уголовному кодексу.",
    qlHousingPrompt: "У меня вопрос по жилищному праву.",
    qlBusinessPrompt: "Мне нужна юридическая консультация для бизнеса.",
    qlAdminPrompt: "Вопрос об административной ответственности.",

    // Library
    libraryTitle: "Библиотека Документов",
    librarySubtitle: "Шаблоны, составленные с помощью ИИ в соответствии с законодательством.",
    libraryDifficulty: "Сложность",
    libraryComingSoon: "Скоро",
    libraryFooter: "Новые шаблоны добавляются еженедельно на основе обновлений Lex.uz.",

    // Library Categories
    catCivil: "Гражданское",
    catProperty: "Имущество",
    catFamily: "Семья",
    catBusiness: "Бизнес",
    catAdmin: "Административное",

    // Templates
    tDebtTitle: "Долговая Расписка",
    tDebtDesc: "Оформление займа денег.",
    tRentTitle: "Договор Аренды",
    tRentDesc: "Аренда жилья или офиса.",
    tDivorceTitle: "Заявление на Развод",
    tDivorceDesc: "Официальное заявление в суд.",
    tLaborTitle: "Трудовой Договор",
    tLaborDesc: "Соглашение между работодателем и сотрудником.",
    tPowerTitle: "Доверенность",
    tPowerDesc: "На управление автомобилем или имуществом.",
    tComplaintTitle: "Жалоба",
    tComplaintDesc: "Жалоба на государственные органы.",

    // Localized Prompts
    tDebtPrompt: "Я хочу составить долговую расписку. Пожалуйста, задайте мне необходимые вопросы (стороны, сумма, срок), чтобы составить документ юридически грамотно.",
    tRentPrompt: "Я хочу составить договор аренды жилья. Пожалуйста, запросите у меня необходимые данные для составления договора.",
    tDivorcePrompt: "Мне нужно подать заявление на развод. Пожалуйста, спросите меня о деталях брака и детях, чтобы сформировать заявление.",
    tLaborPrompt: "Мне нужно составить трудовой договор по новому ТК РУз. Пожалуйста, уточните условия работы и данные сторон.",
    tPowerPrompt: "Мне нужна доверенность (на авто или имущество). Пожалуйста, узнайте у меня детали, прежде чем составлять текст.",
    tComplaintPrompt: "Я хочу написать жалобу в госорган. Пожалуйста, задайте мне вопросы по ситуации, чтобы текст был обоснованным.",

    diffEasy: "Легко",
    diffMedium: "Средне",
    diffHard: "Сложно",

    // Topics Page
    topicsTitle: "Общие Юридические Темы",
    topicsSubtitle: "Выберите тему для предварительного заполнения формы",

    // History
    historyTitle: "История Дел",
    historySubtitle: "Ваши предыдущие консультации хранятся локально на этом устройстве.",
    historyClear: "Очистить историю",
    historyEmpty: "Истории пока нет. Начните новый чат.",
    historyMessages: "сообщений",

    // Profile
    profileTitle: "Профиль",
    profileSubtitle: "Управление личными данными и настройками",
    profileName: "Имя",
    profileEmail: "Email",
    profileStats: "Статистика",
    profileConsultations: "Консультаций",
    profileSavedDocs: "Сохр. документы",
    profileSave: "Сохранить",

    // Chat Filters
    filterTitle: "Фильтр",
    filterDate: "Дата",
    filterRole: "От кого",
    filterAll: "Все",
    filterUser: "Пользователь",
    filterAI: "AI Юрист",
    filterLast24h: "За 24 часа",
    filterLastWeek: "За неделю",
    filterAllTime: "Все время",

    // PLANS
    plansTitle: "Тарифные Планы",
    plansSubtitle: "Выберите подходящий тариф. Можно отменить в любое время.",
    currentPlan: "Текущий план",
    subscribe: "Выбрать",

    // Features
    featRequestLimit: "запросов / день",
    featUnlimited: "Безлимитные запросы",
    featDocs: "анализ документов",
    featNoDocs: "Без загрузки документов",
    featSpeedNormal: "Стандартная скорость",
    featSpeedFast: "Высокая скорость (Pro)",
    featLive: "Живой голосовой чат",
    featLiveLimit: "мин/день",
    featReasoning: "Глубокий юр. анализ",
    featSupport: "Поддержка клиентов",
    featMobile: "Мобильный доступ",
    featHistory: "Сохранение истории",
    featAds: "Без рекламы",
    featExport: "Экспорт в PDF",

    // Plan Names & Prices
    pFreeName: "Бесплатный",
    pFreePrice: "0",
    pDayName: "Дневной Pro",
    pDayPrice: "15 000",
    pWeekName: "Недельный Pro",
    pWeekPrice: "49 000",
    pMonthName: "Месячный Pro",
    pMonthPrice: "119 000",
    pLawyerName: "Юрист Pro",
    pLawyerPrice: "299 000",

    currency: "сум",
    bestValue: "Выгодно",
  },
  [Language.EN]: {
    title: "LAWIFY",
    subtitle: "Uzbekistan Legal Assistant",
    settings: "Settings",
    length: "Answer Length",
    tone: "Tone",
    style: "Output Style",
    clarify: "Clarifying Questions",

    short: "Short",
    medium: "Medium",
    detailed: "Detailed",
    simple: "Simple",
    professional: "Professional",
    bullets: "Bullet points",
    steps: "Step-by-step",
    paragraphs: "Paragraphs",
    docType: "Document Type",
    docGeneral: "General Advice",
    docContract: "Contract",
    docLetter: "Official Letter",
    docApp: "Application",
    perspective: "Perspective",
    persNeutral: "Neutral",
    persConsumer: "Pro-Consumer",
    persBusiness: "Pro-Business",

    inputPlaceholder: "Ask a legal question...",
    disclaimer: "This is informational guidance, not a substitute for a licensed lawyer. For urgent cases consult a lawyer.",
    startLive: "Live Chat",
    stopLive: "End Chat",
    speaking: "Speaking...",
    listening: "Listening...",
    send: "Send",
    uploadImage: "Upload Image",
    uploadDoc: "Upload Document",
    audioPermission: "Microphone permission required",
    thinking: "Thinking...",
    fileSelected: "File selected",
    connectedSources: "Connected: 19 Codes & Lex.uz",
    sourcesTitle: "OFFICIAL SOURCES",

    // Navigation
    navDashboard: "Dashboard",
    navChat: "AI Lawyer",
    navTemplates: "Templates",
    navHistory: "History",
    navTopics: "Topics",
    navProfile: "Profile",
    navPlans: "Pricing",
    upgradeBtn: "Upgrade to Pro",

    // Dashboard
    dashboardWelcome: "Welcome Back",
    dashboardSubtitle: "How can I assist with your legal needs today?",
    quickChat: "Start Consultation",
    quickChatDesc: "Ask general legal questions",
    quickContracts: "Review Contract",
    quickContractsDesc: "Analyze legal risks in docs",
    quickTemplates: "Legal Templates",
    quickTemplatesDesc: "Drafts for contracts/forms",
    didYouKnowTitle: "Uzbekistan's New Labor Code",
    didYouKnowContent: "The new Labor Code of 2023 introduced significant changes to employee rights, vacation calculations, and remote work regulations.",
    didYouKnowButton: "Learn More",
    didYouKnowTag: "Did you know?",

    // Quick Links
    quickLinksTitle: "Quick Links",
    qlFamily: "Family Law",
    qlLabor: "Labor Code",
    qlCriminal: "Criminal Code",
    qlBusiness: "Business Law",
    qlHousing: "Housing Law",
    qlAdmin: "Administrative Law",

    // Quick Link Prompts
    qlFamilyPrompt: "I have a question regarding Family Law.",
    qlLaborPrompt: "I need information about the Labor Code.",
    qlCriminalPrompt: "I have a question about the Criminal Code.",
    qlHousingPrompt: "I have a question about Housing Law.",
    qlBusinessPrompt: "I need legal advice for Business.",
    qlAdminPrompt: "Question about Administrative Liability.",

    // Library
    libraryTitle: "Legal Document Library",
    librarySubtitle: "AI-assisted templates compliant with Uzbekistan legislation.",
    libraryDifficulty: "Difficulty",
    libraryComingSoon: "Coming Soon",
    libraryFooter: "More templates are being added weekly based on new Lex.uz updates.",

    // Library Categories
    catCivil: "Civil",
    catProperty: "Property",
    catFamily: "Family",
    catBusiness: "Business",
    catAdmin: "Administrative",

    // Templates
    tDebtTitle: "Debt Receipt",
    tDebtDesc: "Formalize lending or borrowing money.",
    tRentTitle: "Rental Agreement",
    tRentDesc: "For residential or commercial property leasing.",
    tDivorceTitle: "Divorce Application",
    tDivorceDesc: "Formal application for court submission.",
    tLaborTitle: "Labor Contract",
    tLaborDesc: "Agreement between employer and employee.",
    tPowerTitle: "Power of Attorney",
    tPowerDesc: "For managing vehicle or property.",
    tComplaintTitle: "Complaint Letter",
    tComplaintDesc: "Complaint against government bodies.",

    // Localized Prompts
    tDebtPrompt: "I want to draft a Debt Receipt. Please ask me for the specific details (lender, borrower, amount, date) needed to make it legally valid before drafting.",
    tRentPrompt: "I want to create a Rental Agreement. Please interview me about the property, rent amount, and terms before generating the document.",
    tDivorcePrompt: "I need to write a Divorce Application for the court. Please ask me for the necessary details about marriage and children first.",
    tLaborPrompt: "I need to draft a Labor Contract under the new Labor Code. Please ask me about the job conditions and parties involved.",
    tPowerPrompt: "I need a Power of Attorney (for car or property). Please ask me for the specific details required by law.",
    tComplaintPrompt: "I want to file a formal Complaint against a government body. Please ask me clarifying questions about the incident first.",

    diffEasy: "Easy",
    diffMedium: "Medium",
    diffHard: "Hard",

    // Topics Page
    topicsTitle: "Common Legal Topics",
    topicsSubtitle: "Select a topic to pre-fill the inquiry",

    // History
    historyTitle: "Case History",
    historySubtitle: "Your previous consultations are stored locally on this device.",
    historyClear: "Clear History",
    historyEmpty: "No history yet. Start a new chat.",
    historyMessages: "messages",

    // Profile
    profileTitle: "User Profile",
    profileSubtitle: "Manage your personal information and preferences",
    profileName: "Name",
    profileEmail: "Email",
    profileStats: "Statistics",
    profileConsultations: "Consultations",
    profileSavedDocs: "Saved Docs",
    profileSave: "Save Changes",

    // Chat Filters
    filterTitle: "Filter Chat",
    filterDate: "Date Range",
    filterRole: "Sender",
    filterAll: "All",
    filterUser: "User Only",
    filterAI: "AI Lawyer Only",
    filterLast24h: "Last 24 Hours",
    filterLastWeek: "Last Week",
    filterAllTime: "All Time",

    // PLANS
    plansTitle: "Pricing Plans",
    plansSubtitle: "Select the plan that fits your needs. Cancel anytime.",
    currentPlan: "Current Plan",
    subscribe: "Subscribe",

    // Features
    featRequestLimit: "requests / day",
    featUnlimited: "Unlimited requests",
    featDocs: "document analyses",
    featNoDocs: "No document uploads",
    featSpeedNormal: "Standard Speed",
    featSpeedFast: "Pro Speed",
    featLive: "Live Voice Chat",
    featLiveLimit: "min/day",
    featReasoning: "Deep Legal Reasoning",
    featSupport: "Customer Support",
    featMobile: "Mobile Access",
    featHistory: "History Retention",
    featAds: "Ad-free Experience",
    featExport: "PDF Export",

    // Plan Names & Prices
    pFreeName: "Free",
    pFreePrice: "0",
    pDayName: "Day Pro",
    pDayPrice: "15,000",
    pWeekName: "Week Pro",
    pWeekPrice: "49,000",
    pMonthName: "Month Pro",
    pMonthPrice: "119,000",
    pLawyerName: "Lawyer Pro",
    pLawyerPrice: "299,000",

    currency: "UZS",
    bestValue: "Best Value",
  }
};

export const INITIAL_SETTINGS: UserSettings = {
  answerLength: 'Medium',
  tone: 'Simple',
  outputStyle: 'Bullet points',
  clarifyingQuestions: true,
  documentType: 'General',
  perspective: 'Neutral',
};

// Database of facts for "Did You Know" section
export const DID_YOU_KNOW_FACTS = {
  [Language.UZ]: [
    { title: "Yangi Mehnat Kodeksi", content: "2023-yilgi Mehnat kodeksi xodimlar uchun yillik asosiy ta'tilni kamida 21 kalendar kuni etib belgiladi.", button: "Ta'til haqida so'rash" },
    { title: "O'zini o'zi band qilish", content: "O'zini o'zi band qilgan shaxslar daromad solig'idan ozod etiladi va staj hisoblash uchun ixtiyoriy ijtimoiy soliq to'lashi mumkin.", button: "Soliq imtiyozlari" },
    { title: "Aliment To'lovlari", content: "Agar ota-ona ishsiz bo'lsa, aliment miqdori o'rtacha oylik ish haqidan kelib chiqib hisoblanadi.", button: "Aliment hisoblash" },
    { title: "Tadbirkorlik", content: "Yangi ro'yxatdan o'tgan yakka tartibdagi tadbirkorlar faoliyatining dastlabki davrida soliq imtiyozlariga ega bo'lishlari mumkin.", button: "Biznes boshlash" },
    { title: "Elektron Hukumat", content: "My.gov.uz orqali sudlanmaganlik haqida ma'lumotnoma va boshqa 300+ davlat xizmatlaridan uydan chiqmasdan foydalanishingiz mumkin.", button: "E-xizmatlar" },
    { title: "Nikoh Shartnomasi", content: "Nikoh shartnomasi er va xotinning mulkiy huquqlarini belgilaydi va nikohdan oldin yoki nikoh davrida istalgan vaqtda tuzilishi mumkin.", button: "Nikoh shartnomasi" },
    { title: "Meros Huquqi", content: "Vasiyatnoma bo'lmaganda, meros qonun bo'yicha vorislarga (farzandlar, er-xotin va ota-onalar birinchi navbatda) teng miqdorda o'tadi.", button: "Meros tartibi" }
  ],
  [Language.RU]: [
    { title: "Новый Трудовой Кодекс", content: "Новый Трудовой кодекс 2023 года установил минимальный ежегодный отпуск в размере 21 календарного дня.", button: "Спросить об отпуске" },
    { title: "Самозанятость", content: "Самозанятые лица освобождаются от подоходного налога и могут платить социальный налог для стажа добровольно.", button: "Налоговые льготы" },
    { title: "Алименты", content: "Если родитель безработный, алименты рассчитываются исходя из средней заработной платы по стране.", button: "Расчет алиментов" },
    { title: "Предпринимательство", content: "Новые индивидуальные предприниматели могут иметь налоговые каникулы в начальный период деятельности.", button: "Начать бизнес" },
    { title: "Электронное правительство", content: "Через My.gov.uz можно получить справку о несудимости и еще более 300 госуслуг, не выходя из дома.", button: "Э-услуги" },
    { title: "Брачный контракт", content: "Брачный договор регулирует имущественные права супругов и может быть заключен как до брака, так и в любой момент в браке.", button: "Брачный контракт" },
    { title: "Наследство", content: "При отсутствии завещания наследство переходит наследникам по закону (дети, супруг и родители в первую очередь) в равных долях.", button: "Порядок наследования" }
  ],
  [Language.EN]: [
    { title: "New Labor Code", content: "The 2023 Labor Code set the minimum annual leave for employees to at least 21 calendar days.", button: "Ask about Leave" },
    { title: "Self-Employment", content: "Self-employed individuals are exempt from income tax and can pay voluntary social tax to accrue pension tenure.", button: "Tax Benefits" },
    { title: "Alimony Payments", content: "If a parent is unemployed, alimony is calculated based on the average national monthly salary.", button: "Calculate Alimony" },
    { title: "Entrepreneurship", content: "Newly registered individual entrepreneurs may qualify for tax holidays during their initial period.", button: "Start Business" },
    { title: "E-Government", content: "Via My.gov.uz, you can obtain a criminal record certificate and access over 300+ government services from home.", button: "E-Services" },
    { title: "Prenuptial Agreement", content: "A marriage contract defines property rights and can be signed before marriage or at any time during the marriage.", button: "Prenup Info" },
    { title: "Inheritance Law", content: "In the absence of a will, inheritance passes to heirs by law (children, spouse, and parents first) in equal shares.", button: "Inheritance rules" }
  ]
};

export const TOPICS_DATA = {
  [Language.UZ]: [
    {
      category: "Oila Huquqi",
      items: [
        { title: "Ajrashish tartibi", prompt: "Ajrashish tartibi qanday? Sudga qanday hujjatlar kerak?" },
        { title: "Aliment undirish", prompt: "Aliment undirish uchun nima qilish kerak? Miqdori qancha?" },
        { title: "Nikoh shartnomasi", prompt: "Nikoh shartnomasi qanday tuziladi va u nimalarni o'z ichiga oladi?" },
        { title: "Vasiylik va homiylik", prompt: "Bolaga vasiylikni rasmiylashtirish tartibi qanday?" }
      ]
    },
    {
      category: "Mehnat Huquqi",
      items: [
        { title: "Mehnat ta'tili", prompt: "Yillik mehnat ta'tili necha kun bo'lishi kerak va qanday hisoblanadi?" },
        { title: "Ishdan bo'shatish", prompt: "Xodimni ishdan bo'shatishning qonuniy asoslari qanday?" },
        { title: "Ish haqi va ustamalar", prompt: "Ish haqi kechiktirilsa nima qilish kerak?" },
        { title: "Homiladorlik ta'tili", prompt: "Homiladorlik va tug'ish ta'tili qanday to'lanadi?" }
      ]
    },
    {
      category: "Mulk va Uy-joy",
      items: [
        { title: "Uy-joy oldi-sotdisi", prompt: "Uy-joy oldi-sotdi shartnomasini notariusda tasdiqlash uchun nimalar kerak?" },
        { title: "Ijara shartnomasi", prompt: "Ijaraga beruvchi va oluvchining huquqlari qanday?" },
        { title: "Merosni rasmiylashtirish", prompt: "Merosga egalik qilish huquqi qachon va qanday paydo bo'ladi?" },
        { title: "Kadastr hujjatlari", prompt: "Kadastr pasportini qanday yangilash mumkin?" }
      ]
    },
    {
      category: "Iste'molchilar Huquqi",
      items: [
        { title: "Tovarni qaytarish", prompt: "Sifatsiz tovarni qanday qaytarib berish yoki almashtirish mumkin?" },
        { title: "Kafolat muddati", prompt: "Kafolat muddati ichida tovar buzilsa nima qilish kerak?" },
        { title: "Xizmat ko'rsatish sifati", prompt: "Sifatsiz xizmat ko'rsatilganida pulni qaytarishni talab qilsa bo'ladimi?" }
      ]
    },
    {
      category: "Avtomobil va YHQ",
      items: [
        { title: "Jarima to'lash", prompt: "Jarimani onlayn to'lash va chegirmadan foydalanish tartibi qanday?" },
        { title: "YTH sodir bo'lganda", prompt: "YTH sodir bo'lganda sug'urta to'lovini qanday olish mumkin?" },
        { title: "Ishonchnoma berish", prompt: "Avtomobil boshqarish uchun ishonchnoma turlari va narxlari." }
      ]
    },
    {
      category: "Biznes va Soliq",
      items: [
        { title: "YATT ochish", prompt: "Yakka tartibdagi tadbirkor sifatida ro'yxatdan o'tish tartibi." },
        { title: "MCHJ ochish", prompt: "MCHJ ta'sis hujjatlarini qanday tayyorlash kerak?" },
        { title: "Soliq imtiyozlari", prompt: "Kichik biznes uchun qanday soliq imtiyozlari mavjud?" }
      ]
    },
    {
      category: "Intellektual Mulk",
      items: [
        { title: "Mualliflik huquqi", prompt: "Mualliflik huquqini qanday ro'yxatdan o'tkazish mumkin?" },
        { title: "Patent olish", prompt: "Ixtiro uchun patent olish tartibi qanday?" },
        { title: "Savdo belgisi", prompt: "O'z brendimni qanday himoya qilishim mumkin?" }
      ]
    },
    {
      category: "Qurilish Huquqi",
      items: [
        { title: "Qurilish ruxsatnomasi", prompt: "Uy qurish uchun qanday ruxsatnomalar kerak?" },
        { title: "Yer uchastkasi", prompt: "Yer uchastkasini qanday qilib qonuniy rasmiylashtirish mumkin?" },
        { title: "Pudrat shartnomasi", prompt: "Qurilish pudrat shartnomasida nimalarga e'tibor berish kerak?" }
      ]
    },
    {
      category: "Sog'liqni Saqlash",
      items: [
        { title: "Tibbiy sug'urta", prompt: "Majburiy tibbiy sug'urta tizimi qanday ishlaydi?" },
        { title: "Bemor huquqlari", prompt: "Shifokor xatosi tufayli yetkazilgan zararni undirish tartibi." },
        { title: "Dori vositalari", prompt: "Sifatsiz dori vositalari sotilganda qayerga murojaat qilish kerak?" }
      ]
    }
  ],
  [Language.RU]: [
    {
      category: "Семейное Право",
      items: [
        { title: "Порядок развода", prompt: "Как подать на развод? Какие документы нужны для суда?" },
        { title: "Взыскание алиментов", prompt: "Как подать на алименты и как рассчитывается сумма?" },
        { title: "Брачный договор", prompt: "Как составить брачный контракт и что в нем можно указать?" },
        { title: "Опека и попечительство", prompt: "Как оформить опеку над ребенком?" }
      ]
    },
    {
      category: "Трудовое Право",
      items: [
        { title: "Трудовой отпуск", prompt: "Сколько дней длится ежегодный отпуск и как он оплачивается?" },
        { title: "Увольнение", prompt: "Законные основания для увольнения сотрудника." },
        { title: "Зарплата и надбавки", prompt: "Что делать, если задерживают зарплату?" },
        { title: "Декретный отпуск", prompt: "Как рассчитывается и оплачивается декретный отпуск?" }
      ]
    },
    {
      category: "Имущество и Жилье",
      items: [
        { title: "Купля-продажа жилья", prompt: "Какие документы нужны для нотариального оформления купли-продажи квартиры?" },
        { title: "Договор аренды", prompt: "Права и обязанности арендатора и арендодателя." },
        { title: "Оформление наследства", prompt: "Как вступить в наследство по закону или завещанию?" },
        { title: "Кадастр", prompt: "Как восстановить или обновить кадастровые документы?" }
      ]
    },
    {
      category: "Права Потребителей",
      items: [
        { title: "Возврат товара", prompt: "Как вернуть некачественный товар в магазин?" },
        { title: "Гарантийный срок", prompt: "Что делать, если товар сломался в период гарантии?" },
        { title: "Некачественные услуги", prompt: "Как вернуть деньги за плохо оказанную услугу?" }
      ]
    },
    {
      category: "Авто и ПДД",
      items: [
        { title: "Оплата штрафов", prompt: "Как оплатить штраф ГАИ со скидкой?" },
        { title: "ДТП и страховка", prompt: "Как получить страховую выплату при ДТП?" },
        { title: "Доверенность на авто", prompt: "Виды доверенностей на управление автомобилем." }
      ]
    },
    {
      category: "Бизнес и Налоги",
      items: [
        { title: "Открыть ИП", prompt: "Порядок регистрации индивидуального предпринимателя." },
        { title: "Регистрация ООО", prompt: "Как открыть ООО и какие документы нужны?" },
        { title: "Налоговые льготы", prompt: "Какие налоговые льготы есть для малого бизнеса?" }
      ]
    },
    {
      category: "Интеллектуальная Собственность",
      items: [
        { title: "Авторское право", prompt: "Как зарегистрировать авторское право?" },
        { title: "Получение патента", prompt: "Каков порядок получения патента на изобретение?" },
        { title: "Торговая марка", prompt: "Как защитить свой бренд и торговую марку?" }
      ]
    },
    {
      category: "Строительное Право",
      items: [
        { title: "Разрешение на строительство", prompt: "Какие разрешения нужны для строительства дома?" },
        { title: "Земельный участок", prompt: "Как законно оформить земельный участок?" },
        { title: "Договор подряда", prompt: "На что обратить внимание в договоре строительного подряда?" }
      ]
    },
    {
      category: "Здравоохранение",
      items: [
        { title: "Медицинское страхование", prompt: "Как работает система обязательного медицинского страхования?" },
        { title: "Права пациентов", prompt: "Порядок возмещения вреда, причиненного врачебной ошибкой." },
        { title: "Лекарственные средства", prompt: "Куда жаловаться при продаже некачественных лекарств?" }
      ]
    }
  ],
  [Language.EN]: [
    {
      category: "Family Law",
      items: [
        { title: "Divorce Procedure", prompt: "What is the procedure for divorce? What documents are needed?" },
        { title: "Alimony Collection", prompt: "How to file for alimony and how much is it?" },
        { title: "Prenuptial Agreement", prompt: "How to create a prenuptial agreement?" },
        { title: "Guardianship", prompt: "How to establish guardianship over a child?" }
      ]
    },
    {
      category: "Labor Law",
      items: [
        { title: "Annual Leave", prompt: "What is the minimum annual leave duration and how is it calculated?" },
        { title: "Dismissal", prompt: "What are the legal grounds for terminating an employee?" },
        { title: "Salary Issues", prompt: "What to do if salary payment is delayed?" },
        { title: "Maternity Leave", prompt: "How is maternity leave paid and calculated?" }
      ]
    },
    {
      category: "Property & Housing",
      items: [
        { title: "Buying Property", prompt: "What documents are required for buying a house/apartment?" },
        { title: "Rental Agreement", prompt: "What are the rights of landlords and tenants?" },
        { title: "Inheritance", prompt: "How to claim inheritance under the law?" },
        { title: "Cadastre", prompt: "How to update cadastral documentation?" }
      ]
    },
    {
      category: "Consumer Rights",
      items: [
        { title: "Return of Goods", prompt: "How to return defective goods to the seller?" },
        { title: "Warranty", prompt: "What to do if a product breaks during the warranty period?" },
        { title: "Service Quality", prompt: "Can I get a refund for poor quality services?" }
      ]
    },
    {
      category: "Auto & Traffic",
      items: [
        { title: "Traffic Fines", prompt: "How to pay traffic fines with a discount?" },
        { title: "Accidents & Insurance", prompt: "How to claim insurance after a traffic accident?" },
        { title: "Car Power of Attorney", prompt: "Types of power of attorney for driving a car." }
      ]
    },
    {
      category: "Business & Tax",
      items: [
        { title: "Start Sole Proprietorship", prompt: "How to register as an individual entrepreneur?" },
        { title: "Register LLC", prompt: "Procedure for opening a Limited Liability Company." },
        { title: "Tax Benefits", prompt: "What tax incentives are available for small businesses?" }
      ]
    },
    {
      category: "Intellectual Property",
      items: [
        { title: "Copyright", prompt: "How to register copyright?" },
        { title: "Patent", prompt: "What is the procedure for obtaining a patent for an invention?" },
        { title: "Trademark", prompt: "How can I protect my brand and trademark?" }
      ]
    },
    {
      category: "Construction Law",
      items: [
        { title: "Building Permit", prompt: "What permits are needed to build a house?" },
        { title: "Land Plot", prompt: "How to legally register a land plot?" },
        { title: "Contract Agreement", prompt: "What to look for in a construction contract?" }
      ]
    },
    {
      category: "Healthcare Regulations",
      items: [
        { title: "Medical Insurance", prompt: "How does the mandatory health insurance system work?" },
        { title: "Patient Rights", prompt: "Procedure for compensation of damages caused by medical error." },
        { title: "Medicines", prompt: "Where to complain about the sale of low-quality medicines?" }
      ]
    }
  ]
};