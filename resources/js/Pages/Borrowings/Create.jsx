import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GenericForm from '@/Components/Form/GenericForm';

export default function Create({ auth, students, inventories, errors: serverErrors }) {
    // Filter inventories yang available
    const availableInventories = inventories.filter(inv => 
        inv.status === 'available' && inv.is_active === 'available'
    );

    const borrowingFields = [
        {
            name: 'student_id',
            label: 'Pilih Siswa',
            type: 'select',
            required: true,
            options: students.map(student => ({
                value: student.id,
                label: `${student.nama_lengkap} - ${student.kelas} (NISN: ${student.nisn})`
            }))
        },
        {
            name: 'inventory_id',
            label: 'Pilih Barang',
            type: 'select',
            required: true,
            options: availableInventories.map(inventory => ({
                value: inventory.id,
                label: `${inventory.nama_barang} - ${inventory.kode_barang} (${inventory.kategori})`
            }))
        },
        {
            name: 'notes',
            label: 'Catatan (Opsional)',
            type: 'textarea',
            required: false,
            placeholder: 'Masukkan catatan peminjaman (opsional)',
            spanFull: true
        }
    ];

    const handleSubmit = (formData) => {
        router.post(route('borrowings.store'), formData, {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-white">Tambah Peminjaman Baru</h2>}
        >
            <Head title="Tambah Peminjaman Baru" />

            <GenericForm
                title="Tambah Peminjaman Baru"
                subtitle="Tambah data peminjaman barang baru"
                entity="Peminjaman"
                fields={borrowingFields}
                onSubmit={handleSubmit}
                processing={false}
                errors={serverErrors}
                submitButtonText="Tambah Peminjaman"
                cancelRoute={route('borrowings.index')}
                statusConfig={null} // Tidak perlu status toggle untuk peminjaman
            />
        </AuthenticatedLayout>
    );
}