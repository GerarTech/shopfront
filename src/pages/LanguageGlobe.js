/ LanguageGlobe.js
import React, { useState, createContext, useContext, useEffect } from 'react';
// import '../LanguageSelector.css'; // Keep this if you have external CSS, or remove if using Tailwind only

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
    // Add more English translations here
  },
  'Spanish': {
    welcome: '¡Bienvenido!',
    chooseLanguage: 'Elige un idioma',
    selectLanguageButton: 'Seleccionar Idioma',
    confirmSelection: '✔️ Confirmar Selección',
    close: '✖️ Cerrar',
    clickToChoose: 'Haz clic en el botón para elegir tu idioma.',
    currentLanguageDisplay: 'Idioma Actual:',
    // Add more Spanish translations here
  },
  'Arabic': {
    welcome: 'أهلاً بك!',
    chooseLanguage: 'اختر اللغة',
    selectLanguageButton: 'اختر اللغة',
    confirmSelection: '✔️ تأكيد الاختيار',
    close: '✖️ إغلاق',
    clickToChoose: 'انقر الزر لاختيار لغتك.',
    currentLanguageDisplay: 'اللغة الحالية:',
    // Add more Arabic translations here
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
      {/* Tailwind CSS CDN and Inter font for basic styling.
          Ideally, these belong in your public/index.html or main layout file. */}
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>
        {`
        body {
          font-family: 'Inter', sans-serif;
        }
        /* Basic animations for modal */
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        /* If you are using LanguageSelector.css, ensure its styles
           are compatible or override these Tailwind classes as needed.
           For example, you might define:
           .language-overlay { ... }
           .language-selector { ... }
           .close-button { ... }
           .language-dropdown { ... }
           .choose-label { ... }
           .submit-button { ... }
           .globe-icon { ... }
           .active { ... }
        */
        `}
      </style>

      {/* Globe Icon to open the language selector */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/44/44386.png"
        alt="Globe Icon"
        className="globe-icon w-10 h-10 cursor-pointer fixed top-4 right-4 z-40 rounded-full shadow-md hover:scale-105 transition-transform duration-200"
        onClick={() => setIsOpen(true)}
        title={t('selectLanguageButton')} // Translated title
      />

      {/* Language Selection Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-auto transform transition-all duration-300 ease-out scale-100 opacity-100 animate-slide-up">
            {/* Close button for the modal */}
            <div className="flex justify-end">
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none p-1 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
                title={t('close')} // Translated title for accessibility
              >
                ✖️
              </button>
            </div>

            {/* Language selection list content */}
            <div className="mt-4 text-center">
              <p className="text-xl font-bold text-gray-800 mb-4">{t('chooseLanguage')}</p>
              <ul className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 p-2 mb-6 shadow-inner">
                {languages.map((lang) => (
                  <li
                    key={lang}
                    className={`py-2.5 px-3 rounded-lg cursor-pointer text-gray-700 text-left transition-all duration-200 ease-in-out
                                ${lang === tempSelectedLanguage ? 'bg-blue-500 text-white font-semibold shadow-md transform scale-102' : 'hover:bg-gray-200'}`}
                    onClick={() => handleLanguageClick(lang)} // Updates temporary selection
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirm selection button */}
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
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