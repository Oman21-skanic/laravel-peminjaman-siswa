<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Borrowing extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'teacher_id',
        'inventory_id',
        'borrowed_at',
        'returned_at',
        'status',
        'notes',
        'role',
        'peminjam_type',
        'peminjam_id'
    ];

    protected $casts = [
        'borrowed_at' => 'datetime',
        'returned_at' => 'datetime',
    ];

    // Relasi ke student (untuk role student)
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    // Relasi ke teacher (untuk role teacher)
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    // Polymorphic relationship untuk peminjam
    public function peminjam()
    {
        return $this->morphTo();
    }

    // Relasi ke inventory
    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }

    // Accessor untuk mendapatkan data peminjam berdasarkan role
    public function getPeminjamAttribute()
    {
        if ($this->role === 'teacher') {
            return $this->teacher;
        }
        return $this->student;
    }

    // Accessor untuk nama peminjam
    public function getNamaPeminjamAttribute()
    {
        return $this->peminjam ? $this->peminjam->nama_lengkap : 'Unknown';
    }

    // Scope untuk filter berdasarkan role
    public function scopeStudentBorrowings($query)
    {
        return $query->where('role', 'student');
    }

    public function scopeTeacherBorrowings($query)
    {
        return $query->where('role', 'teacher');
    }
}
