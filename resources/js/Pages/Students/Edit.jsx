import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GenericEditForm from "@/Components/Form/GenericEditForm";

export default function Edit({ auth, student, errors: serverErrors }) {
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
                { value: "X-A", label: "X-A" },
                { value: "X-B", label: "X-B" },
                { value: "XI-A", label: "XI-A" },
                { value: "XI-B", label: "XI-B" },
                { value: "XII-A", label: "XII-A" },
                { value: "XII-B", label: "XII-B" },
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

    const handleSubmit = (data) => {
        router.put(route("students.update", student.id), data, {
            forceFormData: data instanceof FormData,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Edit Siswa
                </h2>
            }
        >
            <Head title={`Edit ${student.nama_lengkap}`} />

            <GenericEditForm
                title="Edit Siswa"
                subtitle={`Ubah informasi siswa ${student.nama_lengkap}`}
                entity="Siswa"
                resource={student}
                resourceId={student.id}
                fields={studentFields}
                onSubmit={handleSubmit}
                processing={false}
                errors={serverErrors}
                submitButtonText="Simpan Perubahan"
                cancelRoute={route("students.show", student.id)}
                statusConfig={{
                    activeLabel: "Siswa Aktif",
                    inactiveLabel: "Siswa Tidak Aktif",
                    activeDescription: "Siswa dapat melakukan peminjaman",
                    inactiveDescription:
                        "Siswa tidak dapat melakukan peminjaman",
                }}
                updateRoute="students.update"
            />
        </AuthenticatedLayout>
    );
}
