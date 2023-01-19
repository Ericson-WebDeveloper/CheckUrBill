<?php

namespace App\Http\Controllers\Administrator;

use App\Helpers\StringHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\MerchantOnBoardRequest;
use App\Interface\MerchantInterface;
use App\Mapper\MerchantMapper;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UploaderController extends Controller
{
    use StringHelper;

    private MerchantMapper $merchant_mapper;
    private MerchantInterface $merchant_repo;

    public function __construct(MerchantMapper $merchant_mapper, MerchantInterface $merchant_repo)
    {
        $this->merchant_mapper = $merchant_mapper;
        $this->merchant_repo = $merchant_repo;
    }

    public function onBoardMerchant(MerchantOnBoardRequest $request): JsonResponse{
        DB::beginTransaction();
        try {
            $extRef = str_replace('-', '', now('Asia/Manila'));
            $extRef = str_replace(':', '', $extRef);
            $extRef = str_replace(' ', '', $extRef);
            $merchant_ref = $this->merchRef($request->merchant_name).'-'.$extRef;
            $merchant_data = $this->merchant_mapper->merchantOnBoard($request);
            $merchant_detail_data = $this->merchant_mapper->merchantDetailsOnBoard($request);
            $merchant = $this->merchant_repo->createMerchant($merchant_data, $merchant_ref);
            if(!$merchant) {
                return response()->json(['message' => 'Unable to Onboard new Merchant. try again Later'], 400);
            }
            $response = $this->merchant_repo->createMerchantDetails($merchant_detail_data, $merchant);
            if(!$response) {
                return response()->json(['message' => 'Unable to Onboard new Merchant. try again Later'], 400);
            }
            Db::commit();
            return response()->json(['message' => 'Onboard new Merchant Success.'], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }


    

}
