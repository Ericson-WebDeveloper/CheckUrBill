<?php

declare(strict_types=1);

namespace App\Repository;

use App\Interface\AccountInterface;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AccountRepository implements AccountInterface
{
    public function accountLink(array $datas)
    {
        try {
            return Account::create($datas);
            // if($response) {
            //     return new Account($response);
            // } else {
            //     return response()->json(['message' => 'unable to confirm add account now. plaese try again later.'], 400);
            //     die();
            // }
        } catch (\Exception $e) {
            return response()->json([
            'message' => 'unable to confirm add account now. plaese try again later.',
            'stack' => $e->getMessage(),
            'error' => get_class($e)], 400);
            die();
        }
        
    }

    public function fetchMerchant(string $merchant_ref)
    {
        return DB::table('merchants')->where('merchant_ref', '=', $merchant_ref)->first();
    }

    public function getAccounts(string $user_id)
    {
        return DB::table('accounts')
        ->where('accounts.user_id', '=', $user_id)
        ->where('accounts.confirm', '=', 1)
        // ->join('bill_costumers as b', function($join) {
        //     $join->on('accounts.merchant_ref', '=', 'b.merchant_ref')
        //     ->on('accounts.account_no', '=', 'b.Account No')
        //     // ->orderBy('b.Due Date', 'DESC')->first()
        //     ;
        //     // ->orderBy('b.batch_no', 'ASC')
        //     // ->first()
        //     // ;

        // })
        // ->groupBy('b.batch_no')
        // ->select('accounts.*', 
        // 'b.id as bill_id', 
        // 'b.batch_no', 
        // 'b.merchant_ref as bill_merchant_ref', 
        // 'b.Account No', 
        // 'b.Transaction Type', 
        // 'b.Name', 
        // 'b.Address',
        //  'b.Email as bill_email', 
        //  'b.Bill From', 
        //  'b.Bill To', 
        //  'b.Due Date', 
        //  'b.Reference No', 
        //  'b.Status', 
        //  'b.Balance', 
        //  'b.Amount Payment', 
        //  'b.Amount',
        // )
        
        
        // ->orderBy('b.Due Date', 'DESC')
        ->get();
    }

    public function fetchMemberAccount(string $merchant_ref, string $account_no, string $email)
    {
        return DB::table('members')
        ->where('merchant_ref', '=', $merchant_ref)
        ->where('account_no', '=', $account_no)
        ->where('email', '=', $email)
        ->first();
    }

    public function getAccount(string $id)
    {
        return DB::table('accounts')
        ->join('members', 'accounts.member_id', '=', 'members.id')
        ->where('accounts.id', '=', $id)
        ->select(
            'accounts.*',
            // DB::raw(sprintf('base64_encode(merchants.merchant_code) as m_code')),
            'members.id as link_account_id',
            'members.account_no as link_account_no',
            'members.merchant_ref as link_account_merchant_ref'
        )
        ->first();
    }

    public function getAccount2(string $id)
    {
        $account = DB::table('accounts')
        ->join('members', 'members.id', '=', 'accounts.member_id')
        ->where('accounts.member_id', '=', $id)
        ->select(
            'accounts.*',
            // DB::raw(sprintf('base64_encode(merchants.merchant_code) as m_code')),
            'members.id as link_account_id',
            'members.account_no as link_account_no',
            'members.merchant_ref as link_account_merchant_ref'
        )
        ->first();

        return $account ? new Account((array)$account) : null;
    }

    public function updateAccountStatus(string $account_no, string $id, array $datas): bool
    {
        $response = DB::table('accounts')->where('account_no', '=', $account_no)
        ->where('id', '=', $id)
        ->update($datas);
        return $response == 0 ? false : true;
    }

    public function verifyAccount(string $account_no, string $id): bool
    {
        $response = DB::table('accounts')->where('account_no', '=', $account_no)
        ->where('id', '=', $id)
        ->update(['confirm' => true, 'code' => null, 'code_generate' => null]);
        return $response == 0 ? false : true;
    }

    public function fetchBillCurrent(string|int $account_no, string $merchant_ref)
    {
        return DB::table('bill_costumers')->where('Account No', '=', $account_no)
        ->where('merchant_ref', '=', $merchant_ref)
        ->latest('Due Date')->get();
    }

    public function fetchPayments(int $bill_id)
    {
        return DB::table('bill_payment_transactions')
        ->where('bill_costumer_id', '=', $bill_id)
        // return Transaction::where('bill_costumer_id', '=', $bill_id)
        ->get();
    }

    public function fetchBillMerchantList(string $merchant_ref, string $account_no)
    {
        return DB::table('bill_costumers')
        ->where('merchant_ref', '=', $merchant_ref)
        ->where('Account No', '=', $account_no)
        ->latest('Bill From')
        ->get();
    }

}