import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, student }) {
    const { data, setData, put, processing, errors } = useForm({
        nisn: student.nisn || '',
        nama_lengkap: student.nama_lengkap || '',
        kelas: student.kelas || '',
        no_hp: student.no_hp || '',
        email: student.email || '',
        alamat: student.alamat || '',
        is_active: student.is_active || false,
        profile_picture: null,
    });

   // Di handleSubmit function, tambahkan:
const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('nisn', data.nisn);
    formData.append('nama_lengkap', data.nama_lengkap);
    formData.append('kelas', data.kelas);
    formData.append('no_hp', data.no_hp);
    formData.append('email', data.email);
    formData.append('alamat', data.alamat);
    formData.append('is_active', data.is_active ? 1 : 0); // Konversi ke 1/0
    formData.append('_method', 'put'); // Untuk method spoofing
    
    if (data.profile_picture) {
        formData.append('profile_picture', data.profile_picture);
    }

    post(route('students.update', student.id), {
        data: formData,
        forceFormData: true,
    });
};

    const handleFileChange = (e) => {
        setData('profile_picture', e.target.files[0]);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Siswa</h2>}
        >
            <Head title={`Edit ${student.nama_lengkap}`} />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                            Edit Siswa
                        </h1>
                        <p className="text-gray-600 mt-2">Ubah informasi siswa</p>
                    </div>
                    <Link 
                        href={route('students.show', student.id)} 
                        className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        <span className="hidden sm:block">Kembali</span>
                    </Link>
                </header>

                {/* Edit Form */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
                            <div className="text-center">
                                {student.profile_picture ? (
                                    <img 
                                        src={`/storage/${student.profile_picture}`} 
                                        alt="Profile" 
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg mx-auto">
                                        <span className="text-gray-400">No Image</span>
                                    </div>
                                )}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ubah Foto Profil
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {errors.profile_picture && (
                                        <p className="text-red-500 text-xs mt-1">{errors.profile_picture}</p>
                                    )}
                                </div>
                            </div>

                            {/* Status Toggle */}
                            <div className="flex-1">
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                        />
                                        <div className={`block w-14 h-8 rounded-full transition-colors ${
                                            data.is_active ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                                            data.is_active ? 'transform translate-x-6' : ''
                                        }`}></div>
                                    </div>
                                    <div className="ml-3 text-gray-700 font-medium">
                                        {data.is_active ? 'Siswa Aktif' : 'Siswa Tidak Aktif'}
                                    </div>
                                </label>
                                <p className="text-sm text-gray-500 mt-2">
                                    {data.is_active 
                                        ? 'Siswa saat ini aktif dalam sistem' 
                                        : 'Siswa saat ini tidak aktif dalam sistem'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* NISN */}
                            <div className="sm:col-span-1">
                                <label htmlFor="nisn" className="block text-sm font-medium text-gray-700">
                                    NISN *
                                </label>
                                <input
                                    type="text"
                                    id="nisn"
                                    value={data.nisn}
                                    onChange={(e) => setData('nisn', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        errors.nisn 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan NISN"
                                />
                                {errors.nisn && (
                                    <p className="text-red-500 text-xs mt-1">{errors.nisn}</p>
                                )}
                            </div>

                            {/* Kelas */}
                            <div className="sm:col-span-1">
                                <label htmlFor="kelas" className="block text-sm font-medium text-gray-700">
                                    Kelas *
                                </label>
                                <select
                                    id="kelas"
                                    value={data.kelas}
                                    onChange={(e) => setData('kelas', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        errors.kelas 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                >
                                    <option value="">Pilih Kelas</option>
                                    <option value="X-A">X-A</option>
                                    <option value="X-B">X-B</option>
                                    <option value="XI-A">XI-A</option>
                                    <option value="XI-B">XI-B</option>
                                    <option value="XII-A">XII-A</option>
                                    <option value="XII-B">XII-B</option>
                                </select>
                                {errors.kelas && (
                                    <p className="text-red-500 text-xs mt-1">{errors.kelas}</p>
                                )}
                            </div>

                            {/* Nama Lengkap */}
                            <div className="sm:col-span-2">
                                <label htmlFor="nama_lengkap" className="block text-sm font-medium text-gray-700">
                                    Nama Lengkap *
                                </label>
                                <input
                                    type="text"
                                    id="nama_lengkap"
                                    value={data.nama_lengkap}
                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        errors.nama_lengkap 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.nama_lengkap && (
                                    <p className="text-red-500 text-xs mt-1">{errors.nama_lengkap}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="sm:col-span-1">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        errors.email 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan email"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* No HP */}
                            <div className="sm:col-span-1">
                                <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700">
                                    No HP *
                                </label>
                                <input
                                    type="tel"
                                    id="no_hp"
                                    value={data.no_hp}
                                    onChange={(e) => setData('no_hp', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        errors.no_hp 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan nomor HP"
                                />
                                {errors.no_hp && (
                                    <p className="text-red-500 text-xs mt-1">{errors.no_hp}</p>
                                )}
                            </div>

                            {/* Alamat */}
                            <div className="sm:col-span-2">
                                <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
                                    Alamat Lengkap *
                                </label>
                                <textarea
                                    id="alamat"
                                    rows={4}
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        errors.alamat 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan alamat lengkap"
                                />
                                {errors.alamat && (
                                    <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-gray-200">
                            <Link 
                                href={route('students.show', student.id)} 
                                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">save</span>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}