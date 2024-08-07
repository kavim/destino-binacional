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
        Schema::create('tracker_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique()->index();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->unsignedBigInteger('device_id')->nullable()->index();
            $table->unsignedBigInteger('agent_id')->nullable()->index();
            $table->string('client_ip')->index();
            $table->unsignedBigInteger('referer_id')->nullable()->index();
            $table->unsignedBigInteger('cookie_id')->nullable()->index();
            $table->unsignedBigInteger('geoip_id')->nullable()->index();
            $table->boolean('is_robot');
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
        Schema::dropIfExists('tracker_sessions');
    }
};
