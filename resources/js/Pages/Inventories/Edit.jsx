import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GenericEditForm from "@/Components/Form/GenericEditForm";

export default function Edit({ auth, inventory, errors: serverErrors }) {
    const kategoriOptions = [
        "Buku",
        "Alat Tulis",
        "Elektronik",
        "Furniture",
        "Alat Olahraga",
        "Alat Musik",
        "Alat Praktikum",
        "Lainnya",
    ];

    const inventoryFields = [
        {
            name: "kode_barang",
            label: "Kode Barang",
            type: "text",
            required: true,
            placeholder: "Masukkan kode barang",
        },
        {
            name: "nama_barang",
            label: "Nama Barang",
            type: "text",
            required: true,
            placeholder: "Masukkan nama barang",
            spanFull: true,
        },
        {
            name: "kategori",
            label: "Kategori",
            type: "select",
            required: true,
            options: kategoriOptions.map((kategori) => ({
                value: kategori,
                label: kategori,
            })),
        },
        {
            name: "lokasi_barang",
            label: "Lokasi Barang",
            type: "text",
            required: true,
            placeholder: "Masukkan lokasi barang",
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
                { value: "available", label: "Tersedia" },
                { value: "borrowed", label: "Dipinjam" },
                { value: "maintenance", label: "Perbaikan" },
            ],
        },
        {
            name: "deskripsi",
            label: "Deskripsi",
            type: "textarea",
            required: true,
            placeholder: "Masukkan deskripsi barang",
            spanFull: true,
        },
    ];

    const handleSubmit = (data) => {
        router.put(route("inventories.update", inventory.id), data, {
            forceFormData: data instanceof FormData,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Edit Barang
                </h2>
            }
        >
            <Head title={`Edit ${inventory.nama_barang}`} />

            <GenericEditForm
                title="Edit Barang"
                subtitle={`Ubah informasi barang ${inventory.nama_barang}`}
                entity="Barang"
                resource={inventory}
                resourceId={inventory.id}
                fields={inventoryFields}
                onSubmit={handleSubmit}
                processing={false}
                errors={serverErrors}
                submitButtonText="Simpan Perubahan"
                cancelRoute={route("inventories.show", inventory.id)}
                statusConfig={{
                    activeLabel: "Barang Aktif",
                    inactiveLabel: "Barang Tidak Aktif",
                    activeDescription: "Barang dapat dipinjam",
                    inactiveDescription: "Barang tidak dapat dipinjam",
                }}
                updateRoute="inventories.update"
            />
        </AuthenticatedLayout>
    );
}
