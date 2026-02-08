import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { LocationDisplay } from "./components/LocationDisplay";
import "./App.css";

function App() {
	const { t } = useTranslation();

	return (
		<div className="app">
			<aside className="app-sidebar">
				<div className="sidebar-header">
					<h1>{t("welcome")}</h1>
				</div>
				<nav className="sidebar-nav">
					<LanguageSwitcher />
				</nav>
			</aside>
			<main className="app-main">
				<div className="main-container">
					<LocationDisplay />
				</div>
			</main>
		</div>
	);
}

export default App;
