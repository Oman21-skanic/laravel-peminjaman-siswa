import DetailCard from "./DetailCard";

export default function DetailsGrid({
    fields = [],
    data,
    title = "Informasi Pribadi",
    sectionClass = "",
}) {
    return (
        <div className={sectionClass}>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-6 pb-3 border-b border-gray-700/50">
                {title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {fields.map((field, index) => (
                    <DetailCard
                        key={index}
                        label={field.label}
                        value={data[field.name]}
                        type={field.type}
                        spanFull={field.spanFull}
                    />
                ))}
            </div>
        </div>
    );
}
