import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, inventory, errors: serverErrors }) {
    const { data, setData, put, processing, errors } = useForm({
        kode_barang: inventory.kode_barang || '',
        nama_barang: inventory.nama_barang || '',
        kategori: inventory.kategori || '',
        deskripsi: inventory.deskripsi || '',
        status: inventory.status || 'available',
        lokasi_barang: inventory.lokasi_barang || '',
        is_active: inventory.is_active || 'available',
        foto_barang: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Buat object data yang akan dikirim
        const submitData = {
            kode_barang: data.kode_barang,
            nama_barang: data.nama_barang,
            kategori: data.kategori,
            deskripsi: data.deskripsi,
            status: data.status,
            lokasi_barang: data.lokasi_barang,
            is_active: data.is_active,
        };

        // Hanya tambahkan foto_barang jika ada file baru
        if (data.foto_barang) {
            submitData.foto_barang = data.foto_barang;
        }

        put(route('inventories.update', inventory.id), {
            data: submitData,
            forceFormData: !!data.foto_barang, // Hanya forceFormData jika ada file
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('foto_barang', file);
        } else {
            setData('foto_barang', null);
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
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Barang</h2>}
        >
            <Head title={`Edit ${inventory.nama_barang}`} />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                            Edit Barang
                        </h1>
                        <p className="text-gray-600 mt-2">Ubah informasi barang inventaris</p>
                    </div>
                    <Link 
                        href={route('inventories.show', inventory.id)} 
                        className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        <span className="hidden sm:block">Kembali</span>
                    </Link>
                </header>

                {/* Edit Form */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Current Status */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Status Saat Ini</h3>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                                        {statusBadge.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">Aktif:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${activeBadge.color}`}>
                                        {activeBadge.label}
                                    </span>
                                </div>
                                {inventory.current_borrowing && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">Dipinjam oleh:</span>
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            {inventory.current_borrowing.student.nama_lengkap}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Photo Upload */}
                        <div className="flex flex-col items-center sm:items-start">
                            <div className="text-center">
                                {inventory.foto_barang ? (
                                    <img 
                                        src={`/storage/${inventory.foto_barang}`} 
                                        alt="Foto Barang" 
                                        className="w-32 h-32 rounded-lg object-cover border-4 border-white shadow-lg mx-auto"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg mx-auto">
                                        <span className="text-gray-400">Tidak ada foto</span>
                                    </div>
                                )}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ubah Foto Barang (Opsional)
                                    </label>
                                    <input
                                        type="file"
                                        name="foto_barang"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Kosongkan jika tidak ingin mengubah foto
                                    </p>
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
                                href={route('inventories.show', inventory.id)} 
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