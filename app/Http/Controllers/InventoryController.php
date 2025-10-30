<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;

class InventoryController extends Controller
{
      public function index(Request $request)
    {
        $filters = $request->only(['search', 'kategoriFilter', 'statusFilter']);
        $perPage = $request->get('perPage', 10); // Default 10 data per halaman

        $query = Inventory::query();

        // Apply filters
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('nama_barang', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('kode_barang', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('deskripsi', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['kategoriFilter'])) {
            $query->where('kategori', $filters['kategoriFilter']);
        }

        if (!empty($filters['statusFilter'])) {
            $query->where('status', $filters['statusFilter']);
        }

        return Inertia::render('Inventories/Index', [
            'inventories' => $query->paginate($perPage)->withQueryString(),
            'filters' => $filters,
            'perPage' => (int)$perPage,
        ]);
    }

    public function create()
    {
        return Inertia::render('Inventories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_barang' => 'required|string|max:255|unique:inventories',
            'nama_barang' => 'required|string|max:255',
            'kategori' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'status' => 'required|string|in:available,borrowed,maintenance',
            'lokasi_barang' => 'required|string|max:255',
            'is_active' => 'required|string|in:available,unavailable',
            'foto_barang' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('foto_barang')) {
            $validated['foto_barang'] = $request->file('foto_barang')->store('inventory_photos', 'public');
        }

        Inventory::create($validated);

        return Redirect::route('inventories.index')->with('success', 'Barang berhasil ditambahkan.');
    }

    public function show(Inventory $inventory)
    {
        return Inertia::render('Inventories/Show', [
            'inventory' => $inventory->load(['borrowings.student']),
        ]);
    }

    public function edit(Inventory $inventory)
    {
        return Inertia::render('Inventories/Edit', [
            'inventory' => $inventory->load(['borrowings.student']),
        ]);
    }

    public function update(Request $request, Inventory $inventory)
    {
        // Validation rules untuk update
        $rules = [
            'kode_barang' => 'required|string|max:255|unique:inventories,kode_barang,' . $inventory->id,
            'nama_barang' => 'required|string|max:255',
            'kategori' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'status' => 'required|string|in:available,borrowed,maintenance',
            'lokasi_barang' => 'required|string|max:255',
            'is_active' => 'required|string|in:available,unavailable',
        ];

        // Hanya validasi foto_barang jika ada file yang diupload
        if ($request->hasFile('foto_barang')) {
            $rules['foto_barang'] = 'image|mimes:jpeg,png,jpg,gif|max:2048';
        }

        $validated = $request->validate($rules);

        // Handle file upload hanya jika ada file baru
        if ($request->hasFile('foto_barang')) {
            // Hapus foto lama jika ada
            if ($inventory->foto_barang) {
                Storage::disk('public')->delete($inventory->foto_barang);
            }
            $validated['foto_barang'] = $request->file('foto_barang')->store('inventory_photos', 'public');
        } else {
            // Jika tidak ada file baru, pertahankan foto lama
            unset($validated['foto_barang']);
        }

        $inventory->update($validated);

        return Redirect::route('inventories.index')->with('success', 'Barang berhasil diupdate.');
    }

    public function destroy(Inventory $inventory)
    {
        if ($inventory->foto_barang) {
            Storage::disk('public')->delete($inventory->foto_barang);
        }
        $inventory->delete();

        return Redirect::route('inventories.index')->with('success', 'Barang berhasil dihapus.');
    }
}
