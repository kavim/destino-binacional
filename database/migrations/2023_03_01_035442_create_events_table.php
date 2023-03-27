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
        Schema::create('events', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->string('slug');
            $table->longText('description')->nullable();
            $table->string('featured_image')->nullable();
            $table->date('start')->nullable();
            $table->date('end')->nullable();
            $table->boolean('is_online')->nullable();
            $table->text('link')->nullable();
            $table->text('google_maps_src')->nullable();
            $table->string('address')->nullable();
            $table->string('door_time')->nullable();
            $table->integer('price')->nullable();
            $table->boolean('active')->default(1);

            $table->foreignId('city_id')->nullable()->constrained();
            $table->foreignId('category_id')
                ->nullable()
                ->constrained();

            $table->string('place_name')->nullable();
            $table->foreignId('place_id')
                ->nullable()
                ->constrained()
                ->onDelete('cascade');

            $table->softDeletes();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
