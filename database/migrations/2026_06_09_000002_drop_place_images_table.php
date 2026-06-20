<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('place_images');
    }

    public function down(): void
    {
        // Legacy stub — not recreated.
    }
};
