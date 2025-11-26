import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";

export default function Create({
    auth,
    students,
    teachers,
    inventories,
    errors: serverErrors,
}) {
    const [selectedRole, setSelectedRole] = useState("student");
    const [peminjamId, setPeminjamId] = useState("");
    const [inventoryId, setInventoryId] = useState("");
    const [peminjamData, setPeminjamData] = useState(null);
    const [inventoryData, setInventoryData] = useState(null);
    const [showPeminjamModal, setShowPeminjamModal] = useState(false);
    const [showInventoryModal, setShowInventoryModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        role: "student",
        student_id: "",
        teacher_id: "",
        inventory_id: "",
        borrowed_at: new Date().toISOString().slice(0, 16),
        returned_at: "",
        notes: "",
    });

    // PERBAIKAN: Gunakan filter yang benar - is_active === true
    const availableInventories =
        inventories?.filter(
            (inv) => inv.status === "available" && inv.is_active === true
        ) || [];

    console.log("Available inventories:", availableInventories);
    console.log("Available count:", availableInventories.length);

    // Cek data peminjam berdasarkan ID
    const checkPeminjam = () => {
        if (!peminjamId.trim()) {
            alert("Harap masukkan ID peminjam!");
            return;
        }

        if (selectedRole === "student") {
            const student = students.find(
                (s) => s.nisn === peminjamId || s.id == peminjamId
            );
            if (student) {
                setPeminjamData(student);
                setData("student_id", student.id);
                setData("teacher_id", ""); // Clear teacher_id
                setShowPeminjamModal(false);
            } else {
                alert("Siswa tidak ditemukan!");
            }
        } else {
            const teacher = teachers.find(
                (t) => t.nip === peminjamId || t.id == peminjamId
            );
            if (teacher) {
                setPeminjamData(teacher);
                setData("teacher_id", teacher.id);
                setData("student_id", ""); // Clear student_id
                setShowPeminjamModal(false);
            } else {
                alert("Guru tidak ditemukan!");
            }
        }
    };

    // Cek data inventory berdasarkan ID
    const checkInventory = () => {
        if (!inventoryId.trim()) {
            alert("Harap masukkan ID barang!");
            return;
        }

        const inventory = availableInventories.find(
            (inv) => inv.kode_barang === inventoryId || inv.id == inventoryId
        );

        if (inventory) {
            setInventoryData(inventory);
            setData("inventory_id", inventory.id);
            setShowInventoryModal(false);
        } else {
            alert("Barang tidak ditemukan atau tidak tersedia!");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Debug: Lihat data yang akan dikirim
        console.log("=== DATA YANG AKAN DIKIRIM ===");
        console.log("Role:", selectedRole);
        console.log("Student ID:", data.student_id);
        console.log("Teacher ID:", data.teacher_id);
        console.log("Inventory ID:", data.inventory_id);
        console.log("Peminjam Data:", peminjamData);
        console.log("Inventory Data:", inventoryData);

        // Validasi sebelum submit
        if (!peminjamData) {
            alert("Harap pilih peminjam terlebih dahulu!");
            return;
        }

        if (!inventoryData) {
            alert("Harap pilih barang terlebih dahulu!");
            return;
        }

        post(route("borrowings.store"));
    };

    const clearPeminjam = () => {
        setPeminjamData(null);
        setPeminjamId("");
        setData(selectedRole === "student" ? "student_id" : "teacher_id", "");
    };

    const clearInventory = () => {
        setInventoryData(null);
        setInventoryId("");
        setData("inventory_id", "");
    };

    // Reset peminjam data ketika role berubah
    useEffect(() => {
        setPeminjamData(null);
        setPeminjamId("");
        setData("student_id", "");
        setData("teacher_id", "");
        setData("role", selectedRole);

        // Clear errors juga
        if (errors.student_id) errors.student_id = null;
        if (errors.teacher_id) errors.teacher_id = null;
    }, [selectedRole]);

    const allErrors = { ...serverErrors, ...errors };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Tambah Peminjaman Baru
                </h2>
            }
        >
            <Head title="Tambah Peminjaman Baru" />

            <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                            Tambah Peminjaman Baru
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Tambah data peminjaman barang baru
                        </p>
                    </div>
                    <a
                        href={route("borrowings.index")}
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

                {/* Create Form */}
                <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Jenis Peminjam */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Jenis Peminjam *
                            </label>
                            <select
                                value={selectedRole}
                                onChange={(e) =>
                                    setSelectedRole(e.target.value)
                                }
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white"
                            >
                                <option
                                    value="student"
                                    className="bg-gray-800 text-white"
                                >
                                    Siswa
                                </option>
                                <option
                                    value="teacher"
                                    className="bg-gray-800 text-white"
                                >
                                    Guru
                                </option>
                            </select>
                        </div>

                        {/* ID Peminjam */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                ID Peminjam *
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={peminjamId}
                                    onChange={(e) =>
                                        setPeminjamId(e.target.value)
                                    }
                                    placeholder={`Masukkan ${
                                        selectedRole === "student"
                                            ? "NISN"
                                            : "NIP"
                                    } atau ID`}
                                    className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white"
                                />
                                <button
                                    type="button"
                                    onClick={checkPeminjam}
                                    className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
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
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    Cek ID
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPeminjamModal(true)}
                                    className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-green-500/30 hover:border-green-500/50"
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
                                    List
                                </button>
                            </div>
                            {allErrors.student_id && (
                                <p className="text-red-400 text-xs mt-2">
                                    {allErrors.student_id}
                                </p>
                            )}
                            {allErrors.teacher_id && (
                                <p className="text-red-400 text-xs mt-2">
                                    {allErrors.teacher_id}
                                </p>
                            )}

                            {/* Peminjam Info */}
                            {peminjamData && (
                                <div className="mt-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
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
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={clearPeminjam}
                                            className="text-red-400 hover:text-red-300"
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
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Barang yang Dipinjam */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Barang yang Dipinjam *
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={inventoryId}
                                    onChange={(e) =>
                                        setInventoryId(e.target.value)
                                    }
                                    placeholder="Masukkan Kode Barang atau ID"
                                    className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white"
                                />
                                <button
                                    type="button"
                                    onClick={checkInventory}
                                    className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
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
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    Cek ID
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowInventoryModal(true)}
                                    className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-green-500/30 hover:border-green-500/50"
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
                                    List
                                </button>
                            </div>
                            {allErrors.inventory_id && (
                                <p className="text-red-400 text-xs mt-2">
                                    {allErrors.inventory_id}
                                </p>
                            )}

                            {/* Inventory Info */}
                            {inventoryData && (
                                <div className="mt-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
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
                                            onClick={clearInventory}
                                            className="text-red-400 hover:text-red-300"
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
                                        </button>
                                    </div>
                                </div>
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
                                href={route("borrowings.index")}
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
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                {processing
                                    ? "Menyimpan..."
                                    : "Tambah Peminjaman"}
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
                                    Daftar{" "}
                                    {selectedRole === "student"
                                        ? "Siswa"
                                        : "Guru"}
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
                                    onClick={() => {
                                        setPeminjamId(
                                            selectedRole === "student"
                                                ? item.nisn
                                                : item.nip
                                        );
                                        setPeminjamData(item);
                                        setData(
                                            selectedRole === "student"
                                                ? "student_id"
                                                : "teacher_id",
                                            item.id
                                        );
                                        setShowPeminjamModal(false);
                                    }}
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
                                    Daftar Barang Tersedia (
                                    {availableInventories.length})
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
                                        onClick={() => {
                                            setInventoryId(
                                                inventory.kode_barang
                                            );
                                            setInventoryData(inventory);
                                            setData(
                                                "inventory_id",
                                                inventory.id
                                            );
                                            setShowInventoryModal(false);
                                        }}
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
                                                <div className="text-green-400 text-sm font-medium">
                                                    Tersedia
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
