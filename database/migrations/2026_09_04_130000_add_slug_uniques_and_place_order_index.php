<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->dedupeSlugs('places');
        $this->dedupeSlugs('events');

        Schema::table('places', function (Blueprint $table) {
            $table->unique('slug');
            $table->index('order');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->unique('slug');
        });
    }

    public function down(): void
    {
        Schema::table('places', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropIndex(['order']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropUnique(['slug']);
        });
    }

    private function dedupeSlugs(string $table): void
    {
        $duplicates = DB::table($table)
            ->select('slug', DB::raw('COUNT(*) as slug_count'))
            ->groupBy('slug')
            ->having('slug_count', '>', 1)
            ->pluck('slug');

        foreach ($duplicates as $slug) {
            $rows = DB::table($table)->where('slug', $slug)->orderBy('id')->get();
            $keep = true;

            foreach ($rows as $row) {
                if ($keep) {
                    $keep = false;

                    continue;
                }

                DB::table($table)->where('id', $row->id)->update([
                    'slug' => $slug.'-'.$row->id,
                ]);
            }
        }
    }
};
