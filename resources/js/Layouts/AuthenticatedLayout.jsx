import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            ),
            current: route().current("dashboard"),
        },
        {
            name: "Siswa",
            href: route("students.index"),
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                </svg>
            ),
            current: route().current("students.index"),
        },
        {
            name: "Guru",
            href: route("teachers.index"),
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            ),
            current: route().current("teachers.index"),
        },
        {
            name: "Peminjaman",
            href: route("borrowings.index"),
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
            ),
            current: route().current("borrowings.index"),
        },
        {
            name: "Inventaris",
            href: route("inventories.index"),
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
            ),
            current: route().current("inventories.index"),
        },
        {
            name: "Laporan",
            href: route("reports.index"),
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                </svg>
            ),
            current: route().current("reports.*"), // Perhatikan .* untuk semua sub-route reports
        },
    ];

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside
                    className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-72 flex-shrink-0 bg-gray-900/95 p-6 flex flex-col
                    transform transition-all duration-300 ease-in-out
                    ${sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                        }
                    border-r border-gray-800/30
                `}
                >
                    {/* Logo with Color */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                                <svg
                                    className="w-5 h-5 text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 22s8-4 8-10V6l-2-1-6-2-6 2-2 1v6c0 6 8 10 8 10z M8 10h8v6c0 1.1-.9 2-2 2H10c-1.1 0-2-.9-2-2v-6z M8 10c0 1.5 1.79 3 4 3s4-1.5 4-3 M10.5 7.5h3v2h-3z M7.5 6L6.5 4h11l-1 2"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-200">
                                    Sewanic
                                </h1>
                                <p className="text-xs text-gray-500">
                                    Kontrol Peminjaman skanic
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation with Colored Icons */}
                    <nav className="space-y-1 flex-1">
                        {navigation.map((item, index) => (
                            <NavLink
                                key={item.name}
                                href={item.href}
                                active={item.current}
                                index={index}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 transition-all duration-200 group"
                            >
                                {item.icon}
                                <span className="text-sm font-medium">
                                    {item.name}
                                </span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className="pt-6 border-t border-gray-800/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                                <span className="text-xs font-medium text-blue-400">
                                    {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-200 truncate">
                                    {user.name}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                    Administrator
                                </div>
                            </div>
                        </div>

                        {/* Action Links with Colored Icons */}
                        <div className="space-y-1">
                            <ResponsiveNavLink
                                href={route("profile.edit")}
                                active={route().current("profile.edit")}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 transition-all duration-200 group"
                            >
                                <svg
                                    className="w-4 h-4 text-green-400/80 group-hover:text-green-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                Profile
                            </ResponsiveNavLink>

                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 transition-all duration-200 group w-full text-left"
                            >
                                <svg
                                    className="w-4 h-4 text-rose-400/80 group-hover:text-rose-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Simple Top Bar */}
                    <div className="h-16 border-b border-gray-800/30 bg-gray-900/50 flex items-center px-6 lg:px-8">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 transition-colors"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        <div className="ml-4 lg:ml-0">
                            <h1 className="text-lg font-medium text-gray-200">
                                {navigation.find((item) => item.current)
                                    ?.name || "Dashboard"}
                            </h1>
                        </div>

                        <div className="lg:hidden ml-auto">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                {user.name.split(" ")[0]}
                            </div>
                        </div>
                    </div>

                    {/* Page Content */}
                    <main className="flex-1 p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}
