import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, inventories, flash }) {
    const { url } = usePage();
    const [search, setSearch] = useState('');
    const [kategoriFilter, setKategoriFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredInventories = useMemo(() => {
        return inventories.filter(inventory => {
            const matchesSearch = search === '' || 
                inventory.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
                inventory.kode_barang.includes(search) ||
                inventory.deskripsi.toLowerCase().includes(search.toLowerCase());
            
            const matchesKategori = kategoriFilter === '' || inventory.kategori === kategoriFilter;
            const matchesStatus = statusFilter === '' || inventory.status === statusFilter;
            
            return matchesSearch && matchesKategori && matchesStatus;
        });
    }, [inventories, search, kategoriFilter, statusFilter]);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
            router.delete(route('inventories.destroy', id));
        }
    };

    const uniqueKategories = [...new Set(inventories.map(inventory => inventory.kategori))].sort();
    const uniqueStatuses = [...new Set(inventories.map(inventory => inventory.status))].sort();

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Inventaris</h2>}
        >
            <Head title="Manajemen Inventaris" />

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
                        Manajemen Inventaris
                    </h1>
                    <Link 
                        href={route('inventories.create')} 
                        className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span>Tambah Barang</span>
                    </Link>
                </header>

                {/* Statistics Section */}
                <section className="mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* Bar Chart - Jumlah Barang per Kategori */}
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                            Jumlah Barang per Kategori
                        </h2>
                        <div className="h-48 sm:h-64 flex items-end gap-2 sm:gap-4 overflow-x-auto">
                            {uniqueKategories.map(kategori => {
                                const count = inventories.filter(i => i.kategori === kategori).length;
                                const maxCount = Math.max(...uniqueKategories.map(k => inventories.filter(i => i.kategori === k).length));
                                const height = maxCount > 0 ? (count / maxCount) * 80 + 20 : 20;
                                
                                return (
                                    <div key={kategori} className="flex flex-col items-center gap-1 sm:gap-2 min-w-[60px]">
                                        <div 
                                            className="w-full bg-blue-600/20 rounded-t-md transition-all duration-300 hover:bg-blue-600/30"
                                            style={{ height: `${height}%` }}
                                        ></div>
                                        <span className="text-xs sm:text-sm text-gray-600 text-center">{kategori}</span>
                                        <span className="text-xs font-medium text-blue-600">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pie Chart - Status Barang */}
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                            Status Barang
                        </h2>
                        <div className="h-48 sm:h-64 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                            <div className="relative w-32 h-32 sm:w-48 sm:h-48">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path 
                                        className="text-green-500" 
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeDasharray={`${(inventories.filter(i => i.status === 'available').length / inventories.length) * 100}, 100`}
                                        strokeWidth="3.8"
                                    ></path>
                                    <path 
                                        className="text-blue-500" 
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeDasharray={`${(inventories.filter(i => i.status === 'borrowed').length / inventories.length) * 100}, 100`}
                                        strokeDashoffset={`-${(inventories.filter(i => i.status === 'available').length / inventories.length) * 100}`}
                                        strokeWidth="3.8"
                                    ></path>
                                    <path 
                                        className="text-yellow-500" 
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeDasharray={`${(inventories.filter(i => i.status === 'maintenance').length / inventories.length) * 100}, 100`}
                                        strokeDashoffset={`-${((inventories.filter(i => i.status === 'available').length + inventories.filter(i => i.status === 'borrowed').length) / inventories.length) * 100}`}
                                        strokeWidth="3.8"
                                    ></path>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl sm:text-3xl font-bold text-gray-900">{inventories.length}</span>
                                    <span className="text-xs sm:text-sm text-gray-600">Total Barang</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm sm:text-base">Tersedia</p>
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            {inventories.filter(i => i.status === 'available').length} Barang
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500"></div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm sm:text-base">Dipinjam</p>
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            {inventories.filter(i => i.status === 'borrowed').length} Barang
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-500"></div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm sm:text-base">Perbaikan</p>
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            {inventories.filter(i => i.status === 'maintenance').length} Barang
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Inventories Table Section */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            {/* Search */}
                            <div className="relative w-full sm:w-64">
                                <input 
                                    type="text"
                                    placeholder="Cari barang..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                />
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                            </div>
                            
                            {/* Kategori Filter */}
                            <div className="relative w-full sm:w-auto">
                                <select 
                                    value={kategoriFilter}
                                    onChange={(e) => setKategoriFilter(e.target.value)}
                                    className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-blue-500 focus:border-blue-500 w-full sm:w-48 text-sm sm:text-base"
                                >
                                    <option value="">Filter Kategori</option>
                                    {uniqueKategories.map(kategori => (
                                        <option key={kategori} value={kategori}>{kategori}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg">expand_more</span>
                            </div>
                            
                            {/* Status Filter */}
                            <div className="relative w-full sm:w-auto">
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-blue-500 focus:border-blue-500 w-full sm:w-40 text-sm sm:text-base"
                                >
                                    <option value="">Filter Status</option>
                                    {uniqueStatuses.map(status => (
                                        <option key={status} value={status}>
                                            {getStatusBadge(status).label}
                                        </option>
                                    ))}
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
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Foto</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Kode Barang</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Nama Barang</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Kategori</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Lokasi</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Status</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Aktif</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-center text-sm">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInventories.map((inventory) => {
                                    const statusBadge = getStatusBadge(inventory.status);
                                    const activeBadge = getActiveBadge(inventory.is_active);
                                    
                                    return (
                                        <tr key={inventory.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-3 sm:p-4">
                                                {inventory.foto_barang ? (
                                                    <img 
                                                        src={`/storage/${inventory.foto_barang}`} 
                                                        alt="Foto Barang" 
                                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400 text-xs">No Image</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3 sm:p-4 font-mono text-sm">{inventory.kode_barang}</td>
                                            <td className="p-3 sm:p-4 font-medium text-gray-900 text-sm">{inventory.nama_barang}</td>
                                            <td className="p-3 sm:p-4 text-sm">{inventory.kategori}</td>
                                            <td className="p-3 sm:p-4 text-sm">{inventory.lokasi_barang}</td>
                                            <td className="p-3 sm:p-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                            <td className="p-3 sm:p-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${activeBadge.color}`}>
                                                    {activeBadge.label}
                                                </span>
                                            </td>
                                            <td className="p-3 sm:p-4">
                                                <div className="flex justify-center items-center gap-1 sm:gap-2">
                                                    <Link 
                                                        href={route('inventories.show', inventory.id)}
                                                        className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                        title="Lihat Detail"
                                                    >
                                                        <span className="material-symbols-outlined text-gray-600 text-lg">visibility</span>
                                                    </Link>
                                                    <Link 
                                                        href={route('inventories.edit', inventory.id)}
                                                        className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-gray-600 text-lg">edit</span>
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(inventory.id)}
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
                            {filteredInventories.map((inventory) => {
                                const statusBadge = getStatusBadge(inventory.status);
                                const activeBadge = getActiveBadge(inventory.is_active);
                                
                                return (
                                    <div key={inventory.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                {inventory.foto_barang ? (
                                                    <img 
                                                        src={`/storage/${inventory.foto_barang}`} 
                                                        alt="Foto Barang" 
                                                        className="w-12 h-12 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400 text-xs">No Image</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{inventory.nama_barang}</h3>
                                                    <p className="text-sm text-gray-600">Kode: {inventory.kode_barang}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1 items-end">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                                    {statusBadge.label}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${activeBadge.color}`}>
                                                    {activeBadge.label}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                            <div>
                                                <span className="text-gray-500">Kategori:</span>
                                                <p className="font-medium">{inventory.kategori}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Lokasi:</span>
                                                <p className="font-medium">{inventory.lokasi_barang}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-gray-500">Deskripsi:</span>
                                                <p className="font-medium line-clamp-2">{inventory.deskripsi}</p>
                                            </div>
                                            {inventory.current_borrowing && (
                                                <div className="col-span-2">
                                                    <span className="text-gray-500">Dipinjam oleh:</span>
                                                    <p className="font-medium text-blue-600">
                                                        {inventory.current_borrowing.student.nama_lengkap}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                                            <Link 
                                                href={route('inventories.show', inventory.id)}
                                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <span className="material-symbols-outlined text-gray-600">visibility</span>
                                            </Link>
                                            <Link 
                                                href={route('inventories.edit', inventory.id)}
                                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                title="Edit"
                                            >
                                                <span className="material-symbols-outlined text-gray-600">edit</span>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(inventory.id)}
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
                        {filteredInventories.length === 0 && (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-gray-400 text-4xl sm:text-6xl mb-4">search_off</span>
                                <p className="text-gray-600 text-sm sm:text-base">Tidak ada barang yang ditemukan</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}