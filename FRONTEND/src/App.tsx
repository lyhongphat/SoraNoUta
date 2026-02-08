import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { LocationDisplay } from "./components/LocationDisplay";

function App() {
	const { t } = useTranslation();

	return (
		<div className="min-h-screen flex bg-gradient-to-br from-primary via-purple-500 to-secondary text-white">
			{/* Sidebar */}
			<aside className="w-72 bg-black/15 backdrop-blur-md border-r border-white/10 p-8 flex flex-col gap-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold">{t("welcome")}</h1>
				</div>
				<nav className="flex flex-col gap-4">
					<LanguageSwitcher />
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-8 flex items-center justify-center">
				<div className="w-full max-w-2xl">
					<LocationDisplay />
				</div>
			</main>
		</div>
	);
}

export default App;
