<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'classFilter', 'statusFilter']);
        $perPage = $request->get('perPage', 10);

        $query = Student::query();

        // Apply filters
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('nama_lengkap', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('nisn', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['classFilter'])) {
            $query->where('kelas', $filters['classFilter']);
        }

        if (!empty($filters['statusFilter'])) {
            $isActive = $filters['statusFilter'] === 'Aktif';
            $query->where('is_active', $isActive);
        }

        $students = $query->paginate($perPage)->withQueryString();

        // Convert is_active to boolean for frontend
        $students->getCollection()->transform(function ($student) {
            $student->is_active = (bool)$student->is_active;
            return $student;
        });

        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => $filters,
            'perPage' => (int)$perPage,
        ]);
    }

    public function create()
    {
        return Inertia::render('Students/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nisn' => 'required|string|max:255|unique:students',
            'nama_lengkap' => 'required|string|max:255',
            'kelas' => 'required|string|max:255',
            'no_hp' => 'required|string|max:20',
            'email' => 'required|email|unique:students',
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

        Student::create($validated);

        return Redirect::route('students.index')->with('success', 'Siswa berhasil ditambahkan.');
    }

    public function show(Student $student)
    {
        // Convert is_active to boolean for frontend
        $student->is_active = (bool)$student->is_active;

        return Inertia::render('Students/Show', [
            'student' => $student,
        ]);
    }

    public function edit(Student $student)
    {
        // Convert is_active to boolean for frontend
        $student->is_active = (bool)$student->is_active;

        return Inertia::render('Students/Edit', [
            'student' => $student,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'nisn' => 'string|max:255|unique:students,nisn,' . $student->id,
            'nama_lengkap' => 'string|max:255',
            'kelas' => 'string|max:255',
            'no_hp' => 'string|max:20',
            'email' => 'email|unique:students,email,' . $student->id,
            'alamat' => 'string',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
        ]);

        // Convert boolean to integer for database
        if (isset($validated['is_active'])) {
            $validated['is_active'] = (int)$validated['is_active'];
        }

        // Handle file upload
        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if exists
            if ($student->profile_picture) {
                Storage::disk('public')->delete($student->profile_picture);
            }
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        } else {
            // Keep the existing profile picture if no new file is uploaded
            $validated['profile_picture'] = $student->profile_picture;
        }

        $student->update($validated);

        return Redirect::route('students.index')->with('success', 'Siswa berhasil diupdate.');
    }

    public function destroy(Student $student)
    {
        // Delete profile picture if exists
        if ($student->profile_picture) {
            Storage::disk('public')->delete($student->profile_picture);
        }

        $student->delete();

        return Redirect::route('students.index')->with('success', 'Siswa berhasil dihapus.');
    }
}