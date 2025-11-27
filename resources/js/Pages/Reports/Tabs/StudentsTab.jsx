import BarChart from "@/Components/BarChart";
import PieChart from "@/Components/PieChart";

export default function StudentsTab({ 
    students = [], 
    stats = {},
    classDistribution = [],
    filters,
    onFilterChange
}) {
    const handleExport = () => {
        const params = new URLSearchParams({
            type: 'students',
            status: filters.status || ''
        });
        
        window.location.href = `/reports/export?${params.toString()}`;
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                <h3 className="text-lg font-semibold text-white mb-4">Filter Data Siswa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <option value="active">Aktif</option>
                            <option value="inactive">Tidak Aktif</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleExport}
                            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Export Data Siswa
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
                    <div className="text-sm text-gray-400">Total Siswa</div>
                </div>
                <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                        {stats.active || 0}
                    </div>
                    <div className="text-sm text-gray-400">Aktif</div>
                </div>
                <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30 text-center">
                    <div className="text-2xl font-bold text-red-400 mb-1">
                        {stats.inactive || 0}
                    </div>
                    <div className="text-sm text-gray-400">Tidak Aktif</div>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30 text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                        {stats.with_borrowings || 0}
                    </div>
                    <div className="text-sm text-gray-400">Pernah Meminjam</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Distribusi per Kelas
                    </h3>
                    <BarChart
                        data={classDistribution}
                        color="green"
                        height={300}
                    />
                </div>

                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Status Keaktifan
                    </h3>
                    <PieChart
                        total={stats.total || 0}
                        activeCount={stats.active || 0}
                        inactiveCount={stats.inactive || 0}
                        activeLabel="Aktif"
                        inactiveLabel="Tidak Aktif"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 overflow-hidden">
                <div className="p-4 border-b border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white">
                        Data Siswa ({students.length} records)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700/50 bg-gray-700/30">
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">No</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">NISN</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Nama Lengkap</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Kelas</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Email</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Total Peminjaman</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-6 text-center text-gray-400">
                                        Tidak ada data siswa untuk filter yang dipilih.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student, index) => (
                                    <tr key={student.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                                        <td className="p-3 text-sm text-gray-300">{index + 1}</td>
                                        <td className="p-3 text-sm text-gray-300 font-mono">
                                            {student.nisn}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center space-x-3">
                                                {student.profile_picture ? (
                                                    <img
                                                        src={`/storage/${student.profile_picture}`}
                                                        alt="Profile"
                                                        className="w-8 h-8 rounded-full object-cover border border-gray-600"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                                                        <span className="text-gray-400 text-xs">👨‍🎓</span>
                                                    </div>
                                                )}
                                                <span className="font-medium text-white text-sm">
                                                    {student.nama_lengkap}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm text-gray-300">
                                            {student.kelas}
                                        </td>
                                        <td className="p-3 text-sm text-gray-300">
                                            {student.email}
                                        </td>
                                        <td className="p-3 text-sm text-gray-300 text-center">
                                            {student.borrowings_count || 0}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                student.is_active
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            }`}>
                                                {student.is_active ? 'Aktif' : 'Tidak Aktif'}
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