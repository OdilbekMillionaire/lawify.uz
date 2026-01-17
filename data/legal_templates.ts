
import { GeneratedDocument, TemplateCategory, Language } from "../types";

// --- OFFICIAL CATEGORIES (Mirrors Yurxizmat.uz) ---

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'shartnomalar',
    title: { [Language.UZ]: 'Shartnomalar', [Language.RU]: 'Договоры', [Language.EN]: 'Contracts' },
    icon: '🤝',
    subcategories: [
      {
        id: 'oldi_sotdi',
        title: { [Language.UZ]: 'Oldi-sotdi', [Language.RU]: 'Купля-продажа', [Language.EN]: 'Sales' },
        templates: [
          { id: 'contract_sales_goods', title: 'Mahsulot oldi-sotdi shartnomasi', description: 'Tovarlarni yetkazib berish va qabul qilish.', templateId: 'CONTRACT_SALES_GOODS', difficulty: 'Medium' },
          { id: 'contract_sales_auto', title: 'Avtomobil oldi-sotdi shartnomasi', description: 'Transport vositasini sotish (Notarial).', templateId: 'CONTRACT_SALES_AUTO', difficulty: 'Medium' },
          { id: 'contract_sales_real_estate', title: 'Ko\'chmas mulk oldi-sotdisi', description: 'Uy-joy yoki bino sotib olish.', templateId: 'CONTRACT_SALES_REAL_ESTATE', difficulty: 'Hard' },
          { id: 'contract_sales_equipment', title: 'Uskuna oldi-sotdi shartnomasi', description: 'Ishlab chiqarish uskunalarini sotib olish.', templateId: 'CONTRACT_SALES_EQUIPMENT', difficulty: 'Medium' }
        ]
      },
      {
        id: 'ijara',
        title: { [Language.UZ]: 'Ijara va Lizing', [Language.RU]: 'Аренда и Лизинг', [Language.EN]: 'Lease & Rent' },
        templates: [
          { id: 'rent_home', title: 'Turar joy ijara shartnomasi', description: 'Kvartira ijarasi (Soliq organiga hisobga qo\'yish uchun).', templateId: 'CONTRACT_RENT_HOME', difficulty: 'Easy' },
          { id: 'rent_commercial', title: 'Noturar joy ijara shartnomasi', description: 'Ofis, do\'kon yoki ombor ijarasi.', templateId: 'CONTRACT_RENT_COMMERCIAL', difficulty: 'Medium' },
          { id: 'rent_car', title: 'Avtomobil ijara shartnomasi', description: 'Haydovchisiz avtomobil ijarasi.', templateId: 'CONTRACT_RENT_CAR', difficulty: 'Medium' },
          { id: 'rent_equipment', title: 'Uskuna ijarasi', description: 'Qurilish yoki ishlab chiqarish uskunalari ijarasi.', templateId: 'CONTRACT_RENT_EQUIPMENT', difficulty: 'Medium' }
        ]
      },
      {
        id: 'xizmatlar',
        title: { [Language.UZ]: 'Xizmat ko\'rsatish', [Language.RU]: 'Услуги', [Language.EN]: 'Services' },
        templates: [
          { id: 'service_general', title: 'Pullik xizmat ko\'rsatish', description: 'Umumiy xizmatlar uchun universal shartnoma.', templateId: 'CONTRACT_SERVICE_GENERAL', difficulty: 'Medium' },
          { id: 'service_marketing', title: 'Marketing xizmatlari', description: 'Reklama va SMM xizmatlari.', templateId: 'CONTRACT_SERVICE_MARKETING', difficulty: 'Medium' },
          { id: 'service_transport', title: 'Yuk tashish shartnomasi', description: 'Yuklarni avtotransportda tashish.', templateId: 'CONTRACT_SERVICE_TRANSPORT', difficulty: 'Medium' },
          { id: 'service_cleaning', title: 'Tozalash xizmatlari (Klining)', description: 'Binolarni tozalash bo\'yicha.', templateId: 'CONTRACT_SERVICE_CLEANING', difficulty: 'Easy' }
        ]
      },
      {
        id: 'pudrat',
        title: { [Language.UZ]: 'Pudrat (Qurilish)', [Language.RU]: 'Подряд', [Language.EN]: 'Construction' },
        templates: [
          { id: 'pudrat_general', title: 'Pudrat shartnomasi', description: 'Qurilish-ta\'mirlash ishlari.', templateId: 'CONTRACT_CONSTRUCTION', difficulty: 'Hard' },
          { id: 'pudrat_sub', title: 'Yordamchi pudrat (Subpudrat)', description: 'Bosh pudratchi va yordamchi o\'rtasida.', templateId: 'CONTRACT_SUBCONSTRUCTION', difficulty: 'Hard' }
        ]
      },
      {
        id: 'qarz',
        title: { [Language.UZ]: 'Qarz va Moliyaviy', [Language.RU]: 'Займ и Финансы', [Language.EN]: 'Debt & Finance' },
        templates: [
          { id: 'loan_simple', title: 'Qarz shartnomasi (Foizsiz)', description: 'Jismoniy shaxslar o\'rtasida qarz.', templateId: 'CONTRACT_LOAN_SIMPLE', difficulty: 'Easy' },
          { id: 'loan_investment', title: 'Investitsiya kiritish shartnomasi', description: 'Loyiha uchun sarmoya kiritish.', templateId: 'CONTRACT_INVESTMENT', difficulty: 'Hard' },
          { id: 'debt_assignment', title: 'Qarzdan voz kechish (Cessiya)', description: 'Qarzni boshqa shaxsga o\'tkazish.', templateId: 'CONTRACT_DEBT_ASSIGNMENT', difficulty: 'Hard' }
        ]
      }
    ]
  },
  {
    id: 'sud_hujjatlari',
    title: { [Language.UZ]: 'Sud hujjatlari', [Language.RU]: 'Судебные документы', [Language.EN]: 'Court Docs' },
    icon: '⚖️',
    subcategories: [
      {
        id: 'fuqarolik_sud',
        title: { [Language.UZ]: 'Fuqarolik sudi', [Language.RU]: 'Гражданский суд', [Language.EN]: 'Civil Court' },
        templates: [
          { id: 'claim_divorce', title: 'Nikohdan ajratish (Da\'vo ariza)', description: 'Er-xotinni sud orqali ajratish.', templateId: 'COURT_CLAIM_DIVORCE', difficulty: 'Medium' },
          { id: 'claim_alimony', title: 'Aliment undirish (Sud buyrug\'i)', description: 'Voyaga yetmagan bolalar uchun.', templateId: 'COURT_ORDER_ALIMONY', difficulty: 'Easy' },
          { id: 'claim_debt', title: 'Qarzni undirish haqida da\'vo', description: 'Tilxat yoki shartnoma asosida.', templateId: 'COURT_CLAIM_DEBT', difficulty: 'Medium' },
          { id: 'claim_eviction', title: 'Uy-joydan ko\'chirish da\'vosi', description: 'Noqonuniy yashovchilarni chiqarish.', templateId: 'COURT_CLAIM_EVICTION', difficulty: 'Hard' },
          { id: 'claim_honor', title: 'Sha\'n va qadr-qimmatni himoya qilish', description: 'Tuhmat va haqorat uchun kompensatsiya.', templateId: 'COURT_CLAIM_HONOR', difficulty: 'Hard' }
        ]
      },
      {
        id: 'iqtisodiy_sud',
        title: { [Language.UZ]: 'Iqtisodiy sud', [Language.RU]: 'Экономический суд', [Language.EN]: 'Economic Court' },
        templates: [
          { id: 'eco_contract_breach', title: 'Shartnoma buzilishi bo\'yicha da\'vo', description: 'Kontragent majburiyatini bajarmaganda.', templateId: 'COURT_ECO_BREACH', difficulty: 'Hard' },
          { id: 'eco_bankruptcy', title: 'Bankrotlik to\'g\'risida ariza', description: 'To\'lovga qobiliyatsizlikni e\'lon qilish.', templateId: 'COURT_ECO_BANKRUPTCY', difficulty: 'Hard' }
        ]
      },
      {
        id: 'mamuriy_sud',
        title: { [Language.UZ]: 'Ma\'muriy sud', [Language.RU]: 'Административный суд', [Language.EN]: 'Admin Court' },
        templates: [
          { id: 'admin_traffic', title: 'JARIMA (GAI) ustidan shikoyat', description: 'Yo\'l harakati qoidabuzarligi bo\'yicha qarorni bekor qilish.', templateId: 'COURT_ADMIN_TRAFFIC', difficulty: 'Medium' },
          { id: 'admin_tax', title: 'Soliq organi qarori ustidan shikoyat', description: 'Noqonuniy hisoblangan soliqlar.', templateId: 'COURT_ADMIN_TAX', difficulty: 'Hard' }
        ]
      }
    ]
  },
  {
    id: 'kadrlar',
    title: { [Language.UZ]: 'Kadrlar (HR)', [Language.RU]: 'Кадры', [Language.EN]: 'HR' },
    icon: '📇',
    subcategories: [
      {
        id: 'mehnat_shartnomasi',
        title: { [Language.UZ]: 'Mehnat shartnomalari', [Language.RU]: 'Трудовые договоры', [Language.EN]: 'Contracts' },
        templates: [
          { id: 'hr_contract_main', title: 'Mehnat shartnomasi (Asosiy)', description: 'Doimiy ishga qabul qilish (Yangi TK).', templateId: 'HR_CONTRACT_MAIN', difficulty: 'Medium' },
          { id: 'hr_contract_fixed', title: 'Muddatli mehnat shartnomasi', description: 'Ma\'lum muddatga ishga olish.', templateId: 'HR_CONTRACT_FIXED', difficulty: 'Medium' },
          { id: 'hr_contract_remote', title: 'Masofaviy ish shartnomasi', description: 'Uyda ishlash (Freelance/Remote).', templateId: 'HR_CONTRACT_REMOTE', difficulty: 'Medium' }
        ]
      },
      {
        id: 'buyruqlar',
        title: { [Language.UZ]: 'Buyruqlar', [Language.RU]: 'Приказы', [Language.EN]: 'Orders' },
        templates: [
          { id: 'hr_order_hiring', title: 'Ishga qabul qilish buyrug\'i', description: 'Yangi xodimni rasmiylashtirish.', templateId: 'HR_ORDER_HIRING', difficulty: 'Easy' },
          { id: 'hr_order_vacation', title: 'Ta\'til berish haqida buyruq', description: 'Yillik mehnat ta\'tili.', templateId: 'HR_ORDER_VACATION', difficulty: 'Easy' },
          { id: 'hr_order_firing', title: 'Ishdan bo\'shatish buyrug\'i', description: 'Mehnat shartnomasini bekor qilish.', templateId: 'HR_ORDER_FIRING', difficulty: 'Medium' },
          { id: 'hr_order_bonus', title: 'Mukofotlash buyrug\'i', description: 'Bayram yoki yutuqlar uchun.', templateId: 'HR_ORDER_BONUS', difficulty: 'Easy' }
        ]
      },
      {
        id: 'hr_arizalar',
        title: { [Language.UZ]: 'Xodim arizalari', [Language.RU]: 'Заявления сотрудников', [Language.EN]: 'Employee Apps' },
        templates: [
          { id: 'app_vacation', title: 'Ta\'til so\'rab ariza', description: 'Mehnat ta\'tiliga chiqish.', templateId: 'HR_APP_VACATION', difficulty: 'Easy' },
          { id: 'app_resign', title: 'Ishdan bo\'shash arizasi', description: 'O\'z xohishiga ko\'ra.', templateId: 'HR_APP_RESIGN', difficulty: 'Easy' },
          { id: 'app_hiring', title: 'Ishga kirish arizasi', description: 'Rahbar nomiga.', templateId: 'HR_APP_HIRING', difficulty: 'Easy' }
        ]
      }
    ]
  },
  {
    id: 'korporativ',
    title: { [Language.UZ]: 'Korporativ', [Language.RU]: 'Корпоративные', [Language.EN]: 'Corporate' },
    icon: '🏢',
    subcategories: [
      {
        id: 'tasis',
        title: { [Language.UZ]: 'Ta\'sis hujjatlari', [Language.RU]: 'Учредительные', [Language.EN]: 'Founding Docs' },
        templates: [
          { id: 'corp_charter_llc', title: 'MCHJ Ustavi (Namuna)', description: 'Yangi MCHJ ochish uchun ustav.', templateId: 'CORP_CHARTER_LLC', difficulty: 'Hard' },
          { id: 'corp_decision_create', title: 'Ta\'sischi Qarori №1', description: 'Korxona tashkil etish haqida.', templateId: 'CORP_DECISION_CREATE', difficulty: 'Medium' },
          { id: 'corp_protocol_director', title: 'Direktorni tayinlash bayonnomasi', description: 'Yangi rahbar tayinlash.', templateId: 'CORP_PROTOCOL_DIRECTOR', difficulty: 'Medium' }
        ]
      },
      {
        id: 'faoliyat',
        title: { [Language.UZ]: 'Faoliyat jarayoni', [Language.RU]: 'Деятельность', [Language.EN]: 'Operations' },
        templates: [
          { id: 'corp_power_attorney', title: 'Ishonchnoma (Korxona nomidan)', description: 'Xodimga vakolat berish.', templateId: 'CORP_POWER_ATTORNEY', difficulty: 'Easy' },
          { id: 'corp_letter', title: 'Rasmiy xat (Blank)', description: 'Hamkorlarga yuboriladigan xat.', templateId: 'CORP_LETTER', difficulty: 'Easy' }
        ]
      }
    ]
  }
];

// --- TEMPLATE DICTIONARY (PRE-FILLED STRUCTURES) ---

export const LEGAL_TEMPLATES: Record<string, GeneratedDocument> = {
  
  // ------------------------------------------------------------------
  // SHARTNOMALAR (CONTRACTS)
  // ------------------------------------------------------------------
  "CONTRACT_SALES_GOODS": {
    title: "MAHSULOT OLDI-SOTDI SHARTNOMASI",
    isComplete: false,
    sections: [
      { heading: "1. TARAFLAR", content: "[Shahar], [Sana]\n\nBir tomondan \"[Sotuvchi Korxona Nomi]\" (keyingi o'rinlarda - Sotuvchi), Ustav asosida faoliyat yurituvchi [Sotuvchi Rahbar F.I.O] nomidan,\nIkkinchi tomondan \"[Oluvchi Korxona Nomi]\" (keyingi o'rinlarda - Sotib oluvchi), Ustav asosida faoliyat yurituvchi [Oluvchi Rahbar F.I.O] nomidan,\nushbu shartnomani quyidagilar haqida tuzdilar:" },
      { heading: "2. SHARTNOMA PREDMETI", content: "2.1. Sotuvchi o'ziga tegishli bo'lgan quyidagi mahsulotlarni (tovarlarni) Sotib oluvchiga mulk qilib topshirish, Sotib oluvchi esa ushbu mahsulotlarni qabul qilish va ular uchun belgilangan haqni to'lash majburiyatini oladi.\n2.2. Mahsulotlarning aniq ro'yxati, miqdori va narxi ushbu shartnomaning ajralmas qismi hisoblangan Spetsifikatsiyada yoki hisob-fakturada ko'rsatiladi.\n2.3. Mahsulot nomi: [Mahsulot Nomi].\n2.4. Miqdori: [Miqdor].\n2.5. Umumiy narxi: [Narx]." },
      { heading: "3. TO'LOV TARTIBI VA SHARTLARI", content: "3.1. Shartnomaning umumiy summasi: [Jami Summa] so'm.\n3.2. To'lov shakli: pul o'tkazish yo'li bilan.\n3.3. Sotib oluvchi shartnoma imzolangandan so'ng [Kun] bank ish kuni ichida shartnoma umumiy summasining [Oldindan to'lov %] foizini oldindan to'lov sifatida amalga oshiradi.\n3.4. Qolgan summa mahsulot yetkazib berilgandan va tegishli hujjatlar (yuk xati, hisob-faktura) imzolangandan so'ng [Kun] kun ichida to'lanadi." },
      { heading: "4. MAHSULOTNI YETKAZIB BERISH", content: "4.1. Mahsulot Sotib oluvchining manziliga Sotuvchining transporti orqali yetkazib beriladi.\n4.2. Yetkazib berish manzili: [Manzil].\n4.3. Yetkazib berish muddati: oldindan to'lov amalga oshirilgandan so'ng [Kun] kun ichida.\n4.4. Mahsulotni qabul qilishda taraflar sifat va miqdor bo'yicha tekshiruv o'tkazadilar." },
      { heading: "5. TARAFLARNING JAVOBGARLIGI", content: "5.1. Agar Sotuvchi mahsulotni o'z vaqtida yetkazib bermasa, kechiktirilgan har bir kun uchun yetkazib berilmagan mahsulot summasining 0.5% miqdorida penya to'laydi (lekin umumiy summaning 50% idan oshmagan holda).\n5.2. Agar Sotib oluvchi to'lovni kechiktirsa, kechiktirilgan har bir kun uchun to'lanmagan summaning 0.5% miqdorida penya to'laydi (lekin umumiy summaning 50% idan oshmagan holda)." },
      { heading: "6. FORS-MAJOR", content: "6.1. Taraflar o'zlariga bog'liq bo'lmagan holatlar (tabiiy ofatlar, urush, hukumat qarorlari) yuzaga kelganda majburiyatlardan qisman yoki to'liq ozod etiladilar." },
      { heading: "7. NIZOLARNI HAL QILISH", content: "7.1. Kelib chiqadigan nizolar muzokaralar yo'li bilan hal etiladi.\n7.2. Kelishuvga erishilmagan taqdirda, nizo O'zbekiston Respublikasining Iqtisodiy sudlarida ko'rib chiqiladi." },
      { heading: "8. REKVIZITLAR VA IMZOLAR", content: "SOTUVCHI:\nNomi: [Sotuvchi Korxona Nomi]\nManzil: [Sotuvchi Manzil]\nSTIR: [Sotuvchi STIR]\nHisob raqam: [Sotuvchi HR]\nBank: [Sotuvchi Bank]\n\nSOTIB OLUVCHI:\nNomi: [Oluvchi Korxona Nomi]\nManzil: [Oluvchi Manzil]\nSTIR: [Oluvchi STIR]\nHisob raqam: [Oluvchi HR]\nBank: [Oluvchi Bank]\n\nSotuvchi: ________________ [Imzo]\nSotib oluvchi: ________________ [Imzo]" }
    ]
  },
  "CONTRACT_RENT_HOME": {
    title: "UY-JOY IJARA SHARTNOMASI",
    isComplete: false,
    sections: [
      { heading: "1. TARAFLAR", content: "Ijaraga beruvchi: [Beruvchi F.I.O], Pasport: [Seriya Raqam], doimiy yashash manzili: [Beruvchi Manzil] (keyingi o'rinlarda - Ijaraga beruvchi).\nIjarachi: [Ijarachi F.I.O], Pasport: [Seriya Raqam], doimiy yashash manzili: [Ijarachi Manzil] (keyingi o'rinlarda - Ijarachi)." },
      { heading: "2. SHARTNOMA PREDMETI", content: "2.1. Ijaraga beruvchi o'ziga mulk huquqi asosida tegishli bo'lgan [Manzil] manzilida joylashgan, [Xonalar Soni] xonali kvartirani (uy-joyni) Ijarachiga vaqtincha yashash uchun haq evaziga foydalanishga topshiradi.\n2.2. Uy-joyning kadastr raqami: [Kadastr Raqami]." },
      { heading: "3. IJARA MUDDATI VA TO'LOV", content: "3.1. Shartnoma [Muddat Boshlanishi] dan [Muddat Tugashi] gacha bo'lgan muddatga tuzildi.\n3.2. Oylik ijara haqi [Summa] so'm qilib belgilanadi.\n3.3. To'lov har oyning [Sana] kunigacha naqd pul yoki plastik karta orqali amalga oshiriladi.\n3.4. Kommunal to'lovlar (elektr, gaz, suv, issiqlik, chiqindi) Ijarachi tomonidan alohida to'lanadi." },
      { heading: "4. TARAFLARNING HUQUQ VA MAJBURIYATLARI", content: "4.1. Ijaraga beruvchi:\n- Uy-joyni yashash uchun yaroqli holatda topshirish;\n- Ijarachining tinch yashashiga xalaqit bermaslik;\n- Uyni sotish yoki boshqacha tasarruf etishdan oldin Ijarachini 1 oy oldin ogohlantirish.\n4.2. Ijarachi:\n- Ijara haqini o'z vaqtida to'lash;\n- Uy-joydan faqat yashash maqsadi uchun foydalanish;\n- Uyni ozoda saqlash va buzmaslik;\n- Qo'shnilarning tinchligini buzmaslik." },
      { heading: "5. SHARTNOMANI BEKOR QILISH", content: "5.1. Taraflar kelishuvi bilan istalgan vaqtda.\n5.2. Ijarachi ijara haqini ikki marta va undan ortiq to'lamagan taqdirda, Ijaraga beruvchi shartnomani bir tomonlama bekor qilishga haqli.\n5.3. Uy-joyga jiddiy zarar yetkazilganda." },
      { heading: "6. QO'SHIMCHA SHARTLAR", content: "6.1. Ushbu shartnoma Davlat soliq xizmati organlarida hisobga qo'yilishi shart.\n6.2. Shartnoma uch nusxada tuzildi: bir nusxasi Ijaraga beruvchida, bir nusxasi Ijarachida, bir nusxasi Soliq organida." },
      { heading: "7. TARAFLARNING IMZOLARI", content: "IJARAGA BERUVCHI: ________________ [Imzo]\nIJARACHI: ________________ [Imzo]" }
    ]
  },
  "CONTRACT_LOAN_SIMPLE": {
    title: "QARZ SHARTNOMASI",
    isComplete: false,
    sections: [
      { heading: "1. TARAFLAR", content: "[Sana], [Shahar]\nQarz beruvchi: [Beruvchi F.I.O], Pasport: [Seriya Raqam], Manzil: [Manzil].\nQarz oluvchi: [Oluvchi F.I.O], Pasport: [Seriya Raqam], Manzil: [Manzil]." },
      { heading: "2. SHARTNOMA MAZMUNI", content: "2.1. Qarz beruvchi Qarz oluvchiga [Summa] ([Summa so'z bilan]) so'm miqdorida pul mablag'ini mulk qilib beradi, Qarz oluvchi esa ushbu summani belgilangan muddatda qaytarish majburiyatini oladi.\n2.2. Qarz foizsiz beriladi." },
      { heading: "3. QAYTARISH MUDDATI VA TARTIBI", content: "3.1. Qarz oluvchi olingan pul mablag'ini [Qaytarish Sanasi] ga qadar to'liq qaytarishi shart.\n3.2. Qarzni qismlab qaytarishga ruxsat beriladi/berilmaydi [Tanlang].\n3.3. Qarz naqd pul shaklida yoki plastik karta orqali qaytarilishi mumkin." },
      { heading: "4. TARAFLARNING JAVOBGARLIGI", content: "4.1. Agar Qarz oluvchi qarzni o'z vaqtida qaytarmasa, u kechiktirilgan har bir kun uchun qaytarilmagan summaning 0.1% miqdorida penya to'laydi.\n4.2. Qarzni qaytarishdan bosh tortgan taqdirda, Qarz beruvchi sudga murojaat qilish huquqiga ega va barcha sud xarajatlari Qarz oluvchi hisobidan qoplanadi." },
      { heading: "5. NIZOLARNI HAL QILISH", content: "5.1. Ushbu shartnoma bo'yicha kelib chiqadigan barcha nizolar o'zaro kelishuv yo'li bilan hal etiladi.\n5.2. Kelishuvga erishilmagan taqdirda, nizo Qarz beruvchi yashaydigan hududdagi fuqarolik sudida ko'rib chiqiladi." },
      { heading: "6. IMZOLAR", content: "Qarz beruvchi: ____________________ [Imzo]\nQarz oluvchi: ____________________ [Imzo]" }
    ]
  },

  // ------------------------------------------------------------------
  // SUD HUJJATLARI (COURT)
  // ------------------------------------------------------------------
  "COURT_CLAIM_DIVORCE": {
    title: "NIKOHDAN AJRATISH HAQIDA DA'VO ARIZA",
    isComplete: false,
    sections: [
      { heading: "SUDGA", content: "Fuqarolik ishlari bo'yicha [Tuman] tumanlararo sudiga\n\nDa'vogar: [Da'vogar F.I.O]\nManzil: [Manzil]\nTelefon: [Tel]\n\nJavobgar: [Javobgar F.I.O]\nManzil: [Manzil]\nTelefon: [Tel]" },
      { heading: "DA'VO MAZMUNI", content: "Men va javobgar [Javobgar F.I.O] o'rtamizda [Nikoh Sanasi] kuni [FHDYO Bo'limi] tomonidan qonuniy nikoh qayd etilgan (Guvohnoma raqami: [Guvohnoma No]).\nBirgalikdagi turmushimizdan [Bolalar Soni] nafar farzandimiz bor: [Bolalar F.I.O va Tug'ilgan yili].\nBizning oilaviy hayotimiz o'zaro xarakterlarimiz to'g'ri kelmasligi va oilaviy kelishmovchiliklar sababli o'xshamadi. Biz [Qachondan] beri alohida yashayapmiz. Oilani tiklash uchun imkoniyat yo'q deb hisoblayman. Mahalla yarashuv komissiyasining harakatlari ham natija bermadi.\nMen javobgar bilan kelgusida birga yashashni va oilani saqlab qolishni imkonsiz deb bilaman." },
      { heading: "HUQUQIY ASOS", content: "O'zbekiston Respublikasi Oila kodeksining 41-moddasiga asosan, er-xotinning bundan buyon birga yashashiga va oilani saqlab qolishga imkoniyat bo'lmagan taqdirda, nikoh sud tartibida tugatiladi." },
      { heading: "TALAB", content: "Yuqoridagilarni inobatga olib, suddan:\nMen va javobgar [Javobgar F.I.O] o'rtasidagi [Nikoh Sanasi] da qayd etilgan nikohni bekor qilishingizni so'rayman." },
      { heading: "ILOVA QILINADIGAN HUJJATLAR", content: "1. Da'vo ariza nusxasi (javobgar uchun).\n2. Pasport nusxasi.\n3. Nikoh tuzilganligi haqida guvohnoma (asl nusxasi).\n4. Bolalarning tug'ilganlik haqida guvohnomalari nusxalari.\n5. Yashash joyidan ma'lumotnoma (mahalla).\n6. Davlat boji to'langanligi haqida kvitansiya.\n7. Yarashuv komissiyasi xulosasi (agar mavjud bo'lsa)." },
      { heading: "IMZO", content: "Sana: [Sana]\nImzo: ________________ [Da'vogar F.I.O]" }
    ]
  },
  "COURT_ORDER_ALIMONY": {
    title: "ALIMENT UNDIRISH (SUD BUYRUG'I)",
    isComplete: false,
    sections: [
      { heading: "SUDGA", content: "FIB [Tuman] tumanlararo sudiga\nUndiruvchi: [Undiruvchi F.I.O], Manzil: [Manzil], Tel: [Tel]\nQarzdor: [Qarzdor F.I.O], Manzil: [Manzil], Tel: [Tel]" },
      { heading: "MAZMUNI", content: "Qarzdor [Qarzdor F.I.O] bilan [Nikoh Sanasi] da qonuniy nikohdan o'tganmiz. Bizning o'rtamizda [Bolalar Soni] nafar farzandimiz bor: [Bolalar Ismi va Yoshi].\nHozirgi kunda bolalar mening qaramog'imda yashamoqda. Qarzdor bolalarning moddiy ta'minoti uchun ixtiyoriy ravishda yordam bermayapti. Oila kodeksining 96-moddasiga ko'ra, ota-ona voyaga yetmagan bolalariga ta'minot berishi shart." },
      { heading: "TALAB", content: "O'zbekiston Respublikasi Oila kodeksining 99-moddasiga asosan, Qarzdor [Qarzdor F.I.O] dan voyaga yetmagan farzandlarim ta'minoti uchun ish haqi va boshqa daromadlarining [1/4, 1/3, 1/2] qismi miqdorida aliment undirish haqida sud buyrug'i chiqarishingizni so'rayman." },
      { heading: "ILOVA", content: "1. Pasport nusxasi.\n2. Nikoh guvohnomasi (yoki ajrashganlik guvohnomasi).\n3. Bolalarning tug'ilganlik guvohnomalari.\n4. Yashash joyidan ma'lumotnoma." },
      { heading: "IMZO", content: "Sana: [Sana]\nImzo: ________________" }
    ]
  },
  "COURT_ADMIN_TRAFFIC": {
    title: "MA'MURIY JARIMA USTIDAN SHIKOYAT",
    isComplete: false,
    sections: [
      { heading: "SUDGA", content: "Jinoyat ishlari bo'yicha [Tuman] tuman sudiga\nArizachi: [F.I.O], Manzil: [Manzil], Tel: [Tel]" },
      { heading: "MAZMUNI", content: "[Sana] kuni menga nisbatan YHXB inspektori tomonidan [Jarima Raqami]-sonli ma'muriy bayonnoma rasmiylashtirildi. Unga ko'ra, men go'yoki [Qoidabuzarlik Turi] sodir etganman.\nMen ushbu qarordan noroziman va uni noqonuniy deb hisoblayman. Chunki: [Vajlar: Masalan, yo'l belgisi ko'rinmas joyda edi / Radar sertifikati yo'q edi / Men qoidani buzmaganligimni videoregistrator tasdiqlaydi].\nMa'muriy javobgarlik to'g'risidagi kodeksning talablariga ko'ra, har qanday shubha ayblanuvchi foydasiga hal qilinishi kerak." },
      { heading: "TALAB", content: "Yuqoridagilarga asosan, menga nisbatan tuzilgan [Jarima Raqami]-sonli ma'muriy bayonnomani va chiqarilgan qarorni bekor qilishingizni hamda ma'muriy ishni harakatdan tugatishingizni so'rayman." },
      { heading: "ILOVA", content: "1. Ma'muriy bayonnoma nusxasi.\n2. Pasport nusxasi.\n3. Videoregistrator yozuvi (diskda/fleshkada) yoki fotosuratlar.\n4. Davlat boji to'lovi kvitansiyasi (agar talab etilsa)." },
      { heading: "IMZO", content: "Sana: [Sana]\nImzo: ________________" }
    ]
  },

  // ------------------------------------------------------------------
  // KADRLAR (HR)
  // ------------------------------------------------------------------
  "HR_CONTRACT_MAIN": {
    title: "MEHNAT SHARTNOMASI",
    isComplete: false,
    sections: [
      { heading: "1. TARAFLAR", content: "Ish beruvchi: \"[Korxona Nomi]\" (keyingi o'rinlarda - Ish beruvchi), rahbar [Rahbar F.I.O] nomidan.\nXodim: [Xodim F.I.O] (keyingi o'rinlarda - Xodim), Pasport ma'lumotlari: [Seriya Raqam]." },
      { heading: "2. SHARTNOMA PREDMETI", content: "2.1. Xodim [Bo'lim Nomi] bo'limiga [Lavozim] lavozimiga ishga qabul qilinadi.\n2.2. Ish joyi: [Manzil].\n2.3. Ushbu shartnoma [Nomuayyan muddatga / Muddatli (sana)] tuzildi.\n2.4. Ishning boshlanish sanasi: [Sana]." },
      { heading: "3. TARAFLARNING MAJBURIYATLARI", content: "3.1. Ish beruvchi:\n- Xodimni ish bilan ta'minlash;\n- Xavfsiz mehnat sharoitlarini yaratish;\n- Ish haqini o'z vaqtida to'lash.\n3.2. Xodim:\n- Lavozim yo'riqnomasidagi vazifalarni vijdonan bajarish;\n- Ichki mehnat tartib qoidalariga rioya qilish;\n- Ish beruvchining mulkini avaylab asrash." },
      { heading: "4. ISH VAQTI VA DAM OLISH VAQTI", content: "4.1. Ish vaqti: Haftasiga 40 soat, 5 kunlik ish haftasi.\n4.2. Ish tartibi: 09:00 dan 18:00 gacha. Tushlik vaqti: 13:00 dan 14:00 gacha.\n4.3. Yillik asosiy mehnat ta'tili: 21 ish kuni." },
      { heading: "5. MEHNATGA HAQ TO'LASH", content: "5.1. Xodimga oylik maosh (oklad) [Summa] so'm miqdorida belgilanadi.\n5.2. Ish haqi har oyning [Sana] va [Sana] kunlari to'lanadi.\n5.3. Qo'shimcha mukofot va ustamalar korxona Nizomiga asosan to'lanishi mumkin." },
      { heading: "6. SHARTNOMANI O'ZGARTIRISH VA BEKOR QILISH", content: "6.1. Shartnoma taraflarning kelishuvi bilan o'zgartirilishi mumkin.\n6.2. Shartnoma Mehnat kodeksida ko'rsatilgan asoslarga ko'ra (taraflar kelishuvi, xodim tashabbusi, ish beruvchi tashabbusi va h.k.) bekor qilinishi mumkin." },
      { heading: "7. REKVIZITLAR", content: "ISH BERUVCHI:\n[Korxona Nomi]\nManzil: [Manzil]\nImzo: __________ [Muhr]\n\nXODIM:\n[Xodim F.I.O]\nManzil: [Manzil]\nImzo: __________" }
    ]
  },
  "HR_APP_VACATION": {
    title: "MEHNAT TA'TILI ARIZASI",
    isComplete: false,
    sections: [
      { heading: "RAHBARGA", content: "\"[Korxona Nomi]\" direktori [Direktor F.I.O] ga\n[Lavozim] [Xodim F.I.O] dan" },
      { heading: "ARIZA MATNI", content: "Menga [Yil] ish yili davri uchun navbatdagi yillik asosiy mehnat ta'tilimni [Boshlanish Sanasi] kunidan boshlab, [Kunlar Soni] kalendar kunga berishingizni so'rayman.\nTa'til davrida moddiy yordam (ta'til puli) to'lanishini so'rayman." },
      { heading: "SANA VA IMZO", content: "Sana: [Sana] ___________ (Imzo)" }
    ]
  },
  "HR_ORDER_HIRING": {
    title: "ISHGA QABUL QILISH BUYRUG'I",
    isComplete: false,
    sections: [
      { heading: "BUYRUQ", content: "\"[Korxona Nomi]\" MCHJ\nBuyruq № [Buyruq Raqami]\n[Shahar], [Sana]" },
      { heading: "MAZMUNI", content: "O'zbekiston Respublikasi Mehnat Kodeksining tegishli moddalariga asosan,\n\nBUYURAMAN:\n\n1. [Xodim F.I.O] [Sana] dan boshlab [Bo'lim] bo'limiga [Lavozim] lavozimiga ishga qabul qilinsin.\n2. Unga shtat jadvaliga asosan [Summa] so'm miqdorida oylik ish haqi belgilansin.\n3. Sinov muddati [Oy Soni] oy qilib belgilansin (yoki belgilanmasin).\n4. Bosh hisobchi ish haqini hisoblashni amalga oshirsin.\n5. Kadrlar bo'limi xodim bilan mehnat shartnomasini rasmiylashtirsin." },
      { heading: "ASOS", content: "Xodimning arizasi va tuzilgan mehnat shartnomasi." },
      { heading: "RAHBAR", content: "Direktor: _____________ [Imzo]" }
    ]
  },

  // ------------------------------------------------------------------
  // KORPORATIV (CORPORATE)
  // ------------------------------------------------------------------
  "CORP_CHARTER_LLC": {
    title: "MAS'ULIYATI CHEKLANGAN JAMIYAT USTAVI",
    isComplete: false,
    sections: [
      { heading: "1. UMUMIY QOIDALAR", content: "1.1. Ushbu Ustav \"[Firma Nomi]\" Mas'uliyati cheklangan jamiyati (keyingi o'rinlarda Jamiyat) faoliyatini tartibga soluvchi asosiy hujjatdir.\n1.2. Jamiyat O'zbekiston Respublikasi qonunchiligiga muvofiq tashkil etilgan yuridik shaxs hisoblanadi.\n1.3. Jamiyatning to'liq nomi: \"[Firma Nomi]\" MCHJ.\n1.4. Joylashgan yeri (pochta manzili): [Yuridik Manzil]." },
      { heading: "2. MAQSAD VA FAOLIYAT TURLARI", content: "2.1. Jamiyatning asosiy maqsadi - xo'jalik faoliyatini yuritish orqali foyda olishdir.\n2.2. Jamiyat quyidagi faoliyat turlarini amalga oshiradi:\n- [Faoliyat 1];\n- [Faoliyat 2];\n- Qonun bilan taqiqlanmagan boshqa har qanday faoliyat." },
      { heading: "3. USTAV FONDI", content: "3.1. Jamiyatning ustav fondi [Summa] so'mni tashkil etadi.\n3.2. Ustav fondi ta'sischilar o'rtasida quyidagicha taqsimlanadi:\n- Ta'sischi 1 ([F.I.O]): [Ulush %] foiz, [Summa] so'm;\n- Ta'sischi 2 ([F.I.O]): [Ulush %] foiz, [Summa] so'm.\n3.3. Ta'sischilar o'z ulushlarini pul, mol-mulk yoki intellektual mulk shaklida kiritishlari mumkin." },
      { heading: "4. BOSHQARUV ORGANLARI", content: "4.1. Jamiyatning oliy boshqaruv organi - Ta'sischilarning Umumiy Yig'ilishi.\n4.2. Jamiyatning ijroiya organi - Yakkaboshchilik asosidagi Direktor.\n4.3. Direktor Jamiyat nomidan ishonchnomasiz ish yuritadi, shartnomalar tuzadi va xodimlarni ishga oladi." },
      { heading: "5. FOYDA TAQSIMOTI", content: "5.1. Jamiyatning sof foydasi soliqlar va majburiy to'lovlar to'langandan so'ng, ta'sischilar o'rtasida ularning ustav fondidagi ulushlariga mutanosib ravishda taqsimlanadi.\n5.2. Foyda taqsimoti bo'yicha qaror Umumiy Yig'ilish tomonidan choraklik, yillik asosda qabul qilinadi." },
      { heading: "6. TUGATISH VA QAYTA TASHKIL ETISH", content: "6.1. Jamiyat qonunchilikda belgilangan tartibda (Ta'sischilar qarori yoki Sud qarori bilan) tugatilishi yoki qayta tashkil etilishi mumkin." },
      { heading: "7. IMZOLAR", content: "Ta'sischi 1: ________________ [Imzo]\nTa'sischi 2: ________________ [Imzo]" }
    ]
  },
  "CORP_DECISION_CREATE": {
    title: "TA'SISCHINING 1-SONLI QARORI",
    isComplete: false,
    sections: [
      { heading: "QAROR", content: "[Shahar], [Sana]\n\nMen, O'zbekiston Respublikasi fuqarosi [Ta'sischi F.I.O] (Pasport: [Seriya]), yagona ta'sischi sifatida quyidagicha qaror qildim:" },
      { heading: "QAROR QILINDI:", content: "1. \"[Firma Nomi]\" Mas'uliyati cheklangan jamiyati (MCHJ) tashkil etilsin.\n2. Jamiyatning Ustav fondi [Summa] so'm miqdorida belgilansin va u ta'sischi tomonidan 100% shakllantirilsin.\n3. Jamiyat Ustavi tasdiqlansin.\n4. Jamiyat direktori etib [Direktor F.I.O] tayinlansin.\n5. Jamiyatning yuridik manzili: [Manzil] deb belgilansin.\n6. Jamiyatni davlat ro'yxatidan o'tkazish uchun Davlat xizmatlari markaziga murojaat qilinsin." },
      { heading: "IMZO", content: "Ta'sischi: _________________ [F.I.O]" }
    ]
  },

  // ------------------------------------------------------------------
  // NOTARIAL / APPLICATIONS (OTHERS)
  // ------------------------------------------------------------------
  "APP_DUPLICATE": {
    title: "DUBLIKAT OLISH UCHUN ARIZA",
    isComplete: false,
    sections: [
      { heading: "ORGANGA", content: "[Tuman] FHDYO bo'limi mudiriga\nFuqaro [F.I.O] dan\nManzil: [Manzil]\nTel: [Tel]" },
      { heading: "MAZMUNI", content: "Men, [F.I.O], [Tug'ilgan Sana] yilda tug'ilganman.\nMening nomimga berilgan [Tug'ilganlik / Nikoh / Ajrashganlik] haqidagi guvohnoma [Yo'qolgan sababi] sababli yo'qolgan (yoki yaroqsiz holga kelgan).\nYuqoridagilarni inobatga olib, menga ushbu guvohnomaning dublikatini berishingizni so'rayman." },
      { heading: "SANA", content: "Sana: [Sana] ___________ (Imzo)" }
    ]
  }
};
