import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GenericShowLayout from "@/Components/Show/GenericShowLayout";

export default function Show({ auth, teacher }) {
    const mainFields = [
        { name: "nip", label: "NIP", type: "mono" },
        { name: "jabatan", label: "Jabatan" },
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
                    Detail Guru
                </h2>
            }
        >
            <Head title={`Detail ${teacher.nama_lengkap}`} />

            <GenericShowLayout
                title="Detail Guru"
                subtitle="Informasi lengkap tentang guru"
                entity="Guru"
                resource={teacher}
                backRoute={route("teachers.index")}
                editRoute={route("teachers.edit", teacher.id)}
                profileConfig={{
                    fallbackIcon: "👨‍🏫",
                    imageAlt: "Foto Profil Guru",
                }}
                mainFields={mainFields}
                additionalFields={additionalFields}
            />
        </AuthenticatedLayout>
    );
}
