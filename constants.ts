
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
    { title: "Yangi Mehnat Kodeksi", content: "2023-yilgi Mehnat kodeksi xodimlar uchun yillik asosiy ta'tilni kamida 21 kalendar kuni etib belgiladi.", button: "Ta'til haqida" },
    { title: "O'zini o'zi band qilish", content: "O'zini o'zi band qilgan shaxslar daromad solig'idan ozod etiladi va staj uchun ixtiyoriy soliq to'lashi mumkin.", button: "Soliq imtiyozlari" },
    { title: "Aliment To'lovlari", content: "Ota-ona ishsiz bo'lsa, aliment miqdori o'rtacha oylik ish haqidan kelib chiqib hisoblanadi.", button: "Aliment tartibi" },
    { title: "Jarima Chegirmasi", content: "Ma'muriy jarimani 15 kun ichida to'lasangiz, 50% chegirmadan foydalanishingiz mumkin.", button: "Jarimalar haqida" },
    { title: "Oyna Tonirovkasi", content: "Avtomobilning orqa yon oynalarini qoraytirish (tonirovka) endi mutlaqo bepul.", button: "Tonirovka qoidalari" },
    { title: "IT Park Imtiyozlari", content: "IT Park rezidentlari daromad solig'ini atigi 7.5% miqdorida to'laydilar.", button: "IT huquqi" },
    { title: "Meros Huquqi", content: "Vafot etgan shaxsdan qolgan merosni qabul qilish uchun 6 oy ichida notariusga murojaat qilish kerak.", button: "Meros maslahati" },
    { title: "Tovar Qaytarish", content: "Iste'molchi maqbul sifatli nooziq-ovqat tovarini 10 kun ichida almashtirib olishga haqli.", button: "Iste'molchi huquqi" },
    { title: "Nikoh Yoshi", content: "O'zbekistonda erkaklar va ayollar uchun nikoh yoshi qat'iy 18 yosh etib belgilangan.", button: "Oila huquqi" },
    { title: "Propiska Tartibi", content: "Toshkent shahridan uy sotib olishda doimiy ro'yxatda turish talabi bekor qilingan.", button: "Uy-joy huquqi" },
    { title: "Qarz Tilxati", content: "850 ming so'mdan yuqori qarzlar uchun qonunan yozma shartnoma yoki tilxat tuzish shart.", button: "Qarz masalalari" },
    { title: "ID-karta", content: "Biometrik pasportni ID-kartaga almashtirish ixtiyoriy, lekin muddati tugasa majburiy.", button: "Pasport tartibi" },
    { title: "Tug'ilganlik Guvohnomasi", content: "Bola tug'ilganda guvohnomani my.gov.uz orqali uydan chiqmasdan olish mumkin.", button: "E-xizmatlar" },
    { title: "Ish haqi kechikishi", content: "Ish beruvchi ish haqini kechiktirsa, har bir kun uchun qayta moliyalash stavkasi asosida kompensatsiya to'laydi.", button: "Mehnat nizolari" },
    { title: "Shovqin Qoidalari", content: "Tungi vaqtda (23:00 dan 06:00 gacha) fuqarolarning osoyishtaligini buzish ma'muriy javobgarlikka sabab bo'ladi.", button: "Ma'muriy huquq" },
    { title: "Elektron imzo (ERI)", content: "ERI kaliti orqali barcha davlat xizmatlaridan masofadan turib foydalanish imkoniyati bor.", button: "Raqamli huquq" },
    { title: "Ta'lim krediti", content: "Xotin-qizlar uchun OTMda o'qishga foizsiz ta'lim krediti berish tizimi mavjud.", button: "Ta'lim imtiyozlari" },
    { title: "Soliq Keshbeki", content: "Xaridlardan tushgan cheklarni Soliq ilovasida skanerlab, 1% keshbek qaytarib olishingiz mumkin.", button: "Soliqlar" },
    { title: "Sudga Murojaat", content: "Iste'molchilar o'z huquqlari buzilganda sudga murojaat qilishda davlat bojidan ozod etiladilar.", button: "Sud tartibi" },
    { title: "Tadbirkorlik", content: "Yangi biznes sub'ektlari ro'yxatdan o'tgandan so'ng 3 yil davomida tekshirilmaydi.", button: "Biznes yordam" }
  ],
  [Language.RU]: [
    { title: "Новый Трудовой Кодекс", content: "Трудовой кодекс 2023 года установил минимальный ежегодный отпуск в 21 календарный день.", button: "Об отпуске" },
    { title: "Самозанятость", content: "Самозанятые лица освобождаются от подоходного налога и платят соцналог добровольно.", button: "Налоги" },
    { title: "Алименты", content: "Если родитель безработный, алименты рассчитываются исходя из средней зарплаты по стране.", button: "Алименты" },
    { title: "Скидка на штрафы", content: "При оплате административного штрафа в течение 15 дней действует скидка 50%.", button: "Штрафы" },
    { title: "Тонировка стекол", content: "Тонировка задних боковых стекол автомобиля теперь абсолютно бесплатна.", button: "ПДД" },
    { title: "Льготы IT Park", content: "Резиденты IT Park платят подоходный налог по ставке всего 7.5%.", button: "IT право" },
    { title: "Наследование", content: "Для принятия наследства необходимо обратиться к нотариусу в течение 6 месяцев.", button: "Наследство" },
    { title: "Возврат товара", content: "Потребитель имеет право обменять непродовольственный товар в течение 10 дней.", button: "Права потребителей" },
    { title: "Брачный возраст", content: "В Узбекистане брачный возраст для мужчин и женщин установлен на уровне 18 лет.", button: "Семейное право" },
    { title: "Прописка", content: "Требование наличия прописки для покупки жилья в Ташкенте полностью отменено.", button: "Жилье" },
    { title: "Долговая расписка", content: "Для займов свыше 850 тысяч сумов закон требует наличие письменной расписки.", button: "Займы" },
    { title: "ID-карты", content: "Замена паспорта на ID-карту является добровольной до истечения срока действия паспорта.", button: "Документы" },
    { title: "Свидетельство о рождении", content: "Получить свидетельство о рождении можно онлайн через портал my.gov.uz.", button: "Э-услуги" },
    { title: "Задержка зарплаты", content: "Работодатель обязан выплатить компенсацию за каждый день задержки заработной платы.", button: "Трудовые споры" },
    { title: "Правила тишины", content: "Нарушение покоя граждан в ночное время (с 23:00 до 06:00) влечет штраф.", button: "Админ. право" },
    { title: "ЭЦП ключ", content: "Электронная подпись дает доступ ко всем госуслугам из любой точки мира.", button: "Цифровое право" },
    { title: "Образовательный кредит", content: "Для женщин предусмотрены беспроцентные кредиты на обучение в вузах.", button: "Образование" },
    { title: "Налоговый кэшбэк", content: "Сканируйте чеки в приложении Soliq и получайте кэшбэк 1% от суммы покупки.", button: "Налоги" },
    { title: "Обращение в суд", content: "Потребители освобождаются от госпошлины при подаче исков о защите прав.", button: "Суд" },
    { title: "Проверки бизнеса", content: "Новые субъекты предпринимательства не проверяются в течение первых 3 лет.", button: "Для бизнеса" }
  ],
  [Language.EN]: [
    { title: "New Labor Code", content: "The 2023 Labor Code set the minimum annual leave for employees at 21 calendar days.", button: "About Leave" },
    { title: "Self-Employment", content: "Self-employed individuals are exempt from income tax and can pay social tax voluntarily.", button: "Tax Benefits" },
    { title: "Alimony Payments", content: "If a parent is unemployed, alimony is calculated based on the average national monthly salary.", button: "Alimony" },
    { title: "Fine Discount", content: "A 50% discount applies if you pay an administrative fine within 15 days.", button: "Fines" },
    { title: "Window Tinting", content: "Tinting for the rear side windows of cars is now completely free of charge.", button: "Traffic Rules" },
    { title: "IT Park Benefits", content: "IT Park residents pay a reduced income tax rate of only 7.5%.", button: "IT Law" },
    { title: "Inheritance Law", content: "You must apply to a notary within 6 months to claim an inheritance after a death.", button: "Inheritance" },
    { title: "Product Returns", content: "Consumers can exchange non-food items of proper quality within 10 days of purchase.", button: "Consumer Rights" },
    { title: "Marriage Age", content: "The legal marriage age in Uzbekistan is strictly set at 18 for both men and women.", button: "Family Law" },
    { title: "Residency Rules", content: "The permanent residency requirement for buying property in Tashkent has been abolished.", button: "Housing Law" },
    { title: "Debt Receipts", content: "Loans exceeding 850,000 UZS legally require a written agreement or receipt.", button: "Debt Issues" },
    { title: "ID-Cards", content: "Replacing a biometric passport with an ID-card is voluntary until the passport expires.", button: "Passports" },
    { title: "Birth Certificates", content: "You can obtain birth certificates online via the my.gov.uz portal.", button: "E-Services" },
    { title: "Salary Delays", content: "Employers must pay daily compensation for any delays in salary payments.", button: "Labor Disputes" },
    { title: "Noise Regulations", content: "Disturbing public peace during night hours (23:00 to 06:00) leads to fines.", button: "Admin Law" },
    { title: "Digital Signature (ERI)", content: "ERI keys allow remote access to all government digital services.", button: "Digital Rights" },
    { title: "Education Loans", content: "Interest-free education loans are available specifically for women in higher education.", button: "Education" },
    { title: "Tax Cashback", content: "Scan receipts in the Soliq app to get a 1% cashback on your purchases.", button: "Taxes" },
    { title: "Access to Justice", content: "Consumers are exempt from court fees when filing for consumer rights protection.", button: "Court Order" },
    { title: "Business Protection", content: "New businesses are protected from inspections for the first 3 years of operation.", button: "Business Support" }
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
        { title: "Oilaviy zo'ravonlik", prompt: "Oilaviy zo'ravonlik bo'lganda himoya orderini qanday olish mumkin?" },
        { title: "Mulkni bo'lish", prompt: "Ajrashish paytida birgalikdagi mulk qanday taqsimlanadi?" }
      ]
    },
    {
      category: "Mehnat Huquqi",
      items: [
        { title: "Mehnat ta'tili", prompt: "Yillik mehnat ta'tili necha kun bo'lishi kerak va qanday hisoblanadi?" },
        { title: "Ishdan bo'shatish", prompt: "Xodimni ishdan bo'shatishning qonuniy asoslari qanday?" },
        { title: "Ish haqi kechikishi", prompt: "Ish haqi kechiktirilsa nima qilish kerak? Qanday javobgarlik bor?" },
        { title: "Dekret ta'tili", prompt: "Homiladorlik va tug'ish ta'tili pullari kim tomonidan to'lanadi?" },
        { title: "Sinov muddati", prompt: "Ishga kirishda sinov muddati qoidalari va muddati qanday?" },
        { title: "Mehnat shartnomasi", prompt: "Yangi Mehnat kodeksi bo'yicha shartnoma tuzish qoidalari." }
      ]
    },
    {
      category: "Mulk va Uy-joy",
      items: [
        { title: "Uy-joy oldi-sotdisi", prompt: "Uy sotib olishda notarius qanday hujjatlarni talab qiladi?" },
        { title: "Ijara shartnomasi", prompt: "Ijara shartnomasini soliq organida ro'yxatdan o'tkazish majburiymi?" },
        { title: "Merosni rasmiylashtirish", prompt: "Merosga egalik qilish huquqi qachon va qanday paydo bo'ladi?" },
        { title: "Snos (Buzilish)", prompt: "Uy buzilishga tushganda kompensatsiya qanday to'lanadi?" },
        { title: "Propiska tartibi", prompt: "Toshkent shahrida doimiy ro'yxatga turishning yangi tartibi qanday?" },
        { title: "Kadastr hujjati", prompt: "Kadastr hujjatini yo'qotib qo'ysa yoki yangilasa nima qilish kerak?" }
      ]
    },
    {
      category: "Avtomobil va YHQ",
      items: [
        { title: "Jarima to'lash", prompt: "Jarimani onlayn to'lash va chegirmadan foydalanish tartibi qanday?" },
        { title: "Oyna tonirovkasi", prompt: "Avtomobil oynalarini qoraytirish narxlari va ruxsatnoma olish." },
        { title: "YTH (Avariya)", prompt: "YTH sodir bo'lganda sug'urta to'lovini olish tartibi qanday?" },
        { title: "Ishonchnoma", prompt: "Avtomobil boshqarish uchun ishonchnoma (doverennost) turlari." },
        { title: "Gaz baloni", prompt: "Avtomobilga gaz baloni o'rnatish uchun ruxsatnoma kerakmi?" },
        { title: "Mast holda haydash", prompt: "Mast holda mashina haydash uchun qanday jazolar bor?" }
      ]
    },
    {
      category: "Bank va Moliya",
      items: [
        { title: "Kredit tarixi", prompt: "Kredit tarixini qanday tekshirish va to'g'irlash mumkin?" },
        { title: "Ipoteka krediti", prompt: "Yosh oilalar uchun ipoteka krediti shartlari qanday?" },
        { title: "Plastik karta firibgarligi", prompt: "Plastik kartadan pul o'g'irlanganda bank javobgarmi?" },
        { title: "Mikroqarz", prompt: "Mikroqarz olish uchun qanday hujjatlar kerak?" },
        { title: "Omonat turlari", prompt: "Bankdagi omonatlar davlat tomonidan kafolatlanadimi?" },
        { title: "Qarz qaytarish", prompt: "Bankdan olingan qarzni to'lay olmaslik oqibatlari qanday?" }
      ]
    },
    {
      category: "Migratsiya va Viza",
      items: [
        { title: "Zagran pasport", prompt: "Xorijga chiqish pasportini olish tartibi va muddati qanday?" },
        { title: "Chet elda ishlash", prompt: "Tashqi mehnat migratsiyasi agentligi orqali ketish tartibi." },
        { title: "Fuqarolik olish", prompt: "O'zbekiston fuqaroligini olishning osonlashtirilgan tartibi." },
        { title: "Deportatsiya", prompt: "Deportatsiya qilinganligini va muddatini qanday tekshirish mumkin?" },
        { title: "Vaqtincha ro'yxatdan o'tish", prompt: "Chet ellik fuqarolarni ro'yxatga qo'yish qoidalari." },
        { title: "Ishchi viza", prompt: "Chet elliklarga O'zbekistonda ishlash uchun ruxsatnoma olish." }
      ]
    },
    {
      category: "Tadbirkorlik",
      items: [
        { title: "YATT ochish", prompt: "Yakka tartibdagi tadbirkor sifatida ro'yxatdan o'tish va soliqlar." },
        { title: "MCHJ tashkil etish", prompt: "MCHJ ochish uchun ustav fondi va hujjatlar ro'yxati." },
        { title: "Litsenziya olish", prompt: "Qaysi faoliyat turlari uchun litsenziya talab qilinadi?" },
        { title: "Davlat subsidiyalari", prompt: "Tadbirkorlar uchun davlat tomonidan qanday subsidiyalar bor?" },
        { title: "Eksport va Import", prompt: "Mahsulotni exports qilish uchun qanday bojxona hujjatlari kerak?" },
        { title: "Franshiza", prompt: "Franshiza shartnomasi tuzishning huquqiy asoslari." }
      ]
    },
    {
      category: "Sog'liqni Saqlash",
      items: [
        { title: "Nogironlik guruhi", prompt: "Nogironlik guruhini belgilash tartibi va imtiyozlar." },
        { title: "Bepul dori-darmon", prompt: "Qaysi kasalliklar uchun bepul dori berilishi shart?" },
        { title: "Order olish", prompt: "Ixtisoslashtirilgan shifoxonalarga bepul davolanish uchun order olish." },
        { title: "Xususiy klinika", prompt: "Xususiy klinikada noto'g'ri davolansa kimga shikoyat qilish kerak?" },
        { title: "Majburiy sug'urta", prompt: "Tibbiy sug'urta tizimi qachondan ishga tushadi?" },
        { title: "Bemor huquqlari", prompt: "Bemorni shoshilinch yordam ko'rsatmasdan qaytarish mumkinmi?" }
      ]
    },
    {
      category: "Ta'lim",
      items: [
        { title: "O'qishni ko'chirish", prompt: "Xorijdan yoki boshqa OTMdan o'qishni ko'chirish (perevod) tartibi." },
        { title: "Magistratura", prompt: "Magistraturaga kirishda til sertifikati talab qilinadimi?" },
        { title: "Bog'cha navbati", prompt: "Bolani bog'chaga joylashtirish uchun onlayn navbatga turish." },
        { title: "Kontrakt to'lovi", prompt: "O'qish kontraktini bo'lib to'lash imkoniyatlari bormi?" },
        { title: "Akademik ta'til", prompt: "Talabaga qanday hollarda akademik ta'til beriladi?" },
        { title: "Maktab imtiyozlari", prompt: "Ko'p bolali oilalar uchun maktabda qanday imtiyozlar bor?" }
      ]
    },
    {
      category: "Bojxona",
      items: [
        { title: "Bojxona to'lovlari", prompt: "Chet eldan tovar olib kirishda bojsiz limit miqdori qancha?" },
        { title: "Yashil yo'lak", prompt: "Aeroportda yashil va qizil yo'lakdan o'tish qoidalari." },
        { title: "Avtomobil rastamojka", prompt: "Chet eldan elektromobil olib kirishdagi bojxona imtiyozlari." },
        { title: "Valyuta olib chiqish", prompt: "O'zbekistondan qancha miqdorgacha naqd valyuta olib chiqish mumkin?" },
        { title: "Pochta jo'natmalari", prompt: "Chet eldan pochta orqali keladigan tovarlar uchun soliq bormi?" },
        { title: "Taqiqlangan mahsulotlar", prompt: "O'zbekistonga olib kirish taqiqlangan tovarlar ro'yxati." }
      ]
    },
    {
      category: "Ijtimoiy Himoya",
      items: [
        { title: "Bolalar puli", prompt: "Kam ta'minlangan oilalarga bolalar puli olish tartibi va miqdori." },
        { title: "Uy-joy subsidiyasi", prompt: "Uy-joy olish uchun davlat subsidiyasini kimlar olishi mumkin?" },
        { title: "Yolg'iz keksalar", prompt: "Yolg'iz yashaydigan qariyalarga qanday yordamlar beriladi?" },
        { title: "Moddiy yordam", prompt: "Mahalla orqali moddiy yordam olish shartlari qanday?" },
        { title: "Mehribonlik uyi", prompt: "Farzand asrab olish tartibi va talablari qanday?" },
        { title: "Ishsizlik nafaqasi", prompt: "Ishsiz deb ro'yxatga turish va nafaqa olish qoidalari." }
      ]
    },
    {
      category: "Sud va Protsess",
      items: [
        { title: "Sudga murojaat", prompt: "Sudga da'vo arizasi qanday yoziladi va topshiriladi?" },
        { title: "Elektron sud", prompt: "E-sud tizimi orqali masofadan turib sudga qatnashish tartibi." },
        { title: "Bepul advokat", prompt: "Davlat hisobidan bepul advokat olish uchun kimlar haqlimi?" },
        { title: "Sud qarori ijrosi", prompt: "Sud qarori ijro etilmasa MIBga qanday murojaat qilinadi?" },
        { title: "Apellyatsiya", prompt: "Sud qarori ustidan apellyatsiya shikoyati berish muddati." },
        { title: "Guvohlik berish", prompt: "Sudda guvoh sifatida qatnashish majburiyatlari va huquqlari." }
      ]
    },
    {
      category: "Soliqlar",
      items: [
        { title: "Daromad solig'i", prompt: "Jismoniy shaxslarning daromad solig'i stavkalari qancha?" },
        { title: "Mol-mulk solig'i", prompt: "Uy-joy va yer uchun soliq qachon va qayerga to'lanadi?" },
        { title: "Soliq keshbek", prompt: "Soliq hamkor ilovasida keshbekni qanday qaytarib olish mumkin?" },
        { title: "QQS (NDS)", prompt: "Tadbirkorlar uchun QQS to'lovchisi bo'lish qoidalari." },
        { title: "Soliq imtiyozlari", prompt: "Yosh oilalar va nogironligi bor shaxslar uchun soliq imtiyozlari." },
        { title: "Aylanma soliq", prompt: "Aylanmadan olinadigan soliqni hisoblash tartibi." }
      ]
    },
    {
      category: "Pensiya",
      items: [
        { title: "Pensiya yoshi", prompt: "O'zbekistonda erkaklar va ayollar uchun pensiya yoshi qancha?" },
        { title: "Pensiya hisoblash", prompt: "Pensiya miqdori ish staji va ish haqiga qanday bog'liq?" },
        { title: "Ish staji", prompt: "Staj yetmagan taqdirda pensiya olish imkoniyati bormi?" },
        { title: "Boquvchisini yo'qotgan", prompt: "Boquvchisini yo'qotganlik nafaqasini tayinlash tartibi." },
        { title: "Pensiya jamg'armasi", prompt: "Jamg'arib boriladigan pensiya tizimi qanday ishlaydi?" },
        { title: "Xorijda ishlash staji", prompt: "Chet elda ishlagan yillar pensiya hisoblashda inobatga olinadimi?" }
      ]
    },
    {
      category: "Iste'molchi Huquqlari",
      items: [
        { title: "Tovar qaytarish", prompt: "Sifatsiz mahsulotni qaytarish yoki almashtirish tartibi." },
        { title: "Kafolat muddati", prompt: "Kafolat muddati davrida bepul ta'mirlash huquqi." },
        { title: "Muddati o'tgan tovar", prompt: "Do'konda muddati o'tgan tovar sotilsa qayerga murojaat qilish kerak?" },
        { title: "Chek berilmasa", prompt: "Sotuvchi chek bermasa nima qilish kerak?" },
        { title: "Onlayn xaridlar", prompt: "Internet orqali olingan tovarlarni qaytarish qoidalari." },
        { title: "Narxlar farqi", prompt: "Vitrinadagi narx kassa narxidan farq qilsa qaysi biri to'lanadi?" }
      ]
    },
    {
      category: "Jinoyat Huquqi",
      items: [
        { title: "Advokat huquqi", prompt: "Ushlangan shaxsning birinchi navbatdagi huquqlari qanday?" },
        { title: "Tuhmat va haqorat", prompt: "Ijtimoiy tarmoqlarda haqorat qilganlik uchun qanday jazo bor?" },
        { title: "Firibgarlik", prompt: "Pulini firibgarga berib qo'ygan odam ariza bilan qayerga boradi?" },
        { title: "Amnistiya", prompt: "O'zbekistonda amnistiya va afv etish tartibi qanday?" },
        { title: "O'zini himoya qilish", prompt: "Zaruriy mudofaa chegarasidan chiqib ketish nima degani?" },
        { title: "Jarima jazosi", prompt: "Jinoyat uchun tayinlangan jarimani to'lash muddati va tartibi." }
      ]
    }
  ],
  [Language.RU]: [
    {
      category: "Семейное право",
      items: [
        { title: "Порядок развода", prompt: "Как подать на развод? Какие документы нужны для суда?" },
        { title: "Взыскание алиментов", prompt: "Как взыскать алименты? Каков их минимальный размер?" },
        { title: "Брачный договор", prompt: "Как оформить брачный контракт и что в нем прописать?" },
        { title: "Опека и попечительство", prompt: "Как оформить опекунство над ребенком?" },
        { title: "Насилие в семье", prompt: "Как получить охранный ордер при домашнем насилии?" },
        { title: "Раздел имущества", prompt: "Как делится совместно нажитое имущество при разводе?" }
      ]
    },
    {
      category: "Трудовое право",
      items: [
        { title: "Трудовой отпуск", prompt: "Сколько дней длится ежегодный отпуск по новому ТК?" },
        { title: "Увольнение", prompt: "Законные основания для увольнения работника по инициативе работодателя." },
        { title: "Задержка зарплаты", prompt: "Что делать, если задерживают зарплату? Куда жаловаться?" },
        { title: "Декретный отпуск", prompt: "Кто и как выплачивает пособие по беременности и родам?" },
        { title: "Испытательный срок", prompt: "Правила и максимальный срок испытательного срока при приеме на работу." },
        { title: "Трудовой договор", prompt: "Правила заключения трудового договора согласно кодексу 2023 года." }
      ]
    },
    {
      category: "Имущество и Жилье",
      items: [
        { title: "Купля-продажа жилья", prompt: "Какие документы требует нотариус при покупке квартиры?" },
        { title: "Договор аренды", prompt: "Обязательно ли регистрировать договор аренды в налоговой?" },
        { title: "Оформление наследства", prompt: "Когда и как вступать в наследство после смерти родственника?" },
        { title: "Снос (Снос)", prompt: "Как рассчитывается компенсация при сносе жилого дома?" },
        { title: "Прописка", prompt: "Новые правила постоянной регистрации в Ташкенте." },
        { title: "Кадастр", prompt: "Что делать при утере кадастрового паспорта на недвижимость?" }
      ]
    },
    {
      category: "Авто и ПДД",
      items: [
        { title: "Оплата штрафов", prompt: "Как оплатить штраф онлайн и получить скидку 50%?" },
        { title: "Тонировка стекол", prompt: "Цены на разрешение на тонировку и процесс оформления." },
        { title: "ДТП (Авария)", prompt: "Порядок получения страховых выплат при совершении ДТП." },
        { title: "Доверенность", prompt: "Виды доверенностей на управление транспортным средством." },
        { title: "Газовый баллон", prompt: "Нужно ли разрешение на установку ГБО на автомобиль?" },
        { title: "Штрафстоянка", prompt: "В каких случаях автомобиль могут забрать на штрафстоянку?" }
      ]
    },
    {
      category: "Банк и Финансы",
      items: [
        { title: "Кредитная история", prompt: "Как проверить и исправить свою кредитную историю?" },
        { title: "Ипотечный кредит", prompt: "Условия ипотеки для молодых семей в Узбекистане." },
        { title: "Мошенничество с картами", prompt: "Несет ли банк ответственность при краже денег с карты?" },
        { title: "Микрозайм", prompt: "Какие документы нужны для получения быстрого микрозайма?" },
        { title: "Банковские вклады", prompt: "Гарантируются ли государством вклады физических лиц?" },
        { title: "Возврат кредита", prompt: "Последствия невозможности выплаты банковского кредита." }
      ]
    },
    {
      category: "Миграция и Виза",
      items: [
        { title: "Загранпаспорт", prompt: "Порядок, сроки и стоимость получения загранпаспорта." },
        { title: "Работа за рубежом", prompt: "Как легально уехать на работу через Агентство внешней миграции?" },
        { title: "Гражданство РУз", prompt: "Упрощенный порядок получения гражданства Узбекистана." },
        { title: "Депортация", prompt: "Как проверить наличие запрета на въезд (депортации)?" },
        { title: "Временная прописка", prompt: "Правила регистрации иностранных граждан в Узбекистане." },
        { title: "Рабочая виза", prompt: "Как получить разрешение на работу иностранцу в Узбекистане?" }
      ]
    },
    {
      category: "Бизнес",
      items: [
        { title: "Открытие ИП", prompt: "Порядок регистрации индивидуального предпринимателя и налоги." },
        { title: "Создание ООО", prompt: "Список документов и минимальный уставной фонд для открытия ООО." },
        { title: "Лицензирование", prompt: "Для каких видов деятельности требуется лицензия?" },
        { title: "Субсидии бизнесу", prompt: "Какие виды государственной поддержки есть для предпринимателей?" },
        { title: "Экспорт и Импорт", prompt: "Таможенное оформление при экспорте товаров из Узбекистана." },
        { title: "Франчайзинг", prompt: "Правовые основы заключения договора франшизы." }
      ]
    },
    {
      category: "Здравоохранение",
      items: [
        { title: "Группа инвалидности", prompt: "Порядок установления группы инвалидности и льготы." },
        { title: "Бесплатные лекарства", prompt: "При каких заболеваниях полагаются бесплатные медикаменты?" },
        { title: "Получение ордера", prompt: "Как получить ордер на бесплатное лечение в госклиниках?" },
        { title: "Частная клиника", prompt: "Куда жаловаться на врачебную ошибку в частной клинике?" },
        { title: "Страхование", prompt: "Как работает система обязательного медицинского страхования?" },
        { title: "Права пациента", prompt: "Могут ли отказать в госпитализации при экстренном случае?" }
      ]
    },
    {
      category: "Образование",
      items: [
        { title: "Перевод учебы", prompt: "Порядок перевода (перевода) из зарубежного или другого ВУЗа." },
        { title: "Магистратура", prompt: "Нужен ли языковой сертификат для поступления в магистратуру?" },
        { title: "Очередь в сад", prompt: "Как встать в онлайн-очередь в детский сад через my.gov.uz?" },
        { title: "Оплата контракта", prompt: "Есть ли льготы или рассрочка при оплате контракта на обучение?" },
        { title: "Академ. отпуск", prompt: "В каких случаях студенту предоставляется академический отпуск?" },
        { title: "Школьные льготы", prompt: "Какие льготы в школах есть для многодетных семей?" }
      ]
    },
    {
      category: "Таможня",
      items: [
        { title: "Таможенные пошлины", prompt: "Каков лимит беспошлинного ввоза товаров для личного пользования?" },
        { title: "Зеленый коридор", prompt: "Правила прохождения зеленого и красного коридора в аэропорту." },
        { title: "Растаможка авто", prompt: "Льготы при ввозе электромобилей в Узбекистан." },
        { title: "Вывоз валюты", prompt: "Какую сумму наличной валюты можно вывозить без декларации?" },
        { title: "Почтовые посылки", prompt: "Налоги на товары, заказанные через интернет-магазины из-за рубежа." },
        { title: "Запрещенные товары", prompt: "Список товаров, запрещенных к ввозу в Республику Узбекистан." }
      ]
    },
    {
      category: "Соцзащита",
      items: [
        { title: "Детские пособия", prompt: "Порядок получения и размер пособия на детей для малообеспеченных семей." },
        { title: "Субсидия на жилье", prompt: "Кто имеет право на получение государственной субсидии на покупку жилья?" },
        { title: "Одинокие пожилые", prompt: "Какая социальная помощь оказывается одиноким пенсионерам?" },
        { title: "Материальная помощь", prompt: "Условия получения материальной помощи через махаллю." },
        { title: "Усыновление", prompt: "Порядок и требования к кандидатам на усыновление ребенка." },
        { title: "Пособие по безработице", prompt: "Как встать на учет по безработице и получать выплаты?" }
      ]
    },
    {
      category: "Суд и Процесс",
      items: [
        { title: "Обращение в суд", prompt: "Как правильно составить и подать исковое заявление в суд?" },
        { title: "Электронный суд", prompt: "Участие в судебном процессе дистанционно через систему E-sud." },
        { title: "Бесплатный адвокат", prompt: "Кто имеет право на адвоката за счет государства?" },
        { title: "Исполнение решений", prompt: "Куда обращаться в БПИ, если судебное решение не выполняется?" },
        { title: "Апелляция", prompt: "Сроки и порядок подачи апелляционной жалобы на решение суда." },
        { title: "Свидетель в суде", prompt: "Права и обязанности свидетеля в гражданском и уголовном процессе." }
      ]
    },
    {
      category: "Налоги",
      items: [
        { title: "Подоходный налог", prompt: "Ставки подоходного налога для физических лиц в Узбекистане." },
        { title: "Налог на имущество", prompt: "Когда и как оплачивать налог на недвижимость и землю?" },
        { title: "Налоговый кэшбэк", prompt: "Как вернуть 1% кэшбэка через приложение Soliq?" },
        { title: "НДС для бизнеса", prompt: "Правила перехода на уплату НДС для предпринимателей." },
        { title: "Налоговые льготы", prompt: "Льготы по налогам для лиц с инвалидностью и молодых семей." },
        { title: "Налог с оборота", prompt: "Порядок расчета и уплаты налога с оборота для малого бизнеса." }
      ]
    },
    {
      category: "Пенсия",
      items: [
        { title: "Пенсионный возраст", prompt: "Во сколько лет выходят на пенсию мужчины и женщины в РУз?" },
        { title: "Расчет пенсии", prompt: "Как зависит размер пенсии от стажа и среднемесячной зарплаты?" },
        { title: "Трудовой стаж", prompt: "Можно ли получать пенсию при неполном трудовом стаже?" },
        { title: "Потеря кормильца", prompt: "Порядок назначения пособия по случаю потери кормильца." },
        { title: "Пенсионный фонд", prompt: "Как работает система накопительного пенсионного обеспечения?" },
        { title: "Стаж за рубежом", prompt: "Учитываются ли годы работы за границей при расчете пенсии в РУз?" }
      ]
    },
    {
      category: "Права потребителей",
      items: [
        { title: "Возврат товара", prompt: "Порядок возврата или обмена товара ненадлежащего качества." },
        { title: "Гарантийный срок", prompt: "Право на бесплатный ремонт в течение гарантийного периода." },
        { title: "Просроченный товар", prompt: "Что делать, если в магазине продали продукт с истекшим сроком годности?" },
        { title: "Отсутствие чека", prompt: "Можно ли вернуть товар, если чек был утерян?" },
        { title: "Онлайн-покупки", prompt: "Правила возврата товаров, купленных через интернет-магазины." },
        { title: "Разница в цене", prompt: "Какую цену обязан пробить кассир, если она отличается от ценника?" }
      ]
    },
    {
      category: "Уголовное право",
      items: [
        { title: "Права при задержании", prompt: "Каковы первые действия и права гражданина при задержании?" },
        { title: "Клевета и оскорбление", prompt: "Ответственность за оскорбление личности в социальных сетях." },
        { title: "Мошенничество", prompt: "Куда подавать заявление, если вы стали жертвой онлайн-мошенников?" },
        { title: "Амнистия", prompt: "Как работает система амнистии и помилования в Узбекистане?" },
        { title: "Самооборона", prompt: "Что является превышением пределов необходимой обороны?" },
        { title: "Штрафы за преступления", prompt: "Сроки и порядок выплаты уголовных штрафов." }
      ]
    }
  ],
  [Language.EN]: [
    {
      category: "Family Law",
      items: [
        { title: "Divorce Procedure", prompt: "What is the procedure for divorce? What documents are needed for court?" },
        { title: "Alimony Collection", prompt: "How to claim alimony? What is the minimum amount in Uzbekistan?" },
        { title: "Prenuptial Agreement", prompt: "How to draft a marriage contract and what should it include?" },
        { title: "Custody", prompt: "What is the legal process for obtaining child custody?" },
        { title: "Domestic Violence", prompt: "How to obtain a protection order in case of domestic violence?" },
        { title: "Property Division", prompt: "How is joint property divided during a divorce?" }
      ]
    },
    {
      category: "Labor Law",
      items: [
        { title: "Annual Leave", prompt: "How many days is the minimum annual leave under the 2023 Labor Code?" },
        { title: "Termination", prompt: "What are the legal grounds for terminating an employee?" },
        { title: "Salary Delay", prompt: "What to do if salary is delayed? What are the penalties for employers?" },
        { title: "Maternity Leave", prompt: "Who pays for pregnancy and childbirth benefits in Uzbekistan?" },
        { title: "Probation Period", prompt: "What are the rules and maximum duration for a probation period?" },
        { title: "Labor Contract", prompt: "Rules for drafting a labor contract according to the new code." }
      ]
    },
    {
      category: "Property & Housing",
      items: [
        { title: "Buying Real Estate", prompt: "What documents does a notary require when buying an apartment?" },
        { title: "Rental Agreement", prompt: "Is it mandatory to register a rental agreement with the tax authorities?" },
        { title: "Inheritance", prompt: "How and when to claim inheritance after the death of a relative?" },
        { title: "Demolition (Snos)", prompt: "How is compensation calculated when a house is scheduled for demolition?" },
        { title: "Residency (Propiska)", prompt: "What are the new rules for permanent residency in Tashkent?" },
        { title: "Cadastral Document", prompt: "What to do if the property's cadastral passport is lost?" }
      ]
    },
    {
      category: "Auto & Traffic",
      items: [
        { title: "Paying Fines", prompt: "How to pay a traffic fine online and get a 50% discount?" },
        { title: "Window Tinting", prompt: "Costs for window tinting permits and the application process." },
        { title: "Car Accident", prompt: "What is the procedure for claiming insurance after a car accident?" },
        { title: "Power of Attorney", prompt: "Types of power of attorney for driving a vehicle in Uzbekistan." },
        { title: "Gas Cylinder (GBO)", prompt: "Do I need a permit to install a gas cylinder on my car?" },
        { title: "Drunk Driving", prompt: "What are the penalties for driving under the influence?" }
      ]
    },
    {
      category: "Bank & Finance",
      items: [
        { title: "Credit History", prompt: "How can I check and improve my credit history in Uzbekistan?" },
        { title: "Mortgage Loans", prompt: "What are the mortgage conditions for young families?" },
        { title: "Card Fraud", prompt: "Is the bank liable if money is stolen from my plastic card?" },
        { title: "Microloans", prompt: "What documents are required to get a quick microloan?" },
        { title: "Bank Deposits", prompt: "Are personal bank deposits guaranteed by the state?" },
        { title: "Loan Repayment", prompt: "What are the consequences of failing to repay a bank loan?" }
      ]
    },
    {
      category: "Migration & Visa",
      items: [
        { title: "Foreign Passport", prompt: "Procedure, timeline, and cost for obtaining a passport for international travel." },
        { title: "Working Abroad", prompt: "How to legally work abroad through the External Migration Agency?" },
        { title: "Citizenship", prompt: "What is the simplified procedure for obtaining Uzbek citizenship?" },
        { title: "Deportation", prompt: "How to check if there is an entry ban or deportation record?" },
        { title: "Temporary Registration", prompt: "Rules for registering foreign citizens visiting Uzbekistan." },
        { title: "Work Visa", prompt: "How to obtain a work permit for a foreign citizen in Uzbekistan?" }
      ]
    },
    {
      category: "Business",
      items: [
        { title: "Starting an IE", prompt: "Registration process for an Individual Entrepreneur and tax obligations." },
        { title: "Forming an LLC", prompt: "List of documents and minimum capital required to open an LLC." },
        { title: "Licensing", prompt: "Which business activities require a special license?" },
        { title: "State Subsidies", prompt: "What kind of government support is available for entrepreneurs?" },
        { title: "Export & Import", prompt: "Customs clearance procedures for exporting goods from Uzbekistan." },
        { title: "Franchising", prompt: "Legal basis for signing a franchise agreement." }
      ]
    },
    {
      category: "Healthcare",
      items: [
        { title: "Disability Group", prompt: "Procedure for determining a disability group and associated benefits." },
        { title: "Free Medications", prompt: "For which diseases are free medicines provided by law?" },
        { title: "Medical Orders", prompt: "How to get a state order for free treatment in specialized clinics?" },
        { title: "Private Clinics", prompt: "Where to file a complaint regarding medical errors in private clinics?" },
        { title: "Health Insurance", prompt: "How does the mandatory medical insurance system work?" },
        { title: "Patient Rights", prompt: "Can a hospital refuse admission in an emergency case?" }
      ]
    },
    {
      category: "Education",
      items: [
        { title: "Student Transfer", prompt: "Procedure for transferring from a foreign or domestic university." },
        { title: "Master's Degree", prompt: "Is a language certificate required for Master's degree admission?" },
        { title: "Kindergarten Queue", prompt: "How to join the online queue for a state kindergarten?" },
        { title: "Tuition Fees", prompt: "Are there installment plans or tax benefits for tuition payments?" },
        { title: "Academic Leave", prompt: "Under what circumstances can a student take an academic leave?" },
        { title: "School Benefits", prompt: "What benefits are available in schools for large families?" }
      ]
    },
    {
      category: "Customs",
      items: [
        { title: "Customs Duties", prompt: "What is the duty-free limit for importing goods for personal use?" },
        { title: "Green Channel", prompt: "Rules for green and red channels at the airport." },
        { title: "Car Customs", prompt: "Customs benefits for importing electric vehicles into Uzbekistan." },
        { title: "Currency Export", prompt: "How much cash currency can be exported without a declaration?" },
        { title: "Postal Packages", prompt: "Taxes on goods ordered from international online shops." },
        { title: "Prohibited Goods", prompt: "List of items prohibited for import into the Republic of Uzbekistan." }
      ]
    },
    {
      category: "Social Protection",
      items: [
        { title: "Child Benefits", prompt: "Procedure and amount of child benefits for low-income families." },
        { title: "Housing Subsidy", prompt: "Who is eligible for a state subsidy to purchase a home?" },
        { title: "Elderly Care", prompt: "What social assistance is provided to elderly people living alone?" },
        { title: "Financial Aid", prompt: "Conditions for receiving financial aid through the local Mahalla." },
        { title: "Adoption", prompt: "Procedure and requirements for adopting a child in Uzbekistan." },
        { title: "Unemployment", prompt: "How to register as unemployed and receive welfare benefits?" }
      ]
    },
    {
      category: "Court & Process",
      items: [
        { title: "Filing a Lawsuit", prompt: "How to correctly draft and submit a claim to the court?" },
        { title: "Electronic Court", prompt: "Participating in court hearings remotely via the E-sud system." },
        { title: "Free Lawyer", prompt: "Who is entitled to a state-funded defense attorney?" },
        { title: "Enforcement", prompt: "How to contact the Bureau of Compulsory Enforcement (MIB)?" },
        { title: "Appeals", prompt: "Timeline and procedure for appealing a court decision." },
        { title: "Witness Rights", prompt: "Rights and obligations of a witness in a judicial proceeding." }
      ]
    },
    {
      category: "Taxes",
      items: [
        { title: "Income Tax", prompt: "What are the personal income tax rates in Uzbekistan?" },
        { title: "Property Tax", prompt: "When and where to pay taxes for real estate and land?" },
        { title: "Tax Cashback", prompt: "How to claim the 1% cashback via the Soliq mobile app?" },
        { title: "VAT for Business", prompt: "Rules for registering as a VAT payer for entrepreneurs." },
        { title: "Tax Exemptions", prompt: "Tax benefits for disabled individuals and young families." },
        { title: "Turnover Tax", prompt: "How to calculate and pay turnover tax for small businesses." }
      ]
    },
    {
      category: "Pension",
      items: [
        { title: "Retirement Age", prompt: "What is the retirement age for men and women in Uzbekistan?" },
        { title: "Pension Calculation", prompt: "How does the pension amount depend on years of service and salary?" },
        { title: "Work Experience", prompt: "Is it possible to receive a pension with incomplete work experience?" },
        { title: "Survivor Pension", prompt: "Procedure for assigning a pension in case of the loss of a breadwinner." },
        { title: "Pension Fund", prompt: "How does the cumulative pension system work?" },
        { title: "Work Abroad", prompt: "Are years worked abroad considered for pension calculation?" }
      ]
    },
    {
      category: "Consumer Rights",
      items: [
        { title: "Returning Goods", prompt: "Procedure for returning or exchanging a defective product." },
        { title: "Warranty Period", prompt: "Right to free repair during the warranty period." },
        { title: "Expired Goods", prompt: "What to do if a store sells an expired product?" },
        { title: "Lost Receipt", prompt: "Can I return a product if the receipt was lost?" },
        { title: "Online Shopping", prompt: "Rules for returning items bought through online stores." },
        { title: "Price Difference", prompt: "Which price should be charged if the shelf price differs from the POS?" }
      ]
    },
    {
      category: "Criminal Law",
      items: [
        { title: "Right to a Lawyer", prompt: "What are the immediate rights of a person when detained?" },
        { title: "Slander & Insult", prompt: "Penalties for personal insults on social media platforms." },
        { title: "Fraud", prompt: "Where to file a report if you become a victim of online fraud?" },
        { title: "Amnesty", prompt: "How does the amnesty and pardon system work in Uzbekistan?" },
        { title: "Self-Defense", prompt: "What constitutes exceeding the limits of necessary self-defense?" },
        { title: "Criminal Fines", prompt: "Timelines and procedures for paying criminal fines." }
      ]
    }
  ]
};

export const TRANSLATIONS = {
  [Language.UZ]: {
    profileLoginPrompt: "Profilingizni boshqarish uchun tizimga kiring.",
    profileLoginBtn: "Kirish / Ro'yxatdan o'tish",
    title: "LAWIFY",
    subtitle: "O'zbekiston bo'yicha huquqiy yordamchi",
    settings: "Sozlamalar",
    length: "Javob uzunligi",
    tone: "Ohang",
    style: "Uslub",
    clarify: "Aniqlovchi savollar",
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
    navDashboard: "Bosh sahifa",
    navChat: "AI Yurist",
    navOdilbek: "Odilbek (Tushuntirish)",
    navTemplates: "AI Kotib", 
    navHistory: "Tarix",
    navTopics: "Mavzular",
    navProfile: "Profil",
    navPlans: "Tariflar",
    upgradeBtn: "Premiumga o'tish",
    dashboardWelcome: "Xush kelibsiz",
    dashboardSubtitle: "Bugun sizga qanday yuridik yordam bera olaman?",
    quickChat: "Yangi suhbat",
    quickChatDesc: "AI bilan huquqiy maslahat",
    quickContracts: "Hujjat tekshirish",
    quickContractsDesc: "Shartnomalarni tahlil qilish",
    quickTemplates: "AI Kotib",
    quickTemplatesDesc: "Hujjatlarni avtomatlashtirish",
    openApp: "Ilovani ochish",
    didYouKnowTitle: "O'zbekistonning Yangi Mehnat Kodeksi",
    didYouKnowContent: "2023-yilgi yangi Mehnat kodeksi xodimlar huquqlari, ta'til hisoblash va masofaviy ishlash bo'yicha muhim o'zgarishlarni kiritdi.",
    didYouKnowButton: "Batafsil so'rash",
    didYouKnowTag: "Bilasizmi?",
    quickLinksTitle: "Tezkor Havolalar",
    qlFamily: "Oila Huquqi",
    qlLabor: "Mehnat Kodeksi",
    qlCriminal: "Jinoyat Kodeksi",
    qlBusiness: "Biznes Huquqi",
    qlHousing: "Uy-joy Huquqi",
    qlAdmin: "Ma'muriy Javobgarlik",
    qlBank: "Bank va Kredit",
    qlHealth: "Sog'liqni Saqlash",
    qlEdu: "Ta'lim Huquqi",
    qlCustoms: "Bojxona",
    qlTax: "Soliqlar",
    qlPension: "Pensiya",
    qlFamilyPrompt: "Oila huquqi bo'yicha savolim bor.",
    qlLaborPrompt: "Mehnat kodeksi bo'yicha ma'lumot kerak.",
    qlCriminalPrompt: "Jinoyat kodeksi bo'yicha savolim bor.",
    qlHousingPrompt: "Uy-joy huquqi bo'yicha savolim bor.",
    qlBusinessPrompt: "Biznes bo'yicha yuridik maslahat kerak.",
    qlAdminPrompt: "Ma'muriy javobgarlik bo'yicha savol.",
    qlBankPrompt: "Bank krediti va omonatlar bo'yicha savolim bor.",
    qlHealthPrompt: "Tibbiy xizmatlar va bemor huquqlari bo'yicha savol.",
    qlEduPrompt: "Ta'lim olish, kontrakt va o'qishni ko'chirish bo'yicha savol.",
    qlCustomsPrompt: "Bojxona to'lovlari va qoidalari haqida ma'lumot kerak.",
    qlTaxPrompt: "Soliq turlari va imtiyozlar haqida so'ramoqchiman.",
    qlPensionPrompt: "Pensiya yoshi va hisoblash tartibi bo'yicha savol.",
    visTitle: "KELAJAK REJALARI",
    visAutoAgents: "Avtonom Yuridik Agentlar",
    visAutoAgentsDesc: "Hujjatlarni mustaqil tayyorlaydigan va muzokara olib boradigan AI agentlar.",
    visCourtAPI: "Sud Tizimi Integratsiyasi",
    visCourtAPIDesc: "Real vaqt rejimida ishlarni kuzatish uchun E-Sud tizimi bilan integratsiya.",
    visBlockchain: "Blokcheyn Notarius",
    visBlockchainDesc: "Milliy blokcheyn orqali shartnomalarni o'zgarmas tasdiqlash.",
    visAIJudge: "AI Sud Yordamchisi Pilot",
    visAIJudgeDesc: "Sud yuklamasini kamaytirish uchun dastlabki ish baholash tizimi.",
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
    libraryTitle: "Yuridik hujjatlar kutubxonasi",
    librarySubtitle: "AI Kotib yordamida har qanday hujjatni tezkor tayyorlang.",
    librarySelectPrompt: "Hujjatni boshlash uchun andozani tanlang.",
    libraryDifficulty: "Murakkablik",
    libraryComingSoon: "Tez orada",
    libraryFooter: "Barcha andozalar O'zbekiston Respublikasi qonunchiligiga to'liq mos keladi va yuristlar tomonidan tasdiqlangan.",
    catCivil: "Fuqarolik",
    catProperty: "Mulkiy",
    catFamily: "Oila",
    catBusiness: "Biznes",
    catAdmin: "Ma'muriy",
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
    tDebtPrompt: "Men qarz tilxatini yozmoqchiman. Iltimos, huquqiy jihatdan to'g'ri hujjat tayyorlash uchun mendan kerakli barcha ma'lumotlarni (tomonlar, summa, muddat) so'rang.",
    tRentPrompt: "Men turar joy ijara shartnomasini tuzmoqchiman. Iltimos, shartnoma qonuniy bo'lishi uchun mendan kerakli ma'lumotlarni so'rang va keyin shartnoma matnini tayyorlab bering.",
    tDivorcePrompt: "Men sudga ajrashish uchun ariza yozmoqchiman. Iltimos, arizani to'g'ri shakllantirish uchun mendan talab qilinadigan ma'lumotlarni so'rang.",
    tLaborPrompt: "Men yangi Mehnat kodeksi bo'yicha mehnat shartnomasini tuzmoqchiman. Iltimos, ish beruvchi va xodim haqidagi kerakli ma'lumotlarni so'rang.",
    tPowerPrompt: "Menga avtomobil yoki mulkni boshqarish uchun ishonchnoma kerak. Iltimos, ishonchnoma turini va taraflar ma'lumotlarini mendan so'rang.",
    tComplaintPrompt: "Men davlat organiga shikoyat yozmoqchiman. Iltimos, vaziyatni o'rganish uchun mendan kerakli savollarni so'rang, so'ngra shikoyat matnini yozib bering.",
    diffEasy: "Oson",
    diffMedium: "O'rta",
    diffHard: "Qiyin",
    topicsTitle: "Umumiy huquqiy mavzular",
    topicsSubtitle: "Formani oldindan to'ldirish uchun mavzuni tanlang",
    historyTitle: "Murojaatlar tarixi",
    historySubtitle: "Sizning avvalgi suhbatlaringiz ushbu qurilmada saqlanadi.",
    historyClear: "Tarixni tozalash",
    historyEmpty: "Hozircha tarix yo'q. Yangi suhbat boshlang.",
    historyMessages: "xabar",
    profileTitle: "Foydalanuvchi Profili",
    profileSubtitle: "Shaxsiy ma'lumotlar va sozlamalarni boshqarish",
    profileName: "Ism",
    profileEmail: "Email",
    profileStats: "Statistika",
    profileConsultations: "Konsultatsiyalar",
    profileSavedDocs: "Saqlangan Hujjatlar",
    profileSave: "Saqlash",
    filterTitle: "Filtrlash",
    filterDate: "Sana",
    filterRole: "Kimdan",
    filterAll: "Barchasi",
    filterUser: "Foydalanuvchi",
    filterAI: "AI Yurist",
    filterLast24h: "Oxirgi 24 soat",
    filterLastWeek: "Oxirgi hafta",
    filterAllTime: "Barcha vaqt",
    plansTitle: "Tarif rejalari",
    plansSubtitle: "Ehtiyojingizga mos tarifni tanlang. Istalgan vaqtda bekor qilish mumkin.",
    currentPlan: "Joriy Tarif",
    subscribe: "Tanlash",
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
    limitReachedTitle: "Kunlik limit tugadi",
    limitReachedBody: "Bugungi bepul 5 ta savol limitidan foydalandingiz.",
    limitUpgrade: "Pro tariflarni ko'rish",
    limitReturn: "Ertaga qaytish",
    freeUsage: "Bepul so'rovlar:",
    odilbekTitle: "Odilbek AI - Yuridik Tushuntiruvchi",
    odilbekSubtitle: "AI Yurist maslahatlarini oddiy tilda tushuntirib beraman. Cheklovsiz so'rang!",
    odilbekWelcome: "Assalomu alaykum! Men Odilbekman (Oksford Magistri). Advokatimiz bergan maslahat tushunarsiz bo'ldimi? Menga yuboring, oddiy qilib tushuntirib beraman.",
    askOdilbek: "Odilbekdan so'rash (Cheklovsiz)",
    odilbekAction: "Tushuntirib berish",
    odilbekPlaceholder: "Odilbekdan xohlagan narsangizni so'rang...",
  }
};
