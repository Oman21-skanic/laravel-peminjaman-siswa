import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, teachers, filters = {}, perPage = 10 }) {
    const { url } = usePage();
    const [search, setSearch] = useState(filters.search || '');
    const [jabatanFilter, setJabatanFilter] = useState(filters.jabatanFilter || '');
    const [statusFilter, setStatusFilter] = useState(filters.statusFilter || '');
    const [selectedPerPage, setSelectedPerPage] = useState(perPage);

    // Filter data secara client-side untuk data yang sudah di-paginate
    const filteredTeachers = useMemo(() => {
        return teachers.data.filter(teacher => {
            const matchesSearch = search === '' || 
                teacher.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
                teacher.nip.includes(search) ||
                teacher.email.toLowerCase().includes(search.toLowerCase());
            
            const matchesJabatan = jabatanFilter === '' || teacher.jabatan === jabatanFilter;
            const matchesStatus = statusFilter === '' || 
                (statusFilter === 'Aktif' && teacher.is_active) ||
                (statusFilter === 'Tidak Aktif' && !teacher.is_active);
            
            return matchesSearch && matchesJabatan && matchesStatus;
        });
    }, [teachers.data, search, jabatanFilter, statusFilter]);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus guru ini?')) {
            router.delete(route('teachers.destroy', id));
        }
    };

    const handleFilter = () => {
        router.get(route('teachers.index'), {
            search,
            jabatanFilter,
            statusFilter,
            perPage: selectedPerPage,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setJabatanFilter('');
        setStatusFilter('');
        setSelectedPerPage(10);
        router.get(route('teachers.index'), {
            perPage: 10,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePerPageChange = (value) => {
        setSelectedPerPage(value);
        router.get(route('teachers.index'), {
            search,
            jabatanFilter,
            statusFilter,
            perPage: value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const uniqueJabatans = [...new Set(teachers.data.map(teacher => teacher.jabatan))].sort();

    // Options untuk data per page
    const perPageOptions = [5, 10, 15, 20, 25];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Guru</h2>}
        >
            <Head title="Manajemen Guru" />

            <div className="max-w-7xl mx-auto">
                {/* Flash Message */}
                {usePage().props.flash?.success && (
                    <div className="mb-4 sm:mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {usePage().props.flash.success}
                    </div>
                )}

                {/* Header */}
                <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                        Manajemen Guru
                    </h1>
                    <Link 
                        href={route('teachers.create')} 
                        className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span>Tambah Guru</span>
                    </Link>
                </header>

                {/* Statistics Section */}
                <section className="mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* Bar Chart */}
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                            Jumlah Guru per Jabatan
                        </h2>
                        <div className="h-48 sm:h-64 flex items-end gap-2 sm:gap-4 overflow-x-auto">
                            {uniqueJabatans.map(jabatan => {
                                const count = teachers.data.filter(t => t.jabatan === jabatan).length;
                                const maxCount = Math.max(...uniqueJabatans.map(j => teachers.data.filter(t => t.jabatan === j).length));
                                const height = maxCount > 0 ? (count / maxCount) * 80 + 20 : 20;
                                
                                return (
                                    <div key={jabatan} className="flex flex-col items-center gap-1 sm:gap-2 min-w-[60px]">
                                        <div 
                                            className="w-full bg-blue-600/20 rounded-t-md transition-all duration-300 hover:bg-blue-600/30"
                                            style={{ height: `${height}%` }}
                                        ></div>
                                        <span className="text-xs sm:text-sm text-gray-600 text-center">{jabatan}</span>
                                        <span className="text-xs font-medium text-blue-600">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                            Status Keaktifan Guru
                        </h2>
                        <div className="h-48 sm:h-64 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                            <div className="relative w-32 h-32 sm:w-48 sm:h-48">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path 
                                        className="text-green-500" 
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeDasharray={`${(teachers.data.filter(t => t.is_active).length / teachers.data.length) * 100}, 100`}
                                        strokeWidth="3.8"
                                    ></path>
                                    <path 
                                        className="text-red-500" 
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeDasharray={`${(teachers.data.filter(t => !t.is_active).length / teachers.data.length) * 100}, 100`}
                                        strokeDashoffset={`-${(teachers.data.filter(t => t.is_active).length / teachers.data.length) * 100}`}
                                        strokeWidth="3.8"
                                    ></path>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl sm:text-3xl font-bold text-gray-900">{teachers.data.length}</span>
                                    <span className="text-xs sm:text-sm text-gray-600">Total Guru</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm sm:text-base">Aktif</p>
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            {teachers.data.filter(t => t.is_active).length} Guru
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500"></div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm sm:text-base">Tidak Aktif</p>
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            {teachers.data.filter(t => !t.is_active).length} Guru
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Teachers Table Section */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            {/* Search */}
                            <div className="relative w-full sm:w-64">
                                <input 
                                    type="text"
                                    placeholder="Cari guru..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                />
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                            </div>
                            
                            {/* Jabatan Filter */}
                            <div className="relative w-full sm:w-auto">
                                <select 
                                    value={jabatanFilter}
                                    onChange={(e) => setJabatanFilter(e.target.value)}
                                    className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-blue-500 focus:border-blue-500 w-full sm:w-48 text-sm sm:text-base"
                                >
                                    <option value="">Filter Jabatan</option>
                                    {uniqueJabatans.map(jabatan => (
                                        <option key={jabatan} value={jabatan}>{jabatan}</option>
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
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg">expand_more</span>
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button 
                                    onClick={handleFilter}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                                >
                                    Terapkan
                                </button>
                                <button 
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Data per Page Selector */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <label htmlFor="perPage" className="text-sm text-gray-600 whitespace-nowrap">
                                Data per Halaman:
                            </label>
                            <div className="relative">
                                <select 
                                    id="perPage"
                                    value={selectedPerPage}
                                    onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                    className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-blue-500 focus:border-blue-500 w-20 text-sm"
                                >
                                    {perPageOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {/* Desktop Table */}
                        <table className="w-full text-left hidden lg:table">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Profile</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">NIP</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Nama Lengkap</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Jabatan</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">No HP</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Status</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-center text-sm">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeachers.map((teacher) => (
                                    <tr key={teacher.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-3 sm:p-4">
                                            {teacher.profile_picture ? (
                                                <img 
                                                    src={`/storage/${teacher.profile_picture}`} 
                                                    alt="Profile" 
                                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs">No Image</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 sm:p-4 font-mono text-sm">{teacher.nip}</td>
                                        <td className="p-3 sm:p-4 font-medium text-gray-900 text-sm">{teacher.nama_lengkap}</td>
                                        <td className="p-3 sm:p-4 text-sm">{teacher.jabatan}</td>
                                        <td className="p-3 sm:p-4 text-sm">{teacher.no_hp}</td>
                                        <td className="p-3 sm:p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                teacher.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {teacher.is_active ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </td>
                                        <td className="p-3 sm:p-4">
                                            <div className="flex justify-center items-center gap-1 sm:gap-2">
                                                <Link 
                                                    href={route('teachers.show', teacher.id)}
                                                    className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                    title="Lihat Detail"
                                                >
                                                    <span className="material-symbols-outlined text-gray-600 text-lg">visibility</span>
                                                </Link>
                                                <Link 
                                                    href={route('teachers.edit', teacher.id)}
                                                    className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                    title="Edit"
                                                >
                                                    <span className="material-symbols-outlined text-gray-600 text-lg">edit</span>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(teacher.id)}
                                                    className="p-1 sm:p-2 rounded-full hover:bg-red-100 transition-colors"
                                                    title="Hapus"
                                                >
                                                    <span className="material-symbols-outlined text-red-500 text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Cards */}
                        <div className="lg:hidden space-y-4">
                            {filteredTeachers.map((teacher) => (
                                <div key={teacher.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {teacher.profile_picture ? (
                                                <img 
                                                    src={`/storage/${teacher.profile_picture}`} 
                                                    alt="Profile" 
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs">No Image</span>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{teacher.nama_lengkap}</h3>
                                                <p className="text-sm text-gray-600">NIP: {teacher.nip}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            teacher.is_active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {teacher.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                        <div>
                                            <span className="text-gray-500">Jabatan:</span>
                                            <p className="font-medium">{teacher.jabatan}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">No HP:</span>
                                            <p className="font-medium">{teacher.no_hp}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-500">Email:</span>
                                            <p className="font-medium truncate">{teacher.email}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-500">Alamat:</span>
                                            <p className="font-medium line-clamp-2">{teacher.alamat}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                                        <Link 
                                            href={route('teachers.show', teacher.id)}
                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Lihat Detail"
                                        >
                                            <span className="material-symbols-outlined text-gray-600">visibility</span>
                                        </Link>
                                        <Link 
                                            href={route('teachers.edit', teacher.id)}
                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-gray-600">edit</span>
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(teacher.id)}
                                            className="p-2 rounded-full hover:bg-red-100 transition-colors"
                                            title="Hapus"
                                        >
                                            <span className="material-symbols-outlined text-red-500">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredTeachers.length === 0 && (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-gray-400 text-4xl sm:text-6xl mb-4">search_off</span>
                                <p className="text-gray-600 text-sm sm:text-base">Tidak ada guru yang ditemukan</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {teachers.data.length > 0 && (
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-700">
                                    Menampilkan {teachers.from} sampai {teachers.to} dari {teachers.total} guru
                                    {selectedPerPage !== 10 && ` (${selectedPerPage} per halaman)`}
                                </div>
                                <div className="flex gap-1">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => router.get(teachers.prev_page_url)}
                                        disabled={!teachers.prev_page_url}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                            !teachers.prev_page_url
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    {teachers.links.slice(1, -1).map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => router.get(link.url)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}

                                    {/* Next Button */}
                                    <button
                                        onClick={() => router.get(teachers.next_page_url)}
                                        disabled={!teachers.next_page_url}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                            !teachers.next_page_url
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}