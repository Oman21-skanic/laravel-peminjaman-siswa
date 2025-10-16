<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'nisn',
        'nama_lengkap',
        'kelas',
        'no_hp',
        'email',
        'alamat',
        'profile_picture',
        'is_active',
    ];
    public function borrowings()
{
    return $this->hasMany(Borrowing::class);
}
}
