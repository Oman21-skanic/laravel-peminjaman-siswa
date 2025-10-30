export default function EmptyState({
    message = "Tidak ada data yang ditemukan",
    icon = "search_off",
    className = ""
}) {
    return (
        <div className={`text-center py-8 ${className}`}>
            <span className="material-symbols-outlined text-gray-400 text-4xl sm:text-6xl mb-4">{icon}</span>
            <p className="text-gray-600 text-sm sm:text-base">{message}</p>
        </div>
    );
}
