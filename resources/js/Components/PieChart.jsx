export default function PieChart({
    title,
    total,
    activeCount,
    inactiveCount,
    activeLabel = "Aktif",
    inactiveLabel = "Tidak Aktif",
    className = "",
}) {
    const activePercentage = total > 0 ? (activeCount / total) * 100 : 0;
    const inactivePercentage = total > 0 ? (inactiveCount / total) * 100 : 0;

    // Additional statistics
    const stats = [
        {
            label: "Rasio Aktif",
            value: `${Math.round(activePercentage)}%`,
            color: "text-green-400",
            icon: (
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
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                </svg>
            ),
        },
        {
            label: "Total Data",
            value: total,
            color: "text-blue-400",
            icon: (
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <div
            className={`bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <div className="text-sm text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full border border-gray-600/30">
                    Real-time
                </div>
            </div>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm mb-6">
                Status keaktifan data sistem
            </p>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Pie Chart Section */}
                <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40">
                        <svg
                            className="w-full h-full transform -rotate-90"
                            viewBox="0 0 36 36"
                        >
                            {/* Background circle */}
                            <circle
                                cx="18"
                                cy="18"
                                r="15.9155"
                                fill="none"
                                stroke="#374151"
                                strokeWidth="3"
                            />
                            {/* Active segment */}
                            <circle
                                cx="18"
                                cy="18"
                                r="15.9155"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeDasharray={`${activePercentage} ${100 - activePercentage
                                    }`}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                            {/* Inactive segment */}
                            <circle
                                cx="18"
                                cy="18"
                                r="15.9155"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="3"
                                strokeDasharray={`${inactivePercentage} ${100 - inactivePercentage
                                    }`}
                                strokeDashoffset={`-${activePercentage}`}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                                {total}
                            </span>
                            <span className="text-xs text-gray-400">Total</span>
                        </div>
                    </div>

                    {/* Quick Stats below pie chart */}
                    <div className="flex gap-4 mt-4">
                        <div className="text-center">
                            <div className="text-lg font-bold text-green-400">
                                {activeCount}
                            </div>
                            <div className="text-xs text-gray-400">Aktif</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-red-400">
                                {inactiveCount}
                            </div>
                            <div className="text-xs text-gray-400">
                                Non-Aktif
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Details and Stats */}
                <div className="flex-1 space-y-4 min-w-0">
                    {/* Main Status Cards */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-700/30 border border-gray-600/30 hover:bg-gray-700/40 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-500 group-hover:scale-110 transition-transform"></div>
                                <div>
                                    <p className="font-medium text-white text-sm">
                                        {activeLabel}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Data aktif dalam sistem
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-green-400 block">
                                    {activeCount}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {total > 0
                                        ? Math.round(activePercentage)
                                        : 0}
                                    %
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-700/30 border border-gray-600/30 hover:bg-gray-700/40 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500 group-hover:scale-110 transition-transform"></div>
                                <div>
                                    <p className="font-medium text-white text-sm">
                                        {inactiveLabel}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Data tidak aktif
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-red-400 block">
                                    {inactiveCount}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {total > 0
                                        ? Math.round(inactivePercentage)
                                        : 0}
                                    %
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Additional Statistics */}
                    <div className="pt-3 border-t border-gray-700/30">
                        <h4 className="text-sm font-semibold text-gray-300 mb-3">
                            Statistik Tambahan
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center p-3 rounded-lg bg-gray-700/20 border border-gray-600/20 hover:bg-gray-700/30 transition-colors group"
                                >
                                    <div
                                        className={`mx-auto mb-2 w-8 h-8 rounded-lg bg-gray-600/50 flex items-center justify-center group-hover:scale-110 transition-transform ${stat.color}`}
                                    >
                                        {stat.icon}
                                    </div>
                                    <div
                                        className={`text-lg font-bold ${stat.color}`}
                                    >
                                        {stat.value}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-3 border-t border-gray-700/30">
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                            <span>Progress Keaktifan</span>
                            <span>{Math.round(activePercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${activePercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="mt-6 pt-4 border-t border-gray-700/30">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">
                        Terakhir update:{" "}
                        {new Date().toLocaleTimeString("id-ID")}
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400">Data Live</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
