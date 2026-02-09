import { useTranslation } from "react-i18next";

interface Language {
	code: string;
	name: string;
	flag: string;
}

const languages: Language[] = [
	{ code: "en", name: "English", flag: "🇺🇸" },
	{ code: "ja", name: "日本語", flag: "🇯🇵" },
	{ code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
];

export function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const handleLanguageChange = (langCode: string) => {
		i18n.changeLanguage(langCode);
		localStorage.setItem("language", langCode);
	};

	return (
		<div className="flex flex-col gap-2 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 w-full">
			{languages.map((lang) => (
				<button
					key={lang.code}
					onClick={() => handleLanguageChange(lang.code)}
					className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
						i18n.language === lang.code
							? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
							: "bg-white/20 text-white hover:bg-white/30"
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
