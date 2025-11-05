import { Head, router, usePage } from "@inertiajs/react";
import { useState, useMemo } from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import FlashMessage from "../../Components/FlashMessage";
import PageHeader from "../../Components/PageHeader";
import BarChart from "../../Components/BarChart";
import PieChart from "../../Components/PieChart";
import SearchFilter from "../../Components/SearchFilter";
import SelectFilter from "../../Components/SelectFilter";
import FilterButtons from "../../Components/FilterButtons";
import PerPageSelector from "../../Components/PerPageSelector";
import DataTable from "../../Components/DataTable";
import EmptyState from "../../Components/EmptyState";
import Pagination from "../../Components/Pagination";

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
        jabatan,
        count: teachers.data.filter((t) => t.jabatan === jabatan).length,
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
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                ),
        },
        {
            key: "nip",
            header: "NIP",
            render: (teacher) => (
                <span className="font-mono">{teacher.nip}</span>
            ),
        },
        {
            key: "nama_lengkap",
            header: "Nama Lengkap",
            render: (teacher) => (
                <span className="font-medium text-gray-900">
                    {teacher.nama_lengkap}
                </span>
            ),
            mobileSpan: true,
        },
        {
            key: "jabatan",
            header: "Jabatan",
        },
        {
            key: "no_hp",
            header: "No HP",
        },
        {
            key: "status",
            header: "Status",
            render: (teacher) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        teacher.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Manajemen Guru
                </h2>
            }
        >
            <Head title="Manajemen Guru" />

            <div className="max-w-7xl mx-auto">
                <FlashMessage />

                <PageHeader
                    title="Manajemen Guru"
                    createRoute={route("teachers.create")}
                    createText="Tambah Guru"
                />

                {/* Statistics Section */}
                <section className="mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    <BarChart
                        title="Jumlah Guru per Jabatan"
                        data={jabatanData}
                        dataKey="jabatan"
                        labelKey="jabatan"
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
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            <SearchFilter
                                value={search}
                                onChange={setSearch}
                                onSearch={handleFilter}
                                placeholder="Cari guru..."
                                className="w-full sm:w-64"
                            />

                            <SelectFilter
                                value={jabatanFilter}
                                onChange={setJabatanFilter}
                                options={uniqueJabatans.map((jabatan) => ({
                                    value: jabatan,
                                    label: jabatan,
                                }))}
                                placeholder="Filter Jabatan"
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
                                placeholder="Filter Status"
                                className="w-full sm:w-40"
                            />

                            <FilterButtons
                                onApply={handleFilter}
                                onReset={clearFilters}
                                className="w-full sm:w-auto"
                            />
                        </div>

                        <PerPageSelector
                            value={selectedPerPage}
                            onChange={handlePerPageChange}
                            className="w-full sm:w-auto"
                        />
                    </div>

                    {/* Table */}
                    {filteredTeachers.length === 0 ? (
                        <EmptyState message="Tidak ada guru yang ditemukan" />
                    ) : (
                        <>
                            <DataTable
                                data={filteredTeachers}
                                columns={columns}
                                viewRoute={(id) => route("teachers.show", id)}
                                editRoute={(id) => route("teachers.edit", id)}
                                onDelete={handleDelete}
                            />
                            <Pagination data={teachers} />
                        </>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
