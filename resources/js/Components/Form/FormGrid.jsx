function FormField({ field, value, onChange, error, className = "" }) {
    const commonClasses = `w-full px-4 py-3 bg-gray-700/50 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 text-white ${
        error
            ? "border-red-500/50 focus:ring-red-500/50"
            : "border-gray-600/50 focus:ring-blue-500/50"
    }`;

    const renderField = () => {
        switch (field.type) {
            case "select":
                return (
                    <select
                        id={field.name}
                        name={field.name}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={commonClasses}
                    >
                        <option value="" className="bg-gray-800 text-gray-400">
                            {field.placeholder || `Pilih ${field.label}`}
                        </option>
                        {field.options?.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="bg-gray-800 text-white"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case "textarea":
                return (
                    <textarea
                        id={field.name}
                        name={field.name}
                        rows={4}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={`${commonClasses} resize-none`}
                        placeholder={field.placeholder}
                    />
                );

            default:
                return (
                    <input
                        type={field.type || "text"}
                        id={field.name}
                        name={field.name}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={commonClasses}
                        placeholder={field.placeholder}
                    />
                );
        }
    };

    return (
        <div className={className}>
            <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-400 mb-2"
            >
                {field.label} {field.required && "*"}
            </label>
            {renderField()}
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
    );
}

export default function FormGrid({ fields, data, setData, errors }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fields.map((field) => (
                <FormField
                    key={field.name}
                    field={field}
                    value={data[field.name]}
                    onChange={(value) => setData(field.name, value)}
                    error={errors[field.name]}
                    className={field.spanFull ? "lg:col-span-2" : ""}
                />
            ))}
        </div>
    );
}
