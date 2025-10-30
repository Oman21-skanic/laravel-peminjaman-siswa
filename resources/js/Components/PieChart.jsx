export default function PieChart({
    title,
    total,
    activeCount,
    inactiveCount,
    activeLabel = "Aktif",
    inactiveLabel = "Tidak Aktif",
    className = ""
}) {
    const activePercentage = (activeCount / total) * 100;
    const inactivePercentage = (inactiveCount / total) * 100;

    return (
        <div className={`bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm ${className}`}>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                {title}
            </h2>
            <div className="h-48 sm:h-64 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <div className="relative w-32 h-32 sm:w-48 sm:h-48">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-green-500"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeDasharray={`${activePercentage}, 100`}
                            strokeWidth="3.8"
                        ></path>
                        <path
                            className="text-red-500"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeDasharray={`${inactivePercentage}, 100`}
                            strokeDashoffset={`-${activePercentage}`}
                            strokeWidth="3.8"
                        ></path>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl sm:text-3xl font-bold text-gray-900">{total}</span>
                        <span className="text-xs sm:text-sm text-gray-600">Total</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
                        <div>
                            <p className="font-medium text-gray-800 text-sm sm:text-base">{activeLabel}</p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                {activeCount} Data
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500"></div>
                        <div>
                            <p className="font-medium text-gray-800 text-sm sm:text-base">{inactiveLabel}</p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                {inactiveCount} Data
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
