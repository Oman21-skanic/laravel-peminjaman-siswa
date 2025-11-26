import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({
    auth,
    students,
    teachers,
    inventories,
    borrowings,
}) {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Selamat Pagi";
        if (hour < 15) return "Selamat Siang";
        if (hour < 18) return "Selamat Sore";
        return "Selamat Malam";
    };

    // Data statistik utama berdasarkan count dari database
    const mainStats = [
        {
            title: "Total Siswa",
            value: students,
            icon: "👨‍🎓",
            color: "blue",
            description: "Siswa terdaftar",
            link: route("students.index"),
        },
        {
            title: "Total Guru",
            value: teachers,
            icon: "👩‍🏫",
            color: "green",
            description: "Guru terdaftar",
            link: route("teachers.index"),
        },
        {
            title: "Inventaris",
            value: inventories,
            icon: "📦",
            color: "purple",
            description: "Item barang",
            link: route("inventories.index"),
        },
        {
            title: "Peminjaman Aktif",
            value: borrowings,
            icon: "📚",
            color: "orange",
            description: "Sedang dipinjam",
            link: route("borrowings.index"),
        },
    ];

    const getCurrentYear = () => {
        return new Date().getFullYear();
    };

    // Data untuk chart peminjaman (dummy data untuk demo)
    const borrowingTrendData = [
        { month: "Jan", total: 8 },
        { month: "Feb", total: 12 },
        { month: "Mar", total: 10 },
        { month: "Apr", total: 15 },
        { month: "Mei", total: 18 },
        { month: "Jun", total: borrowings }, // Gunakan data real untuk bulan ini
    ];

    // Status inventaris (dummy data untuk demo)
    const inventoryStatus = [
        {
            status: "Tersedia",
            count: Math.floor(inventories * 0.7),
            color: "bg-green-500",
        },
        {
            status: "Dipinjam",
            count: Math.floor(inventories * 0.2),
            color: "bg-blue-500",
        },
        {
            status: "Maintenance",
            count: Math.floor(inventories * 0.1),
            color: "bg-yellow-500",
        },
    ];

    // Komponen Bar Chart Sederhana
    const BarChart = () => (
        <div className="space-y-4">
            <div className="flex items-end justify-between h-32">
                {borrowingTrendData.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center space-y-2 flex-1"
                    >
                        <div className="relative group">
                            <div
                                className="w-6 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t transition-all duration-500 hover:from-blue-400 hover:to-blue-500 cursor-pointer"
                                style={{ height: `${item.total * 4}px` }}
                            >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-600">
                                    {item.total} Peminjaman
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                            {item.month}
                        </span>
                    </div>
                ))}
            </div>
            <div className="text-center text-sm text-gray-400">
                Trend Peminjaman 6 Bulan Terakhir
            </div>
        </div>
    );

    // Komponen Status Inventory
    const InventoryStatus = () => (
        <div className="space-y-4">
            {inventoryStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div
                            className={`w-3 h-3 rounded-full ${item.color}`}
                        ></div>
                        <span className="text-sm text-gray-300">
                            {item.status}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-white font-semibold">
                            {item.count}
                        </span>
                        <span className="text-xs text-gray-400">
                            ({Math.round((item.count / inventories) * 100)}%)
                        </span>
                    </div>
                </div>
            ))}
            <div className="pt-2 border-t border-gray-700">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Inventory</span>
                    <span className="text-white font-semibold">
                        {inventories} items
                    </span>
                </div>
            </div>
        </div>
    );

    // Quick metrics berdasarkan data real
    const quickMetrics = [
        {
            label: "Rasio Peminjaman",
            value:
                inventories > 0
                    ? `${Math.round((borrowings / inventories) * 100)}%`
                    : "0%",
            description: "Dari total inventory",
        },
        {
            label: "Ketersediaan",
            value:
                inventories > 0
                    ? `${Math.floor(
                          ((inventories - borrowings) / inventories) * 100
                      )}%`
                    : "0%",
            description: "Barang tersedia",
        },
        {
            label: "Total Pengguna",
            value: students + teachers,
            description: "Siswa + Guru",
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome Section */}
                <section className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {getGreeting()}, {auth.user.name}!
                            </h1>
                            <p className="text-gray-300 text-lg">
                                Dashboard Analytics Sistem Perpustakaan Sekolah
                            </p>
                            <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    Data Real-time
                                </div>
                                <div>
                                    Update:{" "}
                                    {new Date().toLocaleDateString("id-ID")}
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                                <span className="text-3xl">📊</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mainStats.map((stat, index) => (
                        <Link
                            key={index}
                            href={stat.link}
                            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group block"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className={`w-12 h-12 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center border border-${stat.color}-500/30 group-hover:bg-${stat.color}-500/30 transition-colors`}
                                >
                                    <span className="text-2xl">
                                        {stat.icon}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                                    Detail →
                                </div>
                            </div>
                            <h3 className="text-gray-400 text-sm font-medium mb-1">
                                {stat.title}
                            </h3>
                            <div className="flex items-end justify-between">
                                <p className="text-3xl font-bold text-white">
                                    {stat.value}
                                </p>
                                <span className="text-xs text-gray-500">
                                    {stat.description}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Charts & Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bar Chart - Trend Peminjaman */}
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                Trend Peminjaman
                            </h3>
                            <div className="text-sm text-gray-400">
                                {getCurrentYear()}
                            </div>
                        </div>
                        <BarChart />
                    </div>

                    {/* Inventory Status */}
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                        <h3 className="text-xl font-bold text-white mb-6">
                            Status Inventaris
                        </h3>
                        <InventoryStatus />
                    </div>
                </div>

                {/* Quick Metrics & Management */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Metrics */}
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                        <h3 className="text-xl font-bold text-white mb-6">
                            Metrics Cepat
                        </h3>
                        <div className="space-y-4">
                            {quickMetrics.map((metric, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                                >
                                    <div>
                                        <span className="text-gray-300 text-sm">
                                            {metric.label}
                                        </span>
                                        <p className="text-xs text-gray-400">
                                            {metric.description}
                                        </p>
                                    </div>
                                    <span className="text-white font-bold text-lg">
                                        {metric.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="lg:col-span-2 bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                        <h3 className="text-xl font-bold text-white mb-6">
                            Aksi Cepat
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link
                                href={route("students.index")}
                                className="p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl transition-all duration-300 group text-center"
                            >
                                <div className="text-2xl mb-2">👨‍🎓</div>
                                <p className="text-sm font-medium text-white">
                                    Data Siswa
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {students} terdaftar
                                </p>
                            </Link>
                            <Link
                                href={route("teachers.index")}
                                className="p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl transition-all duration-300 group text-center"
                            >
                                <div className="text-2xl mb-2">👩‍🏫</div>
                                <p className="text-sm font-medium text-white">
                                    Data Guru
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {teachers} terdaftar
                                </p>
                            </Link>
                            <Link
                                href={route("borrowings.index")}
                                className="p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl transition-all duration-300 group text-center"
                            >
                                <div className="text-2xl mb-2">📚</div>
                                <p className="text-sm font-medium text-white">
                                    Peminjaman
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {borrowings} aktif
                                </p>
                            </Link>
                            <Link
                                href={route("inventories.index")}
                                className="p-4 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-xl transition-all duration-300 group text-center"
                            >
                                <div className="text-2xl mb-2">📦</div>
                                <p className="text-sm font-medium text-white">
                                    Inventaris
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {inventories} items
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* System Summary */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold text-white mb-6">
                        Ringkasan Sistem
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4">
                            <div className="text-2xl font-bold text-blue-400 mb-2">
                                {students}
                            </div>
                            <p className="text-gray-400">Total Siswa</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Terdaftar dalam sistem
                            </p>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-2xl font-bold text-green-400 mb-2">
                                {teachers}
                            </div>
                            <p className="text-gray-400">Total Guru</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Terdaftar dalam sistem
                            </p>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-2xl font-bold text-purple-400 mb-2">
                                {inventories}
                            </div>
                            <p className="text-gray-400">Total Inventory</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Barang tersedia
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
