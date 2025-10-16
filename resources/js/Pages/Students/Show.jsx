import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, student }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Detail Siswa</h2>}
        >
            <Head title={`Detail ${student.nama_lengkap}`} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                            Detail Siswa
                        </h1>
                        <p className="text-gray-600 mt-2">Informasi lengkap tentang siswa</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Link 
                            href={route('students.index')} 
                            className="flex-1 sm:flex-none bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            <span className="hidden sm:block">Kembali</span>
                        </Link>
                        <Link 
                            href={route('students.edit', student.id)} 
                            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">edit</span>
                            <span className="hidden sm:block">Edit Siswa</span>
                        </Link>
                    </div>
                </header>

                {/* Student Details */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Profile Section */}
                        <div className="lg:col-span-1">
                            <div className="text-center lg:text-left">
                                <div className="relative inline-block">
                                    {student.profile_picture ? (
                                        <img 
                                            src={`/storage/${student.profile_picture}`} 
                                            alt="Profile" 
                                            className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-white shadow-lg mx-auto lg:mx-0"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg mx-auto lg:mx-0">
                                            <span className="text-gray-400 text-2xl">No Image</span>
                                        </div>
                                    )}
                                    <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${
                                        student.is_active ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                </div>
                                
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">{student.nama_lengkap}</h2>
                                <p className="text-gray-600">{student.nisn}</p>
                                
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mt-3 ${
                                    student.is_active 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${
                                        student.is_active ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                    {student.is_active ? 'Aktif' : 'Tidak Aktif'}
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="lg:col-span-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 pb-2 border-b border-gray-200">
                                Informasi Pribadi
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">NISN</label>
                                    <p className="text-gray-900 font-mono bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {student.nisn}
                                    </p>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Kelas</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {student.kelas}
                                    </p>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {student.email}
                                    </p>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">No HP</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {student.no_hp}
                                    </p>
                                </div>
                                
                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Alamat Lengkap</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 min-h-[100px]">
                                        {student.alamat}
                                    </p>
                                </div>
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
                                            {new Date(student.created_at).toLocaleDateString('id-ID', {
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
                                            {new Date(student.updated_at).toLocaleDateString('id-ID', {
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
                        href={route('students.index')} 
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Kembali ke Daftar
                    </Link>
                    <Link 
                        href={route('students.edit', student.id)} 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <span className="material-symbols-outlined">edit</span>
                        Edit Data Siswa
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}