export default function DetailCard({
    label,
    value,
    type = "text",
    spanFull = false,
    children,
}) {
    const getValueDisplay = () => {
        if (children) return children;

        if (!value) return <span className="text-gray-400">-</span>;

        if (type === "date" && value) {
            return new Date(value).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }

        return value;
    };

    const getClassName = () => {
        const baseClasses =
            "text-white bg-gray-700/50 p-3 rounded-xl border border-gray-600/50";
        const additionalClasses = type === "mono" ? "font-mono" : "";
        const spanClass = spanFull ? "min-h-[100px]" : "";

        return `${baseClasses} ${additionalClasses} ${spanClass}`;
    };

    return (
        <div className={`space-y-2 ${spanFull ? "sm:col-span-2" : ""}`}>
            <label className="text-sm font-medium text-gray-400">{label}</label>
            <div className={getClassName()}>{getValueDisplay()}</div>
        </div>
    );
}
