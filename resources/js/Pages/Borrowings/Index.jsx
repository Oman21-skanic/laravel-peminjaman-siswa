import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, borrowings, flash }) {
    const { url } = usePage();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredBorrowings = useMemo(() => {
        return borrowings.filter(borrowing => {
            const matchesSearch = search === '' || 
                borrowing.student.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
                borrowing.inventory.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
                borrowing.inventory.kode_barang.includes(search);
            
            const matchesStatus = statusFilter === '' || borrowing.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [borrowings, search, statusFilter]);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data peminjaman ini?')) {
            router.delete(route('borrowings.destroy', id));
        }
    };

    const getStatusBadge = (status, returnedAt) => {
        if (returnedAt) {
            return { color: 'bg-green-100 text-green-800', label: 'Dikembalikan' };
        }
        
        const statusConfig = {
            'borrowed': { color: 'bg-blue-100 text-blue-800', label: 'Dipinjam' },
            'returned': { color: 'bg-green-100 text-green-800', label: 'Dikembalikan' },
            'overdue': { color: 'bg-red-100 text-red-800', label: 'Terlambat' }
        };
        return statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDaysBorrowed = (borrowedAt, returnedAt) => {
        const borrowed = new Date(borrowedAt);
        const returned = returnedAt ? new Date(returnedAt) : new Date();
        const diffTime = Math.abs(returned - borrowed);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Peminjaman</h2>}
        >
            <Head title="Manajemen Peminjaman" />

            <div className="max-w-7xl mx-auto">
                {/* Flash Message */}
                {flash?.success && (
                    <div className="mb-4 sm:mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {flash.success}
                    </div>
                )}

                {/* Header */}
                <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                        Manajemen Peminjaman
                    </h1>
                    <Link 
                        href={route('borrowings.create')} 
                        className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span>Tambah Peminjaman</span>
                    </Link>
                </header>

                {/* Statistics Section */}
                <section className="mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Total Peminjaman */}
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                            {borrowings.length}
                        </div>
                        <div className="text-sm sm:text-base text-gray-600">Total Peminjaman</div>
                    </div>

                    {/* Sedang Dipinjam */}
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                            {borrowings.filter(b => !b.returned_at).length}
                        </div>
                        <div className="text-sm sm:text-base text-gray-600">Sedang Dipinjam</div>
                    </div>

                    {/* Sudah Dikembalikan */}
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                            {borrowings.filter(b => b.returned_at).length}
                        </div>
                        <div className="text-sm sm:text-base text-gray-600">Sudah Dikembalikan</div>
                    </div>
                </section>

                {/* Borrowings Table Section */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            {/* Search */}
                            <div className="relative w-full sm:w-64">
                                <input 
                                    type="text"
                                    placeholder="Cari siswa atau barang..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                />
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                            </div>
                            
                            {/* Status Filter */}
                            <div className="relative w-full sm:w-auto">
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-blue-500 focus:border-blue-500 w-full sm:w-48 text-sm sm:text-base"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="borrowed">Sedang Dipinjam</option>
                                    <option value="returned">Sudah Dikembalikan</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {/* Desktop Table */}
                        <table className="w-full text-left hidden lg:table">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Siswa</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Barang</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Tanggal Pinjam</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Tanggal Kembali</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Lama Pinjam</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Status</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Catatan</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-center text-sm">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBorrowings.map((borrowing) => {
                                    const statusBadge = getStatusBadge(borrowing.status, borrowing.returned_at);
                                    const daysBorrowed = getDaysBorrowed(borrowing.borrowed_at, borrowing.returned_at);
                                    
                                    return (
                                        <tr key={borrowing.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-3 sm:p-4">
                                                <div className="flex items-center gap-3">
                                                    {borrowing.student.profile_picture ? (
                                                        <img 
                                                            src={`/storage/${borrowing.student.profile_picture}`} 
                                                            alt="Profile" 
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-400 text-xs">No Image</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-gray-900 text-sm">
                                                            {borrowing.student.nama_lengkap}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {borrowing.student.kelas}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 sm:p-4">
                                                <div>
                                                    <div className="font-medium text-gray-900 text-sm">
                                                        {borrowing.inventory.nama_barang}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-mono">
                                                        {borrowing.inventory.kode_barang}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 sm:p-4 text-sm">
                                                {formatDate(borrowing.borrowed_at)}
                                            </td>
                                            <td className="p-3 sm:p-4 text-sm">
                                                {formatDate(borrowing.returned_at)}
                                            </td>
                                            <td className="p-3 sm:p-4 text-sm text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    daysBorrowed > 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {daysBorrowed} hari
                                                </span>
                                            </td>
                                            <td className="p-3 sm:p-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                            <td className="p-3 sm:p-4 text-sm max-w-xs">
                                                <div className="truncate" title={borrowing.notes}>
                                                    {borrowing.notes || '-'}
                                                </div>
                                            </td>
                                            <td className="p-3 sm:p-4">
                                                <div className="flex justify-center items-center gap-1 sm:gap-2">
                                                    <Link 
                                                        href={route('borrowings.show', borrowing.id)}
                                                        className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                        title="Lihat Detail"
                                                    >
                                                        <span className="material-symbols-outlined text-gray-600 text-lg">visibility</span>
                                                    </Link>
                                                    <Link 
                                                        href={route('borrowings.edit', borrowing.id)}
                                                        className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-gray-600 text-lg">edit</span>
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(borrowing.id)}
                                                        className="p-1 sm:p-2 rounded-full hover:bg-red-100 transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <span className="material-symbols-outlined text-red-500 text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Mobile Cards */}
                        <div className="lg:hidden space-y-4">
                            {filteredBorrowings.map((borrowing) => {
                                const statusBadge = getStatusBadge(borrowing.status, borrowing.returned_at);
                                const daysBorrowed = getDaysBorrowed(borrowing.borrowed_at, borrowing.returned_at);
                                
                                return (
                                    <div key={borrowing.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {borrowing.student.profile_picture ? (
                                                        <img 
                                                            src={`/storage/${borrowing.student.profile_picture}`} 
                                                            alt="Profile" 
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-400 text-xs">No Image</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{borrowing.student.nama_lengkap}</h3>
                                                        <p className="text-sm text-gray-600">{borrowing.student.kelas}</p>
                                                    </div>
                                                </div>
                                                <div className="ml-13">
                                                    <p className="font-medium text-gray-900">{borrowing.inventory.nama_barang}</p>
                                                    <p className="text-sm text-gray-600">Kode: {borrowing.inventory.kode_barang}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                                {statusBadge.label}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                            <div>
                                                <span className="text-gray-500">Pinjam:</span>
                                                <p className="font-medium">{formatDate(borrowing.borrowed_at)}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Kembali:</span>
                                                <p className="font-medium">{formatDate(borrowing.returned_at) || '-'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Lama:</span>
                                                <p className="font-medium">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        daysBorrowed > 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {daysBorrowed} hari
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-gray-500">Catatan:</span>
                                                <p className="font-medium line-clamp-2">{borrowing.notes || '-'}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                                            <Link 
                                                href={route('borrowings.show', borrowing.id)}
                                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <span className="material-symbols-outlined text-gray-600">visibility</span>
                                            </Link>
                                            <Link 
                                                href={route('borrowings.edit', borrowing.id)}
                                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                title="Edit"
                                            >
                                                <span className="material-symbols-outlined text-gray-600">edit</span>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(borrowing.id)}
                                                className="p-2 rounded-full hover:bg-red-100 transition-colors"
                                                title="Hapus"
                                            >
                                                <span className="material-symbols-outlined text-red-500">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Empty State */}
                        {filteredBorrowings.length === 0 && (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-gray-400 text-4xl sm:text-6xl mb-4">search_off</span>
                                <p className="text-gray-600 text-sm sm:text-base">Tidak ada data peminjaman yang ditemukan</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}