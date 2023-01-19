<?php

declare(strict_types=1);

namespace App\Interface;

use App\Models\Bill;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Pagination\Paginator;

interface BillInterface {

    public function countBill(string $merchant_id): mixed;

    public function storeBillDdetails(array $datas): bool | JsonResponse;

    public function billLists(string $merchant_id): Paginator;

    public function approvedBill(string $bill_id, string $merchant_id): bool;

    public function rejectBill(string $bill_id, string $merchant_id): bool;

    public function bill(string $bill_id, string $merchant_id);

    public function billCostumerbyId(int $bill_id);

    public function billCostumer(int $bill_id, string $merchant_ref, string $account_no);

    public function billCostumerList(string $batch_no): Paginator;

    public function billReportList(string $bill_reference);

}