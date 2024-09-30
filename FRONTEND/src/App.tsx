import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { LocationDisplay } from "./components/LocationDisplay";
import { DarkModeToggle } from "./components/DarkModeToggle";

function App() {
	const { t, i18n } = useTranslation();
	const [isDark, setIsDark] = useState(() => {
		const saved = localStorage.getItem("darkMode");
		return saved ? JSON.parse(saved) : false;
	});

	useEffect(() => {
		document.title = t("welcome");
	}, [i18n.language, t]);

	const handleDarkModeToggle = () => {
		const newMode = !isDark;
		setIsDark(newMode);
		localStorage.setItem("darkMode", JSON.stringify(newMode));
	};

	const bgGradient = isDark
		? "bg-gradient-to-b from-gray-950 via-gray-900 to-black"
		: "bg-gradient-to-b from-gray-100 via-gray-50 to-white";

	const textColor = isDark ? "text-white" : "text-gray-900";
	const sidebarBg = isDark
		? "bg-gray-900/80 border-gray-800"
		: "bg-white/80 border-gray-200";
	const sidebarText = isDark ? "text-white" : "text-gray-900";

	return (
		<div className={`min-h-screen flex ${bgGradient} ${textColor}`}>
			{/* Sidebar */}
			<aside
				className={`w-96 ${sidebarBg} backdrop-blur-md border-r p-8 flex flex-col gap-6`}
			>
				<div className="text-center">
					<h1 className={`text-3xl font-bold ${sidebarText}`}>
						{t("welcome")}
					</h1>
				</div>
				<nav className="flex flex-col gap-4 flex-1">
					<LanguageSwitcher isDark={isDark} />
				</nav>
				<DarkModeToggle isDark={isDark} onToggle={handleDarkModeToggle} />
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-8 flex items-center justify-center">
				<div className="w-full max-w-2xl">
					<LocationDisplay isDark={isDark} />
				</div>
			</main>
		</div>
	);
}

export default App;
