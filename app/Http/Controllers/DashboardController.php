<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Inventory;
use App\Models\Borrowing;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $request->user(), // Menggunakan user dari Request
            ],
            'students' => Student::count(),
            'teachers' => Teacher::count(),
            'inventories' => Inventory::count(),
            'borrowings' => Borrowing::count(),
        ]);
    }
}