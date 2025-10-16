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
        $perPage = $request->get('perPage', 5); // Default 5 data per halaman
        
        return Inertia::render('Teachers/Index', [
            'teachers' => Teacher::paginate($perPage),
            'filters' => $request->only(['search', 'jabatanFilter', 'statusFilter']),
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
            'no_hp' => 'required|string|max:255',
            'email' => 'required|email|unique:teachers',
            'alamat' => 'required|string',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'required|boolean',
        ]);

        // Konversi is_active ke boolean
        $validated['is_active'] = (bool) $validated['is_active'];

        if ($request->hasFile('profile_picture')) {
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        Teacher::create($validated);

        return Redirect::route('teachers.index')->with('success', 'Guru berhasil ditambahkan.');
    }

    public function show(Teacher $teacher)
    {
        return Inertia::render('Teachers/Show', [
            'teacher' => $teacher,
        ]);
    }

    public function edit(Teacher $teacher)
    {
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
            'no_hp' => 'required|string|max:255',
            'email' => 'required|email|unique:teachers,email,' . $teacher->id,
            'alamat' => 'required|string',
            'is_active' => 'required|boolean',
        ];

        // Hanya validasi profile_picture jika ada file yang diupload
        if ($request->hasFile('profile_picture')) {
            $rules['profile_picture'] = 'image|mimes:jpeg,png,jpg,gif|max:2048';
        }

        $validated = $request->validate($rules);

        // Konversi is_active ke boolean
        $validated['is_active'] = (bool) $validated['is_active'];

        // Handle file upload hanya jika ada file baru
        if ($request->hasFile('profile_picture')) {
            // Hapus foto lama jika ada
            if ($teacher->profile_picture) {
                Storage::disk('public')->delete($teacher->profile_picture);
            }
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        } else {
            // Jika tidak ada file baru, pertahankan foto lama
            unset($validated['profile_picture']);
        }

        $teacher->update($validated);

        return Redirect::route('teachers.index')->with('success', 'Guru berhasil diupdate.');
    }

    public function destroy(Teacher $teacher)
    {
        if ($teacher->profile_picture) {
            Storage::disk('public')->delete($teacher->profile_picture);
        }
        $teacher->delete();

        return Redirect::route('teachers.index')->with('success', 'Guru berhasil dihapus.');
    }
}