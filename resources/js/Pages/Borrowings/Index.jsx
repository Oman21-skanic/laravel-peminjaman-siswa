import { Head, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import FlashMessage from '../../Components/FlashMessage';
import PageHeader from '../../Components/PageHeader';
import BorrowingStats from '../../Components/BorrowingStats';
import SearchFilter from '../../Components/SearchFilter';
import SelectFilter from '../../Components/SelectFilter';
import FilterButtons from '../../Components/FilterButtons';
import PerPageSelector from '../../Components/PerPageSelector';
import BorrowingTable from '../../Components/BorrowingTable';
import EmptyState from '../../Components/EmptyState';
import Pagination from '../../Components/Pagination';

export default function Index({ auth, borrowings, filters = {}, perPage = 10 }) {
    const { url } = usePage();
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.statusFilter || '');
    const [selectedPerPage, setSelectedPerPage] = useState(perPage);

    // Filter data secara client-side untuk data yang sudah di-paginate
    const filteredBorrowings = useMemo(() => {
        return borrowings.data.filter(borrowing => {
            const matchesSearch = search === '' ||
                borrowing.student.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
                borrowing.inventory.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
                borrowing.inventory.kode_barang.includes(search);

            const matchesStatus = statusFilter === '' ||
                (statusFilter === 'borrowed' && !borrowing.returned_at) ||
                (statusFilter === 'returned' && borrowing.returned_at);

            return matchesSearch && matchesStatus;
        });
    }, [borrowings.data, search, statusFilter]);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data peminjaman ini?')) {
            router.delete(route('borrowings.destroy', id));
        }
    };

    const handleFilter = () => {
        router.get(route('borrowings.index'), {
            search,
            statusFilter,
            perPage: selectedPerPage,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('');
        setSelectedPerPage(10);
        router.get(route('borrowings.index'), {
            perPage: 10,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePerPageChange = (value) => {
        setSelectedPerPage(value);
        router.get(route('borrowings.index'), {
            search,
            statusFilter,
            perPage: value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Peminjaman</h2>}
        >
            <Head title="Manajemen Peminjaman" />

            <div className="max-w-7xl mx-auto">
                <FlashMessage />

                <PageHeader
                    title="Manajemen Peminjaman"
                    createRoute={route('borrowings.create')}
                    createText="Tambah Peminjaman"
                />

                {/* Statistics Section */}
                <BorrowingStats borrowings={borrowings} />

                {/* Borrowings Table Section */}
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            <SearchFilter
                                value={search}
                                onChange={setSearch}
                                onSearch={handleFilter}
                                placeholder="Cari siswa atau barang..."
                                className="w-full sm:w-64"
                            />

                            <SelectFilter
                                value={statusFilter}
                                onChange={setStatusFilter}
                                options={[
                                    { value: '', label: 'Semua Status' },
                                    { value: 'borrowed', label: 'Sedang Dipinjam' },
                                    { value: 'returned', label: 'Sudah Dikembalikan' }
                                ]}
                                placeholder="Filter Status"
                                className="w-full sm:w-48"
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
                    {filteredBorrowings.length === 0 ? (
                        <EmptyState message="Tidak ada data peminjaman yang ditemukan" />
                    ) : (
                        <>
                            <BorrowingTable
                                data={filteredBorrowings}
                                viewRoute={(id) => route('borrowings.show', id)}
                                editRoute={(id) => route('borrowings.edit', id)}
                                onDelete={handleDelete}
                            />
                            <Pagination data={borrowings} />
                        </>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
