import { X, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AlertModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	isDark?: boolean;
	onClose: () => void;
}

export function AlertModal({
	isOpen,
	title,
	message,
	isDark = false,
	onClose,
}: AlertModalProps) {
	const { t } = useTranslation();

	if (!isOpen) return null;

	const bgClass = isDark ? "bg-gray-800" : "bg-white";
	const textClass = isDark ? "text-white" : "text-gray-900";
	const borderClass = isDark ? "border-gray-700" : "border-gray-300";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div
				className={`${bgClass} rounded-lg shadow-2xl max-w-sm w-full mx-4 border ${borderClass}`}
			>
				<div className={`flex items-center gap-3 p-4 border-b ${borderClass}`}>
					<AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
					<h2 className={`text-lg font-bold ${textClass}`}>{title}</h2>
					<button
						onClick={onClose}
						className={`ml-auto p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all`}
					>
						<X size={20} />
					</button>
				</div>
				<p className={`p-4 ${textClass}`}>{message}</p>
				<div className={`flex justify-end gap-2 p-4 border-t ${borderClass}`}>
					<button
						onClick={onClose}
						className={`px-4 py-2 rounded font-medium transition-all ${
							isDark
								? "bg-blue-700 hover:bg-blue-600 text-white"
								: "bg-blue-500 hover:bg-blue-600 text-white"
						}`}
					>
						{t("close")}
					</button>
				</div>
			</div>
		</div>
	);
}
