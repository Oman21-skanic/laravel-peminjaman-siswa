import { Link, router } from '@inertiajs/react';

export default function DataTable({
    data,
    columns,
    viewRoute,
    editRoute,
    onDelete,
    mobileView = true,
    className = ""
}) {
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            onDelete(id);
        }
    };

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
                    {data.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                            {columns.map((column, index) => (
                                <td key={index} className="p-3 sm:p-4 text-sm">
                                    {column.render ? column.render(item) : item[column.key]}
                                </td>
                            ))}
                            <td className="p-3 sm:p-4">
                                <div className="flex justify-center items-center gap-1 sm:gap-2">
                                    {viewRoute && (
                                        <Link
                                            href={viewRoute(item.id)}
                                            className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Lihat Detail"
                                        >
                                            <span className="material-symbols-outlined text-gray-600 text-lg">visibility</span>
                                        </Link>
                                    )}
                                    {editRoute && (
                                        <Link
                                            href={editRoute(item.id)}
                                            className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-gray-600 text-lg">edit</span>
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => handleDelete(item.id)}
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
            {mobileView && (
                <div className="lg:hidden space-y-4">
                    {data.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {item.profile_picture && (
                                        <img
                                            src={`/storage/${item.profile_picture}`}
                                            alt="Profile"
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.nama_lengkap}</h3>
                                        {item.nisn && <p className="text-sm text-gray-600">NISN: {item.nisn}</p>}
                                        {item.nip && <p className="text-sm text-gray-600">NIP: {item.nip}</p>}
                                    </div>
                                </div>
                                {item.is_active !== undefined && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        item.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {item.is_active ? 'Aktif' : 'Tidak Aktif'}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                {columns.map((column, index) => (
                                    column.key !== 'profile' && column.key !== 'actions' && (
                                        <div key={index} className={column.mobileSpan ? 'col-span-2' : ''}>
                                            <span className="text-gray-500">{column.header}:</span>
                                            <p className="font-medium">
                                                {column.render ? column.render(item) : item[column.key]}
                                            </p>
                                        </div>
                                    )
                                ))}
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                                {viewRoute && (
                                    <Link
                                        href={viewRoute(item.id)}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        title="Lihat Detail"
                                    >
                                        <span className="material-symbols-outlined text-gray-600">visibility</span>
                                    </Link>
                                )}
                                {editRoute && (
                                    <Link
                                        href={editRoute(item.id)}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        title="Edit"
                                    >
                                        <span className="material-symbols-outlined text-gray-600">edit</span>
                                    </Link>
                                )}
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 rounded-full hover:bg-red-100 transition-colors"
                                    title="Hapus"
                                >
                                    <span className="material-symbols-outlined text-red-500">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
