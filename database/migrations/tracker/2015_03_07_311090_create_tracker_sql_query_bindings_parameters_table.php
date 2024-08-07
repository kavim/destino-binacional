<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'tracker';

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tracker_sql_query_bindings_parameters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sql_query_bindings_id')->nullable();
            $table->string('name')->nullable()->index();
            $table->text('value')->nullable();
            $table->timestamps();
            $table->index('created_at');
            $table->index('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tracker_sql_query_bindings_parameters');
    }
};
