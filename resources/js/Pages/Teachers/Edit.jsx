import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GenericEditForm from "@/Components/Form/GenericEditForm";

export default function Edit({ auth, teacher, errors: serverErrors }) {
    const teacherFields = [
        {
            name: "nip",
            label: "NIP",
            type: "text",
            required: true,
            placeholder: "Masukkan NIP",
        },
        {
            name: "jabatan",
            label: "Jabatan",
            type: "select",
            required: true,
            options: [
                { value: "Guru Mata Pelajaran", label: "Guru Mata Pelajaran" },
                { value: "Wali Kelas", label: "Wali Kelas" },
                { value: "Kepala Sekolah", label: "Kepala Sekolah" },
                {
                    value: "Wakil Kepala Sekolah",
                    label: "Wakil Kepala Sekolah",
                },
                { value: "Guru BK", label: "Guru BK" },
                { value: "Guru Olahraga", label: "Guru Olahraga" },
                { value: "Guru Seni Budaya", label: "Guru Seni Budaya" },
                { value: "Guru Agama", label: "Guru Agama" },
                { value: "Guru Bahasa", label: "Guru Bahasa" },
                { value: "Guru Matematika", label: "Guru Matematika" },
                { value: "Guru IPA", label: "Guru IPA" },
                { value: "Guru IPS", label: "Guru IPS" },
            ],
        },
        {
            name: "nama_lengkap",
            label: "Nama Lengkap",
            type: "text",
            required: true,
            placeholder: "Masukkan nama lengkap",
            spanFull: true,
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            placeholder: "Masukkan email",
        },
        {
            name: "no_hp",
            label: "No HP",
            type: "tel",
            required: true,
            placeholder: "Masukkan nomor HP",
        },
        {
            name: "alamat",
            label: "Alamat Lengkap",
            type: "textarea",
            required: true,
            placeholder: "Masukkan alamat lengkap",
            spanFull: true,
        },
    ];

    const handleSubmit = (data) => {
        router.put(route("teachers.update", teacher.id), data, {
            forceFormData: data instanceof FormData,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Edit Guru
                </h2>
            }
        >
            <Head title={`Edit ${teacher.nama_lengkap}`} />

            <GenericEditForm
                title="Edit Guru"
                subtitle={`Ubah informasi guru ${teacher.nama_lengkap}`}
                entity="Guru"
                resource={teacher}
                resourceId={teacher.id}
                fields={teacherFields}
                onSubmit={handleSubmit}
                processing={false}
                errors={serverErrors}
                submitButtonText="Simpan Perubahan"
                cancelRoute={route("teachers.show", teacher.id)}
                statusConfig={{
                    activeLabel: "Guru Aktif",
                    inactiveLabel: "Guru Tidak Aktif",
                    activeDescription: "Guru dapat melakukan aktivitas",
                    inactiveDescription: "Guru tidak dapat melakukan aktivitas",
                }}
                updateRoute="teachers.update"
            />
        </AuthenticatedLayout>
    );
}
