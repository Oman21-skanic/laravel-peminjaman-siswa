import { Head, router, usePage } from "@inertiajs/react";
import { useState, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import FlashMessage from "@/Components/FlashMessage";
import PageHeader from "@/Components/PageHeader";
import BarChart from "@/Components/BarChart";
import PieChart from "@/Components/PieChart";
import SearchFilter from "@/Components/SearchFilter";
import SelectFilter from "@/Components/SelectFilter";
import FilterButtons from "@/Components/FilterButtons";
import PerPageSelector from "@/Components/PerPageSelector";
import DataTable from "@/Components/DataTable";
import EmptyState from "@/Components/EmptyState";
import Pagination from "@/Components/Pagination";

export default function Index({
    auth,
    borrowings,
    monthlyBorrowings = [],
    stats = {},
    filters = {},
    perPage = 10,
}) {
    const { url } = usePage();
    const [search, setSearch] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.statusFilter || "");
    const [selectedPerPage, setSelectedPerPage] = useState(perPage);

    // Debug: Lihat data yang diterima
    console.log('Borrowings data:', borrowings);
    console.log('First borrowing item:', borrowings.data[0]);

    // Filter data secara client-side untuk data yang sudah di-paginate
    const filteredBorrowings = useMemo(() => {
        return borrowings.data.filter((borrowing) => {
            const matchesSearch =
                search === "" ||
                borrowing.student?.nama_lengkap
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                borrowing.teacher?.nama_lengkap
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                borrowing.inventory?.nama_barang
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                borrowing.inventory?.kode_barang.includes(search);

            const matchesStatus =
                statusFilter === "" ||
                (statusFilter === "borrowed" && !borrowing.returned_at) ||
                (statusFilter === "returned" && borrowing.returned_at);

            return matchesSearch && matchesStatus;
        });
    }, [borrowings.data, search, statusFilter]);

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")) {
            router.delete(route("borrowings.destroy", id));
        }
    };

    // Fungsi untuk quick return
    // Fungsi untuk quick return
    const handleQuickReturn = async (borrowing) => {
        console.log('Quick return for:', borrowing);

        if (confirm(`Apakah Anda yakin ingin mengembalikan barang "${borrowing.inventory?.nama_barang}"?`)) {
            try {
                // Gunakan router.put dari Inertia untuk handle CSRF token otomatis
                router.put(route('borrowings.quick-return', borrowing.id), {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        alert('Barang berhasil dikembalikan!');
                    },
                    onError: (errors) => {
                        alert('Gagal mengembalikan barang: ' + (errors.message || 'Terjadi kesalahan'));
                    }
                });

            } catch (error) {
                console.error('Error returning item:', error);
                alert('Terjadi kesalahan saat mengembalikan barang.');
            }
        }
    };

    const handleFilter = () => {
        router.get(
            route("borrowings.index"),
            {
                search,
                statusFilter,
                perPage: selectedPerPage,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("");
        setSelectedPerPage(10);
        router.get(
            route("borrowings.index"),
            {
                perPage: 10,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handlePerPageChange = (value) => {
        setSelectedPerPage(value);
        router.get(
            route("borrowings.index"),
            {
                search,
                statusFilter,
                perPage: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Data untuk charts - menggunakan data real dari database
    const monthlyData = useMemo(() => {
        return monthlyBorrowings.length > 0
            ? monthlyBorrowings
            : [
                { name: "Jan", value: 0 },
                { name: "Feb", value: 0 },
                { name: "Mar", value: 0 },
                { name: "Apr", value: 0 },
                { name: "Mei", value: 0 },
                { name: "Jun", value: 0 },
            ];
    }, [monthlyBorrowings]);

    const getStatusBadge = (borrowing) => {
        if (borrowing.returned_at) {
            return {
                color: "bg-green-500/20 text-green-400 border border-green-500/30",
                label: "Dikembalikan",
                icon: "✅",
            };
        } else {
            const borrowedDate = new Date(borrowing.borrowed_at);
            const today = new Date();
            const diffTime = today - borrowedDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 7) {
                return {
                    color: "bg-red-500/20 text-red-400 border border-red-500/30",
                    label: "Terlambat",
                    icon: "⏰",
                };
            } else {
                return {
                    color: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
                    label: "Dipinjam",
                    icon: "📚",
                };
            }
        }
    };

    const getDaysRemaining = (borrowedAt) => {
        const borrowedDate = new Date(borrowedAt);
        const today = new Date();
        const diffTime = today - borrowedDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, 7 - diffDays);
    };

    // Fungsi untuk mendapatkan nama peminjam (student atau teacher)
    const getPeminjamName = (borrowing) => {
        if (borrowing.student) {
            return borrowing.student.nama_lengkap;
        } else if (borrowing.teacher) {
            return borrowing.teacher.nama_lengkap;
        }
        return "Tidak diketahui";
    };

    // Fungsi untuk mendapatkan NISN/NIP peminjam
    const getPeminjamIdentifier = (borrowing) => {
        if (borrowing.student) {
            return borrowing.student.nisn;
        } else if (borrowing.teacher) {
            return borrowing.teacher.nip;
        }
        return "-";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Manajemen Peminjaman
                </h2>
            }
        >
            <Head title="Manajemen Peminjaman" />

            <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
                <FlashMessage />

                <PageHeader
                    title="Manajemen Peminjaman"
                    createRoute={route("borrowings.create")}
                    createText="Tambah Peminjaman"
                />

                {/* Statistics Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarChart
                        title="Trend Peminjaman Tahun Ini"
                        data={monthlyData}
                        color="orange"
                        height={320}
                    />

                    <PieChart
                        title="Status Peminjaman"
                        total={stats.total || 0}
                        activeCount={stats.borrowed || 0}
                        inactiveCount={stats.returned || 0}
                        activeLabel="Sedang Dipinjam"
                        inactiveLabel="Sudah Dikembalikan"
                    />
                </section>

                {/* Quick Stats */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1">
                            {stats.borrowed || 0}
                        </div>
                        <div className="text-sm text-gray-400">
                            Sedang Dipinjam
                        </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                            {stats.returned || 0}
                        </div>
                        <div className="text-sm text-gray-400">
                            Dikembalikan
                        </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
                        <div className="text-2xl font-bold text-red-400 mb-1">
                            {stats.overdue || 0}
                        </div>
                        <div className="text-sm text-gray-400">Terlambat</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
                        <div className="text-2xl font-bold text-purple-400 mb-1">
                            {stats.total || 0}
                        </div>
                        <div className="text-sm text-gray-400">
                            Total Peminjaman
                        </div>
                    </div>
                </section>

                {/* Borrowings Table Section */}
                <section className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700/50">
                    {/* Filters - Improved Layout */}
                    <div className="flex flex-col gap-4 mb-6">
                        {/* Top Row - Search and Per Page */}
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                            <div className="w-full lg:w-80">
                                <SearchFilter
                                    value={search}
                                    onChange={setSearch}
                                    onSearch={handleFilter}
                                    placeholder="Cari berdasarkan nama siswa, guru, atau barang..."
                                    className="w-full"
                                />
                            </div>

                            <PerPageSelector
                                value={selectedPerPage}
                                onChange={handlePerPageChange}
                                className="w-full lg:w-auto"
                            />
                        </div>

                        {/* Bottom Row - Filters and Buttons */}
                        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                <SelectFilter
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={[
                                        { value: "", label: "Semua Status" },
                                        {
                                            value: "borrowed",
                                            label: "Sedang Dipinjam",
                                        },
                                        {
                                            value: "returned",
                                            label: "Sudah Dikembalikan",
                                        },
                                    ]}
                                    placeholder="Filter Status"
                                    className="w-full sm:w-48"
                                />
                            </div>

                            <FilterButtons
                                onApply={handleFilter}
                                onReset={clearFilters}
                                className="w-full lg:w-auto"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    {filteredBorrowings.length === 0 ? (
                        <EmptyState
                            message="Tidak ada data peminjaman yang ditemukan"
                            description="Coba ubah filter pencarian atau tambahkan peminjaman baru"
                            createRoute={route("borrowings.create")}
                            createText="Tambah Peminjaman"
                        />
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-gray-400">
                                Menampilkan {filteredBorrowings.length} dari{" "}
                                {borrowings.total} peminjaman
                            </div>

                            <div className="overflow-hidden">
                                <DataTable
                                    data={filteredBorrowings}
                                    columns={[
                                        {
                                            key: "peminjam",
                                            header: "Peminjam",
                                            render: (borrowing) => (
                                                <div className="flex items-center gap-3">
                                                    {borrowing.student
                                                        ?.profile_picture ||
                                                        borrowing.teacher
                                                            ?.profile_picture ? (
                                                        <img
                                                            src={`/storage/${borrowing
                                                                .student
                                                                ?.profile_picture ||
                                                                borrowing
                                                                    .teacher
                                                                    ?.profile_picture
                                                                }`}
                                                            alt="Profile"
                                                            className="w-8 h-8 rounded-full object-cover border border-gray-600"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                                                            <span className="text-gray-400 text-xs">
                                                                {borrowing.role ===
                                                                    "student"
                                                                    ? "👨‍🎓"
                                                                    : "👨‍🏫"}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-white text-sm">
                                                            {getPeminjamName(
                                                                borrowing
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {getPeminjamIdentifier(
                                                                borrowing
                                                            )}{" "}
                                                            •{" "}
                                                            {borrowing.role ===
                                                                "student"
                                                                ? "Siswa"
                                                                : "Guru"}
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                            mobileSpan: true,
                                        },
                                        {
                                            key: "inventory",
                                            header: "Barang",
                                            render: (borrowing) => (
                                                <div>
                                                    <div className="font-medium text-white text-sm">
                                                        {
                                                            borrowing.inventory
                                                                ?.nama_barang
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {
                                                            borrowing.inventory
                                                                ?.kode_barang
                                                        }
                                                    </div>
                                                </div>
                                            ),
                                        },
                                        {
                                            key: "borrowed_at",
                                            header: "Tanggal Pinjam",
                                            render: (borrowing) => (
                                                <div className="text-gray-300 text-sm">
                                                    {new Date(
                                                        borrowing.borrowed_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </div>
                                            ),
                                        },
                                        {
                                            key: "returned_at",
                                            header: "Tanggal Kembali",
                                            render: (borrowing) => (
                                                <div className="text-gray-300 text-sm">
                                                    {borrowing.returned_at
                                                        ? new Date(
                                                            borrowing.returned_at
                                                        ).toLocaleDateString(
                                                            "id-ID"
                                                        )
                                                        : "-"}
                                                </div>
                                            ),
                                        },
                                        {
                                            key: "days_remaining",
                                            header: "Sisa Hari",
                                            render: (borrowing) => {
                                                if (borrowing.returned_at) {
                                                    return (
                                                        <span className="text-gray-400 text-sm">
                                                            -
                                                        </span>
                                                    );
                                                }
                                                const daysRemaining =
                                                    getDaysRemaining(
                                                        borrowing.borrowed_at
                                                    );
                                                return (
                                                    <span
                                                        className={`text-sm font-medium ${daysRemaining <= 2
                                                            ? "text-red-400"
                                                            : daysRemaining <=
                                                                4
                                                                ? "text-yellow-400"
                                                                : "text-green-400"
                                                            }`}
                                                    >
                                                        {daysRemaining} hari
                                                    </span>
                                                );
                                            },
                                        },
                                        {
                                            key: "status",
                                            header: "Status",
                                            render: (borrowing) => {
                                                const statusBadge =
                                                    getStatusBadge(borrowing);
                                                return (
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
                                                    >
                                                        {statusBadge.icon}{" "}
                                                        {statusBadge.label}
                                                    </span>
                                                );
                                            },
                                        },
                                    ]}
                                    // Hapus viewRoute karena kita handle view button secara custom
                                    editRoute={(id) =>
                                        route("borrowings.edit", id)
                                    }
                                    onDelete={handleDelete}
                                    // Di dalam component Index, ganti customActions dengan ini:
                                    customActions={(item) => (
                                        <div className="flex gap-2">
                                            {/* Debug info - sementara tampilkan untuk testing */}
                                            <div className="text-xs text-gray-500 hidden">
                                                ID: {item.id}, Returned: {item.returned_at ? 'Yes' : 'No'}
                                            </div>

                                            {/* Tombol Pengembalian - hanya untuk barang yang belum dikembalikan */}
                                            {!item.returned_at ? (
                                                <button
                                                    onClick={() => handleQuickReturn(item)}
                                                    className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 border border-green-500/30 transition-all duration-300 hover:scale-110"
                                                    title="Kembalikan Barang"
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
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </button>
                                            ) : (
                                                // Tombol Lihat untuk barang yang sudah dikembalikan (disabled)
                                                <a
                                                    href={route("borrowings.show", item.id)}
                                                    className="p-2 rounded-lg bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-not-allowed opacity-50"
                                                    title="Lihat Detail (Sudah Dikembalikan)"
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
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                </a>
                                            )}

                                            {/* Tombol Edit */}
                                            <a
                                                href={route("borrowings.edit", item.id)}
                                                className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 border border-blue-500/30 transition-all duration-300 hover:scale-110"
                                                title="Edit Peminjaman"
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
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </a>

                                            {/* Tombol Delete */}
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 transition-all duration-300 hover:scale-110"
                                                title="Hapus Peminjaman"
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
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                />
                            </div>

                            <Pagination data={borrowings} />
                        </>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}