<?php

declare(strict_types=1);

namespace App\Repository;

use App\Interface\TransactionInterface;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Pagination\Paginator;

class TransactionRepository implements TransactionInterface {

    public function getTransaction(string $trans_id)
    {
        return DB::table('bill_payment_transactions')->where('id', '=', $trans_id)->first();
    }

    public function createTransaction(array $datas): Transaction
    {
        return Transaction::create($datas);
    }

    public function getTransactions(string $batch_no): Paginator
    {
        return DB::table('bill_payment_transactions')
        ->join('bill_costumers', 'bill_costumers.id', '=', 'bill_payment_transactions.bill_costumer_id')
        ->where('bill_payment_transactions.batch_no', '=', $batch_no)
        ->select(
            'bill_payment_transactions.*',
            'bill_costumers.Transaction Type',
            'bill_costumers.Account No',
            'bill_costumers.Name',
        )
        ->orderBy('bill_payment_transactions.batch_no', 'DESC')
        ->paginate(10);
    }

    public function updateTransaction(string $trans_id, array $datas): bool
    {
        // update
        $response = DB::table('bill_payment_transactions')->where('id', '=', $trans_id)
        ->update($datas);
        return $response == 0 ? false : true;
    }

    public function updateBillCostumer(int $bill_id, array $datas): bool
    {
        // $table->enum('Status', ['Unpaid', 'Paid', 'Partial'])->default('Unpaid');
        // $table->decimal('Balance',10,2)->default(0.00);
        // $table->decimal('Amount Payment',10,2)->default(0.00);
        // $table->decimal('Amount',10,2)->default(0.00);
        // in front end Amount Payment - Amount
        //  here update minus Amount Payment - Amount get Balance
        $response = DB::table('bill_costumers')->where('id', '=', $bill_id)
        ->update($datas);
        return $response == 0 ? false : true;
    }


    public function transactionReportList(string $trans_reference)
    {
        return DB::table('bill_payment_transactions')
        ->join('bill_costumers', 'bill_costumers.id', '=', 'bill_payment_transactions.bill_costumer_id')
        ->where('bill_payment_transactions.batch_no', '=', $trans_reference)
        ->orderBy('bill_costumers.Account No', 'DESC')
        ->get()->toArray();
    }

}