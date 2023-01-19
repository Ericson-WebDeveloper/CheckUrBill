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
        // INSERT INTO TBL_TRANSACTION(OTHER_FEES,ISSUERBANK,PAYER, CCNUM, TIN, TRANSNUM, CONNUM, CONDATE, ID, MERCHCODE, MERCHNAME, TRANSTYPE, 
        // BRANCH, ACCNUM, REFNUM, TRANSDATE, CONTIME, AMOUNT, RATE, TRANSFEE, STATUS, REMARKS, GATEWAY, GATEWAY_FEE) VALUES('{"":null}','Unknown',
        // 'JOBELLE BARADO SANFUEGO','20220304000003','000-088-079-000','20220304000004','-','2022-03-04', 8581288,
        // '+jscjkfTVJEUUc6Qt+TqTeT2JaETWcOoonOFg0tiP5w=','Philippine National Police - National Police Clearance','National Police Clearance','-','-',
        // '40721623',TO_DATE('2022-03-04', 'YYYY-MM-DD HH24:MI:SS'),'00:01:05','180','11','11','in-process','in-process','IPAY', 19)
        Schema::create('bill_payment_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('bill_costumer_id')->references('id')->on('bill_costumers');

            $table->string('batch_no')->nullable(true); // add jan 9 2023;
            $table->string('account_no')->nullable(true); // add jan 9 2023;

            $table->boolean('status')->default(false);
            $table->enum('remarks', ['Success', 'Pending', 'In-Process', 'Cancel'])->default('Pending');          
            $table->float('amount')->default(0.00);
            $table->float('transaction_fee')->default(0.00);
            $table->string('payment_option')->nullable();
            // $table->enum('payment_option', ['Paypal', 'Visa', 'MasterCard'])->default('Paypal');
            $table->string('payment_ref_no')->nullable();
            $table->dateTime('transaction_date')->default(now('Asia/Manila'));
            $table->dateTime('transaction_payment_date')->nullable();
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
        Schema::dropIfExists('bill_payment_transactions');
    }
};
