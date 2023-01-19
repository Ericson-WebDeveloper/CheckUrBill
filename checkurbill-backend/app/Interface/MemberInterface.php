<?php

declare(strict_types=1);

namespace App\Interface;

use App\Models\Member;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Http\JsonResponse;

interface MemberInterface {

    public function members(string $merchant_ref, string|null $search): Paginator;

    public function member(string $merchant_ref, string $email): Member | null;

    public function fetchMember(int $id, string|null $account_no = null): Member | null;

    public function updateMember(int $id, array $datas, string|null $account_no = null): bool;

    public function addMemberManual(array $datas, string $merchant_ref): bool | JsonResponse;

    public function removingMember(string $email, string $merchant_ref): bool | JsonResponse;

}