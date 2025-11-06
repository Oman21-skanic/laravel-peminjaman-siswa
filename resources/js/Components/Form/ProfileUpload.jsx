export default function ProfileUpload({
    onFileChange,
    error,
    currentImage,
    mode = "create",
}) {
    return (
        <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-4">
                {mode === "edit" ? "Ubah Foto Profil" : "Foto Profil"}{" "}
                (Opsional)
            </label>
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <img
                        id="profile-preview"
                        src={
                            currentImage
                                ? `/storage/${currentImage}`
                                : "/images/default-avatar.png"
                        }
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-600 bg-gray-700"
                    />
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-gray-800">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>
                </div>
                <input
                    type="file"
                    name="profile_picture"
                    accept="image/*"
                    onChange={onFileChange}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30 cursor-pointer bg-gray-700/50 rounded-lg"
                />
                {mode === "edit" && (
                    <p className="text-xs text-gray-400 text-center">
                        Kosongkan jika tidak ingin mengubah foto
                    </p>
                )}
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>
        </div>
    );
}
