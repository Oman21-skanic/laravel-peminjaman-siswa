<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('borrowings', function (Blueprint $table) {
            $table->enum('role', ['student', 'teacher'])->default('student');
            $table->foreignId('teacher_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('peminjam_type')->default('student'); // Untuk polymorphic relationship
            $table->unsignedBigInteger('peminjam_id')->nullable(); // Untuk polymorphic relationship
        });
    }

    public function down()
    {
        Schema::table('borrowings', function (Blueprint $table) {
            $table->dropColumn(['role', 'teacher_id', 'peminjam_type', 'peminjam_id']);
        });
    }
};