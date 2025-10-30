import { Head, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import FlashMessage from '../../Components/FlashMessage';
import PageHeader from '../../Components/PageHeader';
import BarChart from '../../Components/BarChart';
import PieChart from '../../Components/PieChart';
import SearchFilter from '../../Components/SearchFilter';
import SelectFilter from '../../Components/SelectFilter';
import FilterButtons from '../../Components/FilterButtons';
import PerPageSelector from '../../Components/PerPageSelector';
import DataTable from '../../Components/DataTable';
import EmptyState from '../../Components/EmptyState';
import Pagination from '../../Components/Pagination';

export default function Index({ auth, students, filters = {}, perPage = 10 }) {
    const { url } = usePage();
    const [search, setSearch] = useState(filters.search || '');
    const [classFilter, setClassFilter] = useState(filters.classFilter || '');
    const [statusFilter, setStatusFilter] = useState(filters.statusFilter || '');
    const [selectedPerPage, setSelectedPerPage] = useState(perPage);

    // Filter data secara client-side untuk data yang sudah di-paginate
    const filteredStudents = useMemo(() => {
        return students.data.filter(student => {
            const matchesSearch = search === '' ||
                student.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
                student.nisn.includes(search) ||
                student.email.toLowerCase().includes(search.toLowerCase());

            const matchesClass = classFilter === '' || student.kelas === classFilter;
            const matchesStatus = statusFilter === '' ||
                (statusFilter === 'Aktif' && student.is_active) ||
                (statusFilter === 'Tidak Aktif' && !student.is_active);

            return matchesSearch && matchesClass && matchesStatus;
        });
    }, [students.data, search, classFilter, statusFilter]);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
            router.delete(route('students.destroy', id));
        }
    };

    const handleFilter = () => {
        router.get(route('students.index'), {
            search,
            classFilter,
            statusFilter,
            perPage: selectedPerPage,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setClassFilter('');
        setStatusFilter('');
        setSelectedPerPage(10);
        router.get(route('students.index'), {
            perPage: 10,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePerPageChange = (value) => {
        setSelectedPerPage(value);
        router.get(route('students.index'), {
            search,
            classFilter,
            statusFilter,
            perPage: value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const uniqueClasses = [...new Set(students.data.map(student => student.kelas))].sort();

    // Data untuk charts
    const classData = uniqueClasses.map(kelas => ({
        kelas,
        count: students.data.filter(s => s.kelas === kelas).length
    }));

    const activeStudents = students.data.filter(s => s.is_active).length;
    const inactiveStudents = students.data.filter(s => !s.is_active).length;

    // Columns untuk table
    const columns = [
        {
            key: 'profile',
            header: 'Profile',
            render: (student) => (
                student.profile_picture ? (
                    <img
                        src={`/storage/${student.profile_picture}`}
                        alt="Profile"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                )
            )
        },
        {
            key: 'nisn',
            header: 'NISN',
            render: (student) => <span className="font-mono">{student.nisn}</span>
        },
        {
            key: 'nama_lengkap',
            header: 'Nama Lengkap',
            render: (student) => <span className="font-medium text-gray-900">{student.nama_lengkap}</span>,
            mobileSpan: true
        },
        {
            key: 'kelas',
            header: 'Kelas'
        },
        {
            key: 'no_hp',
            header: 'No HP'
        },
        {
            key: 'status',
            header: 'Status',
            render: (student) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {student.is_active ? 'Aktif' : 'Tidak Aktif'}
                </span>
            )
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Siswa</h2>}
        >
            <Head title="Manajemen Siswa" />

            <div className="max-w-7xl mx-auto">
                <FlashMessage />

                <PageHeader
                    title="Manajemen Siswa"
                    createRoute={route('students.create')}
                    createText="Tambah Siswa"
                />

                {/* Statistics Section */}
                <section className="mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    <BarChart
                        title="Jumlah Siswa per Kelas"
                        data={classData}
                        dataKey="kelas"
                        labelKey="kelas"
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
                <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            <SearchFilter
                                value={search}
                                onChange={setSearch}
                                onSearch={handleFilter}
                                placeholder="Cari siswa..."
                                className="w-full sm:w-64"
                            />

                            <SelectFilter
                                value={classFilter}
                                onChange={setClassFilter}
                                options={uniqueClasses.map(kelas => ({ value: kelas, label: kelas }))}
                                placeholder="Filter Kelas"
                                className="w-full sm:w-40"
                            />

                            <SelectFilter
                                value={statusFilter}
                                onChange={setStatusFilter}
                                options={[
                                    { value: 'Aktif', label: 'Aktif' },
                                    { value: 'Tidak Aktif', label: 'Tidak Aktif' }
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

                        {/* Per Page Selector */}
                        <PerPageSelector
                            value={selectedPerPage}
                            onChange={handlePerPageChange}
                            className="w-full sm:w-auto"
                        />
                    </div>

                    {/* Table */}
                    {filteredStudents.length === 0 ? (
                        <EmptyState message="Tidak ada siswa yang ditemukan" />
                    ) : (
                        <>
                            <DataTable
                                data={filteredStudents}
                                columns={columns}
                                viewRoute={(id) => route('students.show', id)}
                                editRoute={(id) => route('students.edit', id)}
                                onDelete={handleDelete}
                            />
                            <Pagination data={students} />
                        </>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
