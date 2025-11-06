import { useForm } from "@inertiajs/react";
import { useState } from "react";
import FormHeader from "./FormHeader";
import ProfileUpload from "./ProfileUpload";
import StatusToggle from "./StatusToggle";
import FormGrid from "./FormGrid";
import ErrorSummary from "./ErrorSummary";
import ActionButtons from "./ActionButtons";

export default function GenericEditForm({
    title,
    subtitle,
    entity,
    resource,
    resourceId,
    onSubmit,
    processing = false,
    errors = {},
    submitButtonText = "Simpan Perubahan",
    cancelRoute,
    fields = [],
    statusConfig = null,
    updateRoute,
}) {
    const [isActive, setIsActive] = useState(resource.is_active ?? true);

    const { data, setData } = useForm({
        ...Object.fromEntries(
            fields.map((field) => [field.name, resource[field.name] || ""])
        ),
        is_active: resource.is_active ?? true,
        profile_picture: null,
        foto_barang: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            ...data,
            is_active: isActive,
        };

        // Jika ada file, gunakan FormData
        if (data.profile_picture || data.foto_barang) {
            const formData = new FormData();

            // Append semua field
            Object.keys(submitData).forEach((key) => {
                if (submitData[key] !== null && submitData[key] !== undefined) {
                    formData.append(key, submitData[key]);
                }
            });

            onSubmit(formData);
        } else {
            // Jika tidak ada file, gunakan data biasa
            onSubmit(submitData);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (e.target.name === "profile_picture") {
                setData("profile_picture", file);
            } else {
                setData("foto_barang", file);
            }

            // Preview image
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById("profile-preview");
                if (preview) {
                    preview.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleStatus = () => {
        const newStatus = !isActive;
        setIsActive(newStatus);
        setData("is_active", newStatus);
    };

    const allErrors = errors;

    return (
        <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
            <FormHeader
                title={title}
                subtitle={subtitle}
                cancelRoute={cancelRoute}
                cancelText={`Kembali ke Detail ${entity}`}
            />

            {/* Form Section */}
            <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="space-y-8"
                >
                    {/* Profile Picture & Status Section */}
                    {statusConfig && (
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            <ProfileUpload
                                onFileChange={handleFileChange}
                                error={
                                    allErrors.profile_picture ||
                                    allErrors.foto_barang
                                }
                                currentImage={
                                    resource.profile_picture ||
                                    resource.foto_barang
                                }
                                mode="edit"
                            />

                            <StatusToggle
                                isActive={isActive}
                                onToggle={toggleStatus}
                                activeLabel={statusConfig.activeLabel}
                                inactiveLabel={statusConfig.inactiveLabel}
                                activeDescription={
                                    statusConfig.activeDescription
                                }
                                inactiveDescription={
                                    statusConfig.inactiveDescription
                                }
                            />
                        </div>
                    )}

                    {/* Jika tidak ada statusConfig, tampilkan upload foto saja */}
                    {!statusConfig && (
                        <div className="flex justify-center">
                            <ProfileUpload
                                onFileChange={handleFileChange}
                                error={
                                    allErrors.profile_picture ||
                                    allErrors.foto_barang
                                }
                                currentImage={
                                    resource.profile_picture ||
                                    resource.foto_barang
                                }
                                mode="edit"
                            />
                        </div>
                    )}

                    <FormGrid
                        fields={fields}
                        data={data}
                        setData={setData}
                        errors={allErrors}
                    />

                    <ErrorSummary errors={allErrors} />

                    <ActionButtons
                        cancelRoute={cancelRoute}
                        processing={processing}
                        submitButtonText={submitButtonText}
                        cancelText="Batal"
                    />
                </form>
            </section>
        </div>
    );
}
