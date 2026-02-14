import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AddressData } from "./LocationDisplay";

interface AddressCardProps {
	address: AddressData | null;
	loading: boolean;
	isDark?: boolean;
}

export function AddressCard({
	address,
	loading,
	isDark = false,
}: AddressCardProps) {
	const { t } = useTranslation();
	const coordBg = isDark
		? "bg-blue-900/30 border-blue-700"
		: "bg-blue-100/50 border-blue-300";

	if (loading) {
		return (
			<div
				className={`p-4 ${coordBg} rounded-lg border-l-4 border-green-500 flex items-center gap-3`}
			>
				<Loader
					className={`w-4 h-4 ${isDark ? "text-green-300" : "text-green-600"} animate-spin flex-shrink-0`}
				/>
				<p
					className={`text-xs ${isDark ? "text-green-300" : "text-green-600"}`}
				>
					{t("fetchingLocation")}...
				</p>
			</div>
		);
	}

	if (!address || !address.address) {
		return null;
	}

	const addressData = address.address;

	// Extract address components with fallbacks
	const ward =
		addressData.neighbourhood || addressData.village || addressData.hamlet;
	const district = addressData.suburb || addressData.county;
	const province = addressData.city || addressData.state;

	if (!ward && !district && !province) {
		return null;
	}

	return (
		<div className={`p-4 ${coordBg} rounded-lg border-l-4 border-green-500`}>
			<p
				className={`text-xs font-bold uppercase ${isDark ? "text-green-300" : "text-green-600"} mb-2 tracking-wider`}
			>
				{t("addressInfo")}
			</p>
			<div
				className={`text-xs ${isDark ? "text-gray-200" : "text-gray-900"} space-y-1.5`}
			>
				{ward && (
					<p className={`m-0 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
						<span
							className={`font-semibold ${isDark ? "text-green-300" : "text-green-600"}`}
						>
							{t("ward")}:
						</span>{" "}
						{ward}
					</p>
				)}
				{district && (
					<p className={`m-0 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
						<span
							className={`font-semibold ${isDark ? "text-green-300" : "text-green-600"}`}
						>
							{t("district")}:
						</span>{" "}
						{district}
					</p>
				)}
				{province && (
					<p className={`m-0 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
						<span
							className={`font-semibold ${isDark ? "text-green-300" : "text-green-600"}`}
						>
							{t("province")}:
						</span>{" "}
						{province}
					</p>
				)}
			</div>
		</div>
	);
}
