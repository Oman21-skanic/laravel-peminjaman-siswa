import { Link, router } from "@inertiajs/react";

export default function DataTable({
    data,
    columns,
    viewRoute,
    editRoute,
    onDelete,
    mobileView = true,
    className = "",
}) {
    const handleDelete = (item) => {
        if (
            confirm(`Apakah Anda yakin ingin menghapus ${item.nama_lengkap}?`)
        ) {
            onDelete(item.id);
        }
    };

    const ActionButton = ({ onClick, icon, color = "gray", title }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                color === "red"
                    ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30"
                    : "bg-gray-600/50 hover:bg-gray-600/70 text-gray-400 hover:text-gray-300 border border-gray-500/30"
            }`}
            title={title}
        >
            <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                {icon}
            </svg>
        </button>
    );

    return (
        <div className={`overflow-x-auto ${className}`}>
            {/* Desktop Table */}
            <table className="w-full text-left hidden lg:table min-w-full">
                <thead>
                    <tr className="border-b border-gray-700/50 bg-gray-700/30">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider whitespace-nowrap"
                            >
                                {column.header}
                            </th>
                        ))}
                        <th className="p-3 font-medium text-gray-400 text-sm uppercase tracking-wider text-center whitespace-nowrap">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                        >
                            {columns.map((column, index) => (
                                <td
                                    key={index}
                                    className="p-3 text-sm whitespace-nowrap"
                                >
                                    {column.render
                                        ? column.render(item)
                                        : item[column.key]}
                                </td>
                            ))}
                            <td className="p-3">
                                <div className="flex justify-center items-center gap-2">
                                    {viewRoute && (
                                        <Link
                                            href={viewRoute(item.id)}
                                            className="p-2 rounded-lg bg-gray-600/50 hover:bg-gray-600/70 text-gray-400 hover:text-gray-300 border border-gray-500/30 transition-all duration-300 hover:scale-110"
                                            title="Lihat Detail"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        </Link>
                                    )}
                                    {editRoute && (
                                        <Link
                                            href={editRoute(item.id)}
                                            className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 border border-blue-500/30 transition-all duration-300 hover:scale-110"
                                            title="Edit"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                        </Link>
                                    )}
                                    <ActionButton
                                        onClick={() => handleDelete(item)}
                                        icon={
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        }
                                        color="red"
                                        title="Hapus"
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Mobile Cards */}
            {mobileView && (
                <div className="lg:hidden space-y-3">
                    {data.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gray-700/30 border border-gray-600/30 rounded-xl p-4 hover:bg-gray-700/40 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {columns.find(
                                        (col) => col.key === "profile"
                                    )?.render ? (
                                        columns
                                            .find(
                                                (col) => col.key === "profile"
                                            )
                                            .render(item)
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center border border-gray-500">
                                            <span className="text-gray-400 text-xs">
                                                👨‍🏫
                                            </span>
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-white text-sm truncate">
                                            {item.nama_lengkap}
                                        </h3>
                                        {item.nip && (
                                            <p className="text-xs text-gray-400 truncate">
                                                NIP: {item.nip}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {item.is_active !== undefined && (
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                            item.is_active
                                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                                        }`}
                                    >
                                        {item.is_active
                                            ? "Aktif"
                                            : "Tidak Aktif"}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                {columns.map(
                                    (column, index) =>
                                        column.key !== "profile" &&
                                        column.key !== "actions" &&
                                        column.key !== "nama_lengkap" && (
                                            <div
                                                key={index}
                                                className={
                                                    column.mobileSpan
                                                        ? "col-span-2"
                                                        : ""
                                                }
                                            >
                                                <span className="text-gray-500 text-xs block mb-1">
                                                    {column.header}:
                                                </span>
                                                <p className="font-medium text-gray-300 truncate">
                                                    {column.render
                                                        ? column.render(item)
                                                        : item[column.key]}
                                                </p>
                                            </div>
                                        )
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-600/30">
                                {viewRoute && (
                                    <Link
                                        href={viewRoute(item.id)}
                                        className="p-2 rounded-lg bg-gray-600/50 hover:bg-gray-600/70 text-gray-400 hover:text-gray-300 border border-gray-500/30 transition-all duration-300"
                                        title="Lihat Detail"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    </Link>
                                )}
                                {editRoute && (
                                    <Link
                                        href={editRoute(item.id)}
                                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 border border-blue-500/30 transition-all duration-300"
                                        title="Edit"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </Link>
                                )}
                                <ActionButton
                                    onClick={() => handleDelete(item)}
                                    icon={
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    }
                                    color="red"
                                    title="Hapus"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
