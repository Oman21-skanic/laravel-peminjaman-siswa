import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BorrowingShowLayout from "@/Components/Show/BorrowingShowLayout";

export default function Show({ auth, borrowing }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Detail Peminjaman
                </h2>
            }
        >
            <Head
                title={`Detail Peminjaman - ${borrowing.student.nama_lengkap}`}
            />

            <BorrowingShowLayout
                title="Detail Peminjaman"
                subtitle="Informasi lengkap tentang peminjaman barang"
                resource={borrowing}
                backRoute={route("borrowings.index")}
                editRoute={route("borrowings.edit", borrowing.id)}
                entity="Peminjaman"
            />
        </AuthenticatedLayout>
    );
}
