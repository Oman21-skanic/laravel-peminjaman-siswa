import { Link } from "@inertiajs/react";

export default function EmptyState({
    message = "Tidak ada data yang ditemukan",
    description = "Coba ubah filter pencarian atau tambahkan data baru",
    createRoute,
    createText = "Tambah Data",
    className = "",
}) {
    return (
        <div className={`text-center py-12 ${className}`}>
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-700/50 rounded-full flex items-center justify-center border border-gray-600/30">
                <svg
                    className="w-12 h-12 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{message}</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
            {createRoute && (
                <Link
                    href={createRoute}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 hover:scale-105"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    {createText}
                </Link>
            )}
        </div>
    );
}
