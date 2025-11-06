import { Link } from "@inertiajs/react";

export default function ActionButtons({
    cancelRoute,
    processing,
    submitButtonText,
    cancelText = "Batal",
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-700/30">
            <Link
                href={cancelRoute}
                className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-gray-500/30 hover:border-gray-500/50"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
                {cancelText}
            </Link>
            <button
                type="submit"
                disabled={processing}
                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                    />
                </svg>
                {processing ? "Menyimpan..." : submitButtonText}
            </button>
        </div>
    );
}
