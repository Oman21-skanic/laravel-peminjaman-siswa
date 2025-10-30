export default function ManagementCard({
    title,
    description,
    imageUrl,
    className = ""
}) {
    return (
        <div className={`group ${className}`}>
            <div
                className="w-full aspect-square bg-cover bg-center rounded-lg mb-4 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 shadow-md border border-gray-200"
                style={{ backgroundImage: `url("${imageUrl}")` }}
            ></div>
            <h3 className="text-lg font-medium text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}
