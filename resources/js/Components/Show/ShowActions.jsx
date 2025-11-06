import { Link } from "@inertiajs/react";

export default function ShowActions({
    backRoute,
    editRoute,
    backText = "Kembali ke Daftar",
    editText = "Edit Data",
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
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
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
                {backText}
            </Link>
            <Link
                href={editRoute}
                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
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
                {editText}
            </Link>
        </div>
    );
}
