import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DashboardHeader from '../../js/Components/DashboardHeader';
import Section from '../../js/Components/Section';
import BorrowingSummary from '../../js/Components/BorrowingSummary';
import DashboardStats from '../../js/Components/DashboardStats';
import ManagementGrid from '../../js/Components/ManagementGrid';

export default function Dashboard({ auth, students, teachers, inventories, borrowings }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="max-w-5xl mx-auto">
                <DashboardHeader title="Dashboard" />

                <BorrowingSummary borrowings={borrowings} />

                <Section title="Statistik Data">
                    <DashboardStats
                        students={students}
                        teachers={teachers}
                        inventories={inventories}
                        borrowings={borrowings}
                    />
                </Section>

                <Section title="Manajemen">
                    <ManagementGrid />
                </Section>
            </div>
        </AuthenticatedLayout>
    );
}
