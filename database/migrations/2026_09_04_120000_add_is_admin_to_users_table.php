<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false)->after('password');
        });

        $email = config('app.admin_email');

        if (is_string($email) && $email !== '') {
            $updated = DB::table('users')->where('email', $email)->update(['is_admin' => true]);

            if ($updated > 0) {
                return;
            }
        }

        $firstId = DB::table('users')->orderBy('id')->value('id');

        if ($firstId) {
            DB::table('users')->where('id', $firstId)->update(['is_admin' => true]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_admin');
        });
    }
};
