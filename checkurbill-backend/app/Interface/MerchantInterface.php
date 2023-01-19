<?php

declare(strict_types=1);

namespace App\Interface;

use App\Models\Merchant;
use App\Models\MerchantDetail;
use Illuminate\Contracts\Pagination\Paginator;

interface MerchantInterface {

    public function createMerchant(array $data, string $merchant_ref): Merchant | null;

    public function createMerchantDetails(array $data, Merchant $merchant): MerchantDetail;

    public function fetchMerchantNotActive(string $id, string $code): Merchant | null;
    
    public function activateMerchantOnboard(string $id): bool;

    public function updateMerchantData(string $merchant_code, string $merchant_id, array $datas): bool;

    public function deactivateMerchantOnboard(string $id): bool;

    public function merchants(string|null $search = ''): Paginator;

    public function merchantLists(string|null $search = '');

    public function merchant(string|null $merchant_code);

    public function adminLists(string $merchant_ref, string|null $user_id = null): Paginator;
    
    public function biller(string|null $merchant_ref);
}