import { Link } from "@inertiajs/react";

export default function PageHeader({
    title,
    subtitle,
    createRoute,
    createText = "Tambah",
    backRoute,
    backText = "Kembali",
    className = "",
}) {
    return (
        <header
            className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ${className}`}
        >
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                {subtitle && (
                    <p className="text-gray-400 text-lg">{subtitle}</p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {backRoute && (
                    <Link
                        href={backRoute}
                        className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-gray-500/30 hover:border-gray-500/50"
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
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        {backText}
                    </Link>
                )}

                {createRoute && (
                    <Link
                        href={createRoute}
                        className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 hover:scale-105"
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
        </header>
    );
}
