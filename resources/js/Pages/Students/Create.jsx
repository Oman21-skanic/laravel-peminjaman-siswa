import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GenericForm from "@/Components/Form/GenericForm";

export default function Create({ auth, errors: serverErrors }) {
    const studentFields = [
        {
            name: "nisn",
            label: "NISN",
            type: "text",
            required: true,
            placeholder: "Masukkan NISN",
        },
        {
            name: "kelas",
            label: "Kelas",
            type: "select",
            required: true,
            options: [
                { value: "X-PPLG-1", label: "X-PPLG-1" },
                { value: "X-PPLG-2", label: "X-PPLG-2" },
                { value: "X-PPLG-3", label: "X-PPLG-3" },
                { value: "XI-PPLG-1", label: "XI-PPLG-1" },
                { value: "XI-PPLG-3", label: "XI-PPLG-2" },
                { value: "XI-PPLG-3", label: "XI-PPLG-3" },
            ],
        },
        {
            name: "nama_lengkap",
            label: "Nama Lengkap",
            type: "text",
            required: true,
            placeholder: "Masukkan nama lengkap siswa",
            spanFull: true,
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            placeholder: "email@example.com",
        },
        {
            name: "no_hp",
            label: "No HP",
            type: "tel",
            required: true,
            placeholder: "08xxxxxxxxxx",
        },
        {
            name: "alamat",
            label: "Alamat Lengkap",
            type: "textarea",
            required: true,
            placeholder: "Masukkan alamat lengkap siswa",
            spanFull: true,
        },
    ];

    const handleSubmit = (formData) => {
        router.post(route("students.store"), formData, {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Tambah Siswa Baru
                </h2>
            }
        >
            <Head title="Tambah Siswa Baru" />

            <GenericForm
                title="Tambah Siswa Baru"
                subtitle="Tambahkan data siswa baru ke dalam sistem"
                entity="Siswa"
                fields={studentFields}
                onSubmit={handleSubmit}
                processing={false}
                errors={serverErrors}
                submitButtonText="Tambah Siswa"
                cancelRoute={route("students.index")}
                statusConfig={{
                    activeLabel: "Siswa Aktif",
                    inactiveLabel: "Siswa Tidak Aktif",
                    activeDescription: "Siswa dapat melakukan peminjaman",
                    inactiveDescription:
                        "Siswa tidak dapat melakukan peminjaman",
                }}
            />
        </AuthenticatedLayout>
    );
}
