import { Link } from '@inertiajs/react';

export default function PageHeader({
    title,
    createRoute,
    createText = "Tambah",
    createIcon = "add",
    className = ""
}) {
    return (
        <header className={`mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${className}`}>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                {title}
            </h1>
            {createRoute && (
                <Link
                    href={createRoute}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">{createIcon}</span>
                    <span>{createText}</span>
                </Link>
            )}
        </header>
    );
}
