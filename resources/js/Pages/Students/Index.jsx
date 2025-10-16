import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, students, flash }) {
    const { url } = usePage();
    const [search, setSearch] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = search === '' || 
                student.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
                student.nisn.includes(search) ||
                student.email.toLowerCase().includes(search.toLowerCase());
            
            const matchesClass = classFilter === '' || student.kelas === classFilter;
            const matchesStatus = statusFilter === '' || 
                (statusFilter === 'Aktif' && student.is_active) ||
                (statusFilter === 'Tidak Aktif' && !student.is_active);
            
            return matchesSearch && matchesClass && matchesStatus;
        });
    }, [students, search, classFilter, statusFilter]);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
            router.delete(route('students.destroy', id));
        }
    };

    const uniqueClasses = [...new Set(students.map(student => student.kelas))].sort();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Siswa</h2>}
        >
            <Head title="Manajemen Siswa" />

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
                        Manajemen Siswa
                    </h1>
                    <Link 
                        href={route('students.create')} 
                        className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span>Tambah Siswa</span>
                    </Link>
                </header>

                {/* Statistics Section */}
                <section className="mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* Bar Chart */}
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                            Jumlah Siswa per Kelas
                        </h2>
                        <div className="h-48 sm:h-64 flex items-end gap-2 sm:gap-4 overflow-x-auto">
                            {uniqueClasses.map(kelas => {
                                const count = students.filter(s => s.kelas === kelas).length;
                                const maxCount = Math.max(...uniqueClasses.map(k => students.filter(s => s.kelas === k).length));
                                const height = maxCount > 0 ? (count / maxCount) * 80 + 20 : 20;
                                
                                return (
                                    <div key={kelas} className="flex flex-col items-center gap-1 sm:gap-2 min-w-[50px]">
                                        <div 
                                            className="w-full bg-blue-600/20 rounded-t-md transition-all duration-300 hover:bg-blue-600/30"
                                            style={{ height: `${height}%` }}
                                        ></div>
                                        <span className="text-xs sm:text-sm text-gray-600 text-center">{kelas}</span>
                                        <span className="text-xs font-medium text-blue-600">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                            Status Keaktifan Siswa
                        </h2>
                        <div className="h-48 sm:h-64 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                            <div className="relative w-32 h-32 sm:w-48 sm:h-48">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path 
                                        className="text-green-500" 
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeDasharray={`${(students.filter(s => s.is_active).length / students.length) * 100}, 100`}
                                        strokeWidth="3.8"
                                    ></path>
                                    <path 
                                        className="text-red-500" 
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeDasharray={`${(students.filter(s => !s.is_active).length / students.length) * 100}, 100`}
                                        strokeDashoffset={`-${(students.filter(s => s.is_active).length / students.length) * 100}`}
                                        strokeWidth="3.8"
                                    ></path>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl sm:text-3xl font-bold text-gray-900">{students.length}</span>
                                    <span className="text-xs sm:text-sm text-gray-600">Total Siswa</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm sm:text-base">Aktif</p>
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            {students.filter(s => s.is_active).length} Siswa
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500"></div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm sm:text-base">Tidak Aktif</p>
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            {students.filter(s => !s.is_active).length} Siswa
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Students Table Section */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            {/* Search */}
                            <div className="relative w-full sm:w-64">
                                <input 
                                    type="text"
                                    placeholder="Cari siswa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                />
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                            </div>
                            
                            {/* Class Filter */}
                            <div className="relative w-full sm:w-auto">
                                <select 
                                    value={classFilter}
                                    onChange={(e) => setClassFilter(e.target.value)}
                                    className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-blue-500 focus:border-blue-500 w-full sm:w-40 text-sm sm:text-base"
                                >
                                    <option value="">Filter Kelas</option>
                                    {uniqueClasses.map(kelas => (
                                        <option key={kelas} value={kelas}>{kelas}</option>
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
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {/* Desktop Table */}
                        <table className="w-full text-left hidden lg:table">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Profile</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">NISN</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Nama Lengkap</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Kelas</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">No HP</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-sm">Status</th>
                                    <th className="p-3 sm:p-4 font-medium text-gray-600 text-center text-sm">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-3 sm:p-4">
                                            {student.profile_picture ? (
                                                <img 
                                                    src={`/storage/${student.profile_picture}`} 
                                                    alt="Profile" 
                                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs">No Image</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 sm:p-4 font-mono text-sm">{student.nisn}</td>
                                        <td className="p-3 sm:p-4 font-medium text-gray-900 text-sm">{student.nama_lengkap}</td>
                                        <td className="p-3 sm:p-4 text-sm">{student.kelas}</td>
                                        <td className="p-3 sm:p-4 text-sm">{student.no_hp}</td>
                                        <td className="p-3 sm:p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                student.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {student.is_active ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </td>
                                        <td className="p-3 sm:p-4">
                                            <div className="flex justify-center items-center gap-1 sm:gap-2">
                                                <Link 
                                                    href={route('students.show', student.id)}
                                                    className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                    title="Lihat Detail"
                                                >
                                                    <span className="material-symbols-outlined text-gray-600 text-lg">visibility</span>
                                                </Link>
                                                <Link 
                                                    href={route('students.edit', student.id)}
                                                    className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                    title="Edit"
                                                >
                                                    <span className="material-symbols-outlined text-gray-600 text-lg">edit</span>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(student.id)}
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
                            {filteredStudents.map((student) => (
                                <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {student.profile_picture ? (
                                                <img 
                                                    src={`/storage/${student.profile_picture}`} 
                                                    alt="Profile" 
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs">No Image</span>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{student.nama_lengkap}</h3>
                                                <p className="text-sm text-gray-600">NISN: {student.nisn}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            student.is_active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {student.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                        <div>
                                            <span className="text-gray-500">Kelas:</span>
                                            <p className="font-medium">{student.kelas}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">No HP:</span>
                                            <p className="font-medium">{student.no_hp}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-500">Email:</span>
                                            <p className="font-medium truncate">{student.email}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-500">Alamat:</span>
                                            <p className="font-medium line-clamp-2">{student.alamat}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                                        <Link 
                                            href={route('students.show', student.id)}
                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Lihat Detail"
                                        >
                                            <span className="material-symbols-outlined text-gray-600">visibility</span>
                                        </Link>
                                        <Link 
                                            href={route('students.edit', student.id)}
                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-gray-600">edit</span>
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(student.id)}
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
                        {filteredStudents.length === 0 && (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-gray-400 text-4xl sm:text-6xl mb-4">search_off</span>
                                <p className="text-gray-600 text-sm sm:text-base">Tidak ada siswa yang ditemukan</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}