<?php
// app/Models/Inventory.php

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

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Accessor untuk is_active
    public function getIsActiveAttribute($value)
    {
        // Return boolean berdasarkan string
        return $value === 'available';
    }

    // Mutator untuk is_active
    public function setIsActiveAttribute($value)
    {
        // Simpan sebagai string di database
        $this->attributes['is_active'] = $value ? 'available' : 'unavailable';
    }

    // Scope untuk barang aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', 'available');
    }

    // Scope untuk barang tidak aktif
    public function scopeInactive($query)
    {
        return $query->where('is_active', 'unavailable');
    }

    // Relationship dengan borrowings jika ada
    public function borrowings()
    {
        return $this->hasMany(Borrowing::class);
    }
}
