<?php

namespace App\Http\Controllers;

use App\Http\Requests\MerchantApiUrlUpdateRequest;
use App\Http\Requests\MerchantDataUpdateRequest;
use App\Http\Resources\MerchantResource;
use App\Http\Resources\MerchantsResource;
use App\Interface\MerchantInterface;
use App\Mapper\MerchantMapper;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MerchantController extends Controller
{

    private MerchantInterface $merchant_repo;

    public function __construct(MerchantInterface $merchant_repo)
    {
        $this->merchant_repo = $merchant_repo;
    }

    public function merchants(Request $request): JsonResponse
    {
        try {
            $merchants = $this->merchant_repo->merchants($request->query('search') ? $request->query('search') : null);
            return response()->json([
                'data' => new MerchantsResource($merchants)
            ], 200);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function merchant(Request $request, $merchant_code): JsonResponse
    {
        try {
            // change $merchat_id -> merchant_code
            // before use make sure base64_decode first to get real data
            $merchant_code = base64_decode($merchant_code);
            $merchant = $this->merchant_repo->merchant($merchant_code);
            return response()->json([
                'data' => new MerchantResource($merchant)
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function updateAPiUrlMerchant(MerchantApiUrlUpdateRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $datas = MerchantMapper::updateApiUrl($request);
            $merchant_code = base64_decode($request->merchant_code);
            if($this->merchant_repo->updateMerchantData($merchant_code, $request->merchant_id, $datas)) {
                DB::commit();
                return response()->json(['message' => 'Api Url Updated Success'], 200);
            } else {
                return response()->json(['error' => 'Api Url Updated Failed. try again later.'], 400);
            }
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function updateInfoMerchant(MerchantDataUpdateRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $datas = MerchantMapper::updateDetails($request);
            $merchant_code = base64_decode($request->merchant_code);
            if($this->merchant_repo->updateMerchantData($merchant_code, $request->merchant_id, $datas)) {
                DB::commit();
                return response()->json(['message' => 'Merchant Info Updated Success'], 200);
            } else {
                return response()->json(['error' => 'Merchant Info Updating Failed. try again later.'], 400);
            }
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function merchantAdminLists(Request $request, string $merchant_ref): JsonResponse
    {
        try {
            $merchantsAdmin = $this->merchant_repo->adminLists($merchant_ref);
            return response()->json(['data' => $merchantsAdmin], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function biller($ref): JsonResponse
    {
        try {
            $biller = $this->merchant_repo->biller($ref);
            return response()->json([
                'data' => new MerchantResource($biller)
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function merchantLists(Request $request): JsonResponse
    {
        try {
            $merchants = $this->merchant_repo->merchantLists($request->query('search') ? $request->query('search') : null);
            return response()->json([
                'data' => $merchants
            ], 200);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') ? get_class($e) : ''
            ], 500);
        }
    }
}
