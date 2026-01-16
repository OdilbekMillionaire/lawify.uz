
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
        { title: "Vasiylik va homiylik", prompt: "Bolaga vasiylikni rasmiylashtirish tartibi qanday?" },
        { title: "Ikkinchi xotin (Poligamiya)", prompt: "O'zbekistonda ko'p xotinlik uchun qanday javobgarlik bor?" },
        { title: "Oilaviy zo'ravonlik", prompt: "Oilaviy zo'ravonlik bo'lganda himoya orderini qanday olish mumkin?" }
      ]
    },
    {
      category: "Mehnat Huquqi",
      items: [
        { title: "Mehnat ta'tili", prompt: "Yillik mehnat ta'tili necha kun bo'lishi kerak va qanday hisoblanadi?" },
        { title: "Ishdan bo'shatish", prompt: "Xodimni ishdan bo'shatishning qonuniy asoslari qanday?" },
        { title: "Ish haqi va ustamalar", prompt: "Ish haqi kechiktirilsa nima qilish kerak?" },
        { title: "O'zini o'zi band qilish", prompt: "O'zini o'zi band qilgan shaxs sifatida qanday ro'yxatdan o'tiladi?" },
        { title: "Dekret ta'tili", prompt: "Homiladorlik va tug'ish ta'tili pullari kim tomonidan to'lanadi?" },
        { title: "Sinov muddati", prompt: "Ishga kirishda sinov muddati qoidalari qanday?" }
      ]
    },
    {
      category: "Mulk va Uy-joy",
      items: [
        { title: "Uy-joy oldi-sotdisi", prompt: "Uy sotib olishda notarius qanday hujjatlarni talab qiladi?" },
        { title: "Ijara shartnomasi", prompt: "Ijara shartnomasini soliq organida ro'yxatdan o'tkazish majburiymi?" },
        { title: "Merosni rasmiylashtirish", prompt: "Merosga egalik qilish huquqi qachon va qanday paydo bo'ladi?" },
        { title: "Snos (Buzilish)", prompt: "Uy buzilishga tushganda kompensatsiya qanday to'lanadi?" },
        { title: "Propiska (Ro'yxat)", prompt: "Toshkent shahrida doimiy ro'yxatga turish tartibi qanday?" },
        { title: "Kadastr", prompt: "Kadastr hujjatini yo'qotib qo'ysa nima qilish kerak?" }
      ]
    },
    {
      category: "Ta'lim va O'qish",
      items: [
        { title: "Super-kontrakt", prompt: "Super-kontrakt narxlari va to'lash tartibi qanday?" },
        { title: "O'qishni ko'chirish", prompt: "Xorijdan yoki boshqa OTMdan o'qishni ko'chirish (perevod) tartibi." },
        { title: "Magistratura", prompt: "Magistraturaga kirishda til sertifikati talab qilinadimi?" },
        { title: "Maktabgacha ta'lim", prompt: "Bolani bog'chaga joylashtirish uchun navbatga qanday turiladi?" }
      ]
    },
    {
      category: "Avtomobil va YHQ",
      items: [
        { title: "Jarima to'lash", prompt: "Jarimani onlayn to'lash va chegirmadan foydalanish tartibi qanday?" },
        { title: "Tonirovka", prompt: "Avtomobil oynalarini qoraytirish (tonirovka) narxlari va ruxsatnoma olish." },
        { title: "YTH (Avariya)", prompt: "YTH sodir bo'lganda sug'urta to'lovini olish tartibi qanday?" },
        { title: "Ishonchnoma", prompt: "Avtomobil boshqarish uchun ishonchnoma (doverennost) turlari." },
        { title: "Gaz baloni (GBO)", prompt: "Avtomobilga gaz baloni o'rnatish uchun ruxsatnoma kerakmi?" }
      ]
    },
    {
      category: "Bank va Moliya",
      items: [
        { title: "Kredit tarixi", prompt: "Kredit tarixini qanday tekshirish va to'g'irlash mumkin?" },
        { title: "Ipoteka krediti", prompt: "Yosh oilalar uchun ipoteka krediti shartlari qanday?" },
        { title: "Firibgarlik", prompt: "Plastik kartadan pul o'g'irlanganda bank javobgarmi?" },
        { title: "Mikroqarz", prompt: "Mikroqarz olish uchun qanday hujjatlar kerak?" }
      ]
    },
    {
      category: "Migratsiya va Viza",
      items: [
        { title: "Xorijga chiqish pasporti", prompt: "Zagran pasport olish uchun qayerga murojaat qilish kerak?" },
        { title: "Chet elda ishlash", prompt: "Qonuniy mehnat migratsiyasi agentligi orqali ketish tartibi." },
        { title: "Fuqarolikni olish", prompt: "O'zbekiston fuqaroligini olish tartibi qanday?" },
        { title: "Deportatsiya", prompt: "Deportatsiya qilinganligini qanday tekshirish mumkin?" }
      ]
    },
    {
      category: "Iste'molchilar Huquqi",
      items: [
        { title: "Tovarni qaytarish", prompt: "Sifatsiz tovarni qanday qaytarib berish yoki almashtirish mumkin?" },
        { title: "Kafolat muddati", prompt: "Kafolat muddati ichida tovar buzilsa nima qilish kerak?" },
        { title: "Kommunal xizmatlar", prompt: "Svet yoki gaz noqonuniy o'chirilganda kimga shikoyat qilish kerak?" },
        { title: "Onlayn savdo", prompt: "Internet do'kondan olingan mahsulotni qaytarish mumkinmi?" }
      ]
    },
    {
      category: "Tadbirkorlik (Biznes)",
      items: [
        { title: "YATT ochish", prompt: "Yakka tartibdagi tadbirkor sifatida ro'yxatdan o'tish va soliqlar." },
        { title: "MCHJ ochish", prompt: "MCHJ ochish uchun ustav fondi qancha bo'lishi kerak?" },
        { title: "Litsenziya olish", prompt: "Qaysi faoliyat turlari uchun litsenziya talab qilinadi?" },
        { title: "Subsidiyalar", prompt: "Tadbirkorlar uchun davlat tomonidan qanday subsidiyalar bor?" }
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
        { title: "Опека", prompt: "Как оформить опеку над ребенком?" },
        { title: "Вторая жена", prompt: "Какая ответственность предусмотрена за многоженство в Узбекистане?" },
        { title: "Охранный ордер", prompt: "Как получить охранный ордер при домашнем насилии?" }
      ]
    },
    {
      category: "Трудовое Право",
      items: [
        { title: "Трудовой отпуск", prompt: "Сколько дней длится ежегодный отпуск и как он оплачивается?" },
        { title: "Увольнение", prompt: "Законные основания для увольнения сотрудника." },
        { title: "Задержка зарплаты", prompt: "Что делать, если работодатель задерживает зарплату?" },
        { title: "Самозанятость", prompt: "Как зарегистрироваться как самозанятый и платить налоги?" },
        { title: "Декретные", prompt: "Кто выплачивает пособие по беременности и родам?" },
        { title: "Испытательный срок", prompt: "Правила испытательного срока при приеме на работу." }
      ]
    },
    {
      category: "Недвижимость",
      items: [
        { title: "Купля-продажа", prompt: "Какие документы требует нотариус при покупке квартиры?" },
        { title: "Аренда жилья", prompt: "Обязательно ли регистрировать договор аренды в налоговой?" },
        { title: "Наследство", prompt: "Как и в какие сроки нужно вступить в наследство?" },
        { title: "Снос жилья", prompt: "Какая компенсация положена при сносе дома (снос)?" },
        { title: "Прописка", prompt: "Порядок получения постоянной прописки в Ташкенте." },
        { title: "Кадастр", prompt: "Что делать при утере кадастровых документов?" }
      ]
    },
    {
      category: "Образование",
      items: [
        { title: "Супер-контракт", prompt: "Как рассчитывается супер-контракт и можно ли его платить частями?" },
        { title: "Перевод учебы", prompt: "Порядок перевода (перевод) учебы из зарубежного ВУЗа." },
        { title: "Магистратура", prompt: "Нужен ли языковой сертификат для поступления в магистратуру?" },
        { title: "Детский сад", prompt: "Как встать в очередь в государственный детский сад?" }
      ]
    },
    {
      category: "Авто и ГАИ",
      items: [
        { title: "Штрафы ГАИ", prompt: "Как оплатить штраф онлайн со скидкой?" },
        { title: "Тонировка", prompt: "Сколько стоит разрешение на тонировку стекол авто?" },
        { title: "Страховка ДТП", prompt: "Порядок получения выплат по страховке после ДТП." },
        { title: "Доверенность", prompt: "Виды доверенностей на управление автомобилем." },
        { title: "ГБО (Газ)", prompt: "Нужно ли разрешение на установку газового баллона?" }
      ]
    },
    {
      category: "Банки и Финансы",
      items: [
        { title: "Кредитная история", prompt: "Как проверить и исправить свою кредитную историю?" },
        { title: "Ипотека", prompt: "Условия ипотечного кредитования для молодых семей." },
        { title: "Мошенничество", prompt: "Отвечает ли банк за кражу денег с пластиковой карты?" },
        { title: "Микрозайм", prompt: "Какие документы нужны для получения микрозайма?" }
      ]
    },
    {
      category: "Миграция и Визы",
      items: [
        { title: "Загранпаспорт", prompt: "Где и как получить загранпаспорт?" },
        { title: "Работа за границей", prompt: "Легальное трудоустройство через Агентство миграции." },
        { title: "Гражданство", prompt: "Порядок получения гражданства Республики Узбекистан." },
        { title: "Депортация", prompt: "Как проверить наличие запрета на въезд (депортации)?" }
      ]
    },
    {
      category: "Права Потребителей",
      items: [
        { title: "Возврат товара", prompt: "Как вернуть некачественный товар в магазин?" },
        { title: "Гарантия", prompt: "Что делать, если товар сломался в период гарантии?" },
        { title: "Коммунальные услуги", prompt: "Куда жаловаться на незаконное отключение света или газа?" },
        { title: "Онлайн покупки", prompt: "Можно ли вернуть товар, купленный в интернет-магазине?" }
      ]
    },
    {
      category: "Бизнес",
      items: [
        { title: "Открыть ИП", prompt: "Регистрация индивидуального предпринимателя (ЯТТ) и налоги." },
        { title: "Открыть ООО", prompt: "Какой уставной фонд нужен для открытия ООО?" },
        { title: "Лицензии", prompt: "На какие виды деятельности требуется лицензия?" },
        { title: "Субсидии", prompt: "Какие государственные субсидии есть для предпринимателей?" }
      ]
    }
  ],
  [Language.EN]: [
    {
      category: "Family Law",
      items: [
        { title: "Divorce Process", prompt: "What is the divorce procedure in Uzbekistan? Required documents?" },
        { title: "Alimony", prompt: "How to file for alimony and how is it calculated?" },
        { title: "Prenuptial Agreement", prompt: "Is a prenuptial agreement valid in Uzbekistan?" },
        { title: "Child Custody", prompt: "How are child custody disputes resolved?" },
        { title: "Protection Order", prompt: "How to get a protection order in case of domestic violence?" }
      ]
    },
    {
      category: "Labor Law",
      items: [
        { title: "Annual Leave", prompt: "What is the minimum annual leave under the new Labor Code?" },
        { title: "Termination", prompt: "Legal grounds for firing an employee." },
        { title: "Unpaid Salary", prompt: "What to do if the employer delays salary payment?" },
        { title: "Self-Employment", prompt: "How to register as self-employed in Uzbekistan?" },
        { title: "Maternity Leave", prompt: "Who pays for maternity leave benefits?" }
      ]
    },
    {
      category: "Real Estate",
      items: [
        { title: "Buying Property", prompt: "What documents does a notary require to buy an apartment?" },
        { title: "Rent Registration", prompt: "Is it mandatory to register a rental agreement with the tax office?" },
        { title: "Inheritance", prompt: "What is the deadline for accepting inheritance?" },
        { title: "Demolition (Snos)", prompt: "Compensation rights when a house is demolished (snos)." },
        { title: "Propiska", prompt: "How to get permanent registration (propiska) in Tashkent?" }
      ]
    },
    {
      category: "Education",
      items: [
        { title: "Super-contract", prompt: "What is a 'super-contract' for university admission?" },
        { title: "University Transfer", prompt: "Procedure for transferring studies from abroad to Uzbekistan." },
        { title: "Masters Degree", prompt: "Is a language certificate required for Masters admission?" },
        { title: "Kindergarten", prompt: "How to apply for a public kindergarten?" }
      ]
    },
    {
      category: "Auto & Transport",
      items: [
        { title: "Traffic Fines", prompt: "How to pay traffic fines online?" },
        { title: "Tinting (Tonirovka)", prompt: "Cost and permit for car window tinting." },
        { title: "Car Insurance", prompt: "How to claim insurance after a car accident?" },
        { title: "Power of Attorney", prompt: "Types of power of attorney for driving a car." }
      ]
    },
    {
      category: "Banking & Finance",
      items: [
        { title: "Credit Score", prompt: "How to check my credit history?" },
        { title: "Mortgage", prompt: "Mortgage conditions for young families." },
        { title: "Card Fraud", prompt: "Is the bank liable for money stolen from a plastic card?" },
        { title: "Microloans", prompt: "Requirements for obtaining a microloan." }
      ]
    },
    {
      category: "Migration",
      items: [
        { title: "International Passport", prompt: "How to apply for an international travel passport?" },
        { title: "Working Abroad", prompt: "Legal ways to work abroad via the Migration Agency." },
        { title: "Citizenship", prompt: "Procedure for obtaining Uzbekistan citizenship." },
        { title: "Deportation Check", prompt: "How to check if I have a travel ban or deportation?" }
      ]
    },
    {
      category: "Consumer Rights",
      items: [
        { title: "Returns", prompt: "Can I return a defective product?" },
        { title: "Warranty", prompt: "What are my rights during the warranty period?" },
        { title: "Utilities", prompt: "Complaint procedure for illegal electricity or gas disconnection." },
        { title: "Online Shopping", prompt: "Refund rules for online purchases." }
      ]
    },
    {
      category: "Business",
      items: [
        { title: "Sole Proprietorship", prompt: "How to open a YATT (Individual Entrepreneurship)?" },
        { title: "LLC Registration", prompt: "Minimum capital required to open an LLC." },
        { title: "Licensing", prompt: "Which business activities require a license?" },
        { title: "Subsidies", prompt: "Government subsidies available for small businesses." }
      ]
    }
  ]
};

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
    navOdilbek: "Odilbek (Tushuntirish)",
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
    
    // Usage Limits
    limitReachedTitle: "Kunlik limit tugadi",
    limitReachedBody: "Bugungi bepul 5 ta savol limitidan foydalandingiz. Xizmatimiz sizga ma'qul keldi degan umiddamiz! Davom ettirish uchun ertaga qaytishingiz yoki Pro tarifiga o'tib, cheklovsiz foydalanishingiz mumkin.",
    limitUpgrade: "Pro tariflarni ko'rish",
    limitReturn: "Ertaga qaytish",
    freeUsage: "Bepul so'rovlar:",

    // Odilbek
    odilbekTitle: "Odilbek - Yuridik Tushuntiruvchi",
    odilbekSubtitle: "AI Yurist maslahatlarini oddiy tilda tushuntirib beraman. Cheklovsiz so'rang!",
    odilbekWelcome: "Assalomu alaykum! Men Odilbekman. Advokatimiz bergan maslahat tushunarsiz bo'ldimi? Menga yuboring, oddiy qilib tushuntirib beraman.",
    askOdilbek: "Odilbekdan so'rash (Cheklovsiz)",
    odilbekAction: "Tushuntirib berish",
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
    navOdilbek: "Одилбек (Объяснение)",
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

    // Usage Limits
    limitReachedTitle: "Дневной лимит исчерпан",
    limitReachedBody: "Вы использовали 5 бесплатных вопросов на сегодня. Надеемся, они были полезны! Чтобы продолжить сейчас, вы можете перейти на Pro или вернуться завтра.",
    limitUpgrade: "Смотреть тарифы Pro",
    limitReturn: "Вернуться завтра",
    freeUsage: "Бесплатные запросы:",

    // Odilbek
    odilbekTitle: "Одилбек - Правовой Консультант",
    odilbekSubtitle: "Я объясню советы AI Юриста простым языком. Спрашивайте безлимитно!",
    odilbekWelcome: "Здравствуйте! Я Одилбек. Совет нашего адвоката показался сложным? Перешлите его мне, я всё объясню простыми словами.",
    askOdilbek: "Спросить Одилбека (Безлимитно)",
    odilbekAction: "Объяснить подробно",
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
    navOdilbek: "Odilbek (Explainer)",
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
    
    // Usage Limits
    limitReachedTitle: "Daily Limit Reached",
    limitReachedBody: "You've used your 5 free questions for today. We hope they were helpful! To continue immediately with unlimited access and deeper analysis, consider upgrading to Pro.",
    limitUpgrade: "View Pro Plans",
    limitReturn: "Come back tomorrow",
    freeUsage: "Free usage:",

    // Odilbek
    odilbekTitle: "Odilbek - Legal Explainer",
    odilbekSubtitle: "I explain AI Lawyer's advice in simple terms. Ask me anything, unlimited!",
    odilbekWelcome: "Hello! I'm Odilbek. Did the Lawyer's advice sound too complicated? Send it over, and I'll break it down for you.",
    askOdilbek: "Ask Odilbek (Unlimited)",
    odilbekAction: "Explain this",
  }
};
