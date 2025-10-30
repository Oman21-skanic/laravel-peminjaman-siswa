export default function Section({
    title,
    children,
    className = "",
    titleClassName = ""
}) {
    return (
        <section className={`mb-8 ${className}`}>
            <h2 className={`text-2xl font-bold tracking-tight text-gray-900 mb-6 ${titleClassName}`}>
                {title}
            </h2>
            {children}
        </section>
    );
}
