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

export default function Index({ auth, teachers, filters = {}, perPage = 10 }) {
    const { url } = usePage();
    const [search, setSearch] = useState(filters.search || "");
    const [jabatanFilter, setJabatanFilter] = useState(
        filters.jabatanFilter || ""
    );
    const [statusFilter, setStatusFilter] = useState(
        filters.statusFilter || ""
    );
    const [selectedPerPage, setSelectedPerPage] = useState(perPage);

    // Filter data secara client-side untuk data yang sudah di-paginate
    const filteredTeachers = useMemo(() => {
        return teachers.data.filter((teacher) => {
            const matchesSearch =
                search === "" ||
                teacher.nama_lengkap
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                teacher.nip.includes(search) ||
                teacher.email.toLowerCase().includes(search.toLowerCase());

            const matchesJabatan =
                jabatanFilter === "" || teacher.jabatan === jabatanFilter;
            const matchesStatus =
                statusFilter === "" ||
                (statusFilter === "Aktif" && teacher.is_active) ||
                (statusFilter === "Tidak Aktif" && !teacher.is_active);

            return matchesSearch && matchesJabatan && matchesStatus;
        });
    }, [teachers.data, search, jabatanFilter, statusFilter]);

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus guru ini?")) {
            router.delete(route("teachers.destroy", id));
        }
    };

    const handleFilter = () => {
        router.get(
            route("teachers.index"),
            {
                search,
                jabatanFilter,
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
        setJabatanFilter("");
        setStatusFilter("");
        setSelectedPerPage(10);
        router.get(
            route("teachers.index"),
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
            route("teachers.index"),
            {
                search,
                jabatanFilter,
                statusFilter,
                perPage: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const uniqueJabatans = [
        ...new Set(teachers.data.map((teacher) => teacher.jabatan)),
    ].sort();

    // Data untuk charts
    const jabatanData = uniqueJabatans.map((jabatan) => ({
        name: jabatan,
        value: teachers.data.filter((t) => t.jabatan === jabatan).length,
    }));

    const activeTeachers = teachers.data.filter((t) => t.is_active).length;
    const inactiveTeachers = teachers.data.filter((t) => !t.is_active).length;

    // Columns untuk table
    const columns = [
        {
            key: "profile",
            header: "Profile",
            render: (teacher) =>
                teacher.profile_picture ? (
                    <img
                        src={`/storage/${teacher.profile_picture}`}
                        alt="Profile"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-600"
                    />
                ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                        <span className="text-gray-400 text-xs">👨‍🏫</span>
                    </div>
                ),
        },
        {
            key: "nip",
            header: "NIP",
            render: (teacher) => (
                <span className="font-mono text-gray-300 text-sm">
                    {teacher.nip}
                </span>
            ),
        },
        {
            key: "nama_lengkap",
            header: "Nama Lengkap",
            render: (teacher) => (
                <span className="font-medium text-white text-sm">
                    {teacher.nama_lengkap}
                </span>
            ),
            mobileSpan: true,
        },
        {
            key: "jabatan",
            header: "Jabatan",
            render: (teacher) => (
                <span className="text-gray-300 text-sm">{teacher.jabatan}</span>
            ),
        },
        {
            key: "no_hp",
            header: "No HP",
            render: (teacher) => (
                <span className="text-gray-300 text-sm">{teacher.no_hp}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (teacher) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        teacher.is_active
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                >
                    {teacher.is_active ? "Aktif" : "Tidak Aktif"}
                </span>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Manajemen Guru
                </h2>
            }
        >
            <Head title="Manajemen Guru" />

            <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
                <FlashMessage />

                <PageHeader
                    title="Manajemen Guru"
                    createRoute={route("teachers.create")}
                    createText="Tambah Guru"
                />

                {/* Statistics Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarChart
                        title="Distribusi Guru per Jabatan"
                        data={jabatanData}
                        color="blue"
                        height={320}
                    />

                    <PieChart
                        title="Status Keaktifan Guru"
                        total={teachers.data.length}
                        activeCount={activeTeachers}
                        inactiveCount={inactiveTeachers}
                        activeLabel="Aktif"
                        inactiveLabel="Tidak Aktif"
                    />
                </section>

                {/* Teachers Table Section */}
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
                                    placeholder="Cari guru..."
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
                                    value={jabatanFilter}
                                    onChange={setJabatanFilter}
                                    options={uniqueJabatans.map((jabatan) => ({
                                        value: jabatan,
                                        label: jabatan,
                                    }))}
                                    placeholder="Semua Jabatan"
                                    className="w-full sm:w-48"
                                />

                                <SelectFilter
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={[
                                        { value: "Aktif", label: "Aktif" },
                                        {
                                            value: "Tidak Aktif",
                                            label: "Tidak Aktif",
                                        },
                                    ]}
                                    placeholder="Semua Status"
                                    className="w-full sm:w-40"
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
                    {filteredTeachers.length === 0 ? (
                        <EmptyState
                            message="Tidak ada data guru yang ditemukan"
                            description="Coba ubah filter pencarian atau tambahkan guru baru"
                            createRoute={route("teachers.create")}
                            createText="Tambah Guru"
                        />
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-gray-400">
                                Menampilkan {filteredTeachers.length} dari{" "}
                                {teachers.total} guru
                            </div>

                            <div className="overflow-hidden">
                                <DataTable
                                    data={filteredTeachers}
                                    columns={columns}
                                    viewRoute={(id) =>
                                        route("teachers.show", id)
                                    }
                                    editRoute={(id) =>
                                        route("teachers.edit", id)
                                    }
                                    onDelete={handleDelete}
                                />
                            </div>

                            <Pagination data={teachers} />
                        </>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
