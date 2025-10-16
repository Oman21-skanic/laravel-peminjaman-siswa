import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, inventory }) {
    const getStatusBadge = (status) => {
        const statusConfig = {
            'available': { color: 'bg-green-100 text-green-800', label: 'Tersedia' },
            'borrowed': { color: 'bg-blue-100 text-blue-800', label: 'Dipinjam' },
            'maintenance': { color: 'bg-yellow-100 text-yellow-800', label: 'Perbaikan' }
        };
        return statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    };

    const getActiveBadge = (isActive) => {
        return isActive === 'available' 
            ? { color: 'bg-green-100 text-green-800', label: 'Aktif' }
            : { color: 'bg-red-100 text-red-800', label: 'Tidak Aktif' };
    };

    const statusBadge = getStatusBadge(inventory.status);
    const activeBadge = getActiveBadge(inventory.is_active);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Detail Barang</h2>}
        >
            <Head title={`Detail ${inventory.nama_barang}`} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                            Detail Barang
                        </h1>
                        <p className="text-gray-600 mt-2">Informasi lengkap tentang barang inventaris</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Link 
                            href={route('inventories.index')} 
                            className="flex-1 sm:flex-none bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            <span className="hidden sm:block">Kembali</span>
                        </Link>
                        <Link 
                            href={route('inventories.edit', inventory.id)} 
                            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">edit</span>
                            <span className="hidden sm:block">Edit Barang</span>
                        </Link>
                    </div>
                </header>

                {/* Inventory Details */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Photo Section */}
                        <div className="lg:col-span-1">
                            <div className="text-center lg:text-left">
                                <div className="relative inline-block">
                                    {inventory.foto_barang ? (
                                        <img 
                                            src={`/storage/${inventory.foto_barang}`} 
                                            alt="Foto Barang" 
                                            className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg object-cover border-4 border-white shadow-lg mx-auto lg:mx-0"
                                        />
                                    ) : (
                                        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg mx-auto lg:mx-0">
                                            <span className="text-gray-400 text-lg">Tidak ada foto</span>
                                        </div>
                                    )}
                                </div>
                                
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">{inventory.nama_barang}</h2>
                                <p className="text-gray-600 font-mono">{inventory.kode_barang}</p>
                                
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                                        <div className={`w-2 h-2 rounded-full ${statusBadge.color.includes('green') ? 'bg-green-500' : statusBadge.color.includes('blue') ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                                        {statusBadge.label}
                                    </span>
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${activeBadge.color}`}>
                                        <div className={`w-2 h-2 rounded-full ${activeBadge.color.includes('green') ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        {activeBadge.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="lg:col-span-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 pb-2 border-b border-gray-200">
                                Informasi Barang
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Kode Barang</label>
                                    <p className="text-gray-900 font-mono bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {inventory.kode_barang}
                                    </p>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Kategori</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {inventory.kategori}
                                    </p>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Lokasi Barang</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {inventory.lokasi_barang}
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
                                
                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 min-h-[100px]">
                                        {inventory.deskripsi}
                                    </p>
                                </div>

                                {/* Borrowing Information */}
                                {inventory.current_borrowing && (
                                    <div className="sm:col-span-2 space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Informasi Peminjaman</label>
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-blue-600">person</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-blue-900">
                                                        {inventory.current_borrowing.student.nama_lengkap}
                                                    </p>
                                                    <p className="text-sm text-blue-700">
                                                        Dipinjam sejak {new Date(inventory.current_borrowing.borrowed_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Additional Info */}
                            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                                    Informasi Tambahan
                                </h3>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Tanggal Dibuat</label>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            {new Date(inventory.created_at).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Terakhir Diupdate</label>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            {new Date(inventory.updated_at).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Action Buttons Bottom */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                    <Link 
                        href={route('inventories.index')} 
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Kembali ke Daftar
                    </Link>
                    <Link 
                        href={route('inventories.edit', inventory.id)} 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <span className="material-symbols-outlined">edit</span>
                        Edit Data Barang
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}