import { Link } from "@inertiajs/react";

export default function ShowHeader({
    title,
    subtitle,
    backRoute,
    editRoute,
    backText = "Kembali",
    editText = "Edit",
}) {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                    {title}
                </h1>
                {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
                <Link
                    href={backRoute}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-gray-500/30 hover:border-gray-500/50"
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
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    <span className="hidden sm:block">{backText}</span>
                </Link>
                <Link
                    href={editRoute}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                    <span className="hidden sm:block">{editText}</span>
                </Link>
            </div>
        </header>
    );
}
