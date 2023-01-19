<?php

namespace App\Http\Controllers;

use App\Http\Requests\MemberAddRequest;
use App\Http\Resources\MemberJsonResource;
use App\Http\Resources\MemberResource;
use App\Interface\MemberInterface;
use App\Mapper\MemberMapper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MemberController extends Controller
{

    private MemberInterface $member_repo;
    
    public function __construct(MemberInterface $member_repo)
    {
        $this->member_repo = $member_repo;
    }
    
    public function members(Request $request): JsonResponse 
    {
        try {
            $user = $request->user()->load('info');
            $search = $request->query('search') ? $request->query('search') : null;

            $members = $this->member_repo->members($user->info->merchant_ref, $search);

            return response()->json([
                'data' => new MemberResource($members)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e) 
            ], 500);
        }
    }

    public function member(Request $request, string $email, string $merchant_ref): JsonResponse 
    {
        try {
            $member = $this->member_repo->member($merchant_ref, $email);
            return response()->json([
                'data' => new MemberJsonResource($member)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function memberDetail(Request $request, string $email): JsonResponse 
    {
        try {
            $user = $request->user()->load('info');
            $merchant_ref = $user->info->merchant_ref;
            $member = $this->member_repo->member($merchant_ref, $email);
            Log::info($member);
            return response()->json([
                'data' => new MemberJsonResource($member)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

   public function deleteMember(Request $request): JsonResponse
   {
        try {
            $user = $request->user()->load('info');
            $this->member_repo->removingMember($request->email, $user->info->merchant_ref);
            return response()->json(['message' => 'Member Removed Success'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
   }

}
