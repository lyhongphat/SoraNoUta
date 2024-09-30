import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DarkModeToggleProps {
	isDark: boolean;
	onToggle: () => void;
}

export function DarkModeToggle({ isDark, onToggle }: DarkModeToggleProps) {
	const { t } = useTranslation();

	return (
		<button
			onClick={onToggle}
			className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
				isDark
					? "bg-gradient-to-r from-gray-800 to-gray-900 text-yellow-300 hover:shadow-lg"
					: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-gray-800 hover:shadow-lg"
			}`}
			title={isDark ? t("lightMode") : t("darkMode")}
		>
			{isDark ? <Sun size={20} /> : <Moon size={20} />}
			<span>{isDark ? t("lightMode") : t("darkMode")}</span>
		</button>
	);
}
