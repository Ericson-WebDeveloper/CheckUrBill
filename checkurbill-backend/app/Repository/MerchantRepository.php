<?php

declare(strict_types=1);

namespace App\Repository;

use App\Interface\MerchantInterface;
use App\Models\Merchant;
use App\Models\MerchantDetail;
use App\Models\User;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MerchantRepository implements MerchantInterface
{

    public function createMerchant(array $data, string $merchant_ref): Merchant | null
    {
        $datas = array_merge($data, ['merchant_ref' => $merchant_ref]);
        return Merchant::create($datas);
    }

    public function createMerchantDetails(array $data, Merchant $merchant): MerchantDetail
    {
        $datas = array_merge($data, ['merchant_id' => $merchant->id]);
        return MerchantDetail::create($datas);
    }

    public function fetchMerchantNotActive(string $id, string $code): Merchant | null
    {
        $merchant = DB::table('merchants')->where('id', '=', $id)->where('merchant_code', '=', $code)->first();
        return $merchant ? new Merchant((array)$merchant) : null;
    }

    public function activateMerchantOnboard(string $id): bool
    {
        $response = Merchant::where('id', $id)->update(['status' => 'Activated']);
        return $response ? true : false;
    }

    public function updateMerchantData(string $merchant_code, string $merchant_id, array $datas): bool {
        try {
            DB::table('merchants')
            ->join('merchant_details', 'merchants.id', '=', 'merchant_details.merchant_id')
            ->where('merchants.id', '=', $merchant_id)
            ->where('merchants.merchant_code', '=', $merchant_code)
            ->update($datas);
            return true;
        } catch (\Exception $e) {
            return false;
        }
        
        // return $response == 0 ? false : true;
    }

    public function deactivateMerchantOnboard(string $id): bool
    {
        $response = Merchant::where('id', $id)->update(['status' => 'Deactivated']);
        return $response ? true : false;
    }

    public function merchants(string|null $search = ''): Paginator
    {
        $merchants = DB::table('merchants')
            ->join('merchant_details', 'merchants.id', '=', 'merchant_details.merchant_id')
            ->join('institution_types', 'institution_types.id', '=', 'merchant_details.institution_type_id')
            ->join('merchant_categories', 'merchant_categories.id', '=', 'merchant_details.merchant_category_id')
            ->join('merchant_types', 'merchant_types.id', '=', 'merchant_details.merchant_type_id')
            ->when($search, function ($query) use ($search) {
                $query->where('merchant_name', 'like', $search . '%')
                    ->orWhereHas('detail', function ($query) use ($search) {
                        $query->where('address', 'like', $search . '%');
                    });
            })
            ->select(
                'merchants.*',
                // DB::raw(sprintf('base64_encode(merchants.merchant_code) as m_code')),
                'merchant_details.id as detail_id',
                'merchant_details.merchant_id as detail_merchant_id',
                'merchant_details.address as detail_address',
                'merchant_details.institution_type_id',
                'merchant_details.merchant_category_id',
                'merchant_details.merchant_type_id',

                'institution_types.institution_name as merchant_institution',
                'merchant_categories.merchant_category_name as merchant_category',
                'merchant_types.merchant_type_name as merchant_type',

                'merchant_details.contact_no as detail_contact_no',
                'merchant_details.logo as detail_logo',
                'merchant_details.created_at as detail_created_at',
                'merchant_details.updated_at as detail_updated_at',
            )
            ->paginate(2);
        return $merchants;
    }

    public function merchantLists(string|null $search = '')
    {
        $merchants = DB::table('merchants')
            ->join('merchant_details', 'merchants.id', '=', 'merchant_details.merchant_id')
            ->join('institution_types', 'institution_types.id', '=', 'merchant_details.institution_type_id')
            ->join('merchant_categories', 'merchant_categories.id', '=', 'merchant_details.merchant_category_id')
            ->join('merchant_types', 'merchant_types.id', '=', 'merchant_details.merchant_type_id')
            ->when($search, function ($query) use ($search) {
                $query->where('merchant_name', 'like', $search . '%')
                    ->orWhereHas('detail', function ($query) use ($search) {
                        $query->where('address', 'like', $search . '%');
                    });
            })
            ->select(
                'merchants.*',
                // DB::raw(sprintf('base64_encode(merchants.merchant_code) as m_code')),
                'merchant_details.id as detail_id',
                'merchant_details.merchant_id as detail_merchant_id',
                'merchant_details.address as detail_address',
                'merchant_details.institution_type_id',
                'merchant_details.merchant_category_id',
                'merchant_details.merchant_type_id',

                'institution_types.institution_name as merchant_institution',
                'merchant_categories.merchant_category_name as merchant_category',
                'merchant_types.merchant_type_name as merchant_type',

                'merchant_details.contact_no as detail_contact_no',
                'merchant_details.logo as detail_logo',
                'merchant_details.created_at as detail_created_at',
                'merchant_details.updated_at as detail_updated_at',
            )
            ->get();
        return $merchants;
    }

    public function merchant(string|null $merchant_code)
    {
        return DB::table('merchants')
            ->join('merchant_details', 'merchants.id', '=', 'merchant_details.merchant_id')
            ->join('institution_types', 'institution_types.id', '=', 'merchant_details.institution_type_id')
            ->join('merchant_categories', 'merchant_categories.id', '=', 'merchant_details.merchant_category_id')
            ->join('merchant_types', 'merchant_types.id', '=', 'merchant_details.merchant_type_id')
            // ->where('merchants.id', '=', $merchant_id)
            ->where('merchants.merchant_code', '=', $merchant_code)
            // add institution, category, type
            ->select(
                'merchants.*',
                'merchant_details.id as detail_id',
                'merchant_details.merchant_id as detail_merchant_id',
                'merchant_details.address as detail_address',
                'merchant_details.institution_type_id',
                'merchant_details.merchant_category_id',
                'merchant_details.merchant_type_id',

                'institution_types.institution_name as merchant_institution',
                'merchant_categories.merchant_category_name as merchant_category',
                'merchant_types.merchant_type_name as merchant_type',

                'merchant_details.contact_no as detail_contact_no',
                'merchant_details.logo as detail_logo',
                'merchant_details.created_at as detail_created_at',
                'merchant_details.updated_at as detail_updated_at',
            )->first();
    }

    public function biller(string|null $merchant_ref)
    {
        return DB::table('merchants')
            ->join('merchant_details', 'merchants.id', '=', 'merchant_details.merchant_id')
            ->join('institution_types', 'institution_types.id', '=', 'merchant_details.institution_type_id')
            ->join('merchant_categories', 'merchant_categories.id', '=', 'merchant_details.merchant_category_id')
            ->join('merchant_types', 'merchant_types.id', '=', 'merchant_details.merchant_type_id')
            // ->where('merchants.id', '=', $merchant_id)
            ->where('merchants.merchant_ref', '=', $merchant_ref)
            // add institution, category, type
            ->select(
                'merchants.*',
                'merchant_details.id as detail_id',
                'merchant_details.merchant_id as detail_merchant_id',
                'merchant_details.address as detail_address',
                'merchant_details.institution_type_id',
                'merchant_details.merchant_category_id',
                'merchant_details.merchant_type_id',

                'institution_types.institution_name as merchant_institution',
                'merchant_categories.merchant_category_name as merchant_category',
                'merchant_types.merchant_type_name as merchant_type',

                'merchant_details.contact_no as detail_contact_no',
                'merchant_details.logo as detail_logo',
                'merchant_details.created_at as detail_created_at',
                'merchant_details.updated_at as detail_updated_at',
            )->first();
    }

    // public function fetchMerchantUser(string $ref): Merchant | null {
    //     $merchant = DB::table('merchants')
    //     ->where('merchant_ref ', '=', $ref)
    //     ->first();
    //     return $merchant ? new Merchant((array)$merchant) : null;
    // }

    public function adminLists(string $merchant_ref, string|null $user_id = null): Paginator
    {
        return User::query()
        ->with('info')
        ->whereHas('info', function($query) use ($merchant_ref) {
            return $query->where('merchant_ref', $merchant_ref);
        })
        ->whereHas('roles', function($query) {
            return $query->where('name', 'merchant');
        })
        ->when($user_id, function($query) use ($user_id) {
            return $query->where('id', '!=', $user_id);
        })
        ->paginate(5);
    }
}
