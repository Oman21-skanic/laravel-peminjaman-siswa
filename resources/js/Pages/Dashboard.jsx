import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, students, teachers, inventories, borrowings }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="max-w-5xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                </header>
                
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Total Peminjaman</h3>
                        <p className="text-4xl font-bold text-gray-900">{borrowings || 0}</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Total Pengembalian</h3>
                        <p className="text-4xl font-bold text-gray-900">{borrowings || 0}</p>
                    </div>
                </section>
                
                <section className="mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Statistik Data</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <h3 className="text-lg font-medium text-gray-700">Siswa</h3>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{students || 0}</p>
                            <Link href={route('students.index')} className="mt-4 inline-block text-sm text-blue-500 hover:text-blue-700 hover:underline">
                                Lihat Detail
                            </Link>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <h3 className="text-lg font-medium text-gray-700">Guru</h3>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{teachers || 0}</p>
                            <Link href={route('teachers.index')} className="mt-4 inline-block text-sm text-blue-500 hover:text-blue-700 hover:underline">
                                Lihat Detail
                            </Link>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <h3 className="text-lg font-medium text-gray-700">Inventaris</h3>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{inventories || 0}</p>
                            <Link href={route('inventories.index')} className="mt-4 inline-block text-sm text-blue-500 hover:text-blue-700 hover:underline">
                                Lihat Detail
                            </Link>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <h3 className="text-lg font-medium text-gray-700">Peminjaman</h3>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{borrowings || 0}</p>
                            <Link href={route('borrowings.index')} className="mt-4 inline-block text-sm text-blue-500 hover:text-blue-700 hover:underline">
                                Lihat Detail
                            </Link>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Manajemen</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="group">
                            <div className="w-full aspect-square bg-cover bg-center rounded-lg mb-4 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 shadow-md border border-gray-200" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDj6K0FhnlXnoBpr2e8L2MoOEhJbO7rRZaZftT8stCq3RNMCJRFJPqSaK-mfICpKuwnt6Ty1mkJkBnkHvQVFScprxTBNqOuUTxJcRaFVS8acrAS9RNBYNGKf2gb58cGVk7GKZ6OLIXu7tjoqjyh2PB3yuujKmgmOtZwIQ7n3ZMPdVh6FpWqmBiAMUqvrzFHd_vlgQ6bmtRUHC588dm5feV_nxV3J_SqEFRtLL93n2BsIKwTxVBrN_qwHCAaIoQe3wMIdPLb1_ygUOAi")'}}></div>
                            <h3 className="text-lg font-medium text-gray-800">Manajemen Siswa</h3>
                            <p className="text-sm text-gray-600">Kelola data siswa</p>
                        </div>
                        <div className="group">
                            <div className="w-full aspect-square bg-cover bg-center rounded-lg mb-4 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 shadow-md border border-gray-200" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC5NEEMYExZ9T8oeB9x5hsDLF9SK0AKgczZGPlhOl18UrXYl-a1oiJXCoiW903eULS_XjfHz-veuZt6oC1ENkYSQha5LbzweC55vlJv334PLtgYyI01ZC43FWmjhEmv53J4tAy0ngpPYqFzhvkgfPvZowTDvfSKn98w4ukI5XyLYfMGb--WgYrfm0TrIgf0X7wQY7JGaDCXG3gBo20YfzZcG2C8OmFMI0mXV2eqKPxL3-eazKF0RyQss28udzhCtigEdIgJ9r2reyyv")'}}></div>
                            <h3 className="text-lg font-medium text-gray-800">Manajemen Guru</h3>
                            <p className="text-sm text-gray-600">Kelola data guru</p>
                        </div>
                        <div className="group">
                            <div className="w-full aspect-square bg-cover bg-center rounded-lg mb-4 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 shadow-md border border-gray-200" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDJIhKwbGtHnOv_Esa2im-6l4USMrx3fRHLvzpzJt88d2KeNye0OzfP54C7EMrde3MRYXJHsoZ7yv1yPYDUU_IUxd8gP6nz79I4HVwtGrFETKdlnQsZqCrLg7-q5cUh5TX2F61J3UOtM6MRMcKmzwMwI05_1sIs4cn8ZUqtUd-IYwoo3v_rUPU5NSo0Bk6HH4KphQNfXfNlG_Glwa_N_5_hmuS0bA_udux6o9IaMNMhNEqj1N9eZATTGyDoH4_G2YmgOpu64Eqdb0qn")'}}></div>
                            <h3 className="text-lg font-medium text-gray-800">Manajemen Peminjaman</h3>
                            <p className="text-sm text-gray-600">Kelola data peminjaman</p>
                        </div>
                        <div className="group">
                            <div className="w-full aspect-square bg-cover bg-center rounded-lg mb-4 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 shadow-md border border-gray-200" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDyrimVdon0yaV4w3IR1oCcc7fXk4r2ba6Rn4viyOQ7cOwYDo3Ae-7-OImZnbFyDKQeTMUL1nemoyuM2VVHFWWasFQYVTw5Rwf0IJlk1jlvmvAVZD1XcGEB_crnBCgKdU1SqtX4eUEzw_I-uA6OF3Ofxs17xg-wy_kTlI1yHkXJzuCUVeAdOQkTDeNoMJemy5pfAfM3CThNE6u5X4sRRyjxW0wnrgF-v4HC2S6H8N3vUTEcWAuptc9EJhceTG5j8g4LV246beu_Gya3")'}}></div>
                            <h3 className="text-lg font-medium text-gray-800">Manajemen Inventaris</h3>
                            <p className="text-sm text-gray-600">Kelola data inventaris</p>
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}