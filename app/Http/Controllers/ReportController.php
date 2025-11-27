<?php

namespace App\Http\Controllers;

use App\Models\Borrowing;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $activeTab = $request->get('tab', 'dashboard');
        $filters = $request->only(['start_date', 'end_date', 'status', 'role', 'type']);

        $data = [];

        switch ($activeTab) {
            case 'dashboard':
                $data = $this->getDashboardData($filters);
                break;
            case 'borrowings':
                $data = $this->getBorrowingsReport($filters);
                break;
            case 'students':
                $data = $this->getStudentsReport($filters);
                break;
            case 'teachers':
                $data = $this->getTeachersReport($filters);
                break;
            case 'inventory':
                $data = $this->getInventoryReport($filters);
                break;
        }

        return Inertia::render('Reports/Index', array_merge([
            'activeTab' => $activeTab,
            'filters' => $filters,
        ], $data));
    }

    private function getDashboardData($filters)
    {
        // Total Statistics
        $stats = [
            'total_students' => Student::count(),
            'total_teachers' => Teacher::count(),
            'total_inventory' => Inventory::count(),
            'active_borrowings' => Borrowing::whereNull('returned_at')->count(),
            'total_borrowings' => Borrowing::count(),
        ];

        // Monthly Borrowing Trend
        $monthlyBorrowings = $this->getMonthlyBorrowingData($filters);

        // Recent Activities
        $recentBorrowings = Borrowing::with(['student', 'teacher', 'inventory'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return [
            'stats' => $stats,
            'monthlyBorrowings' => $monthlyBorrowings,
            'recentBorrowings' => $recentBorrowings,
        ];
    }

    private function getBorrowingsReport($filters)
    {
        $query = Borrowing::with(['student', 'teacher', 'inventory']);

        // Apply filters
        if (!empty($filters['start_date'])) {
            $query->whereDate('borrowed_at', '>=', $filters['start_date']);
        }
        
        if (!empty($filters['end_date'])) {
            $query->whereDate('borrowed_at', '<=', $filters['end_date']);
        }

        if (!empty($filters['status'])) {
            if ($filters['status'] === 'active') {
                $query->whereNull('returned_at');
            } elseif ($filters['status'] === 'returned') {
                $query->whereNotNull('returned_at');
            }
        }

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        $borrowings = $query->orderBy('borrowed_at', 'desc')->get();

        $stats = [
            'total' => $borrowings->count(),
            'active' => $borrowings->where('returned_at', null)->count(),
            'returned' => $borrowings->where('returned_at', '!=', null)->count(),
            'students' => $borrowings->where('role', 'student')->count(),
            'teachers' => $borrowings->where('role', 'teacher')->count(),
        ];

        return [
            'borrowings' => $borrowings,
            'borrowingsStats' => $stats,
        ];
    }

    private function getStudentsReport($filters)
    {
        $query = Student::query();

        if (!empty($filters['status'])) {
            $isActive = $filters['status'] === 'active';
            $query->where('is_active', $isActive);
        }

        $students = $query->withCount('borrowings')->get();

        $stats = [
            'total' => $students->count(),
            'active' => $students->where('is_active', true)->count(),
            'inactive' => $students->where('is_active', false)->count(),
            'with_borrowings' => $students->where('borrowings_count', '>', 0)->count(),
        ];

        // Class distribution
        $classDistribution = $students->groupBy('kelas')->map(function ($group, $kelas) {
            return [
                'name' => $kelas,
                'value' => $group->count()
            ];
        })->values();

        return [
            'students' => $students,
            'studentsStats' => $stats,
            'classDistribution' => $classDistribution,
        ];
    }

    private function getTeachersReport($filters)
    {
        $query = Teacher::query();

        if (!empty($filters['status'])) {
            $isActive = $filters['status'] === 'active';
            $query->where('is_active', $isActive);
        }

        $teachers = $query->withCount('borrowings')->get();

        $stats = [
            'total' => $teachers->count(),
            'active' => $teachers->where('is_active', true)->count(),
            'inactive' => $teachers->where('is_active', false)->count(),
            'with_borrowings' => $teachers->where('borrowings_count', '>', 0)->count(),
        ];

        return [
            'teachers' => $teachers,
            'teachersStats' => $stats,
        ];
    }

    private function getInventoryReport($filters)
    {
        $query = Inventory::query();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['type'])) {
            $query->where('kategori', $filters['type']);
        }

        $inventory = $query->withCount('borrowings')->get();

        $stats = [
            'total' => $inventory->count(),
            'available' => $inventory->where('status', 'available')->count(),
            'borrowed' => $inventory->where('status', 'borrowed')->count(),
            'maintenance' => $inventory->where('status', 'maintenance')->count(),
        ];

        // Category distribution
        $categoryDistribution = $inventory->groupBy('kategori')->map(function ($group, $kategori) {
            return [
                'name' => $kategori,
                'value' => $group->count()
            ];
        })->values();

        return [
            'inventory' => $inventory,
            'inventoryStats' => $stats,
            'categoryDistribution' => $categoryDistribution,
        ];
    }

    private function getMonthlyBorrowingData($filters = [])
    {
        $query = Borrowing::query();

        if (!empty($filters['start_date'])) {
            $query->whereDate('borrowed_at', '>=', $filters['start_date']);
        }
        
        if (!empty($filters['end_date'])) {
            $query->whereDate('borrowed_at', '<=', $filters['end_date']);
        } else {
            // Default to current year if no end date
            $query->whereYear('borrowed_at', date('Y'));
        }

        $monthlyData = $query->select(
                DB::raw('MONTH(borrowed_at) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy(DB::raw('MONTH(borrowed_at)'))
            ->orderBy(DB::raw('MONTH(borrowed_at)'))
            ->get()
            ->keyBy('month');

        $months = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
            7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
        ];

        $formattedData = [];
        for ($month = 1; $month <= 12; $month++) {
            $formattedData[] = [
                'name' => $months[$month],
                'value' => isset($monthlyData[$month]) ? $monthlyData[$month]->total : 0
            ];
        }

        return $formattedData;
    }

    public function export(Request $request)
    {
        $type = $request->get('type', 'borrowings');
        $filters = $request->only(['start_date', 'end_date', 'status', 'role']);

        switch ($type) {
            case 'borrowings':
                return $this->exportBorrowings($filters);
            case 'students':
                return $this->exportStudents();
            case 'teachers':
                return $this->exportTeachers();
            case 'inventory':
                return $this->exportInventory();
            default:
                return redirect()->back()->with('error', 'Tipe export tidak valid');
        }
    }

    private function exportBorrowings($filters)
    {
        $query = Borrowing::with(['student', 'teacher', 'inventory']);
        
        if (!empty($filters['start_date'])) {
            $query->whereDate('borrowed_at', '>=', $filters['start_date']);
        }
        
        if (!empty($filters['end_date'])) {
            $query->whereDate('borrowed_at', '<=', $filters['end_date']);
        }

        if (!empty($filters['status'])) {
            if ($filters['status'] === 'active') {
                $query->whereNull('returned_at');
            } elseif ($filters['status'] === 'returned') {
                $query->whereNotNull('returned_at');
            }
        }

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        $borrowings = $query->orderBy('borrowed_at', 'desc')->get();

        $fileName = "laporan-peminjaman-" . date('Y-m-d') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];

        $callback = function() use ($borrowings) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for UTF-8
            fwrite($file, "\xEF\xBB\xBF");
            
            // Header CSV
            fputcsv($file, [
                'No',
                'Tanggal Pinjam',
                'Tanggal Kembali', 
                'Peminjam',
                'NISN/NIP',
                'Role',
                'Barang',
                'Kode Barang',
                'Kategori',
                'Status',
                'Lama Pinjam (Hari)'
            ]);

            // Data
            foreach ($borrowings as $index => $borrowing) {
                $peminjamName = $borrowing->student ? 
                    $borrowing->student->nama_lengkap : 
                    $borrowing->teacher->nama_lengkap;
                
                $peminjamId = $borrowing->student ? 
                    $borrowing->student->nisn : 
                    $borrowing->teacher->nip;
                
                $lamaPinjam = '-';
                if ($borrowing->returned_at) {
                    $lamaPinjam = Carbon::parse($borrowing->borrowed_at)
                        ->diffInDays(Carbon::parse($borrowing->returned_at));
                } elseif (!$borrowing->returned_at) {
                    $lamaPinjam = Carbon::parse($borrowing->borrowed_at)
                        ->diffInDays(Carbon::now());
                }

                fputcsv($file, [
                    $index + 1,
                    $borrowing->borrowed_at->format('d/m/Y H:i'),
                    $borrowing->returned_at ? $borrowing->returned_at->format('d/m/Y H:i') : '-',
                    $peminjamName,
                    $peminjamId,
                    $borrowing->role === 'student' ? 'Siswa' : 'Guru',
                    $borrowing->inventory->nama_barang,
                    $borrowing->inventory->kode_barang,
                    $borrowing->inventory->kategori,
                    $borrowing->returned_at ? 'Dikembalikan' : 'Masih Dipinjam',
                    $lamaPinjam
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportStudents()
    {
        $students = Student::withCount('borrowings')->get();

        $fileName = "laporan-siswa-" . date('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];

        $callback = function() use ($students) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for UTF-8
            fwrite($file, "\xEF\xBB\xBF");
            
            fputcsv($file, [
                'No', 'NISN', 'Nama Lengkap', 'Kelas', 'Email', 'No HP', 
                'Alamat', 'Status', 'Total Peminjaman'
            ]);

            foreach ($students as $index => $student) {
                fputcsv($file, [
                    $index + 1,
                    $student->nisn,
                    $student->nama_lengkap,
                    $student->kelas,
                    $student->email,
                    $student->no_hp,
                    $student->alamat,
                    $student->is_active ? 'Aktif' : 'Tidak Aktif',
                    $student->borrowings_count
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportTeachers()
    {
        $teachers = Teacher::withCount('borrowings')->get();

        $fileName = "laporan-guru-" . date('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];

        $callback = function() use ($teachers) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for UTF-8
            fwrite($file, "\xEF\xBB\xBF");
            
            fputcsv($file, [
                'No', 'NIP', 'Nama Lengkap', 'Jabatan', 'Email', 'No HP', 
                'Alamat', 'Status', 'Total Peminjaman'
            ]);

            foreach ($teachers as $index => $teacher) {
                fputcsv($file, [
                    $index + 1,
                    $teacher->nip,
                    $teacher->nama_lengkap,
                    $teacher->jabatan,
                    $teacher->email,
                    $teacher->no_hp,
                    $teacher->alamat,
                    $teacher->is_active ? 'Aktif' : 'Tidak Aktif',
                    $teacher->borrowings_count
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportInventory()
    {
        $inventory = Inventory::withCount('borrowings')->get();

        $fileName = "laporan-inventory-" . date('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];

        $callback = function() use ($inventory) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for UTF-8
            fwrite($file, "\xEF\xBB\xBF");
            
            fputcsv($file, [
                'No', 'Kode Barang', 'Nama Barang', 'Kategori', 'Deskripsi', 
                'Status', 'Lokasi', 'Total Dipinjam'
            ]);

            foreach ($inventory as $index => $item) {
                fputcsv($file, [
                    $index + 1,
                    $item->kode_barang,
                    $item->nama_barang,
                    $item->kategori,
                    $item->deskripsi,
                    $item->status,
                    $item->lokasi_barang,
                    $item->borrowings_count
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}