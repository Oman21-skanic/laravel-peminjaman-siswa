import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ' +
                (active
                    ? 'text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-200 transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/80') +
                ' ' +
                className
            }
        >
            {/* Active Indicator */}
            {active && (
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-full shadow-sm"></div>
            )}

            {/* Icon Container */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                active
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
            }`}>
                {children[0]}
            </div>

            {/* Text */}
            <span className={`font-medium transition-all duration-300 ${
                active ? 'text-white' : 'group-hover:text-gray-800'
            }`}>
                {children[1]}
            </span>

            {/* Hover Effect */}
            {!active && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
        </Link>
    );
}
