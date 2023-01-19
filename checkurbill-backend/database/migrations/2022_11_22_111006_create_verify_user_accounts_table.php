<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 86400 seconds in 1 day
        Schema::create('verify_user_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('code');
            $table->dateTime('created', $precision = 0);
            // $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('verify_user_accounts');
    }
};
