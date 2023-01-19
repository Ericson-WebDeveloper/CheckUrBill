<?php

declare(strict_types=1);

namespace App\Interface;

use App\Models\Transaction;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Http\JsonResponse;

interface TransactionInterface {

    public function getTransaction(string $trans_id);
    
    public function createTransaction(array $datas): Transaction;
    
    public function updateTransaction(string $trans_id, array $datas): bool;

    public function getTransactions(string $batch_no): Paginator;

    public function updateBillCostumer(int $bill_id, array $datas): bool;

    public function transactionReportList(string $trans_reference);
}