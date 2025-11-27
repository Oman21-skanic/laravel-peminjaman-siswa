<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'nip',
        'nama_lengkap',
        'jabatan',
        'no_hp',
        'email',
        'alamat',
        'profile_picture',
        'is_active',
    ];

    // TAMBAHKAN RELATIONSHIP INI
    public function borrowings()
    {
        return $this->hasMany(Borrowing::class, 'teacher_id');
    }
}