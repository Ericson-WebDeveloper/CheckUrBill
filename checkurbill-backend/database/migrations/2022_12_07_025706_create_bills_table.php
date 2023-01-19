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
        Schema::create('bills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('batch_no'); // $batch_no = "BN" . date('Y') . date('m') . date('d') . $countBill;
            $table->foreignUuid('merchant_id')
            ->nullable(false)
            ->references('id')
            ->on('merchants');
            $table->longText('path_file');
            $table->enum('status', ['Pending', 'Approved', 'Reject'])->default('Pending');
            $table->date('bill_month');
            $table->date('date_uploaded')->nullable();
            $table->date('date_approved')->nullable();
            $table->date('date_reject')->nullable();
            $table->string('remarks')->nullable();
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
        Schema::dropIfExists('bills');
    }
};
