import BarChart from "@/Components/BarChart";
import PieChart from "@/Components/PieChart";

export default function DashboardTab({
    stats = {},
    monthlyBorrowings = [],
    recentBorrowings = [],
    filters,
    onFilterChange
}) {
    const handleExport = (type = 'borrowings') => {
        const params = new URLSearchParams({
            type: type,
            start_date: filters.start_date || '',
            end_date: filters.end_date || '',
            status: filters.status || '',
            role: filters.role || ''
        });

        // FIX: Gunakan pendekatan yang sama dengan BorrowingsTab yang berhasil
        window.location.href = `/reports/export?${params.toString()}`;
    };

    const quickStats = [
        {
            title: "Total Siswa",
            value: stats.total_students || 0,
            color: "blue",
            icon: "👨‍🎓"
        },
        {
            title: "Total Guru",
            value: stats.total_teachers || 0,
            color: "green",
            icon: "👨‍🏫"
        },
        {
            title: "Total Barang",
            value: stats.total_inventory || 0,
            color: "purple",
            icon: "📦"
        },
        {
            title: "Sedang Dipinjam",
            value: stats.active_borrowings || 0,
            color: "orange",
            icon: "📚"
        },
        {
            title: "Total Peminjaman",
            value: stats.total_borrowings || 0,
            color: "red",
            icon: "📋"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {quickStats.map((stat, index) => (
                    <div
                        key={index}
                        className={`bg-${stat.color}-500/20 rounded-xl p-4 border border-${stat.color}-500/30 text-center`}
                    >
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-2xl font-bold text-white mb-1">
                            {stat.value}
                        </div>
                        <div className="text-sm text-gray-400">
                            {stat.title}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Trend Peminjaman Bulanan
                    </h3>
                    <BarChart
                        data={monthlyBorrowings}
                        color="blue"
                        height={300}
                    />
                </div>

                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Status Peminjaman
                    </h3>
                    <PieChart
                        total={stats.total_borrowings || 0}
                        activeCount={stats.active_borrowings || 0}
                        inactiveCount={(stats.total_borrowings || 0) - (stats.active_borrowings || 0)}
                        activeLabel="Sedang Dipinjam"
                        inactiveLabel="Sudah Dikembalikan"
                    />
                </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">
                        Aktivitas Terbaru
                    </h3>
                    <button
                        onClick={() => handleExport('borrowings')}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Export CSV
                    </button>
                </div>

                <div className="space-y-3">
                    {recentBorrowings.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">
                            Tidak ada aktivitas terbaru
                        </p>
                    ) : (
                        recentBorrowings.map((borrowing) => (
                            <div key={borrowing.id} className="flex items-center justify-between p-3 bg-gray-700/20 rounded-lg border border-gray-600/30">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${borrowing.returned_at ? 'bg-green-500' : 'bg-blue-500'
                                        }`}></div>
                                    <div>
                                        <p className="text-white text-sm font-medium">
                                            {borrowing.student?.nama_lengkap || borrowing.teacher?.nama_lengkap}
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            Meminjam {borrowing.inventory?.nama_barang}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white text-sm">
                                        {new Date(borrowing.borrowed_at).toLocaleDateString('id-ID')}
                                    </p>
                                    <p className={`text-xs ${borrowing.returned_at ? 'text-green-400' : 'text-blue-400'
                                        }`}>
                                        {borrowing.returned_at ? 'Dikembalikan' : 'Masih Dipinjam'}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}