import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const features = [
        {
            icon: "👨‍🎓",
            title: "Manajemen Siswa",
            description: "Kelola data siswa dengan mudah, lengkap dengan informasi kelas, kontak, dan status keaktifan."
        },
        {
            icon: "👨‍🏫",
            title: "Manajemen Guru",
            description: "Kelola data guru dan staf pengajar dengan sistem yang terintegrasi dan efisien."
        },
        {
            icon: "📦",
            title: "Manajemen Inventaris",
            description: "Pantau dan kelola barang inventaris sekolah dengan sistem peminjaman yang terstruktur."
        },
        {
            icon: "📚",
            title: "Sistem Peminjaman",
            description: "Kelola peminjaman barang dengan tracking yang real-time dan notifikasi otomatis."
        }
    ];

    const stats = [
        { number: "500+", label: "Siswa Terdaftar" },
        { number: "50+", label: "Guru Profesional" },
        { number: "1000+", label: "Barang Inventaris" },
        { number: "200+", label: "Peminjaman/Bulan" }
    ];

    return (
        <>
            <Head title="Sistem Manajemen Sekolah" />

            {/* Hero Section */}
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
                {/* Navigation */}
                <nav className="relative z-10 px-6 py-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">SM</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800 dark:text-white">
                                SchoolManager
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto pt-20 pb-32">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                                Sistem Manajemen
                                <span className="text-blue-600 block mt-2">Sekolah Modern</span>
                            </h1>

                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Kelola data siswa, guru, inventaris, dan peminjaman dengan sistem yang
                                terintegrasi dan mudah digunakan. Efisiensi pengelolaan sekolah dalam genggaman Anda.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                    >
                                        Masuk ke Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                        >
                                            Mulai Sekarang
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                                        >
                                            Masuk Akun
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Hero Illustration */}
                        <div className="mt-16 flex justify-center">
                            <div className="relative w-full max-w-4xl">
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {stats.map((stat, index) => (
                                            <div key={index} className="text-center">
                                                <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                    {stat.number}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white dark:bg-gray-900 py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Fitur Unggulan
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Sistem yang dirancang khusus untuk memudahkan pengelolaan sekolah dengan teknologi terkini
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Cara Kerja Sistem
                        </h2>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Hanya dalam 3 langkah sederhana, kelola sekolah Anda dengan lebih efisien
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center text-white">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                1
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Daftar & Login</h3>
                            <p className="text-blue-100">
                                Buat akun atau login ke sistem dengan kredensial yang aman
                            </p>
                        </div>

                        <div className="text-center text-white">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                2
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Kelola Data</h3>
                            <p className="text-blue-100">
                                Input dan kelola data siswa, guru, dan inventaris dengan mudah
                            </p>
                        </div>

                        <div className="text-center text-white">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                3
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Pantau Aktivitas</h3>
                            <p className="text-blue-100">
                                Pantau semua aktivitas dan laporan dalam dashboard yang intuitif
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white dark:bg-gray-900 py-20">
                <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Siap Mengoptimalkan Pengelolaan Sekolah?
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Bergabung dengan ratusan sekolah yang telah mempercayai sistem kami untuk pengelolaan yang lebih baik
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Lanjut ke Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('register')}
                                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    Daftar Sekarang - Gratis
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                                >
                                    Masuk ke Akun
                                </Link>
                            </>
                        )}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Tidak perlu kartu kredit • Setup dalam 5 menit
                    </p>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">SM</span>
                            </div>
                            <span className="text-lg font-bold">SchoolManager</span>
                        </div>

                        <div className="text-gray-400 text-sm">
                            © 2024 SchoolManager. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
