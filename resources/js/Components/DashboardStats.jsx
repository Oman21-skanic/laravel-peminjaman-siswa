import StatCard from './StatCard';

export default function DashboardStats({ students, teachers, inventories, borrowings }) {
    const stats = [
        {
            title: "Siswa",
            value: students,
            link: route('students.index')
        },
        {
            title: "Guru",
            value: teachers,
            link: route('teachers.index')
        },
        {
            title: "Inventaris",
            value: inventories,
            link: route('inventories.index')
        },
        {
            title: "Peminjaman",
            value: borrowings,
            link: route('borrowings.index')
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    link={stat.link}
                />
            ))}
        </div>
    );
}
