import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { LocationDisplay } from "./components/LocationDisplay";
import type { AddressData } from "./components/LocationDisplay";
import { AddressCard } from "./components/AddressCard";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { AlertModal } from "./components/AlertModal";

function App() {
	const { t, i18n } = useTranslation();
	const [isDark, setIsDark] = useState(() => {
		const saved = localStorage.getItem("darkMode");
		return saved ? JSON.parse(saved) : false;
	});
	const [address, setAddress] = useState<AddressData | null>(null);
	const [addressLoading, setAddressLoading] = useState(true);
	const [locationError, setLocationError] = useState<string | null>(null);
	const [showErrorModal, setShowErrorModal] = useState(false);

	useEffect(() => {
		document.title = t("welcome");
	}, [i18n.language, t]);

	useEffect(() => {
		if (locationError) {
			setShowErrorModal(true);
		}
	}, [locationError]);

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
		<>
			<div className={`min-h-screen flex ${bgGradient} ${textColor}`}>
				{/* Sidebar */}
				<aside
					className={`w-96 ${sidebarBg} backdrop-blur-md border-r p-8 flex flex-col gap-6 overflow-y-auto`}
				>
					<div className="text-center">
						<h1 className={`text-3xl font-bold ${sidebarText}`}>
							{t("welcome")}
						</h1>
					</div>
					<nav className="flex flex-col gap-4 flex-1">
						<LanguageSwitcher isDark={isDark} />
						<AddressCard
							address={address}
							loading={addressLoading}
							isDark={isDark}
						/>
						<LocationDisplay
							isDark={isDark}
							onAddressUpdate={(newAddress) => {
								setAddress(newAddress);
								setAddressLoading(false);
							}}
							onError={setLocationError}
						/>
					</nav>
					<DarkModeToggle isDark={isDark} onToggle={handleDarkModeToggle} />
				</aside>

				{/* Main Content */}
				<main className="flex-1 p-8 flex flex-col items-center justify-center">
					<div className="w-full max-w-2xl flex-1 flex items-center justify-center" />
				</main>
			</div>

			{/* Error Modal */}
			<AlertModal
				isOpen={showErrorModal}
				title="Lỗi định vị"
				message={locationError || "Không thể lấy vị trí của bạn"}
				isDark={isDark}
				onClose={() => setShowErrorModal(false)}
			/>
		</>
	);
}

export default App;
