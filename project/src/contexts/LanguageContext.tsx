import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ru' | 'en' | 'kk';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ru: {
    // Top Bar
    station: 'Станция Алматы-1',
    operator: 'Оператор: Айдана',
    search: 'Поиск',
    
    // Sidebar
    dashboard: 'Панель управления',
    pages: 'Страницы',
    newShipment: 'Новая отправка',
    activeShipments: 'Активные отправки',
    transit: 'Транзит',
    arrival: 'Прибытие',
    reports: 'Отчёты',
    wms: 'WMS склад',
    settings: 'Настройки',
    userProfile: 'Профиль пользователя',
    corporate: 'Корпоративные клиенты',
    
    // New Shipment
    newShipmentTitle: 'Новая отправка',
    newShipmentDesc: 'Оформление перевозки багажа',
    clientInfo: 'Информация о клиенте',
    cargoDetails: 'Детали груза',
    payment: 'Оплата',
    
    // Client Info
    clientType: 'Тип клиента',
    individual: 'Физическое лицо',
    legal: 'Юридическое лицо',
    clientName: 'ФИО / Название организации',
    enterClientName: 'Введите имя клиента',
    clientSource: 'Источник клиента',
    selectSource: 'Выберите источник',
    directContact: 'Прямое обращение',
    contractNumber: 'Номер договора',
    depositSystem: 'Депозитная система',
    route: 'Маршрут',
    from: 'Откуда',
    to: 'Куда',
    selectStation: 'Выберите станцию',
    departureDate: 'Дата отправления',
    transportCost: 'Стоимость перевозки',
    next: 'Далее',
    back: 'Назад',
    
    // Cargo Details
    cargoDetailsTitle: 'Детали груза',
    mobiusTicket: 'Проверка билета Mobius',
    hasTicket: 'У клиента есть билет',
    ticketNumber: 'Номер билета',
    ticketDiscount: 'Применена скидка 50% по билету',
    weight: 'Вес (кг)',
    dimensions: 'Габариты (см)',
    dimensionsPlaceholder: 'Длина × Ширина × Высота',
    cargoValue: 'Ценность груза',
    fragile: 'Хрупкий',
    oversized: 'Негабаритный',
    packaging: 'Упаковка',
    selectPackaging: 'Выберите тип упаковки',
    woodCrate: 'Деревянная обрешётка',
    stretchFilm: 'Стрейч-пленка',
    cardboard: 'Картонная коробка',
    bag: 'Мешок',
    noPackaging: 'Без упаковки',
    declaredValue: 'Объявленная ценность (₸)',
    cargoDescription: 'Описание груза',
    describeContent: 'Опишите содержимое багажа',
    
    // Payment
    tariffCalculation: 'Расчёт тарифа',
    baseTransportCost: 'Базовая стоимость перевозки:',
    weightSurcharge: 'Доплата за вес:',
    fragileCargo: 'Хрупкий груз:',
    oversizedCargo: 'Негабаритный груз:',
    ticketDiscountLabel: 'Скидка по билету (50%):',
    totalPayment: 'Итого к оплате:',
    emailReceipt: 'Email для чека',
    cardInfo: 'Информация о карте',
    cardholderName: 'Имя держателя карты',
    countryRegion: 'Страна или регион',
    postalCode: 'Индекс',
    payButton: 'Оплатить',
    termsAgree: 'Нажимая "Оплатить", вы соглашаетесь с',
    termsOfUse: 'Условиями использования',
    privacyPolicy: 'Политикой конфиденциальности',
    and: 'и',
    
    // Active Shipments
    activeShipmentsTitle: 'Активные отправки',
    activeShipmentsDesc: 'Список отправок в обработке',
    searchPlaceholder: 'Поиск по номеру отправки, клиенту...',
    filters: 'Фильтры',
    number: 'Номер',
    client: 'Клиент',
    routeColumn: 'Маршрут',
    weightColumn: 'Вес',
    date: 'Дата',
    status: 'Статус',
    actions: 'Действия',
    details: 'Подробнее',
    inTransit: 'В пути',
    loaded: 'Погружен',
    arrived: 'Прибыл',
    
    // Transit
    transitTitle: 'Транзит',
    transitDesc: 'Регистрация перемещения багажа',
    qrScanning: 'Сканирование QR-кода',
    scanQrDesc: 'Отсканируйте QR-код на багаже для регистрации',
    startScanning: 'Начать сканирование',
    recentScans: 'Последние сканирования',
    loading: 'Погрузка',
    arrivalScan: 'Прибытие',
    issuance: 'Выдача',
    action: 'Действие',
    
    // Arrival
    arrivalTitle: 'Прибытие',
    arrivalDesc: 'Управление прибывшим багажом',
    arrivedShipments: 'Прибывшие отправки',
    notifyAll: 'Уведомить всех',
    notified: 'Уведомлен',
    arrivedFrom: 'Откуда:',
    arrivedAt: 'Прибыл:',
    phone: 'Телефон:',
    notify: 'Уведомить',
    issue: 'Выдать',
    
    // Reports
    reportsTitle: 'Отчёты',
    reportsDesc: 'Формирование и просмотр отчетов',
    fo3Report: 'Отчёт FO-3',
    financialReport: 'Финансовый отчёт',
    shipmentsReport: 'Отчёт по отправкам',
    generalStats: 'Общая статистика',
    auditLog: 'Журнал аудита',
    userActions: 'Действия пользователей',
    routeReport: 'Отчёт по маршрутам',
    routeAnalysis: 'Анализ направлений',
    allUsers: 'Все пользователи',
    allRoutes: 'Все маршруты',
    generate: 'Сформировать',
    export: 'Выгрузить',
    
    // WMS
    wmsTitle: 'WMS склад',
    wmsDesc: 'Автоматизированная система складских ячеек',
    storageCells: 'Складские ячейки',
    cellStatus: 'Статус ячеек',
    free: 'Свободно',
    occupied: 'Занято',
    maintenance: 'Обслуживание',
    selfService: 'Самообслуживание',
    selfServiceDesc: 'Сдача багажа без участия оператора',
    scanDocument: 'Сканировать документ',
    scanDocumentDesc: 'Отсканируйте паспорт или QR-код для начала',
    placeInCell: 'Поместите багаж в ячейку',
    placeInCellDesc: 'Откройте ячейку и поместите багаж внутрь',
    autoMeasure: 'Автоматическое измерение',
    autoMeasureDesc: 'Вес и габариты будут измерены автоматически',
    confirmShipment: 'Подтвердите отправку',
    confirmShipmentDesc: 'Проверьте данные и получите QR-код',
    cellNumber: 'Ячейка',
    openCell: 'Открыть ячейку',
    closeCell: 'Закрыть ячейку',
    
    // Settings
    settingsTitle: 'Настройки',
    settingsDesc: 'Настройки системы и профиля',
    languageSettings: 'Язык интерфейса',
    themeSettings: 'Тема оформления',
    light: 'Светлая',
    dark: 'Тёмная',
    notificationSettings: 'Уведомления',
    emailNotifications: 'Email уведомления',
    smsNotifications: 'SMS уведомления',
    saveSettings: 'Сохранить настройки',
    
    // Common
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    close: 'Закрыть',
    save: 'Сохранить',
    delete: 'Удалить',
    edit: 'Редактировать',
    
    // Shipment created
    shipmentCreated: 'Отправка создана',
    documentsReady: 'Документы сформированы и готовы к печати',
    printDocuments: 'Печать документов',
    newShipmentButton: 'Новая отправка',
  },
  
  en: {
    // Top Bar
    station: 'Almaty-1 Station',
    operator: 'Operator: Aidana',
    search: 'Search',
    
    // Sidebar
    dashboard: 'Dashboard',
    pages: 'Pages',
    newShipment: 'New Shipment',
    activeShipments: 'Active Shipments',
    transit: 'Transit',
    arrival: 'Arrival',
    reports: 'Reports',
    wms: 'WMS Warehouse',
    settings: 'Settings',
    userProfile: 'User Profile',
    corporate: 'Corporate Clients',
    
    // New Shipment
    newShipmentTitle: 'New Shipment',
    newShipmentDesc: 'Baggage transportation registration',
    clientInfo: 'Client Information',
    cargoDetails: 'Cargo Details',
    payment: 'Payment',
    
    // Client Info
    clientType: 'Client Type',
    individual: 'Individual',
    legal: 'Legal Entity',
    clientName: 'Full Name / Organization Name',
    enterClientName: 'Enter client name',
    clientSource: 'Client Source',
    selectSource: 'Select source',
    directContact: 'Direct Contact',
    contractNumber: 'Contract Number',
    depositSystem: 'Deposit System',
    route: 'Route',
    from: 'From',
    to: 'To',
    selectStation: 'Select station',
    departureDate: 'Departure Date',
    transportCost: 'Transport Cost',
    next: 'Next',
    back: 'Back',
    
    // Cargo Details
    cargoDetailsTitle: 'Cargo Details',
    mobiusTicket: 'Mobius Ticket Check',
    hasTicket: 'Customer has a ticket',
    ticketNumber: 'Ticket Number',
    ticketDiscount: '50% discount applied with ticket',
    weight: 'Weight (kg)',
    dimensions: 'Dimensions (cm)',
    dimensionsPlaceholder: 'Length × Width × Height',
    cargoValue: 'Cargo Value',
    fragile: 'Fragile',
    oversized: 'Oversized',
    packaging: 'Packaging',
    selectPackaging: 'Select packaging type',
    woodCrate: 'Wooden Crate',
    stretchFilm: 'Stretch Film',
    cardboard: 'Cardboard Box',
    bag: 'Bag',
    noPackaging: 'No Packaging',
    declaredValue: 'Declared Value (₸)',
    cargoDescription: 'Cargo Description',
    describeContent: 'Describe baggage contents',
    
    // Payment
    tariffCalculation: 'Tariff Calculation',
    baseTransportCost: 'Base transport cost:',
    weightSurcharge: 'Weight surcharge:',
    fragileCargo: 'Fragile cargo:',
    oversizedCargo: 'Oversized cargo:',
    ticketDiscountLabel: 'Ticket discount (50%):',
    totalPayment: 'Total payment:',
    emailReceipt: 'Email for receipt',
    cardInfo: 'Card Information',
    cardholderName: 'Cardholder Name',
    countryRegion: 'Country or Region',
    postalCode: 'Postal Code',
    payButton: 'Pay',
    termsAgree: 'By clicking "Pay", you agree to',
    termsOfUse: 'Terms of Use',
    privacyPolicy: 'Privacy Policy',
    and: 'and',
    
    // Active Shipments
    activeShipmentsTitle: 'Active Shipments',
    activeShipmentsDesc: 'List of shipments in progress',
    searchPlaceholder: 'Search by shipment number, client...',
    filters: 'Filters',
    number: 'Number',
    client: 'Client',
    routeColumn: 'Route',
    weightColumn: 'Weight',
    date: 'Date',
    status: 'Status',
    actions: 'Actions',
    details: 'Details',
    inTransit: 'In Transit',
    loaded: 'Loaded',
    arrived: 'Arrived',
    
    // Transit
    transitTitle: 'Transit',
    transitDesc: 'Baggage movement registration',
    qrScanning: 'QR Code Scanning',
    scanQrDesc: 'Scan the QR code on baggage for registration',
    startScanning: 'Start Scanning',
    recentScans: 'Recent Scans',
    loading: 'Loading',
    arrivalScan: 'Arrival',
    issuance: 'Issuance',
    action: 'Action',
    
    // Arrival
    arrivalTitle: 'Arrival',
    arrivalDesc: 'Arrived baggage management',
    arrivedShipments: 'Arrived Shipments',
    notifyAll: 'Notify All',
    notified: 'Notified',
    arrivedFrom: 'From:',
    arrivedAt: 'Arrived:',
    phone: 'Phone:',
    notify: 'Notify',
    issue: 'Issue',
    
    // Reports
    reportsTitle: 'Reports',
    reportsDesc: 'Report generation and viewing',
    fo3Report: 'FO-3 Report',
    financialReport: 'Financial Report',
    shipmentsReport: 'Shipments Report',
    generalStats: 'General Statistics',
    auditLog: 'Audit Log',
    userActions: 'User Actions',
    routeReport: 'Route Report',
    routeAnalysis: 'Route Analysis',
    allUsers: 'All Users',
    allRoutes: 'All Routes',
    generate: 'Generate',
    export: 'Export',
    
    // WMS
    wmsTitle: 'WMS Warehouse',
    wmsDesc: 'Automated storage cell system',
    storageCells: 'Storage Cells',
    cellStatus: 'Cell Status',
    free: 'Free',
    occupied: 'Occupied',
    maintenance: 'Maintenance',
    selfService: 'Self-Service',
    selfServiceDesc: 'Baggage drop-off without operator',
    scanDocument: 'Scan Document',
    scanDocumentDesc: 'Scan passport or QR code to start',
    placeInCell: 'Place in Cell',
    placeInCellDesc: 'Open cell and place baggage inside',
    autoMeasure: 'Auto Measurement',
    autoMeasureDesc: 'Weight and dimensions will be measured automatically',
    confirmShipment: 'Confirm Shipment',
    confirmShipmentDesc: 'Check data and receive QR code',
    cellNumber: 'Cell',
    openCell: 'Open Cell',
    closeCell: 'Close Cell',
    
    // Settings
    settingsTitle: 'Settings',
    settingsDesc: 'System and profile settings',
    languageSettings: 'Interface Language',
    themeSettings: 'Theme',
    light: 'Light',
    dark: 'Dark',
    notificationSettings: 'Notifications',
    emailNotifications: 'Email Notifications',
    smsNotifications: 'SMS Notifications',
    saveSettings: 'Save Settings',
    
    // Common
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    
    // Shipment created
    shipmentCreated: 'Shipment Created',
    documentsReady: 'Documents generated and ready to print',
    printDocuments: 'Print Documents',
    newShipmentButton: 'New Shipment',
  },
  
  kk: {
    // Top Bar
    station: 'Алматы-1 станциясы',
    operator: 'Оператор: Айдана',
    search: 'Іздеу',
    
    // Sidebar
    dashboard: 'Басқару панелі',
    pages: 'Беттер',
    newShipment: 'Жаңа жөнелту',
    activeShipments: 'Белсенді жөнелтулер',
    transit: 'Транзит',
    arrival: 'Келу',
    reports: 'Есептер',
    wms: 'WMS қойма',
    settings: 'Баптаулар',
    userProfile: 'Пайдаланушы профилі',
    corporate: 'Корпоративті клиенттер',
    
    // New Shipment
    newShipmentTitle: 'Жаңа жөнелту',
    newShipmentDesc: 'Багажды тасымалдауды ресімдеу',
    clientInfo: 'Клиент туралы мәлімет',
    cargoDetails: 'Жүк туралы мәліметтер',
    payment: 'Төлем',
    
    // Client Info
    clientType: 'Клиент түрі',
    individual: 'Жеке тұлға',
    legal: 'Заңды тұлға',
    clientName: 'Аты-жөні / Ұйым атауы',
    enterClientName: 'Клиент атын енгізіңіз',
    clientSource: 'Клиент көзі',
    selectSource: 'Көзді таңдаңыз',
    directContact: 'Тікелей өтініш',
    contractNumber: 'Шарт нөмірі',
    depositSystem: 'Депозиттік жүйе',
    route: 'Бағыт',
    from: 'Қайдан',
    to: 'Қайда',
    selectStation: 'Станцияны таңдаңыз',
    departureDate: 'Жөнелту күні',
    transportCost: 'Тасымалдау құны',
    next: 'Әрі қарай',
    back: 'Артқа',
    
    // Cargo Details
    cargoDetailsTitle: 'Жүк туралы мәліметтер',
    mobiusTicket: 'Mobius билетін тексеру',
    hasTicket: 'Клиентте билет бар',
    ticketNumber: 'Билет нөмірі',
    ticketDiscount: 'Билет бойынша 50% жеңілдік қолданылды',
    weight: 'Салмақ (кг)',
    dimensions: 'Өлшемдер (см)',
    dimensionsPlaceholder: 'Ұзындығы × Ені × Биіктігі',
    cargoValue: 'Жүк құндылығы',
    fragile: 'Сынғыш',
    oversized: 'Габаритсіз',
    packaging: 'Қаптама',
    selectPackaging: 'Қаптама түрін таңдаңыз',
    woodCrate: 'Ағаш қаптама',
    stretchFilm: 'Стретч-пленка',
    cardboard: 'Картон қорап',
    bag: 'Қап',
    noPackaging: 'Қаптамасыз',
    declaredValue: 'Жариялаған құны (₸)',
    cargoDescription: 'Жүктің сипаттамасы',
    describeContent: 'Багаж мазмұнын сипаттаңыз',
    
    // Payment
    tariffCalculation: 'Тариф есебі',
    baseTransportCost: 'Тасымалдаудың базалық құны:',
    weightSurcharge: 'Салмақ үшін қосымша төлем:',
    fragileCargo: 'Сынғыш жүк:',
    oversizedCargo: 'Габаритсіз жүк:',
    ticketDiscountLabel: 'Билет бойынша жеңілдік (50%):',
    totalPayment: 'Барлығы төлеу керек:',
    emailReceipt: 'Чек үшін Email',
    cardInfo: 'Карта туралы мәлімет',
    cardholderName: 'Карта иесінің аты',
    countryRegion: 'Ел немесе аймақ',
    postalCode: 'Индекс',
    payButton: 'Төлеу',
    termsAgree: '"Төлеу" түймесін басу арқылы сіз келісесіз',
    termsOfUse: 'Пайдалану шарттарымен',
    privacyPolicy: 'Құпиялылық саясатымен',
    and: 'және',
    
    // Active Shipments
    activeShipmentsTitle: 'Белсенді жөнелтулер',
    activeShipmentsDesc: 'Өңдеудегі жөнелтулер тізімі',
    searchPlaceholder: 'Жөнелту нөмірі, клиент бойынша іздеу...',
    filters: 'Сүзгілер',
    number: 'Нөмір',
    client: 'Клиент',
    routeColumn: 'Бағыт',
    weightColumn: 'Салмақ',
    date: 'Күн',
    status: 'Күй',
    actions: 'Әрекеттер',
    details: 'Толығырақ',
    inTransit: 'Жолда',
    loaded: 'Тиелген',
    arrived: 'Келді',
    
    // Transit
    transitTitle: 'Транзит',
    transitDesc: 'Багаж қозғалысын тіркеу',
    qrScanning: 'QR-кодты сканерлеу',
    scanQrDesc: 'Тіркеу үшін багаждағы QR-кодты сканерлеңіз',
    startScanning: 'Сканерлеуді бастау',
    recentScans: 'Соңғы сканерлеулер',
    loading: 'Тиеу',
    arrivalScan: 'Келу',
    issuance: 'Беру',
    action: 'Әрекет',
    
    // Arrival
    arrivalTitle: 'Келу',
    arrivalDesc: 'Келген багажды басқару',
    arrivedShipments: 'Келген жөнелтулер',
    notifyAll: 'Барлығын хабарландыру',
    notified: 'Хабарландырылды',
    arrivedFrom: 'Қайдан:',
    arrivedAt: 'Келді:',
    phone: 'Телефон:',
    notify: 'Хабарландыру',
    issue: 'Беру',
    
    // Reports
    reportsTitle: 'Есептер',
    reportsDesc: 'Есептерді қалыптастыру және қарау',
    fo3Report: 'FO-3 есебі',
    financialReport: 'Қаржылық есеп',
    shipmentsReport: 'Жөнелтулер бойынша есеп',
    generalStats: 'Жалпы статистика',
    auditLog: 'Аудит журналы',
    userActions: 'Пайдаланушы әрекеттері',
    routeReport: 'Бағыттар бойынша есеп',
    routeAnalysis: 'Бағыттарды талдау',
    allUsers: 'Барлық пайдаланушылар',
    allRoutes: 'Барлық бағыттар',
    generate: 'Қалыптастыру',
    export: 'Жүктеп алу',
    
    // WMS
    wmsTitle: 'WMS қойма',
    wmsDesc: 'Автоматтандырылған қойма ұяшықтары жүйесі',
    storageCells: 'Қойма ұяшықтары',
    cellStatus: 'Ұяшықтар күйі',
    free: 'Бос',
    occupied: 'Толық',
    maintenance: 'Қызмет көрсету',
    selfService: 'Өзін-өзі қызмет көрсету',
    selfServiceDesc: 'Операторсыз багаж тапсыру',
    scanDocument: 'Құжатты сканерлеу',
    scanDocumentDesc: 'Бастау үшін төлқұжатты немесе QR-кодты сканерлеңіз',
    placeInCell: 'Ұяшыққа салыңыз',
    placeInCellDesc: 'Ұяшықты ашып, багажды ішіне салыңыз',
    autoMeasure: 'Автоматты өлшеу',
    autoMeasureDesc: 'Салмақ пен өлшемдер автоматты түрде өлшенеді',
    confirmShipment: 'Жөнелтуді растаңыз',
    confirmShipmentDesc: 'Деректерді тексеріп, QR-кодты алыңыз',
    cellNumber: 'Ұяшық',
    openCell: 'Ұяшықты ашу',
    closeCell: 'Ұяшықты жабу',
    
    // Settings
    settingsTitle: 'Баптаулар',
    settingsDesc: 'Жүйе және профиль баптаулары',
    languageSettings: 'Интерфейс тілі',
    themeSettings: 'Тақырып',
    light: 'Ашық',
    dark: 'Қараңғы',
    notificationSettings: 'Хабарландырулар',
    emailNotifications: 'Email хабарландырулары',
    smsNotifications: 'SMS хабарландырулары',
    saveSettings: 'Баптауларды сақтау',
    
    // Common
    cancel: 'Болдырмау',
    confirm: 'Растау',
    close: 'Жабу',
    save: 'Сақтау',
    delete: 'Жою',
    edit: 'Өңдеу',
    
    // Shipment created
    shipmentCreated: 'Жөнелту жасалды',
    documentsReady: 'Құжаттар қалыптастырылды және басып шығаруға дайын',
    printDocuments: 'Құжаттарды басып шығару',
    newShipmentButton: 'Жаңа жөнелту',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ru] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
