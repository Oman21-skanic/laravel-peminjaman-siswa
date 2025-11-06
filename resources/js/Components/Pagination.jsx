import { router } from "@inertiajs/react";

export default function Pagination({ data, showInfo = true, className = "" }) {
    if (!data.data || data.data.length === 0) return null;

    const PaginationButton = ({
        onClick,
        disabled,
        children,
        active = false,
    }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                active
                    ? "bg-blue-500 text-white border border-blue-500 shadow-lg"
                    : disabled
                    ? "bg-gray-700/30 text-gray-500 cursor-not-allowed border border-gray-600/30"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/50 hover:border-gray-500/50"
            }`}
        >
            {children}
        </button>
    );

    return (
        <div
            className={`flex flex-col lg:flex-row items-center justify-between gap-4 mt-6 ${className}`}
        >
            {showInfo && (
                <div className="text-sm text-gray-400">
                    Menampilkan{" "}
                    <span className="text-white font-medium">{data.from}</span>{" "}
                    sampai{" "}
                    <span className="text-white font-medium">{data.to}</span>{" "}
                    dari{" "}
                    <span className="text-white font-medium">{data.total}</span>{" "}
                    data
                </div>
            )}
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <PaginationButton
                    onClick={() => router.get(data.prev_page_url)}
                    disabled={!data.prev_page_url}
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
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </PaginationButton>

                {/* Page Numbers */}
                {data.links.slice(1, -1).map((link, index) => (
                    <PaginationButton
                        key={index}
                        onClick={() => router.get(link.url)}
                        active={link.active}
                        disabled={!link.url}
                    >
                        <span
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    </PaginationButton>
                ))}

                {/* Next Button */}
                <PaginationButton
                    onClick={() => router.get(data.next_page_url)}
                    disabled={!data.next_page_url}
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
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </PaginationButton>
            </div>
        </div>
    );
}
