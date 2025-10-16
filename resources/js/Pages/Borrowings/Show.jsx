import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, borrowing }) {
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
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
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

    const statusBadge = getStatusBadge(borrowing.status, borrowing.returned_at);
    const daysBorrowed = getDaysBorrowed(borrowing.borrowed_at, borrowing.returned_at);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Detail Peminjaman</h2>}
        >
            <Head title={`Detail Peminjaman - ${borrowing.student.nama_lengkap}`} />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                            Detail Peminjaman
                        </h1>
                        <p className="text-gray-600 mt-2">Informasi lengkap tentang peminjaman barang</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Link 
                            href={route('borrowings.index')} 
                            className="flex-1 sm:flex-none bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            <span className="hidden sm:block">Kembali</span>
                        </Link>
                        <Link 
                            href={route('borrowings.edit', borrowing.id)} 
                            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">edit</span>
                            <span className="hidden sm:block">Edit Peminjaman</span>
                        </Link>
                    </div>
                </header>

                {/* Borrowing Details */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Student Information */}
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                Informasi Siswa
                            </h3>
                            
                            <div className="flex items-center gap-4 mb-4">
                                {borrowing.student.profile_picture ? (
                                    <img 
                                        src={`/storage/${borrowing.student.profile_picture}`} 
                                        alt="Profile" 
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">No Image</span>
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900">{borrowing.student.nama_lengkap}</h4>
                                    <p className="text-gray-600">NISN: {borrowing.student.nisn}</p>
                                    <p className="text-gray-600">Kelas: {borrowing.student.kelas}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {borrowing.student.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">No HP</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {borrowing.student.no_hp}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Information */}
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                Informasi Barang
                            </h3>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Nama Barang</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 font-medium">
                                        {borrowing.inventory.nama_barang}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Kode Barang</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
                                        {borrowing.inventory.kode_barang}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Kategori</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {borrowing.inventory.kategori}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Lokasi</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {borrowing.inventory.lokasi_barang}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Borrowing Information */}
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                            Informasi Peminjaman
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Tanggal Pinjam</label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    {formatDate(borrowing.borrowed_at)}
                                </p>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Tanggal Kembali</label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    {formatDate(borrowing.returned_at) || 'Belum dikembalikan'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Lama Pinjam</label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        daysBorrowed > 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {daysBorrowed} hari
                                    </span>
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Status</label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                                        {statusBadge.label}
                                    </span>
                                </p>
                            </div>

                            <div className="sm:col-span-2 lg:col-span-4 space-y-1">
                                <label className="text-sm font-medium text-gray-500">Catatan</label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 min-h-[80px]">
                                    {borrowing.notes || 'Tidak ada catatan'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Action Buttons Bottom */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                    <Link 
                        href={route('borrowings.index')} 
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Kembali ke Daftar
                    </Link>
                    <Link 
                        href={route('borrowings.edit', borrowing.id)} 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <span className="material-symbols-outlined">edit</span>
                        Edit Data Peminjaman
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}