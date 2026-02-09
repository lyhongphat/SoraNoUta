import { useTranslation } from "react-i18next";

interface Language {
	code: string;
	name: string;
	flag: string;
}

interface LanguageSwitcherProps {
	isDark?: boolean;
}

const languages: Language[] = [
	{ code: "en", name: "English", flag: "🇺🇸" },
	{ code: "ja", name: "日本語", flag: "🇯🇵" },
	{ code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
];

export function LanguageSwitcher({ isDark = false }: LanguageSwitcherProps) {
	const { i18n } = useTranslation();

	const handleLanguageChange = (langCode: string) => {
		i18n.changeLanguage(langCode);
		localStorage.setItem("language", langCode);
	};

	const baseClass = isDark
		? "bg-gray-800/50 border-gray-700"
		: "bg-gray-200/50 border-gray-300";

	const buttonActive = isDark
		? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
		: "bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-lg scale-105";

	const buttonInactive = isDark
		? "bg-gray-700/50 text-gray-200 hover:bg-gray-600/50"
		: "bg-gray-300/50 text-gray-700 hover:bg-gray-400/50";

	return (
		<div className={`flex flex-col gap-2 ${baseClass} backdrop-blur-sm p-3 rounded-xl border w-full`}>
			{languages.map((lang) => (
				<button
					key={lang.code}
					onClick={() => handleLanguageChange(lang.code)}
					className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
						i18n.language === lang.code
							? buttonActive
							: buttonInactive
					}`}
					aria-current={i18n.language === lang.code}
					title={`Switch to ${lang.name}`}
				>
					<span className="text-lg">{lang.flag}</span>
					<span>{lang.name}</span>
				</button>
			))}
		</div>
	);
}
