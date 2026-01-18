import { Language, UserSettings } from './types';

export const INITIAL_SETTINGS: UserSettings = {
  answerLength: 'Medium',
  tone: 'Simple',
  outputStyle: 'Paragraphs',
  clarifyingQuestions: true,
  documentType: 'General',
  perspective: 'Neutral',
};

export const DID_YOU_KNOW_FACTS = {
  [Language.UZ]: [
    { title: "Yangi Mehnat Kodeksi", content: "2023-yilgi Mehnat kodeksi xodimlar uchun yillik asosiy ta'tilni kamida 21 kalendar kuni etib belgiladi.", button: "Ta'til haqida so'rash" },
    { title: "O'zini o'zi band qilish", content: "O'zini o'zi band qilgan shaxslar daromad solig'idan ozod etiladi va staj hisoblash uchun ixtiyoriy ijtimoiy soliq to'lashi mumkin.", button: "Soliq imtiyozlari" },
    { title: "Aliment To'lovlari", content: "Agar ota-ona ishsiz bo'lsa, aliment miqdori o'rtacha oylik ish haqidan kelib chiqib hisoblanadi.", button: "Aliment hisoblash" },
    { title: "Tadbirkorlik", content: "Yangi ro'yxatdan o'tgan yakka tartibdagi tadbirkorlar faoliyatining dastlabki davrida soliq imtiyozlariga ega bo'lishlari mumkin.", button: "Biznes boshlash" },
    { title: "Elektron Hukumat", content: "My.gov.uz orqali sudlanmaganlik haqida ma'lumotnoma va boshqa 300+ davlat xizmatlaridan uydan chiqmasdan foydalanishingiz mumkin.", button: "E-xizmatlar" },
    { title: "Nikoh Shartnomasi", content: "Nikoh shartnomasi er va xotinning mulkiy huquqlarini belgilaydi va nikohdan oldin yoki nikoh davrida istalgan vaqtda tuzilishi mumkin.", button: "Nikoh shartnomasi" },
    { title: "Meros Huquqi", content: "Vasiyatnoma bo'lmaganda, meros qonun bo'yicha vorislarga (farzandlar, er-xotin va ota-onalar birinchi navbatda) teng miqdorda o'tadi.", button: "Meros tartibi" },
    { title: "Iste'molchi Huquqlari", content: "Sifatsiz mahsulotni 10 kun ichida qaytarib berish yoki almashtirish huquqiga egasiz (oziq-ovqat bo'lmagan tovarlar uchun).", button: "Qaytarish qoidalari" },
    { title: "Propiska Tizimi", content: "Toshkent shahrida uy sotib olish uchun propiska talabi bekor qilingan. Endi istalgan fuqaro ko'chmas mulk xarid qilishi mumkin.", button: "Propiska savollari" },
    { title: "Soliq Keshbek", content: "Soliq hamkor ilovasi orqali xarid chekini ro'yxatdan o'tkazib, 1% keshbek olishingiz mumkin.", button: "Soliq ilovasi" },
    { title: "Yer Uchastkalari", content: "Yer uchastkalarini faqat E-auksion orqali qonuniy sotib olish yoki ijaraga olish mumkin. Hokim qarori bilan yer ajratish taqiqlangan.", button: "Yer olish" },
    { title: "Kripto-aktivlar", content: "O'zbekistonda kriptovalyuta savdosi faqat litsenziyaga ega milliy provayderlar orqali amalga oshirilishi qonuniy hisoblanadi.", button: "Kripto qonunlari" },
    { title: "Dronlardan Foydalanish", content: "Ruxsatsiz dron uchirish O'zbekistonda ma'muriy va jinoiy javobgarlikka sabab bo'lishi mumkin.", button: "Dron qoidalari" },
    { title: "Nikoh Yoshi", content: "O'zbekistonda erkaklar va ayollar uchun nikoh yoshi 18 yosh etib belgilangan.", button: "Oila qonunchiligi" },
    { title: "Haftalik Ish Soati", content: "Oddiy ish haftasi 40 soatdan oshmasligi kerak. Ortiqcha ishlagan vaqt uchun ikki hissa haq to'lanadi.", button: "Ish vaqti" },
    { title: "Talabalar Kontrakti", content: "Kontrakt to'lovini to'laganlik uchun daromad solig'idan imtiyoz (12% qaytarib olish) mavjud.", button: "Kontrakt imtiyozi" },
    { title: "Advokat So'rovi", content: "Davlat organlari va tashkilotlari advokat so'roviga 15 kun ichida javob berishi shart.", button: "Advokat huquqi" },
    { title: "Tungi Vaqt", content: "Tungi soat 23:00 dan 06:00 gacha turar joylarda shovqin solish ma'muriy javobgarlikka sabab bo'ladi.", button: "Tinchlik saqlash" },
    { title: "Avto Tonirovka", content: "Avtomobil oynalarini qoraytirish uchun ruxsatnoma my.gov.uz orqali online olinganda arzonroq tushadi.", button: "Tonirovka narxi" },
    { title: "Pensiya Yoshi", content: "Hozirgi kunda pensiya yoshi erkaklar uchun 60 yosh, ayollar uchun 55 yosh etib belgilangan.", button: "Pensiya hisoblash" }
  ],
  [Language.RU]: [
    { title: "Новый Трудовой Кодекс", content: "Новый Трудовой кодекс 2023 года установил минимальный ежегодный отпуск в размере 21 календарного дня.", button: "Спросить об отпуске" },
    { title: "Самозанятость", content: "Самозанятые лица освобождаются от подоходного налога и могут платить социальный налог для стажа добровольно.", button: "Налоговые льготы" },
    { title: "Алименты", content: "Если родитель безработный, алименты рассчитываются исходя из средней заработной платы по стране.", button: "Расчет алиментов" },
    { title: "Предпринимательство", content: "Новые индивидуальные предприниматели могут иметь налоговые каникулы в начальный период деятельности.", button: "Начать бизнес" },
    { title: "Электронное правительство", content: "Через My.gov.uz можно получить справку о несудимости и еще более 300 госуслуг, не выходя из дома.", button: "Э-услуги" },
    { title: "Брачный контракт", content: "Брачный договор регулирует имущественные права супругов и может быть заключен как до брака, так и в любой момент в браке.", button: "Брачный контракт" },
    { title: "Наследство", content: "При отсутствии завещания наследство переходит наследникам по закону (дети, супруг и родители в первую очередь) в равных долях.", button: "Порядок наследования" },
    { title: "Права потребителей", content: "Вы имеете право вернуть или обменять некачественный товар в течение 10 дней (для непродовольственных товаров).", button: "Правила возврата" },
    { title: "Прописка", content: "Требование прописки для покупки жилья в Ташкенте отменено. Теперь любой гражданин может купить недвижимость.", button: "Вопросы прописки" },
    { title: "Налоговый Кешбэк", content: "Регистрируйте чеки покупок через приложение Soliq и получайте 1% кешбэка.", button: "Приложение Soliq" },
    { title: "Земельные участки", content: "Землю можно купить или арендовать законно только через E-auksion. Выделение земли решением хокима запрещено.", button: "Получение земли" },
    { title: "Крипто-активы", content: "Торговля криптовалютой в Узбекистане легальна только через лицензированных национальных провайдеров.", button: "Законы о крипто" },
    { title: "Использование дронов", content: "Несанкционированный запуск дронов в Узбекистане может повлечь административную и уголовную ответственность.", button: "Правила дронов" },
    { title: "Брачный возраст", content: "Брачный возраст для мужчин и женщин в Узбекистане установлен на уровне 18 лет.", button: "Семейное право" },
    { title: "Рабочая неделя", content: "Нормальная рабочая неделя не должна превышать 40 часов. Сверхурочные оплачиваются в двойном размере.", button: "Рабочее время" },
    { title: "Контракт студентов", content: "Существует налоговая льгота (возврат 12% подоходного налога) при оплате контракта за обучение.", button: "Льготы студентам" },
    { title: "Адвокатский запрос", content: "Государственные органы обязаны ответить на запрос адвоката в течение 15 дней.", button: "Права адвоката" },
    { title: "Ночное время", content: "Шум в жилых помещениях с 23:00 до 06:00 влечет административную ответственность.", button: "Соблюдение тишины" },
    { title: "Тонировка авто", content: "Разрешение на тонировку стекол автомобиля дешевле при оформлении онлайн через my.gov.uz.", button: "Цена тонировки" },
    { title: "Пенсионный возраст", content: "В настоящее время пенсионный возраст составляет 60 лет для мужчин и 55 лет для женщин.", button: "Расчет пенсии" }
  ],
  [Language.EN]: [
    { title: "New Labor Code", content: "The 2023 Labor Code set the minimum annual leave for employees to at least 21 calendar days.", button: "Ask about Leave" },
    { title: "Self-Employment", content: "Self-employed individuals are exempt from income tax and can pay voluntary social tax to accrue pension tenure.", button: "Tax Benefits" },
    { title: "Alimony Payments", content: "If a parent is unemployed, alimony is calculated based on the average national monthly salary.", button: "Calculate Alimony" },
    { title: "Entrepreneurship", content: "Newly registered individual entrepreneurs may qualify for tax holidays during their initial period.", button: "Start Business" },
    { title: "E-Government", content: "Via My.gov.uz, you can obtain a criminal record certificate and access over 300+ government services from home.", button: "E-Services" },
    { title: "Prenuptial Agreement", content: "A marriage contract defines property rights and can be signed before marriage or at any time during the marriage.", button: "Prenup Info" },
    { title: "Inheritance Law", content: "In the absence of a will, inheritance passes to heirs by law (children, spouse, and parents first) in equal shares.", button: "Inheritance rules" },
    { title: "Consumer Rights", content: "You have the right to return or exchange non-food items within 10 days if they are defective or unsuitable.", button: "Return Policy" },
    { title: "Propiska System", content: "The requirement for a permanent residence permit (propiska) to buy property in Tashkent has been abolished.", button: "Propiska Info" },
    { title: "Tax Cashback", content: "You can receive 1% cashback by registering purchase receipts via the Soliq mobile app.", button: "Soliq App" },
    { title: "Land Plots", content: "Land can only be legally purchased or leased through E-auksion. Allocation by mayor's decree is prohibited.", button: "Land Acquisition" },
    { title: "Crypto Assets", content: "Cryptocurrency trading in Uzbekistan is only legal through licensed national service providers.", button: "Crypto Laws" },
    { title: "Drone Usage", content: "Unauthorized drone flying in Uzbekistan can lead to administrative and criminal liability.", button: "Drone Rules" },
    { title: "Marriage Age", content: "The legal marriage age for both men and women in Uzbekistan is set at 18 years.", button: "Family Law" },
    { title: "Work Week", content: "A normal work week must not exceed 40 hours. Overtime work must be compensated at double the rate.", button: "Working Hours" },
    { title: "Student Tuition", content: "There is a tax deduction benefit (12% refund of income tax) for paying university tuition fees.", button: "Tuition Benefits" },
    { title: "Lawyer's Request", content: "State bodies and organizations are obliged to respond to a lawyer's request within 15 days.", button: "Lawyer Rights" },
    { title: "Quiet Hours", content: "Making noise in residential areas between 23:00 and 06:00 results in administrative liability.", button: "Public Order" },
    { title: "Car Tinting", content: "Obtaining a permit for car window tinting is cheaper when applied for online via my.gov.uz.", button: "Tinting Cost" },
    { title: "Retirement Age", content: "Currently, the retirement age is 60 years for men and 55 years for women.", button: "Pension Calc" }
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
        { title: "Vasiylik va homiylik", prompt: "Bolaga vasiylikni rasmiylashtirish tartibi qanday?" },
        { title: "Ikkinchi xotin", prompt: "O'zbekistonda ko'p xotinlik uchun qanday javobgarlik bor?" },
        { title: "Oilaviy zo'ravonlik", prompt: "Oilaviy zo'ravonlik bo'lganda himoya orderini qanday olish mumkin?" }
      ]
    },
    // ... (keeping other categories same as they are likely fine)
  ],
  // ... (keeping other languages same)
};

export const TRANSLATIONS = {
  [Language.UZ]: {
    // ... existing ...
    profileLoginPrompt: "Profilingizni boshqarish uchun tizimga kiring.",
    profileLoginBtn: "Kirish / Ro'yxatdan o'tish",
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
    navOdilbek: "Odilbek (Tushuntirish)",
    navTemplates: "AI Kotib", 
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
    quickTemplates: "AI Kotib",
    quickTemplatesDesc: "Hujjatlarni avtomatlashtirish",
    openApp: "Ilovani ochish", // Localized
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
    // Added new links
    qlBank: "Bank va Kredit",
    qlHealth: "Sog'liqni Saqlash",
    qlEdu: "Ta'lim Huquqi",
    qlCustoms: "Bojxona",
    qlTax: "Soliqlar",
    qlPension: "Pensiya",
    
    // Quick Link Prompts
    qlFamilyPrompt: "Oila huquqi bo'yicha savolim bor.",
    qlLaborPrompt: "Mehnat kodeksi bo'yicha ma'lumot kerak.",
    qlCriminalPrompt: "Jinoyat kodeksi bo'yicha savolim bor.",
    qlHousingPrompt: "Uy-joy huquqi bo'yicha savolim bor.",
    qlBusinessPrompt: "Biznes bo'yicha yuridik maslahat kerak.",
    qlAdminPrompt: "Ma'muriy javobgarlik bo'yicha savol.",
    // Added prompts
    qlBankPrompt: "Bank krediti va omonatlar bo'yicha savolim bor.",
    qlHealthPrompt: "Tibbiy xizmatlar va bemor huquqlari bo'yicha savol.",
    qlEduPrompt: "Ta'lim olish, kontrakt va o'qishni ko'chirish bo'yicha savol.",
    qlCustomsPrompt: "Bojxona to'lovlari va qoidalari haqida ma'lumot kerak.",
    qlTaxPrompt: "Soliq turlari va imtiyozlar haqida so'ramoqchiman.",
    qlPensionPrompt: "Pensiya yoshi va hisoblash tartibi bo'yicha savol.",

    // Dashboard Sections
    visTitle: "KELAJAK REJALARI",
    visAutoAgents: "Avtonom Yuridik Agentlar",
    visAutoAgentsDesc: "Hujjatlarni mustaqil tayyorlaydigan va muzokara olib boradigan AI agentlar.",
    visCourtAPI: "Sud Tizimi Integratsiyasi",
    visCourtAPIDesc: "Real vaqt rejimida ishlarni kuzatish uchun E-Sud tizimi bilan integratsiya.",
    visBlockchain: "Blokcheyn Notarius",
    visBlockchainDesc: "Milliy blokcheyn orqali shartnomalarni o'zgarmas tasdiqlash.",
    visAIJudge: "AI Sud Yordamchisi Pilot",
    visAIJudgeDesc: "Sud yuklamasini kamaytirish uchun dastlabki ish baholash tizimi.",
    
    // Platform Impact Section
    statPlatformImpact: "PLATFORMA NATIJALARI",
    statUsers: "Faol Foydalanuvchilar",
    statDocs: "Yaratilgan Hujjatlar",
    statAccuracy: "Yuridik Aniqlik",
    statAIAvailability: "AI Mavjudligi",
    statLanguages: "Tillar",
    statSystemOp: "Tizim Ishlamoqda",
    footerCopyright: "Lawify Inc. © 2026",
    
    techTitle: "Ishonchli Texnologiya",
    techSecure: "Xavfsiz va Shifrlangan",
    techModel: "Ixtisoslashgan AI",
    techModelSub: "Gallyutsinatsiyasiz",
    techDatabase: "Lex.uz Bazasi",

    // Library
    libraryTitle: "Yuridik hujjatlar kutubxonasi",
    librarySubtitle: "AI Kotib yordamida har qanday hujjatni tezkor tayyorlang.",
    librarySelectPrompt: "Hujjatni boshlash uchun andozani tanlang.",
    libraryDifficulty: "Murakkablik",
    libraryComingSoon: "Tez orada",
    libraryFooter: "Barcha andozalar O'zbekiston Respublikasi qonunchiligiga to'liq mos keladi va yuristlar tomonidan tasdiqlangan.",
    
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
    topicsTitle: "Umumiy huquqiy mavzular",
    topicsSubtitle: "Formani oldindan to'ldirish uchun mavzuni tanlang",

    // History
    historyTitle: "Murojaatlar tarixi",
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
    plansTitle: "Tarif rejalari",
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
    
    // Usage Limits
    limitReachedTitle: "Kunlik limit tugadi",
    limitReachedBody: "Bugungi bepul 5 ta savol limitidan foydalandingiz. Xizmatimiz sizga ma'qul keldi degan umiddamiz! Davom ettirish uchun ertaga qaytishingiz yoki Pro tarifiga o'tib, cheklovsiz foydalanishingiz mumkin.",
    limitUpgrade: "Pro tariflarni ko'rish",
    limitReturn: "Ertaga qaytish",
    freeUsage: "Bepul so'rovlar:",

    // Odilbek
    odilbekTitle: "Odilbek AI - Yuridik Tushuntiruvchi",
    odilbekSubtitle: "AI Yurist maslahatlarini oddiy tilda tushuntirib beraman. Cheklovsiz so'rang!",
    odilbekWelcome: "Assalomu alaykum! Men Odilbekman (Oksford Magistri). Advokatimiz bergan maslahat tushunarsiz bo'ldimi? Menga yuboring, oddiy qilib tushuntirib beraman.",
    askOdilbek: "Odilbekdan so'rash (Cheklovsiz)",
    odilbekAction: "Tushuntirib berish",
    odilbekPlaceholder: "Odilbekdan xohlagan narsangizni so'rang...",
  },
  [Language.RU]: {
    profileLoginPrompt: "Пожалуйста, войдите в систему, чтобы управлять профилем и подпиской.",
    profileLoginBtn: "Войти / Регистрация",
    // ... rest of RU ...
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
    navOdilbek: "Одилбек (Объяснение)",
    navTemplates: "AI Секретарь",
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
    quickTemplates: "AI Секретарь",
    quickTemplatesDesc: "Подготовка документов",
    openApp: "Открыть приложение", // Localized
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
    // Added
    qlBank: "Банк и Кредит",
    qlHealth: "Здравоохранение",
    qlEdu: "Образование",
    qlCustoms: "Таможня",
    qlTax: "Налоги",
    qlPension: "Пенсия",

    // Quick Link Prompts
    qlFamilyPrompt: "У меня вопрос по семейному праву.",
    qlLaborPrompt: "Мне нужна информация по Трудовому кодексу.",
    qlCriminalPrompt: "У меня вопрос по Уголовному кодексу.",
    qlHousingPrompt: "У меня вопрос по жилищному праву.",
    qlBusinessPrompt: "Мне нужна юридическая консультация для бизнеса.",
    qlAdminPrompt: "Вопрос об административной ответственности.",
    // Added
    qlBankPrompt: "Вопрос по банковским кредитам и вкладам.",
    qlHealthPrompt: "Вопрос по медицинским услугам и правам пациентов.",
    qlEduPrompt: "Вопрос по образованию, контрактам и переводу.",
    qlCustomsPrompt: "Вопрос по таможенным пошлинам и правилам.",
    qlTaxPrompt: "Вопрос по налогам и льготам.",
    qlPensionPrompt: "Вопрос по пенсионному возрасту и начислению.",

    // Dashboard Sections
    visTitle: "ПЛАНЫ НА БУДУЩЕЕ",
    visAutoAgents: "Автономные Юридические Агенты",
    visAutoAgentsDesc: "AI агенты, способные автономно вести переговоры и готовить документы.",
    visCourtAPI: "Интеграция с Судом",
    visCourtAPIDesc: "Прямая интеграция с E-Sud для отслеживания дел в реальном времени.",
    visBlockchain: "Блокчейн Нотариус",
    visBlockchainDesc: "Неизменная проверка контрактов через Национальный Блокчейн.",
    visAIJudge: "Пилот AI Судьи",
    visAIJudgeDesc: "Предварительная оценка дел для снижения судебной нагрузки.",
    
    // Platform Impact Section
    statPlatformImpact: "ПОКАЗАТЕЛИ ПЛАТФОРМЫ",
    statUsers: "Активных пользователей",
    statDocs: "Документов создано",
    statAccuracy: "Юридическая точность",
    statAIAvailability: "Доступность ИИ",
    statLanguages: "Языки",
    statSystemOp: "Система работает",
    footerCopyright: "Lawify Inc. © 2026",
    
    techTitle: "Надежные Технологии",
    techSecure: "Безопасно и Зашифровано",
    techModel: "Специализированный ИИ",
    techModelSub: "Без галлюцинаций",
    techDatabase: "База Lex.uz",

    // Library
    libraryTitle: "Библиотека Документов",
    librarySubtitle: "AI Секретарь поможет составить любой документ за минуты.",
    librarySelectPrompt: "Выберите шаблон, чтобы начать.",
    libraryDifficulty: "Сложность",
    libraryComingSoon: "Скоро",
    libraryFooter: "Все шаблоны полностью соответствуют законодательству Республики Узбекистан и одобрены юристами.",

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
    pWeekName: "Дневной Pro",
    pWeekPrice: "49 000",
    pMonthName: "Месячный Pro",
    pMonthPrice: "119 000",
    pLawyerName: "Юрист Pro",
    pLawyerPrice: "299 000",

    currency: "сум",
    bestValue: "Выгодно",

    // Usage Limits
    limitReachedTitle: "Дневной лимит исчерпан",
    limitReachedBody: "Вы использовали 5 бесплатных вопросов на сегодня. Надеемся, они были полезны! Чтобы продолжить сейчас, вы можете перейти на Pro или вернуться завтра.",
    limitUpgrade: "Смотреть тарифы Pro",
    limitReturn: "Вернуться завтра",
    freeUsage: "Бесплатные запросы:",

    // Odilbek
    odilbekTitle: "Одилбек AI - Правовой Консультант", // Updated Name
    odilbekSubtitle: "Я объясню советы AI Юриста простым языком. Спрашивайте безлимитно!",
    odilbekWelcome: "Здравствуйте! Я Одилбек (Оксфордский магистр). Совет нашего адвоката показался сложным? Перешлите его мне, я всё объясню простыми словами.",
    askOdilbek: "Спросить Одилбека (Безлимитно)",
    odilbekAction: "Объяснить подробно",
    odilbekPlaceholder: "Спросите у Одилбека что угодно...",
  },
  [Language.EN]: {
    profileLoginPrompt: "Please login to manage your profile and subscription.",
    profileLoginBtn: "Login / Register",
    // ... rest of EN ...
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
    navOdilbek: "Odilbek (Explainer)",
    navTemplates: "AI Secretary",
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
    quickTemplates: "AI Secretary",
    quickTemplatesDesc: "Draft Documents",
    openApp: "Open App", // Localized
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
    // Added
    qlBank: "Bank & Credit",
    qlHealth: "Healthcare",
    qlEdu: "Education Law",
    qlCustoms: "Customs",
    qlTax: "Taxes",
    qlPension: "Pension",

    // Quick Link Prompts
    qlFamilyPrompt: "I have a question regarding Family Law.",
    qlLaborPrompt: "I need information about the Labor Code.",
    qlCriminalPrompt: "I have a question about the Criminal Code.",
    qlHousingPrompt: "I have a question about Housing Law.",
    qlBusinessPrompt: "I need legal advice for Business.",
    qlAdminPrompt: "Question about Administrative Liability.",
    // Added
    qlBankPrompt: "Question about bank loans and deposits.",
    qlHealthPrompt: "Question about medical services and patient rights.",
    qlEduPrompt: "Question about education, tuition, and transfers.",
    qlCustomsPrompt: "I need info on customs duties and regulations.",
    qlTaxPrompt: "Question about taxes and benefits.",
    qlPensionPrompt: "Question about retirement age and calculation.",

    // Dashboard Sections
    visTitle: "FUTURE PLANS",
    visAutoAgents: "Autonomous Legal Agents",
    visAutoAgentsDesc: "AI agents that can negotiate and file documents autonomously.",
    visCourtAPI: "Court API Integration",
    visCourtAPIDesc: "Direct integration with E-Sud for real-time case tracking.",
    visBlockchain: "Blockchain Notary",
    visBlockchainDesc: "Immutable contract verification via National Blockchain.",
    visAIJudge: "AI Judge Assistance Pilot",
    visAIJudgeDesc: "Preliminary case assessment to reduce judicial load.",
    
    // Platform Impact Section
    statPlatformImpact: "PLATFORM IMPACT",
    statUsers: "Active Users",
    statDocs: "Documents Generated",
    statAccuracy: "Legal Accuracy",
    statAIAvailability: "AI Availability",
    statLanguages: "Languages",
    statSystemOp: "System Operational",
    footerCopyright: "Lawify Inc. © 2026",
    
    techTitle: "Trusted Technology",
    techSecure: "Secure & Encrypted",
    techModel: "Specialized Legal AI",
    techModelSub: "No Hallucinations",
    techDatabase: "Lex.uz Database",

    // Library
    libraryTitle: "Legal Document Library",
    librarySubtitle: "Draft any document in minutes with AI Secretary.",
    librarySelectPrompt: "Select a template to start drafting.",
    libraryDifficulty: "Difficulty",
    libraryComingSoon: "Coming Soon", 
    libraryFooter: "All templates are fully compliant with the legislation of the Republic of Uzbekistan and approved by lawyers.",

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
    
    // Usage Limits
    limitReachedTitle: "Daily Limit Reached",
    limitReachedBody: "You've used your 5 free questions for today. We hope they were helpful! To continue immediately with unlimited access and deeper analysis, consider upgrading to Pro.",
    limitUpgrade: "View Pro Plans",
    limitReturn: "Come back tomorrow",
    freeUsage: "Free usage:",

    // Odilbek
    odilbekTitle: "Odilbek AI - Legal Explainer", // Updated Name
    odilbekSubtitle: "I explain AI Lawyer's advice in simple terms. Ask me anything, unlimited!",
    odilbekWelcome: "Hello! I'm Odilbek (Oxford Master Graduate). Did the Lawyer's advice sound too complicated? Send it over, and I'll break it down for you.",
    askOdilbek: "Ask Odilbek (Unlimited)",
    odilbekAction: "Explain this",
    odilbekPlaceholder: "Ask Odilbek anything...",
  }
};