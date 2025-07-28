// LanguageGlobe.js
import React, { useState, createContext, useContext, useEffect } from 'react';
import '../LanguageSelector.css'; // This import will now be the primary source of styling

// 1. Create a Language Context
// This context will be used to provide and consume language-related state
// throughout your application.
const LanguageContext = createContext();

// 2. Define your translations
// This object holds all the translated strings, organized by language.
// You can expand this object with more keys and languages as your application grows.
const translations = {
  'English': {
    welcome: 'Welcome!',
    chooseLanguage: 'Choose language',
    selectLanguageButton: 'Select Language',
    confirmSelection: '✔️ Confirm Selection',
    close: '✖️ Close',
    clickToChoose: 'Click the button to choose your language.',
    currentLanguageDisplay: 'Current Language:',
    brandName: 'Shopify',
    tagline: 'Talking',
    loginFailed: 'Login failed.',
    phoneNumberPlaceholder: 'Phone Number',
    passwordPlaceholder: 'Password',
    logInButton: 'LOG IN',
    loggingInButton: 'Logging in...',
    createAccountLink: 'Create an account',
    poweredBy: 'Powered by Shopify',
    // Dashboard specific translations
    logoutButton: 'Logout',
    loadingText: 'Loading...',
    currencySymbol: '$',
    addFundsButton: 'Add Funds',
    topProductsHeading: 'Top Products',
    loadingProductsText: 'Loading products... ⏳',
    errorLoadingProducts: 'Error: Failed to load products. 🙁',
    noProductsFound: 'No products found. 😔',
    congratulationsPrefix: '🎉 Congratulations to',
    startMakingMoneyButton: 'START MAKING MONEY',
    aboutUsHeading: 'About Us',
    aboutUsText: 'We are committed to offering curated, trending, and premium products through our platform.',
    latestIncidentHeading: 'Latest Incident',
    noReportedIncidents: 'No reported incidents at this time.',
    trcHeading: 'TRC',
    trcText: 'Transparency Reporting Center - All transactions and activity are monitored for your security.',
    faqHeading: 'FAQ',
    partnerPlaceholder: 'Partner', // For placeholder text
    faq1Question: 'How do I start earning?',
    faq1Answer: 'You can start earning by clicking the “START MAKING MONEY” button and completing tasks or sharing your affiliate links.',
    faq2Question: 'How do I track my orders?',
    faq2Answer: 'Orders can be tracked via the “Orders” section in the sidebar. You\'ll see real-time updates there.',
    faq3Question: 'Where can I view my payments?',
    faq3Answer: 'All payment history and upcoming payouts are available under the “Profile” or “Payments” tab in your account dashboard.',
    // Register specific translations
    registrationTo: 'Registration to',
    createYourAccount: 'Create your account',
    fillAllFields: 'Please fill all required fields.',
    passwordsMismatch: 'Passwords do not match.',
    referralCodeRequired: 'Referral code is required for registration.',
    registrationSuccessful: 'Registration successful!',
    registrationFailed: 'Registration failed. Please try again.',
    usernamePlaceholder: 'Username',
    confirmPasswordPlaceholder: 'Confirm password',
    withdrawalPasswordPlaceholder: 'Withdrawal password',
    referralCodePlaceholder: 'Referral Code (Required)',
    registerButton: 'REGISTER',
    backToLoginLink: 'Back to Login',
    // OrderDashboard specific translations
    uncompletedOrders: 'Uncompleted Orders',
    completedOrders: 'Completed Orders',
    dailyOrders: 'Daily Orders',
    startOrderTask: 'START ORDER TASK',
    failedLoadSummary: 'Failed to load dashboard summary.',
    retryButton: 'Retry',
  },
  'Spanish': {
    welcome: '¡Bienvenido!',
    chooseLanguage: 'Elige un idioma',
    selectLanguageButton: 'Seleccionar Idioma',
    confirmSelection: '✔️ Confirmar Selección',
    close: '✖️ Cerrar',
    clickToChoose: 'Haz clic en el botón para elegir tu idioma.',
    currentLanguageDisplay: 'Idioma Actual:',
    brandName: 'Shopify',
    tagline: 'Hablando',
    loginFailed: 'Error al iniciar sesión.',
    phoneNumberPlaceholder: 'Número de Teléfono',
    passwordPlaceholder: 'Contraseña',
    logInButton: 'INICIAR SESIÓN',
    loggingInButton: 'Iniciando sesión...',
    createAccountLink: 'Crear una cuenta',
    poweredBy: 'Con la tecnología de Shopify',
    // Dashboard specific translations
    logoutButton: 'Cerrar sesión',
    loadingText: 'Cargando...',
    currencySymbol: '$',
    addFundsButton: 'Añadir Fondos',
    topProductsHeading: 'Productos Destacados',
    loadingProductsText: 'Cargando productos... ⏳',
    errorLoadingProducts: 'Error: No se pudieron cargar los productos. 🙁',
    noProductsFound: 'No se encontraron productos. 😔',
    congratulationsPrefix: '🎉 Felicitaciones a',
    startMakingMoneyButton: 'EMPEZAR A GANAR DINERO',
    aboutUsHeading: 'Sobre Nosotros',
    aboutUsText: 'Estamos comprometidos a ofrecer productos seleccionados, de tendencia y premium a través de nuestra plataforma.',
    latestIncidentHeading: 'Último Incidente',
    noReportedIncidents: 'No se han reportado incidentes en este momento.',
    trcHeading: 'TRC',
    trcText: 'Centro de Informes de Transparencia - Todas las transacciones y actividades son monitoreadas para su seguridad.',
    faqHeading: 'Preguntas Frecuentes',
    partnerPlaceholder: 'Socio',
    faq1Question: '¿Cómo empiezo a ganar?',
    faq1Answer: 'Puedes empezar a ganar haciendo clic en el botón “EMPEZAR A GANAR DINERO” y completando tareas o compartiendo tus enlaces de afiliado.',
    faq2Question: '¿Cómo hago seguimiento de mis pedidos?',
    faq2Answer: 'Los pedidos se pueden rastrear a través de la sección “Pedidos” en la barra lateral. Verás actualizaciones en tiempo real allí.',
    faq3Question: '¿Dónde puedo ver mis pagos?',
    faq3Answer: 'Todo el historial de pagos y los próximos pagos están disponibles en la pestaña “Perfil” o “Pagos” de tu panel de cuenta.',
    // OrderDashboard specific translations
    uncompletedOrders: 'Pedidos Incompletos',
    completedOrders: 'Pedidos Completados',
    dailyOrders: 'Pedidos Diarios',
    startOrderTask: 'INICIAR TAREA DE PEDIDO',
    failedLoadSummary: 'No se pudo cargar el resumen del panel.',
    retryButton: 'Reintentar',
  },
  'Arabic': {
    welcome: 'أهلاً بك!',
    chooseLanguage: 'اختر اللغة',
    selectLanguageButton: 'اختر اللغة',
    confirmSelection: '✔️ تأكيد الاختيار',
    close: '✖️ إغلاق',
    clickToChoose: 'انقر الزر لاختيار لغتك.',
    currentLanguageDisplay: 'اللغة الحالية:',
    brandName: 'شوبيفاي',
    tagline: 'يتحدث',
    loginFailed: 'فشل تسجيل الدخول.',
    phoneNumberPlaceholder: 'رقم الهاتف',
    passwordPlaceholder: 'كلمة المرور',
    logInButton: 'تسجيل الدخول',
    loggingInButton: 'جاري تسجيل الدخول...',
    createAccountLink: 'إنشاء حساب',
    poweredBy: 'مدعوم من شوبيفاي',
    // Dashboard specific translations
    logoutButton: 'تسجيل الخروج',
    loadingText: 'جاري التحميل...',
    currencySymbol: '$',
    addFundsButton: 'إضافة أموال',
    topProductsHeading: 'أهم المنتجات',
    loadingProductsText: 'جاري تحميل المنتجات... ⏳',
    errorLoadingProducts: 'خطأ: فشل تحميل المنتجات. 🙁',
    noProductsFound: 'لم يتم العثور على منتجات. 😔',
    congratulationsPrefix: '🎉 تهانينا لـ',
    startMakingMoneyButton: 'ابدأ بكسب المال',
    aboutUsHeading: 'من نحن',
    aboutUsText: 'نحن ملتزمون بتقديم منتجات منسقة ورائجة ومميزة عبر منصتنا.',
    latestIncidentHeading: 'آخر حادث',
    noReportedIncidents: 'لا توجد حوادث مبلغ عنها في الوقت الحالي.',
    trcHeading: 'مركز تقارير الشفافية',
    trcText: 'مركز تقارير الشفافية - يتم مراقبة جميع المعاملات والأنشطة لأمانك.',
    faqHeading: 'الأسئلة الشائعة',
    partnerPlaceholder: 'شريك',
    faq1Question: 'كيف أبدأ الكسب؟',
    faq1Answer: 'يمكنك البدء في الكسب بالنقر على زر "ابدأ بكسب المال" وإكمال المهام أو مشاركة روابط الإحالة الخاصة بك.',
    faq2Question: 'كيف أتتبع طلباتي؟',
    faq2Answer: 'يمكن تتبع الطلبات عبر قسم "الطلبات" في الشريط الجانبي. سترى تحديثات في الوقت الفعلي هناك.',
    faq3Question: 'أين يمكنني عرض مدفوعاتي؟',
    faq3Answer: 'جميع سجلات الدفع والمدفوعات القادمة متاحة تحت علامة التبويب "الملف الشخصي" أو "المدفوعات" في لوحة تحكم حسابك.',
    // Register specific translations
    registrationTo: 'التسجيل في',
    createYourAccount: 'أنشئ حسابك',
    fillAllFields: 'الرجاء ملء جميع الحقول المطلوبة.',
    passwordsMismatch: 'كلمات المرور غير متطابقة.',
    referralCodeRequired: 'رمز الإحالة مطلوب للتسجيل.',
    registrationSuccessful: 'تم التسجيل بنجاح!',
    registrationFailed: 'فشل التسجيل. الرجاء المحاولة مرة أخرى.',
    usernamePlaceholder: 'اسم المستخدم',
    confirmPasswordPlaceholder: 'تأكيد كلمة المرور',
    withdrawalPasswordPlaceholder: 'كلمة مرور السحب',
    referralCodePlaceholder: 'رمز الإحالة (مطلوب)',
    registerButton: 'تسجيل',
    backToLoginLink: 'العودة إلى تسجيل الدخول',
    // OrderDashboard specific translations
    uncompletedOrders: 'الطلبات غير المكتملة',
    completedOrders: 'الطلبات المكتملة',
    dailyOrders: 'الطلبات اليومية',
    startOrderTask: 'بدء مهمة الطلب',
    failedLoadSummary: 'فشل تحميل ملخص لوحة التحكم.',
    retryButton: 'إعادة المحاولة',
  },
  // Add more languages and their translations here
};

// LanguageGlobe Component
// This component displays the language selection overlay.
// It manages its own `isOpen` state and uses context for language selection.
const LanguageGlobe = () => {
  const [isOpen, setIsOpen] = useState(false); // State to control modal visibility

  // Consume the language context to get current language and the translation function.
  // The `setCurrentLanguage` function is used to update the global language state.
  const { currentLanguage, setCurrentLanguage, t } = useContext(LanguageContext);

  // `tempSelectedLanguage` holds the language selected within the modal,
  // before it's confirmed and applied globally.
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState(currentLanguage);

  // Get the list of available languages from the keys of the translations object.
  // This ensures the list dynamically updates with available translations.
  const languages = Object.keys(translations);

  // Effect to update the temporary selected language when the modal opens
  // or when the global current language changes (e.g., if set externally).
  useEffect(() => {
    setTempSelectedLanguage(currentLanguage);
  }, [isOpen, currentLanguage]);

  // Handler for when the user confirms their language selection.
  const handleConfirm = () => {
    setCurrentLanguage(tempSelectedLanguage); // Update the global language state
    setIsOpen(false); // Close the language selection modal
  };

  // Handler for when a language is clicked in the list (updates temporary selection)
  const handleLanguageClick = (lang) => {
    setTempSelectedLanguage(lang); // Only update the temporary selection
  };

  return (
    <>
      {/* Globe Icon to open the language selector */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/44/44386.png"
        alt="Globe Icon"
        className="globe-icon" // Removed Tailwind classes, relies on LanguageSelector.css
        onClick={() => setIsOpen(true)}
        title={t('selectLanguageButton')} // Translated title
      />

      {/* Language Selection Overlay */}
      {isOpen && (
        <div className="language-overlay"> {/* Removed Tailwind classes, relies on LanguageSelector.css */}
          <div className="language-selector"> {/* Removed Tailwind classes, relies on LanguageSelector.css */}
            {/* Close button for the modal */}
            <button
              className="close-button" // Removed Tailwind classes, relies on LanguageSelector.css
              onClick={() => setIsOpen(false)}
              title={t('close')} // Translated title for accessibility
            >
              ✖️
            </button>

            {/* Language selection list content */}
            <div className="language-dropdown"> {/* Removed Tailwind classes, relies on LanguageSelector.css */}
              <p className="choose-label">{t('chooseLanguage')}</p> 
              <ul>
                {languages.map((lang) => (
                  <li
                    key={lang}
                    className={lang === tempSelectedLanguage ? 'active' : ''} // Relies on LanguageSelector.css for 'active'
                    onClick={() => handleLanguageClick(lang)} // Updates temporary selection
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirm selection button */}
            <button
              className="submit-button" // Removed Tailwind classes, relies on LanguageSelector.css
              onClick={handleConfirm} // Calls handleConfirm to apply changes
              title={t('confirmSelection')} // Translated title for accessibility
            >
              {t('confirmSelection')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Export the LanguageGlobe component, LanguageContext, and translations.
// This allows other components to import and use them.
export { LanguageContext, translations };
export default LanguageGlobe;
