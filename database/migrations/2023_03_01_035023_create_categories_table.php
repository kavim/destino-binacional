<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();

            $table->string('color')->nullable();
            $table->string('icon')->nullable();
            $table->boolean('active')->default(1);
            $table->text('featured_image')->nullable();
            $table->string('type')->nullable();

            // Parent Category Laravel 9 like
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();

            $table->softDeletes();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
