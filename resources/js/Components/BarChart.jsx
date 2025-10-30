export default function BarChart({
    title,
    data,
    dataKey,
    labelKey,
    className = ""
}) {
    const maxCount = Math.max(...data.map(item => item.count));

    return (
        <div className={`bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm ${className}`}>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                {title}
            </h2>
            <div className="h-48 sm:h-64 flex items-end gap-2 sm:gap-4 overflow-x-auto">
                {data.map((item) => {
                    const height = maxCount > 0 ? (item.count / maxCount) * 80 + 20 : 20;

                    return (
                        <div key={item[dataKey]} className="flex flex-col items-center gap-1 sm:gap-2 min-w-[60px]">
                            <div
                                className="w-full bg-blue-600/20 rounded-t-md transition-all duration-300 hover:bg-blue-600/30"
                                style={{ height: `${height}%` }}
                            ></div>
                            <span className="text-xs sm:text-sm text-gray-600 text-center">{item[labelKey]}</span>
                            <span className="text-xs font-medium text-blue-600">{item.count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
