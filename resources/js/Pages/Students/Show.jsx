import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GenericShowLayout from "@/Components/Show/GenericShowLayout";

export default function Show({ auth, student }) {
    const mainFields = [
        { name: "nisn", label: "NISN", type: "mono" },
        { name: "kelas", label: "Kelas" },
        { name: "email", label: "Email" },
        { name: "no_hp", label: "No HP" },
        { name: "alamat", label: "Alamat Lengkap", spanFull: true },
    ];

    const additionalFields = [
        { name: "created_at", label: "Tanggal Dibuat", type: "date" },
        { name: "updated_at", label: "Terakhir Diupdate", type: "date" },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Detail Siswa
                </h2>
            }
        >
            <Head title={`Detail ${student.nama_lengkap}`} />

            <GenericShowLayout
                title="Detail Siswa"
                subtitle="Informasi lengkap tentang siswa"
                entity="Siswa"
                resource={student}
                backRoute={route("students.index")}
                editRoute={route("students.edit", student.id)}
                profileConfig={{
                    fallbackIcon: "👨‍🎓",
                    imageAlt: "Foto Profil Siswa",
                }}
                mainFields={mainFields}
                additionalFields={additionalFields}
            />
        </AuthenticatedLayout>
    );
}
