import { Link } from '@inertiajs/react';

export default function StatCard({ title, value, link, linkText = "Lihat Detail", className = "" }) {
    return (
        <div className={`bg-white/90 backdrop-blur-sm p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
            <h3 className="text-lg font-medium text-gray-700">{title}</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value || 0}</p>
            {link && (
                <Link href={link} className="mt-4 inline-block text-sm text-blue-500 hover:text-blue-700 hover:underline">
                    {linkText}
                </Link>
            )}
        </div>
    );
}
