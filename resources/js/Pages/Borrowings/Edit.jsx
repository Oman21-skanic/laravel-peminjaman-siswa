import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";

export default function Edit({
    auth,
    borrowing,
    students,
    teachers,
    inventories,
    errors: serverErrors,
}) {
    const [selectedRole, setSelectedRole] = useState(
        borrowing.role || "student"
    );
    const [peminjamData, setPeminjamData] = useState(null);
    const [inventoryData, setInventoryData] = useState(null);
    const [showPeminjamModal, setShowPeminjamModal] = useState(false);
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [isReturned, setIsReturned] = useState(!!borrowing.returned_at);

    // Inisialisasi form data - TIDAK PERLU student_id/teacher_id karena sudah ada di peminjamData
    const { data, setData, put, processing, errors, reset } = useForm({
        role: borrowing.role || "student",
        inventory_id: borrowing.inventory_id || "",
        borrowed_at: borrowing.borrowed_at
            ? new Date(borrowing.borrowed_at).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
        returned_at: borrowing.returned_at
            ? new Date(borrowing.returned_at).toISOString().slice(0, 16)
            : "",
        notes: borrowing.notes || "",
    });

    // Filter inventories yang available + inventory yang sedang dipinjam
    const availableInventories =
        inventories?.filter(
            (inv) =>
                inv.status === "available" || inv.id === borrowing.inventory_id
        ) || [];

    // Set data peminjam dan inventory saat component mount
    useEffect(() => {
        // Set peminjam data berdasarkan role dari data yang sudah ada
        if (borrowing.role === "student" && borrowing.student) {
            setPeminjamData(borrowing.student);
            setSelectedRole("student");
        } else if (borrowing.role === "teacher" && borrowing.teacher) {
            setPeminjamData(borrowing.teacher);
            setSelectedRole("teacher");
        }

        // Set inventory data
        if (borrowing.inventory) {
            setInventoryData(borrowing.inventory);
        }
    }, [borrowing]);

    // Handle status pengembalian
    const handleReturnToggle = () => {
        const newReturnStatus = !isReturned;
        setIsReturned(newReturnStatus);

        if (newReturnStatus) {
            // Jika dikembalikan, set returned_at ke waktu sekarang
            setData("returned_at", new Date().toISOString().slice(0, 16));
        } else {
            // Jika dibatalkan pengembalian, kosongkan returned_at
            setData("returned_at", "");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi sebelum submit
        if (!peminjamData) {
            alert("Harap pilih peminjam terlebih dahulu!");
            return;
        }

        if (!inventoryData) {
            alert("Harap pilih barang terlebih dahulu!");
            return;
        }

        // Siapkan data untuk dikirim - TIDAK PERLU kirim student_id/teacher_id
        const submitData = {
            ...data,
            role: selectedRole,
            // Tidak perlu kirim student_id/teacher_id karena backend akan handle berdasarkan peminjamData
        };

        put(route("borrowings.update", borrowing.id), submitData);
    };

    const clearPeminjam = () => {
        setPeminjamData(null);
    };

    const clearInventory = () => {
        setInventoryData(null);
        setData("inventory_id", "");
    };

    // Handle change peminjam dari modal
    const handlePeminjamSelect = (item) => {
        setPeminjamData(item);
        setSelectedRole(selectedRole); // Tetap pertahankan role yang dipilih
        setShowPeminjamModal(false);
    };

    // Handle change inventory dari modal
    const handleInventorySelect = (inventory) => {
        setInventoryData(inventory);
        setData("inventory_id", inventory.id);
        setShowInventoryModal(false);
    };

    const allErrors = { ...serverErrors, ...errors };

    const getStatusBadge = () => {
        if (isReturned) {
            return {
                color: "bg-green-500/20 text-green-400 border border-green-500/30",
                label: "Telah Dikembalikan",
                icon: "✅",
            };
        } else {
            return {
                color: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
                label: "Masih Dipinjam",
                icon: "📚",
            };
        }
    };

    const statusBadge = getStatusBadge();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Edit Data Peminjaman
                </h2>
            }
        >
            <Head title="Edit Data Peminjaman" />

            <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                            Edit Data Peminjaman
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Ubah informasi peminjaman dan kelola status
                            pengembalian
                        </p>
                    </div>
                    <a
                        href={route("borrowings.show", borrowing.id)}
                        className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-gray-500/30 hover:border-gray-500/50"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        <span className="hidden sm:block">Kembali</span>
                    </a>
                </header>

                {/* Status Section */}
                <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Status Peminjaman
                            </h3>
                            <div
                                className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 ${statusBadge.color}`}
                            >
                                <span>{statusBadge.icon}</span>
                                {statusBadge.label}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleReturnToggle}
                            className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border ${
                                isReturned
                                    ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border-yellow-500/30 hover:border-yellow-500/50"
                                    : "bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30 hover:border-green-500/50"
                            }`}
                        >
                            {isReturned ? (
                                <>
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                    Batalkan Pengembalian
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Tandai Sudah Dikembalikan
                                </>
                            )}
                        </button>
                    </div>
                </section>

                {/* Edit Form */}
                <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Jenis Peminjam - Read Only */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Jenis Peminjam *
                            </label>
                            <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white opacity-70">
                                {selectedRole === "student" ? "Siswa" : "Guru"}
                            </div>
                            <p className="text-gray-500 text-xs mt-1">
                                Jenis peminjam tidak dapat diubah
                            </p>
                        </div>

                        {/* Peminjam Info - Read Only */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Peminjam *
                            </label>

                            {peminjamData ? (
                                <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {peminjamData.profile_picture ? (
                                                <img
                                                    src={`/storage/${peminjamData.profile_picture}`}
                                                    alt="Profile"
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                                                    <span className="text-gray-400 text-sm">
                                                        {selectedRole ===
                                                        "student"
                                                            ? "👨‍🎓"
                                                            : "👨‍🏫"}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-white font-medium">
                                                    {peminjamData.nama_lengkap}
                                                </h4>
                                                <p className="text-gray-400 text-sm">
                                                    {selectedRole === "student"
                                                        ? `NISN: ${peminjamData.nisn} | Kelas: ${peminjamData.kelas}`
                                                        : `NIP: ${peminjamData.nip} | Jabatan: ${peminjamData.jabatan}`}
                                                </p>
                                                <p className="text-green-400 text-xs mt-1">
                                                    ✅ Data peminjam sudah
                                                    terisi
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPeminjamModal(true)
                                            }
                                            className="text-blue-400 hover:text-blue-300"
                                            disabled={processing}
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8 border-2 border-dashed border-gray-600/50 rounded-xl">
                                    <p className="text-gray-400 mb-4">
                                        Belum ada peminjam yang dipilih
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPeminjamModal(true)
                                        }
                                        className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-green-500/30 hover:border-green-500/50 mx-auto"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Ganti Peminjam
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Inventory Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Barang yang Dipinjam *
                            </label>

                            {inventoryData ? (
                                <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {inventoryData.foto_barang ? (
                                                <img
                                                    src={`/storage/${inventoryData.foto_barang}`}
                                                    alt="Barang"
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                                                    <span className="text-gray-400 text-sm">
                                                        📦
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-white font-medium">
                                                    {inventoryData.nama_barang}
                                                </h4>
                                                <p className="text-gray-400 text-sm">
                                                    Kode:{" "}
                                                    {inventoryData.kode_barang}{" "}
                                                    | Kategori:{" "}
                                                    {inventoryData.kategori}
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    Lokasi:{" "}
                                                    {
                                                        inventoryData.lokasi_barang
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowInventoryModal(true)
                                            }
                                            className="text-blue-400 hover:text-blue-300"
                                            disabled={processing}
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8 border-2 border-dashed border-gray-600/50 rounded-xl">
                                    <p className="text-gray-400 mb-4">
                                        Belum ada barang yang dipilih
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowInventoryModal(true)
                                        }
                                        className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-green-500/30 hover:border-green-500/50 mx-auto"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                            />
                                        </svg>
                                        Ganti Barang
                                    </button>
                                </div>
                            )}
                            {allErrors.inventory_id && (
                                <p className="text-red-400 text-xs mt-2">
                                    {allErrors.inventory_id}
                                </p>
                            )}
                        </div>

                        {/* Tanggal dan Waktu */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Tanggal dan Waktu Pinjam *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.borrowed_at}
                                    onChange={(e) =>
                                        setData("borrowed_at", e.target.value)
                                    }
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white"
                                    disabled={processing}
                                />
                                {allErrors.borrowed_at && (
                                    <p className="text-red-400 text-xs mt-2">
                                        {allErrors.borrowed_at}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Tanggal dan Waktu Kembali
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.returned_at}
                                    onChange={(e) =>
                                        setData("returned_at", e.target.value)
                                    }
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white"
                                    disabled={processing || isReturned}
                                />
                                {allErrors.returned_at && (
                                    <p className="text-red-400 text-xs mt-2">
                                        {allErrors.returned_at}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Keterangan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Keterangan
                            </label>
                            <textarea
                                rows={4}
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                placeholder="Masukkan keterangan peminjaman (opsional)"
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white resize-none"
                                disabled={processing}
                            />
                            {allErrors.notes && (
                                <p className="text-red-400 text-xs mt-2">
                                    {allErrors.notes}
                                </p>
                            )}
                        </div>

                        {/* Error Summary */}
                        {Object.keys(allErrors).length > 0 && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-3 text-red-400 mb-3">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <h4 className="font-semibold">Perhatian</h4>
                                </div>
                                <ul className="text-red-400 text-sm space-y-1">
                                    {Object.entries(allErrors).map(
                                        ([field, error]) => (
                                            <li
                                                key={field}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                                {error}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-700/30">
                            <a
                                href={route("borrowings.show", borrowing.id)}
                                className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-gray-500/30 hover:border-gray-500/50"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                Batal
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                {processing
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>

            {/* Modal List Peminjam */}
            {showPeminjamModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-white">
                                    Ganti Peminjam (
                                    {selectedRole === "student"
                                        ? "Siswa"
                                        : "Guru"}
                                    )
                                </h3>
                                <button
                                    onClick={() => setShowPeminjamModal(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {(selectedRole === "student"
                                ? students
                                : teachers
                            ).map((item) => (
                                <div
                                    key={item.id}
                                    className="p-4 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                                    onClick={() => handlePeminjamSelect(item)}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.profile_picture ? (
                                            <img
                                                src={`/storage/${item.profile_picture}`}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                                                <span className="text-gray-400 text-xs">
                                                    {selectedRole === "student"
                                                        ? "👨‍🎓"
                                                        : "👨‍🏫"}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium">
                                                {item.nama_lengkap}
                                            </h4>
                                            <p className="text-gray-400 text-sm">
                                                {selectedRole === "student"
                                                    ? `NISN: ${item.nisn} | Kelas: ${item.kelas}`
                                                    : `NIP: ${item.nip} | Jabatan: ${item.jabatan}`}
                                            </p>
                                        </div>
                                        <div
                                            className={`px-2 py-1 rounded-full text-xs ${
                                                item.is_active
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-red-500/20 text-red-400"
                                            }`}
                                        >
                                            {item.is_active
                                                ? "Aktif"
                                                : "Tidak Aktif"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal List Inventory */}
            {showInventoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-white">
                                    Ganti Barang ({availableInventories.length})
                                </h3>
                                <button
                                    onClick={() => setShowInventoryModal(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {availableInventories.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">
                                    <div className="text-4xl mb-4">📦</div>
                                    <div className="text-lg font-medium mb-2">
                                        Tidak ada barang yang tersedia
                                    </div>
                                    <div className="text-sm">
                                        Semua barang sedang dipinjam atau dalam
                                        perbaikan
                                    </div>
                                </div>
                            ) : (
                                availableInventories.map((inventory) => (
                                    <div
                                        key={inventory.id}
                                        className="p-4 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                                        onClick={() =>
                                            handleInventorySelect(inventory)
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            {inventory.foto_barang ? (
                                                <img
                                                    src={`/storage/${inventory.foto_barang}`}
                                                    alt="Barang"
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                                                    <span className="text-gray-400">
                                                        📦
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="text-white font-medium">
                                                    {inventory.nama_barang}
                                                </h4>
                                                <p className="text-gray-400 text-sm">
                                                    Kode:{" "}
                                                    {inventory.kode_barang} |
                                                    Kategori:{" "}
                                                    {inventory.kategori}
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    Lokasi:{" "}
                                                    {inventory.lokasi_barang}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div
                                                    className={`text-sm font-medium ${
                                                        inventory.status ===
                                                        "available"
                                                            ? "text-green-400"
                                                            : "text-blue-400"
                                                    }`}
                                                >
                                                    {inventory.status ===
                                                    "available"
                                                        ? "Tersedia"
                                                        : "Dipinjam"}
                                                </div>
                                                <div className="text-gray-400 text-xs">
                                                    {inventory.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
