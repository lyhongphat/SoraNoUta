import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import './App.css';

function App() {
	const { t } = useTranslation();

	return (
		<div className="app">
			<header className="app-header">
				<h1>{t('welcome')}</h1>
				<LanguageSwitcher />
			</header>
			<main className="app-main">
				<p>Sora no Uta - Music Recommendation App</p>
			</main>
		</div>
	);
}

export default App;
