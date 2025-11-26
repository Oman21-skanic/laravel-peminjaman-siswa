<?php
// app/Http/Controllers/BorrowingController.php

namespace App\Http\Controllers;

use App\Models\Borrowing;
use App\Models\Inventory;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Carbon\Carbon;

class BorrowingController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'statusFilter', 'roleFilter']);
        $perPage = $request->get('perPage', 10);

        $query = Borrowing::with(['student', 'teacher', 'inventory']);

        // Apply filters
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereHas('student', function ($studentQuery) use ($filters) {
                    $studentQuery->where('nama_lengkap', 'like', '%' . $filters['search'] . '%');
                })
                ->orWhereHas('teacher', function ($teacherQuery) use ($filters) {
                    $teacherQuery->where('nama_lengkap', 'like', '%' . $filters['search'] . '%');
                })
                ->orWhereHas('inventory', function ($inventoryQuery) use ($filters) {
                    $inventoryQuery->where('nama_barang', 'like', '%' . $filters['search'] . '%')
                                  ->orWhere('kode_barang', 'like', '%' . $filters['search'] . '%');
                });
            });
        }

        if (!empty($filters['statusFilter'])) {
            if ($filters['statusFilter'] === 'borrowed') {
                $query->whereNull('returned_at');
            } elseif ($filters['statusFilter'] === 'returned') {
                $query->whereNotNull('returned_at');
            }
        }

        if (!empty($filters['roleFilter'])) {
            $query->where('role', $filters['roleFilter']);
        }

        // Get statistics for pie chart and quick stats
        $stats = $this->getBorrowingStats();

        // Get monthly borrowing data for bar chart
        $monthlyBorrowings = $this->getMonthlyBorrowingData();

        return Inertia::render('Borrowings/Index', [
            'borrowings' => $query->paginate($perPage)->withQueryString(),
            'filters' => $filters,
            'perPage' => (int)$perPage,
            'monthlyBorrowings' => $monthlyBorrowings,
            'stats' => $stats,
        ]);
    }

    /**
     * Get borrowing statistics for pie chart and quick stats
     */
    private function getBorrowingStats()
    {
        $total = Borrowing::count();
        $borrowed = Borrowing::whereNull('returned_at')->count();
        $returned = Borrowing::whereNotNull('returned_at')->count();
        $overdue = Borrowing::whereNull('returned_at')
            ->where('borrowed_at', '<=', Carbon::now()->subDays(7))
            ->count();

        return [
            'total' => $total,
            'borrowed' => $borrowed,
            'returned' => $returned,
            'overdue' => $overdue,
        ];
    }

    /**
     * Get monthly borrowing data for the current year
     */
    private function getMonthlyBorrowingData()
    {
        $currentYear = date('Y');

        $monthlyData = Borrowing::select(
                DB::raw('MONTH(borrowed_at) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->whereYear('borrowed_at', $currentYear)
            ->groupBy(DB::raw('MONTH(borrowed_at)'))
            ->orderBy(DB::raw('MONTH(borrowed_at)'))
            ->get()
            ->keyBy('month');

        $months = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
            7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
        ];

        $formattedData = [];
        $currentMonth = (int)date('m');

        for ($month = 1; $month <= $currentMonth; $month++) {
            $formattedData[] = [
                'name' => $months[$month],
                'value' => isset($monthlyData[$month]) ? $monthlyData[$month]->total : 0
            ];
        }

        return $formattedData;
    }

   public function create()
{
    // Debug: Lihat data inventory yang tersedia
    $availableInventories = Inventory::where('is_active', 'available')
                                   ->where('status', 'available')
                                   ->get();

    \Log::info('Available inventories debug:', [
        'total_available' => $availableInventories->count(),
        'inventories' => $availableInventories->map(function($item) {
            return [
                'id' => $item->id,
                'nama_barang' => $item->nama_barang,
                'is_active' => $item->is_active,
                'is_active_raw' => $item->getRawOriginal('is_active'), // nilai asli di database
                'status' => $item->status
            ];
        })->toArray()
    ]);

    return Inertia::render('Borrowings/Create', [
        'students' => Student::where('is_active', true)->get(),
        'teachers' => Teacher::where('is_active', true)->get(),
        'inventories' => $availableInventories,
    ]);
}

   public function store(Request $request)
    {
        // Validasi dasar
        $validated = $request->validate([
            'role' => 'required|in:student,teacher',
            'inventory_id' => 'required|exists:inventories,id',
            'borrowed_at' => 'required|date',
            'returned_at' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        // Validasi conditional berdasarkan role
        if ($request->role === 'student') {
            $request->validate([
                'student_id' => 'required|exists:students,id',
                'teacher_id' => 'nullable' // Pastikan teacher_id null untuk student
            ]);
            $validated['student_id'] = $request->student_id;
            $validated['teacher_id'] = null; // Pastikan teacher_id null
        } else {
            $request->validate([
                'teacher_id' => 'required|exists:teachers,id',
                'student_id' => 'nullable' // Pastikan student_id null untuk teacher
            ]);
            $validated['teacher_id'] = $request->teacher_id;
            $validated['student_id'] = null; // Pastikan student_id null
        }

        // Set peminjam_type dan peminjam_id untuk polymorphic relationship
        if ($validated['role'] === 'student') {
            $validated['peminjam_type'] = 'App\Models\Student';
            $validated['peminjam_id'] = $validated['student_id'];
        } else {
            $validated['peminjam_type'] = 'App\Models\Teacher';
            $validated['peminjam_id'] = $validated['teacher_id'];
        }

        // Cek ketersediaan inventory
        $inventory = Inventory::find($validated['inventory_id']);

        \Log::info('Inventory check for borrowing:', [
            'inventory_id' => $inventory->id,
            'nama_barang' => $inventory->nama_barang,
            'status' => $inventory->status,
            'is_active' => $inventory->is_active,
            'is_active_raw' => $inventory->getRawOriginal('is_active'),
        ]);

        // Cek status inventory
        $isActiveRaw = $inventory->getRawOriginal('is_active');

        if ($inventory->status !== 'available') {
            return back()->withErrors(['inventory_id' => 'Barang tidak tersedia untuk dipinjam. Status: ' . $inventory->status]);
        }

        if ($isActiveRaw !== 'available') {
            return back()->withErrors(['inventory_id' => 'Barang tidak aktif. Status aktif: ' . $isActiveRaw]);
        }

        try {
            DB::beginTransaction();

            // Create borrowing record
            $borrowing = Borrowing::create($validated);

            // Update inventory status
            $inventory->update(['status' => 'borrowed']);

            DB::commit();

            return Redirect::route('borrowings.index')->with('success', 'Peminjaman berhasil ditambahkan.');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error creating borrowing: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan data peminjaman.']);
        }
    }

    public function show(Borrowing $borrowing)
    {
        return Inertia::render('Borrowings/Show', [
            'borrowing' => $borrowing->load(['student', 'teacher', 'inventory']),
        ]);
    }

    public function edit(Borrowing $borrowing)
    {
        return Inertia::render('Borrowings/Edit', [
            'borrowing' => $borrowing->load(['student', 'teacher', 'inventory']),
            'students' => Student::where('is_active', true)->get(),
            'teachers' => Teacher::where('is_active', true)->get(),
            'inventories' => Inventory::where('is_active', 'available')->get(), // Ubah ke 'available'
        ]);
    }

    public function update(Request $request, Borrowing $borrowing)
    {
        $validated = $request->validate([
            'role' => 'required|in:student,teacher',
            'inventory_id' => 'required|exists:inventories,id',
            'borrowed_at' => 'required|date',
            'returned_at' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        if ($request->returned_at && !$borrowing->returned_at) {
            $validated['status'] = 'returned';
            $borrowing->inventory->update(['status' => 'available']);
        } elseif (!$request->returned_at && $borrowing->returned_at) {
            $validated['status'] = 'borrowed';
            $borrowing->inventory->update(['status' => 'borrowed']);
        }

        if ($borrowing->inventory_id != $validated['inventory_id']) {
            $oldInventory = Inventory::find($borrowing->inventory_id);
            $oldInventory->update(['status' => 'available']);

            $newInventory = Inventory::find($validated['inventory_id']);
            $newInventory->update(['status' => 'borrowed']);
        }

        $borrowing->update($validated);

        return Redirect::route('borrowings.index')->with('success', 'Peminjaman berhasil diupdate.');
    }

    public function destroy(Borrowing $borrowing)
    {
        if (!$borrowing->returned_at) {
            $borrowing->inventory->update(['status' => 'available']);
        }

        $borrowing->delete();

        return Redirect::route('borrowings.index')->with('success', 'Peminjaman berhasil dihapus.');
    }

    public function returnBorrowing(Borrowing $borrowing)
    {
        if (!$borrowing->returned_at) {
            $borrowing->update([
                'returned_at' => now(),
                'status' => 'returned'
            ]);

            $borrowing->inventory->update(['status' => 'available']);

            return Redirect::route('borrowings.index')->with('success', 'Barang berhasil dikembalikan.');
        }

        return Redirect::route('borrowings.index')->with('error', 'Barang sudah dikembalikan sebelumnya.');
    }
}
