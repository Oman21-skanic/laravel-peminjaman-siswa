import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth, students, inventories, errors: serverErrors }) {
    const { data, setData, post, processing, errors } = useForm({
        student_id: '',
        inventory_id: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('borrowings.store'));
    };

    const allErrors = { ...serverErrors, ...errors };

    // Filter inventories yang available
    const availableInventories = inventories.filter(inv => 
        inv.status === 'available' && inv.is_active === 'available'
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Tambah Peminjaman Baru</h2>}
        >
            <Head title="Tambah Peminjaman Baru" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                            Tambah Peminjaman Baru
                        </h1>
                        <p className="text-gray-600 mt-2">Tambah data peminjaman barang baru</p>
                    </div>
                    <Link 
                        href={route('borrowings.index')} 
                        className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        <span className="hidden sm:block">Kembali</span>
                    </Link>
                </header>

                {/* Create Form */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Form Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            {/* Student Selection */}
                            <div>
                                <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
                                    Pilih Siswa *
                                </label>
                                <select
                                    id="student_id"
                                    name="student_id"
                                    value={data.student_id}
                                    onChange={(e) => setData('student_id', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.student_id 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                >
                                    <option value="">Pilih Siswa</option>
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.nama_lengkap} - {student.kelas} (NISN: {student.nisn})
                                        </option>
                                    ))}
                                </select>
                                {allErrors.student_id && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.student_id}</p>
                                )}
                            </div>

                            {/* Inventory Selection */}
                            <div>
                                <label htmlFor="inventory_id" className="block text-sm font-medium text-gray-700">
                                    Pilih Barang *
                                </label>
                                <select
                                    id="inventory_id"
                                    name="inventory_id"
                                    value={data.inventory_id}
                                    onChange={(e) => setData('inventory_id', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.inventory_id 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                >
                                    <option value="">Pilih Barang</option>
                                    {availableInventories.map(inventory => (
                                        <option key={inventory.id} value={inventory.id}>
                                            {inventory.nama_barang} - {inventory.kode_barang} ({inventory.kategori})
                                        </option>
                                    ))}
                                </select>
                                {allErrors.inventory_id && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.inventory_id}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Hanya menampilkan barang yang tersedia
                                </p>
                            </div>

                            {/* Notes */}
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                    Catatan (Opsional)
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={4}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                        allErrors.notes 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                    placeholder="Masukkan catatan peminjaman (opsional)"
                                />
                                {allErrors.notes && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.notes}</p>
                                )}
                            </div>
                        </div>

                        {/* Selected Information Preview */}
                        {(data.student_id || data.inventory_id) && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-800 mb-3">Preview Peminjaman</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {data.student_id && (
                                        <div>
                                            <span className="text-sm font-medium text-blue-700">Siswa:</span>
                                            <p className="text-blue-900">
                                                {students.find(s => s.id == data.student_id)?.nama_lengkap}
                                            </p>
                                        </div>
                                    )}
                                    {data.inventory_id && (
                                        <div>
                                            <span className="text-sm font-medium text-blue-700">Barang:</span>
                                            <p className="text-blue-900">
                                                {inventories.find(i => i.id == data.inventory_id)?.nama_barang}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

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
                                href={route('borrowings.index')} 
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
                                {processing ? 'Menyimpan...' : 'Tambah Peminjaman'}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}