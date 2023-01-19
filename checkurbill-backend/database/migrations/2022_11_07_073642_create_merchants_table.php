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
        Schema::create('merchants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->longText('merchant_ref')->index();
            $table->longText('merchant_code')->index();
            $table->string('merchant_name');
            $table->longText('lbp_enrolled_account')->nullable();
            $table->enum('checkurbills_schema', ['Api', 'StandAlone', 'Costumize']);
            $table->enum('status', ['Activated', 'Deactivated', 'Not Activated']);	
            $table->longText('API_URL')->nullable();
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
        Schema::dropIfExists('merchants');
    }
};
