export default function FilterButtons({
    onApply,
    onReset,
    applyText = "Terapkan",
    resetText = "Reset",
    className = "",
}) {
    return (
        <div className={`flex gap-3 ${className}`}>
            <button
                onClick={onApply}
                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 hover:scale-105"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                </svg>
                {applyText}
            </button>
            <button
                onClick={onReset}
                className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 border border-gray-500/30 hover:border-gray-500/50"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                </svg>
                {resetText}
            </button>
        </div>
    );
}
