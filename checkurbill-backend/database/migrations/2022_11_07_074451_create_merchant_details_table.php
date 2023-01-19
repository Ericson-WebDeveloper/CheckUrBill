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
        Schema::create('merchant_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('merchant_id')
            ->nullable(false)
            ->references('id')
            ->on('merchants');
            $table->string('address');
            $table->foreignId('institution_type_id')
            ->nullable(false)
            ->references('id')
            ->on('institution_types');
            $table->foreignId('merchant_category_id')
            ->nullable(false)
            ->references('id')
            ->on('merchant_categories');
            $table->foreignId('merchant_type_id')
            ->nullable(false)
            ->references('id')
            ->on('merchant_types');
            $table->string('contact_no');
            $table->longText('logo');
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
        Schema::dropIfExists('merchant_details');
    }
};
