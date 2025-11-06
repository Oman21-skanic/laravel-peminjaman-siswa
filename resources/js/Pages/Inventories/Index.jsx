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
    inventories,
    filters = {},
    perPage = 10,
}) {
    const { url } = usePage();
    const [search, setSearch] = useState(filters.search || "");
    const [kategoriFilter, setKategoriFilter] = useState(
        filters.kategoriFilter || ""
    );
    const [statusFilter, setStatusFilter] = useState(
        filters.statusFilter || ""
    );
    const [selectedPerPage, setSelectedPerPage] = useState(perPage);

    // Filter data secara client-side untuk data yang sudah di-paginate
    const filteredInventories = useMemo(() => {
        return inventories.data.filter((inventory) => {
            const matchesSearch =
                search === "" ||
                inventory.nama_barang
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                inventory.kode_barang.includes(search) ||
                inventory.deskripsi
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesKategori =
                kategoriFilter === "" || inventory.kategori === kategoriFilter;
            const matchesStatus =
                statusFilter === "" || inventory.status === statusFilter;

            return matchesSearch && matchesKategori && matchesStatus;
        });
    }, [inventories.data, search, kategoriFilter, statusFilter]);

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
            router.delete(route("inventories.destroy", id));
        }
    };

    const handleFilter = () => {
        router.get(
            route("inventories.index"),
            {
                search,
                kategoriFilter,
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
        setKategoriFilter("");
        setStatusFilter("");
        setSelectedPerPage(10);
        router.get(
            route("inventories.index"),
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
            route("inventories.index"),
            {
                search,
                kategoriFilter,
                statusFilter,
                perPage: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const uniqueKategories = [
        ...new Set(inventories.data.map((inventory) => inventory.kategori)),
    ].sort();
    const uniqueStatuses = [
        ...new Set(inventories.data.map((inventory) => inventory.status)),
    ].sort();

    const getStatusBadge = (status) => {
        const statusConfig = {
            available: {
                color: "bg-green-500/20 text-green-400 border border-green-500/30",
                label: "Tersedia",
                icon: "✅",
            },
            borrowed: {
                color: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
                label: "Dipinjam",
                icon: "📚",
            },
            maintenance: {
                color: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
                label: "Perbaikan",
                icon: "🛠️",
            },
        };
        return (
            statusConfig[status] || {
                color: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
                label: status,
                icon: "❓",
            }
        );
    };

    const getActiveBadge = (isActive) => {
        return isActive
            ? {
                  color: "bg-green-500/20 text-green-400 border border-green-500/30",
                  label: "Aktif",
                  icon: "🟢",
              }
            : {
                  color: "bg-red-500/20 text-red-400 border border-red-500/30",
                  label: "Tidak Aktif",
                  icon: "🔴",
              };
    };

    // Data untuk charts
    const kategoriData = uniqueKategories.map((kategori) => ({
        name: kategori,
        value: inventories.data.filter((i) => i.kategori === kategori).length,
    }));

    // Data untuk pie chart
    const availableCount = inventories.data.filter(
        (i) => i.status === "available"
    ).length;
    const borrowedCount = inventories.data.filter(
        (i) => i.status === "borrowed"
    ).length;
    const maintenanceCount = inventories.data.filter(
        (i) => i.status === "maintenance"
    ).length;
    const activeCount = inventories.data.filter((i) => i.is_active).length;
    const inactiveCount = inventories.data.filter((i) => !i.is_active).length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Manajemen Inventaris
                </h2>
            }
        >
            <Head title="Manajemen Inventaris" />

            <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
                <FlashMessage />

                <PageHeader
                    title="Manajemen Inventaris"
                    createRoute={route("inventories.create")}
                    createText="Tambah Barang"
                />

                {/* Statistics Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarChart
                        title="Distribusi Barang per Kategori"
                        data={kategoriData}
                        color="purple"
                        height={320}
                    />

                    <PieChart
                        title="Status Ketersediaan Barang"
                        total={inventories.data.length}
                        activeCount={availableCount}
                        inactiveCount={borrowedCount + maintenanceCount}
                        activeLabel="Tersedia"
                        inactiveLabel="Tidak Tersedia"
                    />
                </section>

                {/* Additional Stats */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                            {availableCount}
                        </div>
                        <div className="text-sm text-gray-400">Tersedia</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1">
                            {borrowedCount}
                        </div>
                        <div className="text-sm text-gray-400">Dipinjam</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
                        <div className="text-2xl font-bold text-yellow-400 mb-1">
                            {maintenanceCount}
                        </div>
                        <div className="text-sm text-gray-400">Perbaikan</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
                        <div className="text-2xl font-bold text-gray-400 mb-1">
                            {inventories.data.length}
                        </div>
                        <div className="text-sm text-gray-400">
                            Total Barang
                        </div>
                    </div>
                </section>

                {/* Inventories Table Section */}
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
                                    placeholder="Cari berdasarkan nama, kode, atau deskripsi..."
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
                                    value={kategoriFilter}
                                    onChange={setKategoriFilter}
                                    options={uniqueKategories.map(
                                        (kategori) => ({
                                            value: kategori,
                                            label: kategori,
                                        })
                                    )}
                                    placeholder="Semua Kategori"
                                    className="w-full sm:w-48"
                                />

                                <SelectFilter
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={uniqueStatuses.map((status) => ({
                                        value: status,
                                        label: getStatusBadge(status).label,
                                    }))}
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
                    {filteredInventories.length === 0 ? (
                        <EmptyState
                            message="Tidak ada data barang yang ditemukan"
                            description="Coba ubah filter pencarian atau tambahkan barang baru"
                            createRoute={route("inventories.create")}
                            createText="Tambah Barang"
                        />
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-gray-400">
                                Menampilkan {filteredInventories.length} dari{" "}
                                {inventories.total} barang
                            </div>

                            <div className="overflow-hidden">
                                <DataTable
                                    data={filteredInventories}
                                    columns={[
                                        {
                                            key: "foto_barang",
                                            header: "Foto",
                                            render: (inventory) =>
                                                inventory.foto_barang ? (
                                                    <img
                                                        src={`/storage/${inventory.foto_barang}`}
                                                        alt="Foto Barang"
                                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover border border-gray-600"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-700 flex items-center justify-center border border-gray-600">
                                                        <span className="text-gray-400 text-xs">
                                                            📦
                                                        </span>
                                                    </div>
                                                ),
                                        },
                                        {
                                            key: "kode_barang",
                                            header: "Kode Barang",
                                            render: (inventory) => (
                                                <span className="font-mono text-gray-300 text-sm">
                                                    {inventory.kode_barang}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: "nama_barang",
                                            header: "Nama Barang",
                                            render: (inventory) => (
                                                <span className="font-medium text-white text-sm">
                                                    {inventory.nama_barang}
                                                </span>
                                            ),
                                            mobileSpan: true,
                                        },
                                        {
                                            key: "kategori",
                                            header: "Kategori",
                                            render: (inventory) => (
                                                <span className="text-gray-300 text-sm">
                                                    {inventory.kategori}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: "lokasi_barang",
                                            header: "Lokasi",
                                            render: (inventory) => (
                                                <span className="text-gray-300 text-sm">
                                                    {inventory.lokasi_barang}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: "status",
                                            header: "Status",
                                            render: (inventory) => {
                                                const statusBadge =
                                                    getStatusBadge(
                                                        inventory.status
                                                    );
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
                                        {
                                            key: "is_active",
                                            header: "Aktif",
                                            render: (inventory) => {
                                                const activeBadge =
                                                    getActiveBadge(
                                                        inventory.is_active
                                                    );
                                                return (
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${activeBadge.color}`}
                                                    >
                                                        {activeBadge.icon}{" "}
                                                        {activeBadge.label}
                                                    </span>
                                                );
                                            },
                                        },
                                    ]}
                                    viewRoute={(id) =>
                                        route("inventories.show", id)
                                    }
                                    editRoute={(id) =>
                                        route("inventories.edit", id)
                                    }
                                    onDelete={handleDelete}
                                />
                            </div>

                            <Pagination data={inventories} />
                        </>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
