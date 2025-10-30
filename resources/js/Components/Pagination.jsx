import { router } from '@inertiajs/react';

export default function Pagination({
    data,
    showInfo = true,
    className = ""
}) {
    if (!data.data || data.data.length === 0) return null;

    return (
        <div className={`mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {showInfo && (
                <div className="text-sm text-gray-700">
                    Menampilkan {data.from} sampai {data.to} dari {data.total} data
                </div>
            )}
            <div className="flex gap-1">
                {/* Previous Button */}
                <button
                    onClick={() => router.get(data.prev_page_url)}
                    disabled={!data.prev_page_url}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        !data.prev_page_url
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    Previous
                </button>

                {/* Page Numbers */}
                {data.links.slice(1, -1).map((link, index) => (
                    <button
                        key={index}
                        onClick={() => router.get(link.url)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                            link.active
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}

                {/* Next Button */}
                <button
                    onClick={() => router.get(data.next_page_url)}
                    disabled={!data.next_page_url}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        !data.next_page_url
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
