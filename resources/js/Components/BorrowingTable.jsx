import { Link } from '@inertiajs/react';

export default function BorrowingTable({
    data,
    viewRoute,
    editRoute,
    deleteRoute,
    onDelete,
    mobileView = true,
    className = ""
}) {
    const getStatusBadge = (status, returnedAt) => {
        if (returnedAt) {
            return { color: 'bg-green-100 text-green-800', label: 'Dikembalikan' };
        }

        const statusConfig = {
            'borrowed': { color: 'bg-blue-100 text-blue-800', label: 'Dipinjam' },
            'returned': { color: 'bg-green-100 text-green-800', label: 'Dikembalikan' },
            'overdue': { color: 'bg-red-100 text-red-800', label: 'Terlambat' }
        };
        return statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    };

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

    const getDaysBorrowed = (borrowedAt, returnedAt) => {
        const borrowed = new Date(borrowedAt);
        const returned = returnedAt ? new Date(returnedAt) : new Date();
        const diffTime = Math.abs(returned - borrowed);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data peminjaman ini?')) {
            onDelete(id);
        }
    };

    // Columns untuk desktop table
    const columns = [
        {
            key: 'student',
            header: 'Siswa',
            render: (borrowing) => (
                <div className="flex items-center gap-3">
                    {borrowing.student.profile_picture ? (
                        <img
                            src={`/storage/${borrowing.student.profile_picture}`}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                    )}
                    <div>
                        <div className="font-medium text-gray-900 text-sm">
                            {borrowing.student.nama_lengkap}
                        </div>
                        <div className="text-xs text-gray-500">
                            {borrowing.student.kelas}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'inventory',
            header: 'Barang',
            render: (borrowing) => (
                <div>
                    <div className="font-medium text-gray-900 text-sm">
                        {borrowing.inventory.nama_barang}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                        {borrowing.inventory.kode_barang}
                    </div>
                </div>
            )
        },
        {
            key: 'borrowed_at',
            header: 'Tanggal Pinjam',
            render: (borrowing) => formatDate(borrowing.borrowed_at)
        },
        {
            key: 'returned_at',
            header: 'Tanggal Kembali',
            render: (borrowing) => formatDate(borrowing.returned_at)
        },
        {
            key: 'days_borrowed',
            header: 'Lama Pinjam',
            render: (borrowing) => {
                const daysBorrowed = getDaysBorrowed(borrowing.borrowed_at, borrowing.returned_at);
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        daysBorrowed > 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        {daysBorrowed} hari
                    </span>
                );
            }
        },
        {
            key: 'status',
            header: 'Status',
            render: (borrowing) => {
                const statusBadge = getStatusBadge(borrowing.status, borrowing.returned_at);
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.label}
                    </span>
                );
            }
        },
        {
            key: 'notes',
            header: 'Catatan',
            render: (borrowing) => (
                <div className="truncate max-w-xs" title={borrowing.notes}>
                    {borrowing.notes || '-'}
                </div>
            )
        }
    ];

    return (
        <div className={`overflow-x-auto ${className}`}>
            {/* Desktop Table */}
            <table className="w-full text-left hidden lg:table">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        {columns.map((column, index) => (
                            <th key={index} className="p-3 sm:p-4 font-medium text-gray-600 text-sm">
                                {column.header}
                            </th>
                        ))}
                        <th className="p-3 sm:p-4 font-medium text-gray-600 text-center text-sm">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((borrowing) => (
                        <tr key={borrowing.id} className="border-b border-gray-200 hover:bg-gray-50">
                            {columns.map((column, index) => (
                                <td key={index} className="p-3 sm:p-4 text-sm">
                                    {column.render(borrowing)}
                                </td>
                            ))}
                            <td className="p-3 sm:p-4">
                                <div className="flex justify-center items-center gap-1 sm:gap-2">
                                    {viewRoute && (
                                        <Link
                                            href={viewRoute(borrowing.id)}
                                            className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Lihat Detail"
                                        >
                                            <span className="material-symbols-outlined text-gray-600 text-lg">visibility</span>
                                        </Link>
                                    )}
                                    {editRoute && (
                                        <Link
                                            href={editRoute(borrowing.id)}
                                            className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-gray-600 text-lg">edit</span>
                                        </Link>
                                    )}
                                    {deleteRoute && (
                                        <button
                                            onClick={() => handleDelete(borrowing.id)}
                                            className="p-1 sm:p-2 rounded-full hover:bg-red-100 transition-colors"
                                            title="Hapus"
                                        >
                                            <span className="material-symbols-outlined text-red-500 text-lg">delete</span>
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Mobile Cards */}
            {mobileView && (
                <div className="lg:hidden space-y-4">
                    {data.map((borrowing) => {
                        const statusBadge = getStatusBadge(borrowing.status, borrowing.returned_at);
                        const daysBorrowed = getDaysBorrowed(borrowing.borrowed_at, borrowing.returned_at);

                        return (
                            <div key={borrowing.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {borrowing.student.profile_picture ? (
                                                <img
                                                    src={`/storage/${borrowing.student.profile_picture}`}
                                                    alt="Profile"
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs">No Image</span>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{borrowing.student.nama_lengkap}</h3>
                                                <p className="text-sm text-gray-600">{borrowing.student.kelas}</p>
                                            </div>
                                        </div>
                                        <div className="ml-13">
                                            <p className="font-medium text-gray-900">{borrowing.inventory.nama_barang}</p>
                                            <p className="text-sm text-gray-600">Kode: {borrowing.inventory.kode_barang}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                        {statusBadge.label}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                    <div>
                                        <span className="text-gray-500">Pinjam:</span>
                                        <p className="font-medium">{formatDate(borrowing.borrowed_at)}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Kembali:</span>
                                        <p className="font-medium">{formatDate(borrowing.returned_at) || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Lama:</span>
                                        <p className="font-medium">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                daysBorrowed > 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {daysBorrowed} hari
                                            </span>
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-gray-500">Catatan:</span>
                                        <p className="font-medium line-clamp-2">{borrowing.notes || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                                    {viewRoute && (
                                        <Link
                                            href={viewRoute(borrowing.id)}
                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Lihat Detail"
                                        >
                                            <span className="material-symbols-outlined text-gray-600">visibility</span>
                                        </Link>
                                    )}
                                    {editRoute && (
                                        <Link
                                            href={editRoute(borrowing.id)}
                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-gray-600">edit</span>
                                        </Link>
                                    )}
                                    {deleteRoute && (
                                        <button
                                            onClick={() => handleDelete(borrowing.id)}
                                            className="p-2 rounded-full hover:bg-red-100 transition-colors"
                                            title="Hapus"
                                        >
                                            <span className="material-symbols-outlined text-red-500">delete</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
