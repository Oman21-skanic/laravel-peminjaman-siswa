<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'kategori',
        'deskripsi',
        'status',
        'lokasi_barang',
        'is_active',
        'foto_barang',
    ];

    public function borrowings()
    {
        return $this->hasMany(Borrowing::class);
    }

    public function currentBorrowing()
    {
        return $this->borrowings()->whereNull('returned_at')->latest()->first();
    }
}