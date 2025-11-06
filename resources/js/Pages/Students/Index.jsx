import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
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

export default function Index({ auth, students, filters = {}, perPage = 10 }) {
    const { url } = usePage();
    const [search, setSearch] = useState(filters.search || "");
    const [classFilter, setClassFilter] = useState(filters.classFilter || "");
    const [statusFilter, setStatusFilter] = useState(
        filters.statusFilter || ""
    );
    const [selectedPerPage, setSelectedPerPage] = useState(perPage);

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus siswa ini?")) {
            router.delete(route("students.destroy", id));
        }
    };

    const handleFilter = () => {
        router.get(
            route("students.index"),
            {
                search,
                classFilter,
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
        setClassFilter("");
        setStatusFilter("");
        setSelectedPerPage(10);
        router.get(
            route("students.index"),
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
            route("students.index"),
            {
                search,
                classFilter,
                statusFilter,
                perPage: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Untuk chart, gunakan semua data dari props students
    const uniqueClasses = [
        ...new Set(students.data.map((student) => student.kelas)),
    ].sort();

    // Data untuk charts - gunakan students.data langsung
    const classData = uniqueClasses.map((kelas) => ({
        name: kelas,
        value: students.data.filter((s) => s.kelas === kelas).length,
    }));

    const activeStudents = students.data.filter((s) => s.is_active).length;
    const inactiveStudents = students.data.filter((s) => !s.is_active).length;

    // Columns untuk table
    const columns = [
        {
            key: "profile",
            header: "Profile",
            render: (student) =>
                student.profile_picture ? (
                    <img
                        src={`/storage/${student.profile_picture}`}
                        alt="Profile"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-600"
                    />
                ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                        <span className="text-gray-400 text-xs">👨‍🎓</span>
                    </div>
                ),
        },
        {
            key: "nisn",
            header: "NISN",
            render: (student) => (
                <span className="font-mono text-gray-300 text-sm">
                    {student.nisn}
                </span>
            ),
        },
        {
            key: "nama_lengkap",
            header: "Nama Lengkap",
            render: (student) => (
                <span className="font-medium text-white text-sm">
                    {student.nama_lengkap}
                </span>
            ),
            mobileSpan: true,
        },
        {
            key: "kelas",
            header: "Kelas",
            render: (student) => (
                <span className="text-gray-300 text-sm">{student.kelas}</span>
            ),
        },
        {
            key: "no_hp",
            header: "No HP",
            render: (student) => (
                <span className="text-gray-300 text-sm">{student.no_hp}</span>
            ),
        },
        {
            key: "email",
            header: "Email",
            render: (student) => (
                <span className="text-gray-300 text-sm">{student.email}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (student) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.is_active
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                >
                    {student.is_active ? "Aktif" : "Tidak Aktif"}
                </span>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Manajemen Siswa
                </h2>
            }
        >
            <Head title="Manajemen Siswa" />

            <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
                <FlashMessage />

                <PageHeader
                    title="Manajemen Siswa"
                    createRoute={route("students.create")}
                    createText="Tambah Siswa"
                />

                {/* Statistics Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarChart
                        title="Distribusi Siswa per Kelas"
                        data={classData}
                        color="green"
                        height={320}
                    />

                    <PieChart
                        title="Status Keaktifan Siswa"
                        total={students.data.length}
                        activeCount={activeStudents}
                        inactiveCount={inactiveStudents}
                        activeLabel="Aktif"
                        inactiveLabel="Tidak Aktif"
                    />
                </section>

                {/* Students Table Section */}
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
                                    placeholder="Cari berdasarkan nama, NISN, atau email..."
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
                                    value={classFilter}
                                    onChange={setClassFilter}
                                    options={uniqueClasses.map((kelas) => ({
                                        value: kelas,
                                        label: kelas,
                                    }))}
                                    placeholder="Semua Kelas"
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

                    {/* Table - Gunakan students.data langsung dari server */}
                    {students.data.length === 0 ? (
                        <EmptyState
                            message="Tidak ada data siswa yang ditemukan"
                            description="Coba ubah filter pencarian atau tambahkan siswa baru"
                            createRoute={route("students.create")}
                            createText="Tambah Siswa"
                        />
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-gray-400">
                                Menampilkan {students.data.length} dari{" "}
                                {students.total} siswa
                            </div>

                            <div className="overflow-hidden">
                                <DataTable
                                    data={students.data}
                                    columns={columns}
                                    viewRoute={(id) =>
                                        route("students.show", id)
                                    }
                                    editRoute={(id) =>
                                        route("students.edit", id)
                                    }
                                    onDelete={handleDelete}
                                />
                            </div>

                            <Pagination data={students} />
                        </>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
