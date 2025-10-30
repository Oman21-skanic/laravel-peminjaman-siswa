import { Head, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import FlashMessage from '../../Components/FlashMessage';
import PageHeader from '../../Components/PageHeader';
import BarChart from '../../Components/BarChart';
import SearchFilter from '../../Components/SearchFilter';
import SelectFilter from '../../Components/SelectFilter';
import FilterButtons from '../../Components/FilterButtons';
import PerPageSelector from '../../Components/PerPageSelector';
import DataTable from '../../Components/DataTable';
import EmptyState from '../../Components/EmptyState';
import Pagination from '../../Components/Pagination';

export default function Index({ auth, inventories, filters = {}, perPage = 10 }) {
    const { url } = usePage();
    const [search, setSearch] = useState(filters.search || '');
    const [kategoriFilter, setKategoriFilter] = useState(filters.kategoriFilter || '');
    const [statusFilter, setStatusFilter] = useState(filters.statusFilter || '');
    const [selectedPerPage, setSelectedPerPage] = useState(perPage);

    // Filter data secara client-side untuk data yang sudah di-paginate
    const filteredInventories = useMemo(() => {
        return inventories.data.filter(inventory => {
            const matchesSearch = search === '' ||
                inventory.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
                inventory.kode_barang.includes(search) ||
                inventory.deskripsi.toLowerCase().includes(search.toLowerCase());

            const matchesKategori = kategoriFilter === '' || inventory.kategori === kategoriFilter;
            const matchesStatus = statusFilter === '' || inventory.status === statusFilter;

            return matchesSearch && matchesKategori && matchesStatus;
        });
    }, [inventories.data, search, kategoriFilter, statusFilter]);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
            router.delete(route('inventories.destroy', id));
        }
    };

    const handleFilter = () => {
        router.get(route('inventories.index'), {
            search,
            kategoriFilter,
            statusFilter,
            perPage: selectedPerPage,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setKategoriFilter('');
        setStatusFilter('');
        setSelectedPerPage(10);
        router.get(route('inventories.index'), {
            perPage: 10,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePerPageChange = (value) => {
        setSelectedPerPage(value);
        router.get(route('inventories.index'), {
            search,
            kategoriFilter,
            statusFilter,
            perPage: value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const uniqueKategories = [...new Set(inventories.data.map(inventory => inventory.kategori))].sort();
    const uniqueStatuses = [...new Set(inventories.data.map(inventory => inventory.status))].sort();

    const getStatusBadge = (status) => {
        const statusConfig = {
            'available': { color: 'bg-green-100 text-green-800', label: 'Tersedia' },
            'borrowed': { color: 'bg-blue-100 text-blue-800', label: 'Dipinjam' },
            'maintenance': { color: 'bg-yellow-100 text-yellow-800', label: 'Perbaikan' }
        };
        return statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    };

    const getActiveBadge = (isActive) => {
        return isActive === 'available'
            ? { color: 'bg-green-100 text-green-800', label: 'Aktif' }
            : { color: 'bg-red-100 text-red-800', label: 'Tidak Aktif' };
    };

    // Data untuk charts
    const kategoriData = uniqueKategories.map(kategori => ({
        kategori,
        count: inventories.data.filter(i => i.kategori === kategori).length
    }));

    // Data untuk pie chart
    const availableCount = inventories.data.filter(i => i.status === 'available').length;
    const borrowedCount = inventories.data.filter(i => i.status === 'borrowed').length;
    const maintenanceCount = inventories.data.filter(i => i.status === 'maintenance').length;

    // Custom Pie Chart untuk Inventaris
    const InventoryPieChart = () => {
        const availablePercentage = (availableCount / inventories.data.length) * 100;
        const borrowedPercentage = (borrowedCount / inventories.data.length) * 100;
        const maintenancePercentage = (maintenanceCount / inventories.data.length) * 100;

        return (
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                    Status Barang
                </h2>
                <div className="h-48 sm:h-64 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <div className="relative w-32 h-32 sm:w-48 sm:h-48">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                className="text-green-500"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeDasharray={`${availablePercentage}, 100`}
                                strokeWidth="3.8"
                            ></path>
                            <path
                                className="text-blue-500"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeDasharray={`${borrowedPercentage}, 100`}
                                strokeDashoffset={`-${availablePercentage}`}
                                strokeWidth="3.8"
                            ></path>
                            <path
                                className="text-yellow-500"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeDasharray={`${maintenancePercentage}, 100`}
                                strokeDashoffset={`-${(availablePercentage + borrowedPercentage)}`}
                                strokeWidth="3.8"
                            ></path>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl sm:text-3xl font-bold text-gray-900">{inventories.data.length}</span>
                            <span className="text-xs sm:text-sm text-gray-600">Total Barang</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
                            <div>
                                <p className="font-medium text-gray-800 text-sm sm:text-base">Tersedia</p>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                    {availableCount} Barang
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500"></div>
                            <div>
                                <p className="font-medium text-gray-800 text-sm sm:text-base">Dipinjam</p>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                    {borrowedCount} Barang
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-500"></div>
                            <div>
                                <p className="font-medium text-gray-800 text-sm sm:text-base">Perbaikan</p>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                    {maintenanceCount} Barang
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Columns untuk table
    const columns = [
        {
            key: 'foto',
            header: 'Foto',
            render: (inventory) => (
                inventory.foto_barang ? (
                    <img
                        src={`/storage/${inventory.foto_barang}`}
                        alt="Foto Barang"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                )
            )
        },
        {
            key: 'kode_barang',
            header: 'Kode Barang',
            render: (inventory) => <span className="font-mono">{inventory.kode_barang}</span>
        },
        {
            key: 'nama_barang',
            header: 'Nama Barang',
            render: (inventory) => <span className="font-medium text-gray-900">{inventory.nama_barang}</span>,
            mobileSpan: true
        },
        {
            key: 'kategori',
            header: 'Kategori'
        },
        {
            key: 'lokasi_barang',
            header: 'Lokasi'
        },
        {
            key: 'status',
            header: 'Status',
            render: (inventory) => {
                const statusBadge = getStatusBadge(inventory.status);
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.label}
                    </span>
                );
            }
        },
        {
            key: 'is_active',
            header: 'Aktif',
            render: (inventory) => {
                const activeBadge = getActiveBadge(inventory.is_active);
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${activeBadge.color}`}>
                        {activeBadge.label}
                    </span>
                );
            }
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Inventaris</h2>}
        >
            <Head title="Manajemen Inventaris" />

            <div className="max-w-7xl mx-auto">
                <FlashMessage />

                <PageHeader
                    title="Manajemen Inventaris"
                    createRoute={route('inventories.create')}
                    createText="Tambah Barang"
                />

                {/* Statistics Section */}
                <section className="mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    <BarChart
                        title="Jumlah Barang per Kategori"
                        data={kategoriData}
                        dataKey="kategori"
                        labelKey="kategori"
                    />

                    <InventoryPieChart />
                </section>

                {/* Inventories Table Section */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            <SearchFilter
                                value={search}
                                onChange={setSearch}
                                onSearch={handleFilter}
                                placeholder="Cari barang..."
                                className="w-full sm:w-64"
                            />

                            <SelectFilter
                                value={kategoriFilter}
                                onChange={setKategoriFilter}
                                options={uniqueKategories.map(kategori => ({ value: kategori, label: kategori }))}
                                placeholder="Filter Kategori"
                                className="w-full sm:w-48"
                            />

                            <SelectFilter
                                value={statusFilter}
                                onChange={setStatusFilter}
                                options={uniqueStatuses.map(status => ({
                                    value: status,
                                    label: getStatusBadge(status).label
                                }))}
                                placeholder="Filter Status"
                                className="w-full sm:w-40"
                            />

                            <FilterButtons
                                onApply={handleFilter}
                                onReset={clearFilters}
                                className="w-full sm:w-auto"
                            />
                        </div>

                        {/* Per Page Selector */}
                        <PerPageSelector
                            value={selectedPerPage}
                            onChange={handlePerPageChange}
                            className="w-full sm:w-auto"
                        />
                    </div>

                    {/* Table */}
                    {filteredInventories.length === 0 ? (
                        <EmptyState message="Tidak ada barang yang ditemukan" />
                    ) : (
                        <>
                            <DataTable
                                data={filteredInventories}
                                columns={columns}
                                viewRoute={(id) => route('inventories.show', id)}
                                editRoute={(id) => route('inventories.edit', id)}
                                onDelete={handleDelete}
                            />
                            <Pagination data={inventories} />
                        </>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
