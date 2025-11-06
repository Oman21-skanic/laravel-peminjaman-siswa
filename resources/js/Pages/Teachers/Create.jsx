import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GenericForm from "@/Components/Form/GenericForm";

export default function Create({ auth, errors: serverErrors }) {
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

    const handleSubmit = (formData) => {
        router.post(route("teachers.store"), formData, {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tambah Guru Baru
                </h2>
            }
        >
            <Head title="Tambah Guru Baru" />

            <GenericForm
                title="Tambah Guru Baru"
                subtitle="Tambahkan data guru baru ke sistem"
                entity="Guru"
                fields={teacherFields}
                onSubmit={handleSubmit}
                processing={false}
                errors={serverErrors}
                submitButtonText="Tambah Guru"
                cancelRoute={route("teachers.index")}
                statusConfig={{
                    activeLabel: "Guru Aktif",
                    inactiveLabel: "Guru Tidak Aktif",
                    activeDescription: "Guru akan aktif dalam sistem",
                    inactiveDescription: "Guru akan tidak aktif dalam sistem",
                }}
            />
        </AuthenticatedLayout>
    );
}
