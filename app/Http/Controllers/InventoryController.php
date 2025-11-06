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
        $perPage = $request->get('perPage', 10);

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
            $isActive = $filters['statusFilter'] === 'Aktif';
            $query->where('is_active', $isActive);
        }

        $inventories = $query->paginate($perPage)->withQueryString();

        // Convert is_active to boolean for frontend
        $inventories->getCollection()->transform(function ($inventory) {
            $inventory->is_active = (bool)$inventory->is_active;
            return $inventory;
        });

        return Inertia::render('Inventories/Index', [
            'inventories' => $inventories,
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
            'is_active' => 'required|boolean',
            'foto_barang' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Convert boolean to integer for database
        $validated['is_active'] = (int)$validated['is_active'];

        // Handle file upload
        if ($request->hasFile('foto_barang')) {
            $validated['foto_barang'] = $request->file('foto_barang')->store('inventory_photos', 'public');
        }

        Inventory::create($validated);

        return Redirect::route('inventories.index')->with('success', 'Barang berhasil ditambahkan.');
    }

    public function show(Inventory $inventory)
    {
        // Convert is_active to boolean for frontend
        $inventory->is_active = (bool)$inventory->is_active;

        return Inertia::render('Inventories/Show', [
            'inventory' => $inventory->load(['borrowings.student']),
        ]);
    }

    public function edit(Inventory $inventory)
    {
        // Convert is_active to boolean for frontend
        $inventory->is_active = (bool)$inventory->is_active;

        return Inertia::render('Inventories/Edit', [
            'inventory' => $inventory->load(['borrowings.student']),
        ]);
    }

    public function update(Request $request, Inventory $inventory)
    {
        $validated = $request->validate([
            'kode_barang' => 'required|string|max:255|unique:inventories,kode_barang,' . $inventory->id,
            'nama_barang' => 'required|string|max:255',
            'kategori' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'status' => 'required|string|in:available,borrowed,maintenance',
            'lokasi_barang' => 'required|string|max:255',
            'is_active' => 'boolean',
            'foto_barang' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Convert boolean to integer for database
        if (isset($validated['is_active'])) {
            $validated['is_active'] = (int)$validated['is_active'];
        }

        // Handle file upload
        if ($request->hasFile('foto_barang')) {
            // Delete old photo if exists
            if ($inventory->foto_barang) {
                Storage::disk('public')->delete($inventory->foto_barang);
            }
            $validated['foto_barang'] = $request->file('foto_barang')->store('inventory_photos', 'public');
        } else {
            // Keep the existing photo if no new file is uploaded
            $validated['foto_barang'] = $inventory->foto_barang;
        }

        $inventory->update($validated);

        return Redirect::route('inventories.index')->with('success', 'Barang berhasil diupdate.');
    }

    public function destroy(Inventory $inventory)
    {
        // Delete photo if exists
        if ($inventory->foto_barang) {
            Storage::disk('public')->delete($inventory->foto_barang);
        }

        $inventory->delete();

        return Redirect::route('inventories.index')->with('success', 'Barang berhasil dihapus.');
    }
}