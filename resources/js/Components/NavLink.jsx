import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    // Function to determine icon color based on active state and index
    const getIconColor = (index) => {
        if (active) return "text-gray-200";

        const colors = [
            "text-blue-400/80 group-hover:text-blue-300",
            "text-green-400/80 group-hover:text-green-300",
            "text-amber-400/80 group-hover:text-amber-300",
            "text-purple-400/80 group-hover:text-purple-300",
            "text-rose-400/80 group-hover:text-rose-300",
        ];
        return colors[index] || "text-gray-500 group-hover:text-gray-300";
    };

    return (
        <Link
            {...props}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                active
                    ? "text-gray-200 bg-gray-800/50 border-gray-400"
                    : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
            } ${className}`}
        >
            {/* Icon with subtle color */}
            <div
                className={`transition-all duration-200 ${getIconColor(
                    props.index
                )}`}
            >
                {children[0]}
            </div>

            {/* Text */}
            <span className="text-sm font-medium flex-1">{children[1]}</span>

            {/* Active Indicator - Very Subtle */}
            {active && (
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full ml-2"></div>
            )}
        </Link>
    );
}
