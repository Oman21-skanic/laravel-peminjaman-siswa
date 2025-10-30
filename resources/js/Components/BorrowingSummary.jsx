import StatCard from './StatCard';

export default function BorrowingSummary({ borrowings }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StatCard
                title="Total Peminjaman"
                value={borrowings}
                className="text-center"
            />
            <StatCard
                title="Total Pengembalian"
                value={borrowings}
                className="text-center"
            />
        </div>
    );
}
