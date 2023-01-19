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
        Schema::create('user_infos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            // $table->foreignUuid('user_id');
            $table->foreignUuid('user_id');
            $table->string('gender');
            $table->longText('avatar');
            $table->string('contact_no');
            $table->longText('merchant_ref')->nullable(true); // if null sya ay user from crm kung meron sya ay user sa cub
            $table->timestamps();     
            
            $table->foreign('user_id')
            ->references('id')
            ->on('users')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_infos');
    }
};
