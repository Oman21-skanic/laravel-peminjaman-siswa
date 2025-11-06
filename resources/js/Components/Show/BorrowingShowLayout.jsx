import ShowHeader from './ShowHeader';
import ShowActions from './ShowActions';
import DetailCard from './DetailCard';

export default function BorrowingShowLayout({
    title,
    subtitle,
    resource,
    backRoute,
    editRoute,
    entity = "Peminjaman"
}) {
    const getStatusBadge = (status, returnedAt) => {
        if (returnedAt) {
            return { color: 'bg-green-500/20 text-green-400 border border-green-500/30', label: 'Dikembalikan' };
        }
        
        const statusConfig = {
            'borrowed': { color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', label: 'Dipinjam' },
            'returned': { color: 'bg-green-500/20 text-green-400 border border-green-500/30', label: 'Dikembalikan' },
            'overdue': { color: 'bg-red-500/20 text-red-400 border border-red-500/30', label: 'Terlambat' }
        };
        return statusConfig[status] || { color: 'bg-gray-500/20 text-gray-400 border border-gray-500/30', label: status };
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDaysBorrowed = (borrowedAt, returnedAt) => {
        const borrowed = new Date(borrowedAt);
        const returned = returnedAt ? new Date(returnedAt) : new Date();
        const diffTime = Math.abs(returned - borrowed);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const statusBadge = getStatusBadge(resource.status, resource.returned_at);
    const daysBorrowed = getDaysBorrowed(resource.borrowed_at, resource.returned_at);

    return (
        <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
            <ShowHeader
                title={title}
                subtitle={subtitle}
                backRoute={backRoute}
                editRoute={editRoute}
                backText={`Kembali ke Daftar ${entity}`}
                editText={`Edit ${entity}`}
            />

            {/* Borrowing Details */}
            <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Student Information */}
                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-6 pb-3 border-b border-gray-700/50">
                            Informasi Siswa
                        </h3>
                        
                        <div className="flex items-center gap-4 mb-6">
                            {resource.student.profile_picture ? (
                                <img 
                                    src={`/storage/${resource.student.profile_picture}`} 
                                    alt="Profile" 
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
                                    <span className="text-gray-400 text-sm">👨‍🎓</span>
                                </div>
                            )}
                            <div>
                                <h4 className="text-xl font-bold text-white">{resource.student.nama_lengkap}</h4>
                                <p className="text-gray-400">NISN: {resource.student.nisn}</p>
                                <p className="text-gray-400">Kelas: {resource.student.kelas}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <DetailCard
                                label="Email"
                                value={resource.student.email}
                            />
                            <DetailCard
                                label="No HP"
                                value={resource.student.no_hp}
                            />
                        </div>
                    </div>

                    {/* Inventory Information */}
                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-6 pb-3 border-b border-gray-700/50">
                            Informasi Barang
                        </h3>
                        
                        <div className="space-y-4">
                            <DetailCard
                                label="Nama Barang"
                                value={resource.inventory.nama_barang}
                            />
                            <DetailCard
                                label="Kode Barang"
                                value={resource.inventory.kode_barang}
                                type="mono"
                            />
                            <DetailCard
                                label="Kategori"
                                value={resource.inventory.kategori}
                            />
                            <DetailCard
                                label="Lokasi"
                                value={resource.inventory.lokasi_barang}
                            />
                        </div>
                    </div>
                </div>

                {/* Borrowing Information */}
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">
                        Informasi Peminjaman
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DetailCard
                            label="Tanggal Pinjam"
                            value={formatDate(resource.borrowed_at)}
                        />
                        
                        <DetailCard
                            label="Tanggal Kembali"
                            value={formatDate(resource.returned_at) || 'Belum dikembalikan'}
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Lama Pinjam</label>
                            <div className="text-white bg-gray-700/50 p-3 rounded-xl border border-gray-600/50">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    daysBorrowed > 7 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                }`}>
                                    {daysBorrowed} hari
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Status</label>
                            <div className="text-white bg-gray-700/50 p-3 rounded-xl border border-gray-600/50">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                                    {statusBadge.label}
                                </span>
                            </div>
                        </div>

                        <div className="sm:col-span-2 lg:col-span-4">
                            <DetailCard
                                label="Catatan"
                                value={resource.notes || 'Tidak ada catatan'}
                                spanFull={true}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <ShowActions
                backRoute={backRoute}
                editRoute={editRoute}
                backText={`Kembali ke Daftar ${entity}`}
                editText={`Edit ${entity}`}
            />
        </div>
    );
}