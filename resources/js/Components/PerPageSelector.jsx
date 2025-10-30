export default function PerPageSelector({
    value,
    onChange,
    options = [5, 10, 15, 20, 25],
    label = "Data per Halaman:",
    className = ""
}) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <label htmlFor="perPage" className="text-sm text-gray-600 whitespace-nowrap">
                {label}
            </label>
            <div className="relative">
                <select
                    id="perPage"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-blue-500 focus:border-blue-500 w-20 text-sm"
                >
                    {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">expand_more</span>
            </div>
        </div>
    );
}
