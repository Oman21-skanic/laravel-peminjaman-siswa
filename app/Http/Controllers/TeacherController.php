<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'jabatanFilter', 'statusFilter']);
        $perPage = $request->get('perPage', 10);

        $query = Teacher::query();

        // Apply filters
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('nama_lengkap', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('nip', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['jabatanFilter'])) {
            $query->where('jabatan', $filters['jabatanFilter']);
        }

        if (!empty($filters['statusFilter'])) {
            $isActive = $filters['statusFilter'] === 'Aktif';
            $query->where('is_active', $isActive);
        }

        $teachers = $query->paginate($perPage)->withQueryString();

        // Convert is_active to boolean for frontend
        $teachers->getCollection()->transform(function ($teacher) {
            $teacher->is_active = (bool)$teacher->is_active;
            return $teacher;
        });

        return Inertia::render('Teachers/Index', [
            'teachers' => $teachers,
            'filters' => $filters,
            'perPage' => (int)$perPage,
        ]);
    }

    public function create()
    {
        return Inertia::render('Teachers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nip' => 'required|string|max:255|unique:teachers',
            'nama_lengkap' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'no_hp' => 'required|string|max:20',
            'email' => 'required|email|unique:teachers',
            'alamat' => 'required|string',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'required|boolean',
        ]);

        // Convert boolean to integer for database
        $validated['is_active'] = (int)$validated['is_active'];

        // Handle file upload
        if ($request->hasFile('profile_picture')) {
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        Teacher::create($validated);

        return Redirect::route('teachers.index')->with('success', 'Guru berhasil ditambahkan.');
    }

    public function show(Teacher $teacher)
    {
        // Convert is_active to boolean for frontend
        $teacher->is_active = (bool)$teacher->is_active;

        return Inertia::render('Teachers/Show', [
            'teacher' => $teacher,
        ]);
    }

    public function edit(Teacher $teacher)
    {
        // Convert is_active to boolean for frontend
        $teacher->is_active = (bool)$teacher->is_active;

        return Inertia::render('Teachers/Edit', [
            'teacher' => $teacher,
        ]);
    }

   public function update(Request $request, Teacher $teacher)
{
    // Validation rules untuk update
    $rules = [
        'nip' => 'required|string|max:255|unique:teachers,nip,' . $teacher->id,
        'nama_lengkap' => 'required|string|max:255',
        'jabatan' => 'required|string|max:255',
        'no_hp' => 'required|string|max:20',
        'email' => 'required|email|unique:teachers,email,' . $teacher->id,
        'alamat' => 'required|string',
        'is_active' => 'required|boolean',
    ];

    // Hanya validasi profile_picture jika ada file yang diupload
    if ($request->hasFile('profile_picture')) {
        $rules['profile_picture'] = 'image|mimes:jpeg,png,jpg,gif|max:2048';
    }

    $validated = $request->validate($rules);

    // Convert boolean to integer for database
    $validated['is_active'] = (int)$validated['is_active'];

    // Handle file upload hanya jika ada file baru
    if ($request->hasFile('profile_picture')) {
        // Hapus foto lama jika ada
        if ($teacher->profile_picture) {
            Storage::disk('public')->delete($teacher->profile_picture);
        }
        $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
    } else {
        // Jika tidak ada file baru, pertahankan foto lama
        $validated['profile_picture'] = $teacher->profile_picture;
    }

    $teacher->update($validated);

    return Redirect::route('teachers.index')->with('success', 'Guru berhasil diupdate.');
}

    public function destroy(Teacher $teacher)
    {
        // Delete profile picture if exists
        if ($teacher->profile_picture) {
            Storage::disk('public')->delete($teacher->profile_picture);
        }

        $teacher->delete();

        return Redirect::route('teachers.index')->with('success', 'Guru berhasil dihapus.');
    }
}