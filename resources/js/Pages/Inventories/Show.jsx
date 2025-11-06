import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GenericShowLayout from '@/Components/Show/GenericShowLayout';

export default function Show({ auth, inventory }) {
    const mainFields = [
        { name: 'kode_barang', label: 'Kode Barang', type: 'mono' },
        { name: 'kategori', label: 'Kategori' },
        { name: 'status', label: 'Status' },
        { name: 'lokasi_barang', label: 'Lokasi Barang' },
        { name: 'deskripsi', label: 'Deskripsi', spanFull: true },
    ];

    const additionalFields = [
        { name: 'created_at', label: 'Tanggal Dibuat', type: 'date' },
        { name: 'updated_at', label: 'Terakhir Diupdate', type: 'date' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-white">Detail Barang</h2>}
        >
            <Head title={`Detail ${inventory.nama_barang}`} />

            <GenericShowLayout
                title="Detail Barang"
                subtitle="Informasi lengkap tentang barang"
                entity="Barang"
                resource={inventory}
                backRoute={route('inventories.index')}
                editRoute={route('inventories.edit', inventory.id)}
                profileConfig={{
                    fallbackIcon: '📦',
                    imageAlt: 'Foto Barang'
                }}
                mainFields={mainFields}
                additionalFields={additionalFields}
            />
        </AuthenticatedLayout>
    );
}