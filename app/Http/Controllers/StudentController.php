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
    $perPage = $request->get('perPage', 5); // Default 5 data per halaman
    
    return Inertia::render('Students/Index', [
        'students' => Student::paginate($perPage),
        'filters' => $request->only(['search', 'classFilter', 'statusFilter']),
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
            'no_hp' => 'required|string|max:255',
            'email' => 'required|email|unique:students',
            'alamat' => 'required|string',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'required|boolean', // Ubah menjadi boolean
        ]);

        // Konversi is_active ke format yang sesuai dengan database
        $validated['is_active'] = (bool) $validated['is_active'];

        if ($request->hasFile('profile_picture')) {
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        Student::create($validated);

        return Redirect::route('students.index')->with('success', 'Siswa berhasil ditambahkan.');
    }

    public function show(Student $student)
    {
        return Inertia::render('Students/Show', [
            'student' => $student,
        ]);
    }

    public function edit(Student $student)
    {
        return Inertia::render('Students/Edit', [
            'student' => $student,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'nisn' => 'required|string|max:255|unique:students,nisn,' . $student->id,
            'nama_lengkap' => 'required|string|max:255',
            'kelas' => 'required|string|max:255',
            'no_hp' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email,' . $student->id,
            'alamat' => 'required|string',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'required|boolean', // Ubah menjadi boolean
        ]);

        // Konversi is_active ke format yang sesuai dengan database
        $validated['is_active'] = (bool) $validated['is_active'];

        if ($request->hasFile('profile_picture')) {
            // Hapus foto lama kalau ada
            if ($student->profile_picture) {
                Storage::disk('public')->delete($student->profile_picture);
            }
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        $student->update($validated);

        return Redirect::route('students.index')->with('success', 'Siswa berhasil diupdate.');
    }

    public function destroy(Student $student)
    {
        // Hapus foto kalau ada
        if ($student->profile_picture) {
            Storage::disk('public')->delete($student->profile_picture);
        }
        $student->delete();

        return Redirect::route('students.index')->with('success', 'Siswa berhasil dihapus.');
    }
}