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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('account_no');
            $table->longText('merchant_ref')->nullable(false);
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name');
            $table->string('email')->nullable();
            $table->string('password');
            $table->enum('status', ['active', 'warning', 'deleted'])->default('active'); // added jan 8 2023
            $table->rememberToken()->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('members');
    }
};
