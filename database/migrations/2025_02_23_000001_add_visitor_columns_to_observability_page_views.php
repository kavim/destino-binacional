<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('observability_page_views', function (Blueprint $table) {
            $table->string('ip', 45)->nullable()->after('route_name');
            $table->foreignId('user_id')->nullable()->after('ip')->constrained()->nullOnDelete();
            $table->string('user_agent', 500)->nullable()->after('user_id');
            $table->string('referer', 1000)->nullable()->after('user_agent');
            $table->string('country', 100)->nullable()->after('referer');
            $table->string('country_code', 10)->nullable()->index()->after('country');
            $table->string('region', 100)->nullable()->after('country_code');
            $table->string('city', 100)->nullable()->after('region');
            $table->string('timezone', 50)->nullable()->after('city');
        });
    }

    public function down(): void
    {
        Schema::table('observability_page_views', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn([
                'ip',
                'user_id',
                'user_agent',
                'referer',
                'country',
                'country_code',
                'region',
                'city',
                'timezone',
            ]);
        });
    }
};
