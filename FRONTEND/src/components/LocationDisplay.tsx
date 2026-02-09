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

export function LocationDisplay() {
	const { t } = useTranslation();
	const [data, setData] = useState<WeatherData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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
			<div className="bg-white/95 rounded-2xl p-8 shadow-2xl max-w-2xl w-full text-gray-900 flex flex-col items-center justify-center min-h-80 gap-6">
				<Loader className="w-12 h-12 text-primary animate-spin" />
				<p className="text-lg text-gray-600">{t("fetchingLocation")}</p>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="bg-white/95 rounded-2xl p-8 shadow-2xl max-w-2xl w-full flex flex-col items-center justify-center min-h-80 gap-4 text-red-500">
				<AlertCircle className="w-12 h-12" />
				<p className="text-lg">{t("locationError")}</p>
				{error && <small className="text-gray-500">{error}</small>}
			</div>
		);
	}

	const { location, weather } = data;
	const windDirection = Math.round(weather.winddirection);

	return (
		<div className="bg-white/95 rounded-2xl p-8 shadow-2xl max-w-2xl w-full text-gray-900">
			{/* Header */}
			<div className="flex items-start gap-4 mb-8 pb-6 border-b-2 border-primary">
				<MapPin className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
				<div>
					<h2 className="text-2xl font-bold text-primary m-0 mb-2">
						{t("currentLocation")}
					</h2>
					<p className="text-lg text-gray-600 m-0">
						{location.name}, {location.country}
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-col gap-6">
				{/* Coordinates Card */}
				<div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border-l-4 border-primary">
					<p className="text-xs font-bold uppercase text-primary mb-3 tracking-wider">
						Coordinates
					</p>
					<div className="text-base text-gray-900 font-mono mb-3 break-all">
						📍 {location.latitude.toFixed(4)}° N,{" "}
						{location.longitude.toFixed(4)}° E
					</div>
					<p className="text-xs text-gray-400 m-0">
						{new Date(weather.time).toLocaleString()}
					</p>
				</div>

				{/* Weather Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					{/* Temperature Card */}
					<div className="p-6 bg-white border-2 border-gray-200 rounded-xl flex flex-col items-center gap-2 hover:border-primary hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary">
						<p className="text-3xl font-bold text-gray-900">
							{Math.round(weather.temperature)}°C
						</p>
						<p className="text-xs uppercase font-bold text-gray-500 text-center tracking-widest">
							Temperature
						</p>
					</div>

					{/* Wind Speed Card */}
					<div className="p-6 bg-white border-2 border-gray-200 rounded-xl flex flex-col items-center gap-2 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-emerald-500/5 to-green-500/5 border-emerald-400">
						<Wind className="w-6 h-6 text-emerald-500" />
						<p className="text-3xl font-bold text-gray-900">
							{weather.windspeed}
						</p>
						<p className="text-xs uppercase font-bold text-gray-500 text-center tracking-widest">
							Wind (km/h)
						</p>
						<small className="text-xs text-gray-400">
							Dir: {windDirection}°
						</small>
					</div>

					{/* Weather Code Card */}
					<div className="p-6 bg-white border-2 border-gray-200 rounded-xl flex flex-col items-center gap-2 hover:border-orange-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-orange-500/5 to-amber-500/5 border-orange-400">
						<Droplets className="w-6 h-6 text-orange-500" />
						<p className="text-3xl font-bold text-gray-900">
							{weather.weathercode}
						</p>
						<p className="text-xs uppercase font-bold text-gray-500 text-center tracking-widest">
							Code
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
