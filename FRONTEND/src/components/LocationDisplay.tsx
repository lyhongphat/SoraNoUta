import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader, AlertCircle, RefreshCw } from "lucide-react";

export interface AddressData {
	display_name: string;
	address?: {
		neighbourhood?: string;
		village?: string;
		hamlet?: string;
		suburb?: string;
		district?: string;
		county?: string;
		city?: string;
		province?: string;
		state?: string;
		postcode?: string;
		country?: string;
	};
}

interface LocationDisplayProps {
	isDark?: boolean;
	onAddressUpdate?: (address: AddressData | null) => void;
	onError?: (error: string | null) => void;
}

export function LocationDisplay({
	isDark = false,
	onAddressUpdate,
	onError,
}: LocationDisplayProps) {
	const { t } = useTranslation();
	const [address, setAddress] = useState<AddressData | null>(null);
	const [coordinates, setCoordinates] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const cardBg = isDark ? "bg-gray-800/90" : "bg-white/90";
	const cardText = isDark ? "text-white" : "text-gray-900";
	const cardBorder = isDark ? "border-gray-700" : "border-gray-300";
	const coordBg = isDark
		? "bg-blue-900/30 border-blue-700"
		: "bg-blue-100/50 border-blue-300";

	const handleGetLocation = async () => {
		try {
			setLoading(true);
			setError(null);

			if (!navigator.geolocation) {
				throw new Error(t("geolocationNotSupported"));
			}

			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;
					setCoordinates({ latitude, longitude });
					await fetchAddress(latitude, longitude);
					setLoading(false);
				},
				(err) => {
					setError(err.message);
					setLoading(false);
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 0,
				},
			);
		} catch (err) {
			console.error("Error:", err);
			const errorMsg = err instanceof Error ? err.message : "Unknown error";
			setError(errorMsg);
			setLoading(false);
		}
	};

	useEffect(() => {
		handleGetLocation();
	}, []);

	useEffect(() => {
		onAddressUpdate?.(address);
	}, [address, onAddressUpdate]);

	useEffect(() => {
		onError?.(error);
	}, [error, onError]);

	const fetchAddress = async (lat: number, lng: number) => {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
				{
					headers: {
						"User-Agent": "SoraNoUta/1.0 (Address Lookup)",
						"Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
						Referer: "http://localhost:5173/",
						Origin: "http://localhost:5173",
					},
				},
			);
			if (!response.ok) {
				throw new Error("Failed to fetch address");
			}
			const addressData: AddressData = await response.json();
			setAddress(addressData);
		} catch (err) {
			console.error("Error fetching address:", err);
			setError(t("locationFetchError"));
		}
	};

	if (loading) {
		return (
			<div
				className={`${cardBg} rounded-lg p-4 shadow-lg ${cardText} flex flex-col items-center justify-center gap-3 border ${cardBorder}`}
			>
				<Loader
					className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"} animate-spin`}
				/>
				<p className="text-sm">{t("fetchingLocation")}</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-3">
				<div
					className={`${cardBg} rounded-lg p-4 shadow-lg flex flex-col items-center justify-center gap-3 ${isDark ? "text-red-400" : "text-red-500"} border ${cardBorder}`}
				>
					<AlertCircle className="w-5 h-5" />
					<p className="text-sm">{error}</p>
					<button
						onClick={handleGetLocation}
						className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-all ${
							isDark
								? "bg-red-900/30 hover:bg-red-800/50 text-red-300"
								: "bg-red-100/50 hover:bg-red-200/50 text-red-600"
						}`}
					>
						<RefreshCw size={14} />
						{t("retry")}
					</button>
				</div>

				{/* Warning persists even in error state if we have past coordinates */}
				{coordinates && (
					<div
						className={`p-3 rounded-lg border-l-4 ${
							isDark
								? "border-yellow-600 bg-yellow-900/20 text-yellow-200"
								: "border-yellow-500 bg-yellow-50 text-yellow-700"
						} text-xs`}
					>
						⚠️ {t("warning")}: {t("warningMessage")}
					</div>
				)}
			</div>
		);
	}

	if (!coordinates) return null;

	return (
		<div className="space-y-3">
			{/* Coordinates Card */}
			<div className={`p-4 ${coordBg} rounded-lg border-l-4 border-blue-500`}>
				<p
					className={`text-xs font-bold uppercase ${isDark ? "text-blue-300" : "text-blue-600"} mb-2 tracking-wider`}
				>
					{t("coordinates")}
				</p>
				<div
					className={`text-sm ${isDark ? "text-gray-200" : "text-gray-900"} font-mono break-all`}
				>
					📍 {coordinates.latitude.toFixed(4)}°,{" "}
					{coordinates.longitude.toFixed(4)}°
				</div>
			</div>

			{/* Warning */}
			<div
				className={`p-3 rounded-lg border-l-4 ${
					isDark
						? "border-yellow-600 bg-yellow-900/20 text-yellow-200"
						: "border-yellow-500 bg-yellow-50 text-yellow-700"
				} text-xs`}
			>
				⚠️ {t("warning")}: {t("warningMessage")}
			</div>
		</div>
	);
}
