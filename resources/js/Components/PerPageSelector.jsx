export default function PerPageSelector({
    value,
    onChange,
    options = [10, 25, 50, 100],
    label = "Per Halaman:",
    className = "",
}) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <label
                htmlFor="perPage"
                className="text-sm text-gray-400 whitespace-nowrap hidden sm:block"
            >
                {label}
            </label>
            <div className="relative">
                <select
                    id="perPage"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="pl-3 pr-8 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white text-sm cursor-pointer transition-all duration-300 w-20"
                >
                    {options.map((option) => (
                        <option
                            key={option}
                            value={option}
                            className="bg-gray-800 text-white"
                        >
                            {option}
                        </option>
                    ))}
                </select>
                <svg
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </div>
    );
}
