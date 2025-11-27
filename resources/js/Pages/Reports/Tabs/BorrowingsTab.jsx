import { useState } from "react";
import BarChart from "@/Components/BarChart";
import PieChart from "@/Components/PieChart";

export default function BorrowingsTab({
    borrowings = [],
    stats = {},
    filters,
    onFilterChange
}) {
    const [dateRange, setDateRange] = useState({
        start: filters.start_date || '',
        end: filters.end_date || ''
    });

    const handleDateChange = (type, value) => {
        const newRange = { ...dateRange, [type]: value };
        setDateRange(newRange);

        if (type === 'start') {
            onFilterChange('start_date', value);
        } else {
            onFilterChange('end_date', value);
        }
    };

    const handleExport = () => {
        const params = new URLSearchParams({
            type: 'borrowings',
            start_date: filters.start_date || '',
            end_date: filters.end_date || '',
            status: filters.status || '',
            role: filters.role || ''
        });

        // FIX: Direct window location - INI YANG WORK!
        window.location.href = `/reports/export?${params.toString()}`;
    };

    const getPeminjamName = (borrowing) => {
        if (borrowing.student) return borrowing.student.nama_lengkap;
        if (borrowing.teacher) return borrowing.teacher.nama_lengkap;
        return "Tidak diketahui";
    };

    const getLamaPinjam = (borrowing) => {
        if (!borrowing.returned_at) {
            return Math.max(0, Math.ceil((new Date() - new Date(borrowing.borrowed_at)) / (1000 * 60 * 60 * 24)));
        }
        return Math.ceil((new Date(borrowing.returned_at) - new Date(borrowing.borrowed_at)) / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                <h3 className="text-lg font-semibold text-white mb-4">Filter Laporan</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Tanggal Mulai
                        </label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => handleDateChange('start', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Tanggal Akhir
                        </label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => handleDateChange('end', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white"
                        />
                    </div>
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
                            <option value="active">Sedang Dipinjam</option>
                            <option value="returned">Sudah Dikembalikan</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Role Peminjam
                        </label>
                        <select
                            value={filters.role || ''}
                            onChange={(e) => onFilterChange('role', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white"
                        >
                            <option value="">Semua Role</option>
                            <option value="student">Siswa</option>
                            <option value="teacher">Guru</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                        {stats.total || 0}
                    </div>
                    <div className="text-sm text-gray-400">Total</div>
                </div>
                <div className="bg-orange-500/20 rounded-xl p-4 border border-orange-500/30 text-center">
                    <div className="text-2xl font-bold text-orange-400 mb-1">
                        {stats.active || 0}
                    </div>
                    <div className="text-sm text-gray-400">Sedang Dipinjam</div>
                </div>
                <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                        {stats.returned || 0}
                    </div>
                    <div className="text-sm text-gray-400">Sudah Dikembalikan</div>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30 text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                        {stats.students || 0} / {stats.teachers || 0}
                    </div>
                    <div className="text-sm text-gray-400">Siswa / Guru</div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                    Data Peminjaman ({borrowings.length} records)
                </h3>
                <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                    Export CSV
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700/50 bg-gray-700/30">
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">No</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Peminjam</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Barang</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Tanggal Pinjam</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Tanggal Kembali</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Lama Pinjam</th>
                                <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowings.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-6 text-center text-gray-400">
                                        Tidak ada data peminjaman untuk filter yang dipilih.
                                    </td>
                                </tr>
                            ) : (
                                borrowings.map((borrowing, index) => (
                                    <tr key={borrowing.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                                        <td className="p-3 text-sm text-gray-300">{index + 1}</td>
                                        <td className="p-3">
                                            <div>
                                                <div className="font-medium text-white text-sm">
                                                    {getPeminjamName(borrowing)}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {borrowing.role === 'student' ? 'Siswa' : 'Guru'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div>
                                                <div className="font-medium text-white text-sm">
                                                    {borrowing.inventory?.nama_barang}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {borrowing.inventory?.kode_barang}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm text-gray-300">
                                            {new Date(borrowing.borrowed_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="p-3 text-sm text-gray-300">
                                            {borrowing.returned_at
                                                ? new Date(borrowing.returned_at).toLocaleDateString('id-ID')
                                                : '-'
                                            }
                                        </td>
                                        <td className="p-3 text-sm text-gray-300">
                                            {getLamaPinjam(borrowing)} hari
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${borrowing.returned_at
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                }`}>
                                                {borrowing.returned_at ? 'Dikembalikan' : 'Dipinjam'}
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