<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('kode_barang')->unique();
            $table->string('nama_barang');
            $table->string('kategori');
            $table->string('deskripsi');
            $table->string('status');
            $table->string('lokasi_barang');
            $table->string('is_active')->default('available');
            $table->foreignId('student_id')->nullable()->constrained('students')->nullOnDelete();
            $table->string('foto_barang')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};