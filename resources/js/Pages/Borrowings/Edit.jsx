import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, borrowing, students, inventories, errors: serverErrors }) {
    const { data, setData, put, processing, errors } = useForm({
        student_id: borrowing.student_id || '',
        inventory_id: borrowing.inventory_id || '',
        notes: borrowing.notes || '',
        returned_at: borrowing.returned_at || '',
    });

    const [markAsReturned, setMarkAsReturned] = useState(!!borrowing.returned_at);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submitData = {
            student_id: data.student_id,
            inventory_id: data.inventory_id,
            notes: data.notes,
        };

        // Jika menandai sebagai dikembalikan, tambahkan returned_at
        if (markAsReturned && !data.returned_at) {
            submitData.returned_at = new Date().toISOString().slice(0, 16);
        } else if (markAsReturned && data.returned_at) {
            submitData.returned_at = data.returned_at;
        } else {
            submitData.returned_at = null;
        }

        put(route('borrowings.update', borrowing.id));
    };

    const handleReturnToggle = (e) => {
        const isReturned = e.target.checked;
        setMarkAsReturned(isReturned);
        
        if (isReturned && !data.returned_at) {
            setData('returned_at', new Date().toISOString().slice(0, 16));
        }
    };

    const allErrors = { ...serverErrors, ...errors };

    // Filter inventories yang available atau yang sedang dipinjam oleh peminjaman ini
    const availableInventories = inventories.filter(inv => 
        inv.status === 'available' && inv.is_active === 'available' || 
        inv.id === borrowing.inventory_id
    );

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Peminjaman</h2>}
        >
            <Head title={`Edit Peminjaman - ${borrowing.student.nama_lengkap}`} />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                            Edit Peminjaman
                        </h1>
                        <p className="text-gray-600 mt-2">Ubah informasi peminjaman barang</p>
                    </div>
                    <Link 
                        href={route('borrowings.show', borrowing.id)} 
                        className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        <span className="hidden sm:block">Kembali</span>
                    </Link>
                </header>

                {/* Current Status */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Status Saat Ini</h3>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Siswa:</span>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {borrowing.student.nama_lengkap}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Barang:</span>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                {borrowing.inventory.nama_barang}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Status:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                borrowing.returned_at 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                                {borrowing.returned_at ? 'Dikembalikan' : 'Dipinjam'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Dipinjam:</span>
                            <span className="text-sm text-gray-600">
                                {formatDate(borrowing.borrowed_at)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
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
                                            {inventory.id === borrowing.inventory_id && ' (sedang dipinjam)'}
                                        </option>
                                    ))}
                                </select>
                                {allErrors.inventory_id && (
                                    <p className="text-red-500 text-xs mt-1">{allErrors.inventory_id}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Barang yang sedang dipinjam tetap bisa dipilih
                                </p>
                            </div>

                            {/* Return Toggle */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={markAsReturned}
                                            onChange={handleReturnToggle}
                                        />
                                        <div className={`block w-14 h-8 rounded-full transition-colors ${
                                            markAsReturned ? 'bg-green-500' : 'bg-gray-300'
                                        }`}></div>
                                        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                                            markAsReturned ? 'transform translate-x-6' : ''
                                        }`}></div>
                                    </div>
                                    <div className="ml-3 text-gray-700 font-medium">
                                        Tandai sebagai Dikembalikan
                                    </div>
                                </label>
                                <p className="text-sm text-gray-600 mt-2">
                                    {markAsReturned 
                                        ? 'Barang akan ditandai sebagai sudah dikembalikan dan status barang akan diubah menjadi tersedia'
                                        : 'Barang masih dalam status dipinjam'
                                    }
                                </p>

                                {/* Return Date */}
                                {markAsReturned && (
                                    <div className="mt-4">
                                        <label htmlFor="returned_at" className="block text-sm font-medium text-gray-700">
                                            Tanggal Pengembalian
                                        </label>
                                        <input
                                            type="datetime-local"
                                            id="returned_at"
                                            name="returned_at"
                                            value={data.returned_at}
                                            onChange={(e) => setData('returned_at', e.target.value)}
                                            className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                                                allErrors.returned_at 
                                                    ? 'border-red-500 focus:ring-red-500' 
                                                    : 'border-gray-300 focus:ring-blue-500'
                                            }`}
                                        />
                                        {allErrors.returned_at && (
                                            <p className="text-red-500 text-xs mt-1">{allErrors.returned_at}</p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Kosongkan untuk menggunakan tanggal saat ini
                                        </p>
                                    </div>
                                )}
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
                                href={route('borrowings.show', borrowing.id)} 
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