export default function ErrorSummary({ errors }) {
    if (Object.keys(errors).length === 0) return null;

    return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3 text-red-400 mb-3">
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <h4 className="font-semibold">Perhatian</h4>
            </div>
            <ul className="text-red-400 text-sm space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                    <li key={field} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        {error}
                    </li>
                ))}
            </ul>
        </div>
    );
}
