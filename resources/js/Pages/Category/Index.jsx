export default function Index({ category }) {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Kategori Barang</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">ID</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Nama Kategori</th>
                    </tr>
                </thead>
                <tbody>
                    {category.map((cat) => (
                        <tr key={cat.id}>
                            <td className="py-2 px-4 border-b border-gray-200">{cat.id}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{cat.category_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}