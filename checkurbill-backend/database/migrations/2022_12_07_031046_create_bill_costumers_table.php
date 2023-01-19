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
        Schema::create('bill_costumers', function (Blueprint $table) {
            $table->id();
            // $table->foreignUuid('merchant_id')
            // ->nullable(false)
            // ->references('id')
            // ->on('merchants');
            $table->string('batch_no');
            $table->string('merchant_ref');
            $table->string('Account No');
            $table->string('Transaction Type');
            $table->string('Name');
            $table->string('Address');
            $table->string('Email');
            $table->date('Bill From');
            $table->date('Bill To');
            $table->date('Due Date');
            $table->string('Reference No');
            $table->enum('Status', ['Unpaid', 'Paid', 'Partial'])->default('Unpaid');
            $table->decimal('Balance',10,2)->default(0.00);
            $table->decimal('Amount Payment',10,2)->default(0.00);
            $table->decimal('Amount',10,2)->default(0.00);
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
        Schema::dropIfExists('bill_costumers');
    }
};
