export default function DashboardHeader({ title = "Dashboard", subtitle }) {
    return (
        <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{title}</h1>
            {subtitle && (
                <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
            )}
        </header>
    );
}
