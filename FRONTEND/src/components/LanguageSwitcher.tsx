import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  return (
    <div className="group relative inline-block">
      {/* Button */}
      <button
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white border-none rounded-lg cursor-pointer font-medium text-base transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        title="Change language"
        aria-label="Language selector"
      >
        <Globe size={20} />
        <span className="text-xl">{currentLanguage?.flag}</span>
      </button>

      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl min-w-max opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`w-full px-4 py-3 text-left border-none cursor-pointer font-medium text-base transition-all duration-200 flex items-center gap-3 text-gray-900 ${
              i18n.language === lang.code
                ? 'bg-primary/10 text-primary font-bold'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleLanguageChange(lang.code)}
            aria-current={i18n.language === lang.code}
          >
            <span className="text-2xl min-w-max text-center">{lang.flag}</span>
            <span className="flex-1">{lang.name}</span>
            {i18n.language === lang.code && (
              <span className="font-bold text-primary">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
