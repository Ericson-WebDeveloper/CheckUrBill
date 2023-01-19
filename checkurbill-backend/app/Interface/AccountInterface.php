<?php

declare(strict_types=1);

namespace App\Interface;

use App\Models\Account;
use Illuminate\Http\JsonResponse;

interface AccountInterface {

    public function accountLink(array $datas);

    public function getAccounts(string $user_id);

    public function getAccount(string $id);

    public function getAccount2(string $id);

    public function fetchMerchant(string $merchant_ref);

    public function fetchMemberAccount(string $merchant_ref, string $account_no, string $email);

    public function verifyAccount(string $account_no, string $id): bool;

    public function updateAccountStatus(string $account_no, string $id, array $datas): bool;

    public function fetchBillCurrent(string|int $account_no, string $merchant_ref);

    public function fetchPayments(int $bill_id);

    public function fetchBillMerchantList(string $merchant_ref, string $account_no);
}