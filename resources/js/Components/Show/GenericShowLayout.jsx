import ShowHeader from "./ShowHeader";
import ProfileSection from "./ProfileSection";
import DetailsGrid from "./DetailsGrid";
import ShowActions from "./ShowActions";

export default function GenericShowLayout({
    title,
    subtitle,
    entity,
    resource,
    backRoute,
    editRoute,
    profileConfig = {},
    mainFields = [],
    additionalFields = [],
    additionalTitle = "Informasi Tambahan",
}) {
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

            {/* Main Content */}
            <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Section */}
                    <ProfileSection
                        image={resource.profile_picture || resource.foto_barang}
                        name={resource.nama_lengkap || resource.nama_barang}
                        identifier={
                            resource.nisn ||
                            resource.nip ||
                            resource.kode_barang
                        }
                        isActive={resource.is_active}
                        {...profileConfig}
                    />

                    {/* Details Section */}
                    <div className="lg:col-span-2">
                        <DetailsGrid
                            fields={mainFields}
                            data={resource}
                            title={`Informasi ${entity}`}
                        />

                        {/* Additional Info */}
                        {additionalFields.length > 0 && (
                            <DetailsGrid
                                fields={additionalFields}
                                data={resource}
                                title={additionalTitle}
                                sectionClass="mt-8 pt-6 border-t border-gray-700/50"
                            />
                        )}
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
