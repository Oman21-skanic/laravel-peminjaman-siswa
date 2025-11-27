import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import FlashMessage from "@/Components/FlashMessage";
import PageHeader from "@/Components/PageHeader";

// Import Tab Components
import DashboardTab from "./Tabs/DashboardTab";
import BorrowingsTab from "./Tabs/BorrowingsTab";
import StudentsTab from "./Tabs/StudentsTab";
import TeachersTab from "./Tabs/TeachersTab";
import InventoryTab from "./Tabs/InventoryTab";

export default function ReportsIndex({
    auth,
    activeTab = 'dashboard',
    filters = {},
    // Data dari semua tabs
    stats = {},
    monthlyBorrowings = [],
    recentBorrowings = [],
    borrowings = [],
    borrowingsStats = {},
    students = [],
    studentsStats = {},
    classDistribution = [],
    teachers = [],
    teachersStats = {},
    inventory = [],
    inventoryStats = {},
    categoryDistribution = []
}) {
    const [localFilters, setLocalFilters] = useState({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        status: filters.status || '',
        role: filters.role || '',
        type: filters.type || ''
    });

    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: '📊' },
        { id: 'borrowings', name: 'Peminjaman', icon: '📋' },
        { id: 'students', name: 'Siswa', icon: '👨‍🎓' },
        { id: 'teachers', name: 'Guru', icon: '👨‍🏫' },
        { id: 'inventory', name: 'Inventory', icon: '📦' },
    ];

    const handleTabChange = (tabId) => {
        router.get(route('reports.index'), {
            tab: tabId,
            ...localFilters
        });
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);

        router.get(route('reports.index'), {
            tab: activeTab,
            ...newFilters
        }, {
            preserveState: true,
            replace: true
        });
    };

    const renderActiveTab = () => {
        const tabProps = {
            filters: localFilters,
            onFilterChange: handleFilterChange
        };

        switch (activeTab) {
            case 'dashboard':
                return <DashboardTab
                    {...tabProps}
                    stats={stats}
                    monthlyBorrowings={monthlyBorrowings}
                    recentBorrowings={recentBorrowings}
                />;
            case 'borrowings':
                return <BorrowingsTab
                    {...tabProps}
                    borrowings={borrowings}
                    stats={borrowingsStats}
                />;
            case 'students':
                return <StudentsTab
                    {...tabProps}
                    students={students}
                    stats={studentsStats}
                    classDistribution={classDistribution}
                />;
            case 'teachers':
                return <TeachersTab
                    {...tabProps}
                    teachers={teachers}
                    stats={teachersStats}
                />;
            case 'inventory':
                return <InventoryTab
                    {...tabProps}
                    inventory={inventory}
                    stats={inventoryStats}
                    categoryDistribution={categoryDistribution}
                />;
            default:
                return <DashboardTab {...tabProps} />;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Laporan & Analytics
                </h2>
            }
        >
            <Head title="Laporan & Analytics" />

            <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
                <FlashMessage />

                <PageHeader
                    title="Laporan & Analytics"
                    description="Analisis data lengkap sistem peminjaman"
                />

                {/* Tab Navigation */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="border-b border-gray-700/50">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                        }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {renderActiveTab()}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}