<?php

namespace App\Http\Controllers;

use App\Interface\RolePermissionInterface;
use App\Models\InstitutionType;
use App\Models\MerchantCategory;
use App\Models\MerchantType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HelperController extends Controller
{
    
    private RolePermissionInterface $rolepermission;

    public function __construct(RolePermissionInterface $rolepermission)
    {
        $this->rolepermission = $rolepermission;
    }

    public function getRoles(): JsonResponse {
        try {
            $roles = $this->rolepermission->roles();
            return response()->json(['data' => [ 'roles' => $roles ]], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function getPermissions(): JsonResponse {
        try {
            $permissions = $this->rolepermission->permissions();
            return response()->json(['data' => [ 'permissions' => $permissions ]], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function institutions(): JsonResponse {
        try {
            $institutions = DB::table('institution_types')->get();
            return response()->json(['data' => $institutions], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function categories(): JsonResponse {
        try {
            $categories = DB::table('merchant_categories')->get();
            return response()->json(['data' => $categories], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function types(): JsonResponse {
        try {
            $types = DB::table('merchant_types')->get();
            return response()->json(['data' => $types], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function billers($category): JsonResponse
    {
        try {
            $category = DB::table('merchant_categories')->where('merchant_category_name', '=', $category)->select('id')->first();
            $billers = DB::table('merchants')
            ->join('merchant_details', 'merchants.id', '=', 'merchant_details.merchant_id')
            ->where('merchant_details.merchant_category_id', '=', $category->id)
            ->select(
                'merchants.*',
                'merchant_details.id as detail_id',
                'merchant_details.merchant_id as detail_merchant_id',
                'merchant_details.address as detail_address',
                'merchant_details.institution_type_id',
                'merchant_details.merchant_category_id',
                'merchant_details.merchant_type_id',

                'merchant_details.contact_no as detail_contact_no',
                'merchant_details.logo as detail_logo',
                'merchant_details.created_at as detail_created_at',
                'merchant_details.updated_at as detail_updated_at',
            )
            ->get();

            return response()->json(['data' => $billers], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }
}
