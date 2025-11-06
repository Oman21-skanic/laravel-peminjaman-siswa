import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GenericForm from "@/Components/Form/GenericForm";

export default function Create({ auth, errors: serverErrors }) {
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

    const handleSubmit = (formData) => {
        router.post(route("inventories.store"), formData, {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Tambah Barang Baru
                </h2>
            }
        >
            <Head title="Tambah Barang Baru" />

            <GenericForm
                title="Tambah Barang Baru"
                subtitle="Tambahkan data barang baru ke inventaris"
                entity="Barang"
                fields={inventoryFields}
                onSubmit={handleSubmit}
                processing={false}
                errors={serverErrors}
                submitButtonText="Tambah Barang"
                cancelRoute={route("inventories.index")}
                statusConfig={{
                    activeLabel: "Barang Aktif",
                    inactiveLabel: "Barang Tidak Aktif",
                    activeDescription: "Barang dapat dipinjam",
                    inactiveDescription: "Barang tidak dapat dipinjam",
                }}
            />
        </AuthenticatedLayout>
    );
}
