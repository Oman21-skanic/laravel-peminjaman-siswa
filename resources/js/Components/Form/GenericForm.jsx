import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import FormHeader from "./FormHeader";
import ProfileUpload from "./ProfileUpload";
import StatusToggle from "./StatusToggle";
import FormGrid from "./FormGrid";
import ErrorSummary from "./ErrorSummary";
import ActionButtons from "./ActionButtons";

export default function GenericForm({
    title,
    subtitle,
    entity,
    initialData = {},
    onSubmit,
    processing = false,
    errors = {},
    submitButtonText = "Simpan",
    cancelRoute,
    mode = "create",
    fields = [],
    statusConfig = null,
}) {
    const [isActive, setIsActive] = useState(initialData.is_active ?? true);

    const { data, setData } = useForm({
        // Set default values untuk semua field
        ...Object.fromEntries(
            fields.map((field) => [field.name, initialData[field.name] || ""])
        ),
        is_active: initialData.is_active ?? true,
        profile_picture: null,
        foto_barang: null,
    });

    // Effect untuk update data ketika initialData berubah
    useEffect(() => {
        if (mode === "edit") {
            fields.forEach((field) => {
                if (initialData[field.name] !== undefined) {
                    setData(field.name, initialData[field.name] || "");
                }
            });
            setIsActive(initialData.is_active ?? true);
            setData("is_active", initialData.is_active ?? true);
        }
    }, [initialData, mode, fields]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form data before submit:", data); // Debug

        const formData = new FormData();

        // Append all fields dynamically
        fields.forEach((field) => {
            const value = data[field.name];
            if (value !== undefined && value !== null && value !== "") {
                formData.append(field.name, value);
            }
        });

        // Append status jika ada statusConfig
        if (statusConfig) {
            formData.append("is_active", isActive ? 1 : 0);
        }

        // Append profile picture jika ada
        if (data.profile_picture) {
            formData.append("profile_picture", data.profile_picture);
        }

        // Append foto barang jika ada (untuk inventory)
        if (data.foto_barang) {
            formData.append("foto_barang", data.foto_barang);
        }

        console.log("FormData entries:"); // Debug
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        onSubmit(formData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Cek apakah ini profile_picture atau foto_barang
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
                    {/* Profile Picture & Status Section - hanya tampil jika ada statusConfig */}
                    {statusConfig && (
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            <ProfileUpload
                                onFileChange={handleFileChange}
                                error={
                                    allErrors.profile_picture ||
                                    allErrors.foto_barang
                                }
                                currentImage={
                                    initialData.profile_picture ||
                                    initialData.foto_barang
                                }
                                mode={mode}
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
                                    initialData.profile_picture ||
                                    initialData.foto_barang
                                }
                                mode={mode}
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
