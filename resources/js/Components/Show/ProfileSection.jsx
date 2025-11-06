export default function ProfileSection({
    image,
    name,
    identifier,
    isActive,
    imageAlt = "Profile",
    fallbackIcon = "👨‍🎓",
}) {
    return (
        <div className="lg:col-span-1">
            <div className="text-center lg:text-left">
                <div className="relative inline-block">
                    {image ? (
                        <img
                            src={`/storage/${image}`}
                            alt={imageAlt}
                            className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-gray-600 shadow-lg mx-auto lg:mx-0"
                        />
                    ) : (
                        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600 shadow-lg mx-auto lg:mx-0">
                            <span className="text-gray-400 text-2xl">
                                {fallbackIcon}
                            </span>
                        </div>
                    )}
                    <div
                        className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-gray-800 ${
                            isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                    ></div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white mt-4">
                    {name}
                </h2>
                {identifier && (
                    <p className="text-gray-400 font-mono">{identifier}</p>
                )}

                <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mt-3 ${
                        isActive
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                >
                    <div
                        className={`w-2 h-2 rounded-full ${
                            isActive ? "bg-green-400" : "bg-red-400"
                        }`}
                    ></div>
                    {isActive ? "Aktif" : "Tidak Aktif"}
                </div>
            </div>
        </div>
    );
}
