<?php

declare(strict_types=1);

namespace App\Repository;

use App\Interface\MemberInterface;
use App\Models\Member;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MemberRepository implements MemberInterface {

    // check din ang transaction payment and bill if tama ang query
    public function members(string $merchant_ref, string|null $search): Paginator {
        return DB::table('members')
        ->when($search,  function($query) use($search, $merchant_ref) {
            return $query
            ->where('merchant_ref', '=', $merchant_ref)
            ->where( function($query) use($search) {
                  return  $query->where('account_no', 'LIKE', $search."%")
                  ->orWhere('first_name', 'LIKE', $search."%")
                  ->orWhere('last_name', 'LIKE', $search."%")
                  ->orWhere('email', 'LIKE', $search."%");
                 });
         
        },function($query) use ($merchant_ref) {
            return $query->where('merchant_ref', '=', $merchant_ref);
        })
        ->paginate(10);
    }

    public function member(string $merchant_ref, string $email): Member | null
    {
        $member = DB::table('members')->where('merchant_ref', '=', $merchant_ref)
        ->where('email', '=', $email)->first();
       

        return $member ? new Member((array)$member) : null;
    }

    public function fetchMember(int $id, string|null $account_no = null): Member | null
    {
        $member = DB::table('members')->where('id', '=', $id)
        ->when($account_no, function($query, $account_no) {
            $query->where('account_no', '=', $account_no);
        })
        ->first();

        return $member ? new Member((array)$member) : null;
    }

    public function updateMember(int $id, array $datas, string|null $account_no = null): bool
    {
        Log::info($id);
        Log::info($account_no);
        $response = DB::table('members')
        // ->when($account_no, function($query, $account_no) {
        //     $query;
        // })
        // ->where('account_no', '=', $account_no)
        ->where('id', '=', $id)
        ->update($datas);
        
        return $response == 0 ? false : true;
    }

    public function addMemberManual(array $datas, string $merchant_ref): bool | JsonResponse
    {
        try {
            $newDatas = array_merge($datas, ['merchant_ref' => $merchant_ref, 'created_at' => \Carbon\Carbon::now(), 'updated_at' => \Carbon\Carbon::now()]);
        // return Member::create($newDatas);
             DB::table('members')->insert($newDatas);
             return true;
        } catch (\Exception $e) {
            return response()->json(['message' => 'Request Failed. please try again'], 400);
            die();
        }
    }

    public function removingMember(string $email, string $merchant_ref): bool | JsonResponse
    {
        try {
             DB::table('members')->where('email', '=', $email)->where('merchant_ref', '=', $merchant_ref)->delete();
             return true;
        } catch (\Exception $e) {
            return response()->json(['message' => 'Request Failed. please try again'], 400);
            die();
        }
    }


}