<?php

namespace App\Http\Controllers;

use App\Models\Borrowing;
use App\Models\Inventory;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class BorrowingController extends Controller
{
    public function index()
    {
        return Inertia::render('Borrowings/Index', [
            'borrowings' => Borrowing::with(['student', 'inventory'])->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Borrowings/Create', [
            'students' => Student::where('is_active', true)->get(),
            'inventories' => Inventory::where('is_active', 'available')->where('status', 'available')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'inventory_id' => 'required|exists:inventories,id',
            'notes' => 'nullable|string',
        ]);

        // Cek kalau inventory sudah dipinjam
        $inventory = Inventory::find($validated['inventory_id']);
        if ($inventory->status === 'borrowed') {
            return back()->withErrors(['inventory_id' => 'Barang sudah dipinjam.']);
        }

        $borrowing = Borrowing::create($validated);

        // Update status inventory jadi borrowed
        $inventory->update(['status' => 'borrowed']);

        return Redirect::route('borrowings.index')->with('success', 'Peminjaman berhasil ditambahkan.');
    }

    public function show(Borrowing $borrowing)
    {
        return Inertia::render('Borrowings/Show', [
            'borrowing' => $borrowing->load(['student', 'inventory']),
        ]);
    }

    public function edit(Borrowing $borrowing)
    {
        return Inertia::render('Borrowings/Edit', [
            'borrowing' => $borrowing->load(['student', 'inventory']),
            'students' => Student::where('is_active', true)->get(),
            'inventories' => Inventory::where('is_active', 'available')->get(),
        ]);
    }

    public function update(Request $request, Borrowing $borrowing)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'inventory_id' => 'required|exists:inventories,id',
            'notes' => 'nullable|string',
            'returned_at' => 'nullable|date',
        ]);

        // Handle inventory status changes
        if ($request->returned_at && !$borrowing->returned_at) {
            // Mark as returned
            $validated['status'] = 'returned';
            $borrowing->inventory->update(['status' => 'available']);
        } elseif (!$request->returned_at && $borrowing->returned_at) {
            // Mark as borrowed again
            $validated['status'] = 'borrowed';
            $borrowing->inventory->update(['status' => 'borrowed']);
        }

        // If inventory changed
        if ($borrowing->inventory_id != $validated['inventory_id']) {
            // Return old inventory
            $oldInventory = Inventory::find($borrowing->inventory_id);
            $oldInventory->update(['status' => 'available']);
            
            // Borrow new inventory
            $newInventory = Inventory::find($validated['inventory_id']);
            $newInventory->update(['status' => 'borrowed']);
        }

        $borrowing->update($validated);

        return Redirect::route('borrowings.index')->with('success', 'Peminjaman berhasil diupdate.');
    }

    public function destroy(Borrowing $borrowing)
    {
        // Update inventory status kalau belum returned
        if (!$borrowing->returned_at) {
            $borrowing->inventory->update(['status' => 'available']);
        }
        
        $borrowing->delete();

        return Redirect::route('borrowings.index')->with('success', 'Peminjaman berhasil dihapus.');
    }
}