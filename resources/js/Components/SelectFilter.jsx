export default function SelectFilter({
    value,
    onChange,
    options,
    placeholder = "Filter",
    className = "",
}) {
    return (
        <div className={`relative ${className}`}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-4 pr-10 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl appearance-none w-full focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white transition-all duration-300 cursor-pointer"
            >
                <option value="" className="bg-gray-800 text-gray-300">
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className="bg-gray-800 text-white"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5"
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
    );
}
