import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Wind, Droplets, Loader, AlertCircle } from "lucide-react";

interface WeatherData {
	location: {
		name: string;
		country: string;
		latitude: number;
		longitude: number;
	};
	weather: {
		temperature: number;
		windspeed: number;
		winddirection: number;
		weathercode: number;
		time: string;
	};
}

interface LocationDisplayProps {
	isDark?: boolean;
}

export function LocationDisplay({ isDark = false }: LocationDisplayProps) {
	const { t } = useTranslation();
	const [data, setData] = useState<WeatherData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const cardBg = isDark ? "bg-gray-800/90" : "bg-white/90";
	const cardText = isDark ? "text-white" : "text-gray-900";
	const cardBorder = isDark ? "border-gray-700" : "border-gray-300";
	const headerBorder = isDark ? "border-blue-500" : "border-blue-400";
	const coordBg = isDark
		? "bg-blue-900/30 border-blue-700"
		: "bg-blue-100/50 border-blue-300";
	const weatherCardBg = isDark ? "bg-gray-700/50" : "bg-gray-100/50";
	const weatherCardBorder = isDark ? "border-gray-600" : "border-gray-300";
	const labelText = isDark ? "text-gray-400" : "text-gray-500";

	useEffect(() => {
		const fetchLocation = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetch("http://localhost:8000/weather");
				if (!response.ok) {
					throw new Error("Failed to fetch location data");
				}
				const jsonData = await response.json();
				setData(jsonData);
			} catch (err) {
				console.error("Error fetching location:", err);
				const errorMsg = err instanceof Error ? err.message : "Unknown error";
				setError(errorMsg);
				setData(null);
			} finally {
				setLoading(false);
			}
		};

		fetchLocation();
	}, []);

	if (loading) {
		return (
			<div className={`${cardBg} rounded-2xl p-8 shadow-2xl max-w-2xl w-full ${cardText} flex flex-col items-center justify-center min-h-80 gap-6 border ${cardBorder}`}>
				<Loader className={`w-12 h-12 ${isDark ? "text-blue-400" : "text-blue-600"} animate-spin`} />
				<p className="text-lg">{t("fetchingLocation")}</p>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className={`${cardBg} rounded-2xl p-8 shadow-2xl max-w-2xl w-full flex flex-col items-center justify-center min-h-80 gap-4 ${isDark ? "text-red-400" : "text-red-500"} border ${cardBorder}`}>
				<AlertCircle className="w-12 h-12" />
				<p className="text-lg">{t("locationError")}</p>
				{error && <small className={isDark ? "text-gray-400" : "text-gray-500"}>{error}</small>}
			</div>
		);
	}

	const { location, weather } = data;
	const windDirection = Math.round(weather.winddirection);
	const iconColor = isDark ? "text-blue-400" : "text-blue-600";

	return (
		<div className={`${cardBg} rounded-2xl p-8 shadow-2xl max-w-2xl w-full ${cardText} border ${cardBorder}`}>
			{/* Header */}
			<div className={`flex items-start gap-4 mb-8 pb-6 border-b-2 ${headerBorder}`}>
				<MapPin className={`w-8 h-8 ${iconColor} flex-shrink-0 mt-1`} />
				<div>
					<h2 className={`text-2xl font-bold ${iconColor} m-0 mb-2`}>
						{t("currentLocation")}
					</h2>
					<p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"} m-0`}>
						{location.name}, {location.country}
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-col gap-6">
				{/* Coordinates Card */}
				<div className={`p-6 ${coordBg} rounded-xl border-l-4 border-blue-500`}>
					<p className={`text-xs font-bold uppercase ${isDark ? "text-blue-300" : "text-blue-600"} mb-3 tracking-wider`}>
						Coordinates
					</p>
					<div className={`text-base ${isDark ? "text-gray-200" : "text-gray-900"} font-mono mb-3 break-all`}>
						📍 {location.latitude.toFixed(4)}° N,{" "}
						{location.longitude.toFixed(4)}° E
					</div>
					<p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"} m-0`}>
						{new Date(weather.time).toLocaleString()}
					</p>
				</div>

				{/* Weather Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					{/* Temperature Card */}
					<div className={`p-6 ${weatherCardBg} border-2 ${weatherCardBorder} rounded-xl flex flex-col items-center gap-2 hover:shadow-lg transition-all duration-300`}>
						<p className={`text-3xl font-bold ${isDark ? "text-blue-300" : "text-blue-600"}`}>
							{Math.round(weather.temperature)}°C
						</p>
						<p className={`text-xs uppercase font-bold ${labelText} text-center tracking-widest`}>
							Temperature
						</p>
					</div>

					{/* Wind Speed Card */}
					<div className={`p-6 ${weatherCardBg} border-2 ${weatherCardBorder} rounded-xl flex flex-col items-center gap-2 hover:shadow-lg transition-all duration-300`}>
						<Wind className={`w-6 h-6 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
						<p className={`text-3xl font-bold ${isDark ? "text-emerald-300" : "text-emerald-600"}`}>
							{weather.windspeed}
						</p>
						<p className={`text-xs uppercase font-bold ${labelText} text-center tracking-widest`}>
							Wind (km/h)
						</p>
						<small className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
							Dir: {windDirection}°
						</small>
					</div>

					{/* Weather Code Card */}
					<div className={`p-6 ${weatherCardBg} border-2 ${weatherCardBorder} rounded-xl flex flex-col items-center gap-2 hover:shadow-lg transition-all duration-300`}>
						<Droplets className={`w-6 h-6 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
						<p className={`text-3xl font-bold ${isDark ? "text-orange-300" : "text-orange-600"}`}>
							{weather.weathercode}
						</p>
						<p className={`text-xs uppercase font-bold ${labelText} text-center tracking-widest`}>
							Code
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
