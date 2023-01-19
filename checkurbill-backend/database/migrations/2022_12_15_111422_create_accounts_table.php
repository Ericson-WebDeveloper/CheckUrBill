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
        Schema::create('accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id');
            $table->foreignId('member_id')->references('id')->on('members');
            $table->string('account_no');
            $table->longText('merchant_ref');
            $table->longText('merchant_name');
            $table->string('firstname');
            $table->string('lastname');
            $table->string('middlename');
            $table->string('email');
            $table->boolean('confirm')->default(false);
            $table->enum('status', ['active', 'warning', 'deleted'])->default('active'); // added jan 8 2023
            $table->string('code')->nullable(true);
            $table->dateTime('code_generate')->nullable(true);
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
        Schema::dropIfExists('accounts');
    }
};
