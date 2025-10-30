export default function FilterButtons({
    onApply,
    onReset,
    applyText = "Terapkan",
    resetText = "Reset",
    className = ""
}) {
    return (
        <div className={`flex gap-2 ${className}`}>
            <button
                onClick={onApply}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
                {applyText}
            </button>
            <button
                onClick={onReset}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
            >
                {resetText}
            </button>
        </div>
    );
}
