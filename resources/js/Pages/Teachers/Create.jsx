import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth, errors: serverErrors }) {
    const { data, setData, post, processing, errors } = useForm({
        nip: '',
        nama_lengkap: '',
        jabatan: '',
        no_hp: '',
        email: '',
        alamat: '',
        is_active: true,
        profile_picture: null,
    });

   // Di handleSubmit function Create.jsx, ganti dengan:
const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('nip', data.nip);
    formData.append('nama_lengkap', data.nama_lengkap);
    formData.append('jabatan', data.jabatan);
    formData.append('no_hp', data.no_hp);
    formData.append('email', data.email);
    formData.append('alamat', data.alamat);
    formData.append('is_active', data.is_active ? 1 : 0);
    if (data.profile_picture) {
        formData.append('profile_picture', data.profile_picture);
    }

    post(route('teachers.store'), {
        data: formData,
        forceFormData: true,
    });
};

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_picture', file);
        }
    };

    const allErrors = { ...serverErrors, ...errors };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Tambah Guru Baru</h2>}
        >
            <Head title="Tambah Guru Baru" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                            Tambah Guru Baru
                        </h1>
                        <p className="text-gray-600 mt-2">Tambahkan data guru baru ke sistem</p>
                    </div>
                    <Link 
                        href={route('teachers.index')} 
                        className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        <span className="hidden sm:block">Kembali</span>
                    </Link>
                </header>

                {/* Create Form */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
                            <div className="text-center">
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg mx-auto">
                                    <span className="text-gray-400 text-sm text-center">Upload<br />Foto</span>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Foto Profil (Opsional)
                                    </label>
                                    <input
                                        type="file"
                                        name="profile_picture"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {allErrors.profile_picture && (
                                        <p className="text-red-500 text-xs mt-1">{allErrors.profile_picture}</p>
                                    )}
                                </div>
                            </div>

                            {/* Status Toggle */}
                            <div className="flex-1">
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="is_active"
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
                                        {data.is_active ? 'Guru Aktif' : 'Guru Tidak Aktif'}
                                    </div>
                                </label>
                                <p className="text-sm text-gray-500 mt-2">
                                    {data.is_active 
                                        ? 'Guru akan aktif dalam sistem' 
                                        : 'Guru akan tidak aktif dalam sistem'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* NIP */}
                            <div className="sm:col-span-1">
                                <label htmlFor="nip" className="block text-sm font-medium text-gray-700">
                                    NIP *
                                </label>
                                <input
                                    type="text"
                                    id="nip"
                                    name="nip"
                                    value={data.nip}
                                    onChange={(e) => setData('nip', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.nip 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan NIP"
                                />
                                {allErrors.nip && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.nip}</p>
                                )}
                            </div>

                            {/* Jabatan */}
                            <div className="sm:col-span-1">
                                <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700">
                                    Jabatan *
                                </label>
                                <select
                                    id="jabatan"
                                    name="jabatan"
                                    value={data.jabatan}
                                    onChange={(e) => setData('jabatan', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.jabatan 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                >
                                    <option value="">Pilih Jabatan</option>
                                    <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
                                    <option value="Wali Kelas">Wali Kelas</option>
                                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                                    <option value="Wakil Kepala Sekolah">Wakil Kepala Sekolah</option>
                                    <option value="Guru BK">Guru BK</option>
                                    <option value="Guru Olahraga">Guru Olahraga</option>
                                    <option value="Guru Seni Budaya">Guru Seni Budaya</option>
                                    <option value="Guru Kesehatan">Guru Kesehatan</option>
                                    <option value="Guru Kesejahteraan Sosial">Guru Kesejahteraan Sosial</option>
                                </select>
                                {allErrors.jabatan && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.jabatan}</p>
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
                                    name="nama_lengkap"
                                    value={data.nama_lengkap}
                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.nama_lengkap 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan nama lengkap"
                                />
                                {allErrors.nama_lengkap && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.nama_lengkap}</p>
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
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.email 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan email"
                                />
                                {allErrors.email && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.email}</p>
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
                                    name="no_hp"
                                    value={data.no_hp}
                                    onChange={(e) => setData('no_hp', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.no_hp 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan nomor HP"
                                />
                                {allErrors.no_hp && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.no_hp}</p>
                                )}
                            </div>

                            {/* Alamat */}
                            <div className="sm:col-span-2">
                                <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
                                    Alamat Lengkap *
                                </label>
                                <textarea
                                    id="alamat"
                                    name="alamat"
                                    rows={4}
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.alamat 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan alamat lengkap"
                                />
                                {allErrors.alamat && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.alamat}</p>
                                )}
                            </div>
                        </div>

                        {/* Error Summary */}
                        {Object.keys(allErrors).length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-red-800 mb-2">
                                    <span className="material-symbols-outlined">error</span>
                                    <h4 className="font-semibold">Terjadi Kesalahan</h4>
                                </div>
                                <ul className="text-red-700 text-sm list-disc list-inside">
                                    {Object.entries(allErrors).map(([field, error]) => (
                                        <li key={field}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-gray-200">
                            <Link 
                                href={route('teachers.index')} 
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
                                <span className="material-symbols-outlined">add</span>
                                {processing ? 'Menyimpan...' : 'Tambah Guru'}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}