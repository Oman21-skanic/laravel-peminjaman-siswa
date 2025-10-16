import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth, errors: serverErrors }) {
    const { data, setData, post, processing, errors } = useForm({
        kode_barang: '',
        nama_barang: '',
        kategori: '',
        deskripsi: '',
        status: 'available',
        lokasi_barang: '',
        is_active: 'available',
        foto_barang: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('kode_barang', data.kode_barang);
        formData.append('nama_barang', data.nama_barang);
        formData.append('kategori', data.kategori);
        formData.append('deskripsi', data.deskripsi);
        formData.append('status', data.status);
        formData.append('lokasi_barang', data.lokasi_barang);
        formData.append('is_active', data.is_active);
        if (data.foto_barang) {
            formData.append('foto_barang', data.foto_barang);
        }

        post(route('inventories.store'), {
            data: formData,
            forceFormData: true,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('foto_barang', file);
        }
    };

    const allErrors = { ...serverErrors, ...errors };

    const kategoriOptions = [
        'Buku',
        'Alat Tulis',
        'Elektronik',
        'Furniture',
        'Alat Olahraga',
        'Alat Musik',
        'Alat Praktikum',
        'Lainnya'
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Tambah Barang Baru</h2>}
        >
            <Head title="Tambah Barang Baru" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                            Tambah Barang Baru
                        </h1>
                        <p className="text-gray-600 mt-2">Tambahkan data barang baru ke inventaris</p>
                    </div>
                    <Link 
                        href={route('inventories.index')} 
                        className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        <span className="hidden sm:block">Kembali</span>
                    </Link>
                </header>

                {/* Create Form */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                        {/* Photo Upload */}
                        <div className="flex flex-col items-center sm:items-start">
                            <div className="text-center">
                                <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg mx-auto">
                                    <span className="text-gray-400 text-sm text-center">Upload<br />Foto Barang</span>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Foto Barang (Opsional)
                                    </label>
                                    <input
                                        type="file"
                                        name="foto_barang"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {allErrors.foto_barang && (
                                        <p className="text-red-500 text-xs mt-1">{allErrors.foto_barang}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Kode Barang */}
                            <div className="sm:col-span-1">
                                <label htmlFor="kode_barang" className="block text-sm font-medium text-gray-700">
                                    Kode Barang *
                                </label>
                                <input
                                    type="text"
                                    id="kode_barang"
                                    name="kode_barang"
                                    value={data.kode_barang}
                                    onChange={(e) => setData('kode_barang', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.kode_barang 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan kode barang"
                                />
                                {allErrors.kode_barang && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.kode_barang}</p>
                                )}
                            </div>

                            {/* Kategori */}
                            <div className="sm:col-span-1">
                                <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">
                                    Kategori *
                                </label>
                                <select
                                    id="kategori"
                                    name="kategori"
                                    value={data.kategori}
                                    onChange={(e) => setData('kategori', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.kategori 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                >
                                    <option value="">Pilih Kategori</option>
                                    {kategoriOptions.map(kategori => (
                                        <option key={kategori} value={kategori}>{kategori}</option>
                                    ))}
                                </select>
                                {allErrors.kategori && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.kategori}</p>
                                )}
                            </div>

                            {/* Nama Barang */}
                            <div className="sm:col-span-2">
                                <label htmlFor="nama_barang" className="block text-sm font-medium text-gray-700">
                                    Nama Barang *
                                </label>
                                <input
                                    type="text"
                                    id="nama_barang"
                                    name="nama_barang"
                                    value={data.nama_barang}
                                    onChange={(e) => setData('nama_barang', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.nama_barang 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan nama barang"
                                />
                                {allErrors.nama_barang && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.nama_barang}</p>
                                )}
                            </div>

                            {/* Lokasi Barang */}
                            <div className="sm:col-span-1">
                                <label htmlFor="lokasi_barang" className="block text-sm font-medium text-gray-700">
                                    Lokasi Barang *
                                </label>
                                <input
                                    type="text"
                                    id="lokasi_barang"
                                    name="lokasi_barang"
                                    value={data.lokasi_barang}
                                    onChange={(e) => setData('lokasi_barang', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.lokasi_barang 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan lokasi barang"
                                />
                                {allErrors.lokasi_barang && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.lokasi_barang}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="sm:col-span-1">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Status *
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.status 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                >
                                    <option value="available">Tersedia</option>
                                    <option value="borrowed">Dipinjam</option>
                                    <option value="maintenance">Perbaikan</option>
                                </select>
                                {allErrors.status && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.status}</p>
                                )}
                            </div>

                            {/* Is Active */}
                            <div className="sm:col-span-1">
                                <label htmlFor="is_active" className="block text-sm font-medium text-gray-700">
                                    Status Aktif *
                                </label>
                                <select
                                    id="is_active"
                                    name="is_active"
                                    value={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.is_active 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                >
                                    <option value="available">Aktif</option>
                                    <option value="unavailable">Tidak Aktif</option>
                                </select>
                                {allErrors.is_active && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.is_active}</p>
                                )}
                            </div>

                            {/* Deskripsi */}
                            <div className="sm:col-span-2">
                                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
                                    Deskripsi *
                                </label>
                                <textarea
                                    id="deskripsi"
                                    name="deskripsi"
                                    rows={4}
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.deskripsi 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan deskripsi barang"
                                />
                                {allErrors.deskripsi && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.deskripsi}</p>
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
                                href={route('inventories.index')} 
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
                                {processing ? 'Menyimpan...' : 'Tambah Barang'}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}