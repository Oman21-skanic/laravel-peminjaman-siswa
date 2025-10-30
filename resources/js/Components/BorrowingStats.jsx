export default function BorrowingStats({ borrowings }) {
    const totalBorrowings = borrowings.total;
    const activeBorrowings = borrowings.data.filter(b => !b.returned_at).length;
    const returnedBorrowings = borrowings.data.filter(b => b.returned_at).length;

    return (
        <section className="mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Total Peminjaman */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                    {totalBorrowings}
                </div>
                <div className="text-sm sm:text-base text-gray-600">Total Peminjaman</div>
            </div>

            {/* Sedang Dipinjam */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                    {activeBorrowings}
                </div>
                <div className="text-sm sm:text-base text-gray-600">Sedang Dipinjam</div>
            </div>

            {/* Sudah Dikembalikan */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                    {returnedBorrowings}
                </div>
                <div className="text-sm sm:text-base text-gray-600">Sudah Dikembalikan</div>
            </div>
        </section>
    );
}
