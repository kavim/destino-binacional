<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'tracker';

    /**
     * Table related to this migration.
     *
     * @var string
     */
    private $table = 'tracker_agents';

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        try {
            Schema::table($this->table, function (Blueprint $table) {
                $table->dropUnique('tracker_agents_name_unique');
                $table->string('name_hash', 65)->nullable();
            });

            DB::table($this->table)->update(['name_hash' => DB::raw('SHA2(name, 256)')]);

            Schema::table($this->table, function (Blueprint $table) {
                $table->unique('name_hash');
            });
        } catch (\Exception $e) {
            dd($e->getMessage());
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        try {
            Schema::table($this->table, function (Blueprint $table) {
                $table->dropUnique('tracker_agents_name_hash_unique');
                $table->dropColumn('name_hash');
                $table->mediumText('name')->unique()->change();
            });
        } catch (\Exception $e) {
        }
    }
};
