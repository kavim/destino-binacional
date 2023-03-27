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
        Schema::create('places', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('slug');
            $table->string('address');
            $table->foreignId('city_id')->nullable()->constrained();
            $table->foreignId('place_type_id')->nullable()->constrained();
            $table->foreignId('category_id')->nullable()->constrained();
            $table->string('featured_image')->nullable();
            $table->boolean('active')->default(1);
            $table->text('google_maps_src')->nullable();
            $table->json('social_media')->nullable();
            $table->json('opening_hours')->nullable();
            $table->json('details')->nullable();
            $table->json('contact')->nullable();
            $table->softDeletes();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('places');
    }
};
