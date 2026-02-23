<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('observability_page_views', function (Blueprint $table) {
            $table->id();
            $table->string('path', 500)->index();
            $table->string('method', 10)->default('GET');
            $table->string('route_name')->nullable()->index();
            $table->string('ip_hash', 64)->nullable()->index();
            $table->timestamp('viewed_at')->index();
            $table->timestamps();
        });

        Schema::create('observability_errors', function (Blueprint $table) {
            $table->id();
            $table->string('source', 20)->index(); // frontend, backend
            $table->text('message');
            $table->string('url', 1000)->nullable();
            $table->string('file')->nullable();
            $table->unsignedInteger('line')->nullable();
            $table->json('context')->nullable();
            $table->string('level', 50)->nullable()->index();
            $table->timestamps();
        });

        Schema::create('observability_performance', function (Blueprint $table) {
            $table->id();
            $table->string('path', 500)->index();
            $table->string('method', 10)->default('GET');
            $table->string('route_name')->nullable()->index();
            $table->unsignedInteger('duration_ms')->index();
            $table->unsignedBigInteger('memory_bytes')->nullable();
            $table->unsignedSmallInteger('status_code')->nullable()->index();
            $table->timestamp('measured_at')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('observability_page_views');
        Schema::dropIfExists('observability_errors');
        Schema::dropIfExists('observability_performance');
    }
};
