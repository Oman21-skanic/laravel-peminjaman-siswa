import { Link } from "@inertiajs/react";

export default function FormHeader({
    title,
    subtitle,
    cancelRoute,
    cancelText,
}) {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                    {title}
                </h1>
                {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
            </div>
            <Link
                href={cancelRoute}
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
                <span className="hidden sm:block">{cancelText}</span>
            </Link>
        </header>
    );
}
