<?php

declare(strict_types=1);

namespace App\Mapper;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MerchantMapper
{

    public function merchantOnBoard(Request $request): array
    {
        return [
            'merchant_code' => $request->merchant_code,
            'merchant_name' => $request->merchant_name,
            'API_URL' => $request->API_URL ? $request->API_URL : null,
            'checkurbills_schema' => $request->checkurbills_schema,
            'status' => 'Not Activated'
        ];
        // status => Not Activated
    }

    public function merchantDetailsOnBoard(Request $request): array
    {
        return [
            'address' => $request->address,
            'institution_type_id' => $request->institution_type_id,
            'merchant_category_id' => $request->merchant_category_id,
            'merchant_type_id' => $request->merchant_type_id,
            'contact_no' => $request->contact_no,
            'logo' => $request->logo
        ];
    }

    static function updateApiUrl(Request $request): array
    {
        return [
            'merchants.API_URL' => $request->API_URL
        ];
    }

    static function updateDetails(Request $request): array
    {
        $datas = [
                'merchants.merchant_name' => $request->merchant_name,
                'merchants.checkurbills_schema' => $request->checkurbills_schema,
                'merchant_details.address' => $request->address,
                'merchant_details.contact_no' => $request->contact_no,
            ];
        if ($request->logo != null) {
            $datas = array_merge(['merchant_details.logo' => $request->logo], $datas);
        }
        return $datas;
    }

    static function addNewAdmin(Request $request, string $password): array
    {
        return [
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'middlename' => $request->middlename,
            'status' => 'Not Activated',
            'email' => $request->email,
            'password' => Hash::make($password),
            'remember_token' => Str::random(10)
        ];
    }

    static function addNewAdminInfo(Request $request, string $merchan_ref): array
    {
        return [
            'gender' => $request->gender,
            'avatar' => $request->avatar,
            'contact_no' => $request->contact_no,
            'merchant_ref' => $merchan_ref
        ];
    }

}
