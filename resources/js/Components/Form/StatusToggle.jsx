export default function StatusToggle({
    isActive,
    onToggle,
    activeLabel = "Aktif",
    inactiveLabel = "Tidak Aktif",
    activeDescription = "Dapat melakukan aktivitas",
    inactiveDescription = "Tidak dapat melakukan aktivitas",
}) {
    return (
        <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-4">
                Status
            </label>
            <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-lg font-semibold text-white">
                            {isActive ? activeLabel : inactiveLabel}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                            {isActive ? activeDescription : inactiveDescription}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onToggle}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                            isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                isActive ? "translate-x-7" : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>
                <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        isActive
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                >
                    <div
                        className={`w-2 h-2 rounded-full ${
                            isActive ? "bg-green-400" : "bg-red-400"
                        }`}
                    ></div>
                    {isActive ? "Aktif" : "Tidak Aktif"}
                </div>
            </div>
        </div>
    );
}
