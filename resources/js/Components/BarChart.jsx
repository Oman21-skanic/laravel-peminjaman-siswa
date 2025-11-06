import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function BarChart({
    title,
    data,
    dataKey = "value", // Key untuk data values (default: 'value')
    labelKey = "name", // Key untuk labels (default: 'name')
    color = "blue", // Warna theme: blue, green, purple, orange, red
    height = 320,
    showGrid = true,
    showLegend = false,
    className = "",
}) {
    // Jika tidak ada data, tampilkan empty state
    if (!data || data.length === 0) {
        return (
            <div
                className={`bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 ${className}`}
            >
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center border border-gray-600/30">
                        <svg
                            className="w-8 h-8 text-gray-500"
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
                    </div>
                    <p className="text-gray-400">
                        Tidak ada data untuk ditampilkan
                    </p>
                </div>
            </div>
        );
    }

    // Color themes
    const colorThemes = {
        blue: {
            gradient: {
                start: "#3B82F6",
                end: "#1D4ED8",
            },
            text: "#60A5FA",
            bg: "bg-blue-500/20",
        },
        green: {
            gradient: {
                start: "#10B981",
                end: "#047857",
            },
            text: "#34D399",
            bg: "bg-green-500/20",
        },
        purple: {
            gradient: {
                start: "#8B5CF6",
                end: "#7C3AED",
            },
            text: "#A78BFA",
            bg: "bg-purple-500/20",
        },
        orange: {
            gradient: {
                start: "#F59E0B",
                end: "#D97706",
            },
            text: "#FBBF24",
            bg: "bg-orange-500/20",
        },
        red: {
            gradient: {
                start: "#EF4444",
                end: "#DC2626",
            },
            text: "#F87171",
            bg: "bg-red-500/20",
        },
    };

    const theme = colorThemes[color] || colorThemes.blue;
    const total = data.reduce((sum, item) => sum + item[dataKey], 0);

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const value = payload[0].value;
            const percentage =
                total > 0 ? ((value / total) * 100).toFixed(1) : 0;

            return (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                    <p className="text-white font-semibold">{label}</p>
                    <p className={theme.text}>{value} data</p>
                    <p className="text-gray-400 text-sm">
                        {percentage}% dari total
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom label untuk bar
    const renderCustomBarLabel = ({ x, y, width, value }) => {
        return (
            <text
                x={x + width / 2}
                y={y - 8}
                fill={theme.text}
                textAnchor="middle"
                fontSize={12}
                fontWeight="600"
            >
                {value}
            </text>
        );
    };

    return (
        <div
            className={`bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <div className="text-sm text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full border border-gray-600/30">
                    Total: {total} data
                </div>
            </div>

            {/* Chart Container */}
            <div style={{ height: `${height}px` }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 60,
                        }}
                    >
                        {showGrid && (
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                                vertical={false}
                            />
                        )}
                        <XAxis
                            dataKey={labelKey}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9CA3AF", fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9CA3AF", fontSize: 12 }}
                            width={40}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {showLegend && <Legend />}
                        <Bar
                            dataKey={dataKey}
                            fill={`url(#gradient-${color})`}
                            radius={[4, 4, 0, 0]}
                            label={renderCustomBarLabel}
                        />

                        {/* Gradient definition */}
                        <defs>
                            <linearGradient
                                id={`gradient-${color}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor={theme.gradient.start}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="100%"
                                    stopColor={theme.gradient.end}
                                    stopOpacity={0.9}
                                />
                            </linearGradient>
                        </defs>
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>

            {/* Statistics Summary */}
            {data.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700/30">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {data.slice(0, 4).map((item, index) => (
                            <div
                                key={index}
                                className="text-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30"
                            >
                                <div
                                    className="text-xl font-bold mb-1"
                                    style={{ color: theme.text }}
                                >
                                    {item[dataKey]}
                                </div>
                                <div
                                    className="text-xs text-gray-400 truncate"
                                    title={item[labelKey]}
                                >
                                    {item[labelKey]}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {total > 0
                                        ? (
                                              (item[dataKey] / total) *
                                              100
                                          ).toFixed(1)
                                        : 0}
                                    %
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
