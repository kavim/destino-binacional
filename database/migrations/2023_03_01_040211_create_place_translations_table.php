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
        Schema::create('place_translations', function (Blueprint $table) {
            $table->id();

            $table->string('locale')->index();
            $table->longText('description')->nullable();
            $table->foreignId('place_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->unique(['place_id', 'locale']);
            $table->softDeletes();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('place_translations');
    }
};
