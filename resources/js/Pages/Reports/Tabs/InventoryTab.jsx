import BarChart from "@/Components/BarChart";
import PieChart from "@/Components/PieChart";

export default function InventoryTab({
    inventory = [],
    stats = {},
    categoryDistribution = [],
    filters,
    onFilterChange
}) {
    const handleExport = () => {
        const params = new URLSearchParams({
            type: 'inventory',
            status: filters.status || '',
            type: filters.type || ''
        });

        window.location.href = `/reports/export?${params.toString()}`;
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                <h3 className="text-lg font-semibold text-white mb-4">Filter Data Inventory</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Status
                        </label>
                        <select
                            value={filters.status || ''}
                            onChange={(e) => onFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white"
                        >
                            <option value="">Semua Status</option>
                            <option value="available">Tersedia</option>
                            <option value="borrowed">Dipinjam</option>
                            <option value="maintenance">Perbaikan</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Kategori
                        </label>
                        <select
                            value={filters.type || ''}
                            onChange={(e) => onFilterChange('type', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white"
                        >
                            <option value="">Semua Kategori</option>
                            <option value="Buku">Buku</option>
                            <option value="Elektronik">Elektronik</option>
                            <option value="Alat Tulis">Alat Tulis</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleExport}
                            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Export Data Inventory
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                        {stats.total || 0}
                    </div>
                    <div className="text-sm text-gray-400">Total Barang</div>
                </div>
                <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                        {stats.available || 0}
                    </div>
                    <div className="text-sm text-gray-400">Tersedia</div>
                </div>
                <div className="bg-orange-500/20 rounded-xl p-4 border border-orange-500/30 text-center">
                    <div className="text-2xl font-bold text-orange-400 mb-1">
                        {stats.borrowed || 0}
                    </div>
                    <div className="text-sm text-gray-400">Dipinjam</div>
                </div>
                <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30 text-center">
                    <div className="text-2xl font-bold text-red-400 mb-1">
                        {stats.maintenance || 0}
                    </div>
                    <div className="text-sm text-gray-400">Perbaikan</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Distribusi per Kategori
                    </h3>
                    <BarChart
                        data={categoryDistribution}
                        color="purple"
                        height={300}
                    />
                </div>

                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Status Barang
                    </h3>
                    <PieChart
                        total={stats.total || 0}
                        activeCount={stats.available || 0}
                        inactiveCount={(stats.borrowed || 0) + (stats.maintenance || 0)}
                        activeLabel="Tersedia"
                        inactiveLabel="Tidak Tersedia"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 overflow-hidden">
                <div className="p-4 border-b border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white">
                        Data Inventory ({inventory.length} records)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700/50 bg-gray-700/30">
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">No</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Kode</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Nama Barang</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Kategori</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Deskripsi</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Lokasi</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Total Dipinjam</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-6 text-center text-gray-400">
                                        Tidak ada data inventory untuk filter yang dipilih.
                                    </td>
                                </tr>
                            ) : (
                                inventory.map((item, index) => (
                                    <tr key={item.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                                        <td className="p-3 text-sm text-gray-300">{index + 1}</td>
                                        <td className="p-3 text-sm text-gray-300 font-mono">
                                            {item.kode_barang}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center space-x-3">
                                                {item.foto_barang ? (
                                                    <img
                                                        src={`/storage/${item.foto_barang}`}
                                                        alt="Barang"
                                                        className="w-10 h-10 rounded-lg object-cover border border-gray-600"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center border border-gray-600">
                                                        <span className="text-gray-400">📦</span>
                                                    </div>
                                                )}
                                                <span className="font-medium text-white text-sm">
                                                    {item.nama_barang}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm text-gray-300">
                                            {item.kategori}
                                        </td>
                                        <td className="p-3 text-sm text-gray-300 max-w-xs truncate">
                                            {item.deskripsi}
                                        </td>
                                        <td className="p-3 text-sm text-gray-300">
                                            {item.lokasi_barang}
                                        </td>
                                        <td className="p-3 text-sm text-gray-300 text-center">
                                            {item.borrowings_count || 0}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'available'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : item.status === 'borrowed'
                                                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                }`}>
                                                {item.status === 'available' ? 'Tersedia' :
                                                    item.status === 'borrowed' ? 'Dipinjam' : 'Perbaikan'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}