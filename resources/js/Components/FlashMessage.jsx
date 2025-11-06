import { usePage } from "@inertiajs/react";

export default function FlashMessage() {
    const { flash } = usePage().props;

    if (!flash?.success) return null;

    return (
        <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center gap-2">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>{flash.success}</span>
            </div>
        </div>
    );
}
