import ManagementCard from './ManagementCard';

export default function ManagementGrid() {
    const managementItems = [
        {
            title: "Manajemen Siswa",
            description: "Kelola data siswa",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDj6K0FhnlXnoBpr2e8L2MoOEhJbO7rRZaZftT8stCq3RNMCJRFJPqSaK-mfICpKuwnt6Ty1mkJkBnkHvQVFScprxTBNqOuUTxJcRaFVS8acrAS9RNBYNGKf2gb58cGVk7GKZ6OLIXu7tjoqjyh2PB3yuujKmgmOtZwIQ7n3ZMPdVh6FpWqmBiAMUqvrzFHd_vlgQ6bmtRUHC588dm5feV_nxV3J_SqEFRtLL93n2BsIKwTxVBrN_qwHCAaIoQe3wMIdPLb1_ygUOAi"
        },
        {
            title: "Manajemen Guru",
            description: "Kelola data guru",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5NEEMYExZ9T8oeB9x5hsDLF9SK0AKgczZGPlhOl18UrXYl-a1oiJXCoiW903eULS_XjfHz-veuZt6oC1ENkYSQha5LbzweC55vlJv334PLtgYyI01ZC43FWmjhEmv53J4tAy0ngpPYqFzhvkgfPvZowTDvfSKn98w4ukI5XyLYfMGb--WgYrfm0TrIgf0X7wQY7JGaDCXG3gBo20YfzZcG2C8OmFMI0mXV2eqKPxL3-eazKF0RyQss28udzhCtigEdIgJ9r2reyyv"
        },
        {
            title: "Manajemen Peminjaman",
            description: "Kelola data peminjaman",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJIhKwbGtHnOv_Esa2im-6l4USMrx3fRHLvzpzJt88d2KeNye0OzfP54C7EMrde3MRYXJHsoZ7yv1yPYDUU_IUxd8gP6nz79I4HVwtGrFETKdlnQsZqCrLg7-q5cUh5TX2F61J3UOtM6MRMcKmzwMwI05_1sIs4cn8ZUqtUd-IYwoo3v_rUPU5NSo0Bk6HH4KphQNfXfNlG_Glwa_N_5_hmuS0bA_udux6o9IaMNMhNEqj1N9eZATTGyDoH4_G2YmgOpu64Eqdb0qn"
        },
        {
            title: "Manajemen Inventaris",
            description: "Kelola data inventaris",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyrimVdon0yaV4w3IR1oCcc7fXk4r2ba6Rn4viyOQ7cOwYDo3Ae-7-OImZnbFyDKQeTMUL1nemoyuM2VVHFWWasFQYVTw5Rwf0IJlk1jlvmvAVZD1XcGEB_crnBCgKdU1SqtX4eUEzw_I-uA6OF3Ofxs17xg-wy_kTlI1yHkXJzuCUVeAdOQkTDeNoMJemy5pfAfM3CThNE6u5X4sRRyjxW0wnrgF-v4HC2S6H8N3vUTEcWAuptc9EJhceTG5j8g4LV246beu_Gya3"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {managementItems.map((item, index) => (
                <ManagementCard
                    key={index}
                    title={item.title}
                    description={item.description}
                    imageUrl={item.imageUrl}
                />
            ))}
        </div>
    );
}
