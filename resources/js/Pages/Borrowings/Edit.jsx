import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GenericEditForm from "@/Components/Form/GenericEditForm";

export default function Edit({
    auth,
    borrowing,
    students,
    inventories,
    errors: serverErrors,
}) {
    // Filter inventories yang available
    const availableInventories = inventories.filter(
        (inv) => inv.status === "available" && inv.is_active === "available"
    );

    const borrowingFields = [
        {
            name: "student_id",
            label: "Pilih Siswa",
            type: "select",
            required: true,
            options: students.map((student) => ({
                value: student.id,
                label: `${student.nama_lengkap} - ${student.kelas} (NISN: ${student.nisn})`,
            })),
        },
        {
            name: "inventory_id",
            label: "Pilih Barang",
            type: "select",
            required: true,
            options: availableInventories.map((inventory) => ({
                value: inventory.id,
                label: `${inventory.nama_barang} - ${inventory.kode_barang} (${inventory.kategori})`,
            })),
        },
        {
            name: "notes",
            label: "Catatan (Opsional)",
            type: "textarea",
            required: false,
            placeholder: "Masukkan catatan peminjaman (opsional)",
            spanFull: true,
        },
    ];

    const handleSubmit = (data) => {
        router.put(route("borrowings.update", borrowing.id), data, {
            forceFormData: data instanceof FormData,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Edit Peminjaman
                </h2>
            }
        >
            <Head title="Edit Peminjaman" />

            <GenericEditForm
                title="Edit Peminjaman"
                subtitle="Ubah informasi peminjaman"
                entity="Peminjaman"
                resource={borrowing}
                resourceId={borrowing.id}
                fields={borrowingFields}
                onSubmit={handleSubmit}
                processing={false}
                errors={serverErrors}
                submitButtonText="Simpan Perubahan"
                cancelRoute={route("borrowings.show", borrowing.id)}
                statusConfig={null} // Tidak perlu status toggle untuk peminjaman
                updateRoute="borrowings.update"
            />
        </AuthenticatedLayout>
    );
}
