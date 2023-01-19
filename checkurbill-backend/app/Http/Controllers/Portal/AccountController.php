<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Http\Controllers\LinkController;
use App\Http\Requests\AccountEnrollRequest;
use App\Interface\AccountInterface;
use App\Mail\AccountLinkConfirmMail;
use App\Models\Account;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AccountController extends Controller
{

    private AccountInterface $account_repo;
    private $otherhelper;

    public function __construct(AccountInterface $account_repo)
    {
        $this->account_repo = $account_repo;
        $this->otherhelper = new LinkController;
    }

    public function accountLists(Request $request): JsonResponse
    {
        try {
            $accounts = $this->account_repo->getAccounts($request->user()->id);
            return response()->json(['data' => $accounts], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function accountBillMerchantLists($merchant_ref, $account_no): JsonResponse
    {
        try {
            $bills = $this->account_repo->fetchBillMerchantList($merchant_ref, $account_no);
            return response()->json(['data' => $bills], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function confirmAccountLink(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $now = Carbon::now('Asia/Manila');
            $accountDetails = $this->account_repo->getAccount($request->ref1);
            if(!$accountDetails) {
                return response()->json(['message' => 'Account Not Found'], 400);
            }
            // code verify
            if( $accountDetails->code !== $request->ref4) {
                return response()->json(['message' => 'Code not Match'], 400);
            }

            $seconds = $now->diffInSeconds($accountDetails->code_generate);
            // 300 seconds -> 5 minutes
            // 86400 seconds -> 1 day
            if ($seconds >= 300) {
                return response()->json(['message' => 'Token Code Expires. Please Request New Code'], 400);
            }
            
            if($this->account_repo->verifyAccount($request->ref2, $request->ref1)) {
                DB::commit();
                return response()->json(['message' => 'Account verified Success.'], 200);
            } else {
                return response()->json(['message' => 'Unable to verify the account for now. please try again.'], 400);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function enrollAccount(AccountEnrollRequest $request): JsonResponse
    {

        try {
            DB::beginTransaction();
            // 1. validate data

            // 2. fetch merchant data if merchant_ref is valid
            $merchant = $this->account_repo->fetchMerchant($request->merchant);
            if (!$merchant) {
                return response()->json(['message' => 'merchant details not found. cannot enroll now. try again later'], 400);
            }
            $memberAccount = $this->account_repo->fetchMemberAccount(
                $request->merchant,
                $request->account_no,
                $request->email
            );
            // 3. select query in members table using merchant_ref and account_no
            if (!$memberAccount) {
                return response()->json(['message' => 'account details not found. details you submitted not matches in record. try again later'], 400);
            }
            // 4. validate firstname, lastname, middlename, email are matches in members data
            // 5. create account links
            $accountCreate = $this->account_repo->accountLink([
                'user_id' => $request->user()->id, 
                'member_id' => $memberAccount->id, 
                'account_no' => $memberAccount->account_no, 
                'merchant_ref' => $merchant->merchant_ref, 
                'merchant_name' => $merchant->merchant_name, 
                'firstname' => $request->firstname, 
                'lastname' => $request->lastname, 
                'middlename' => $request->middlename, 
                'email' => $request->email, 
                'code' => $this->otherhelper->getTokenCode(10), 
                'code_generate' => now('Asia/Manila')
            ]);
            // 6. send confirm code to email
            Mail::to($request->email)->send(new AccountLinkConfirmMail($accountCreate));
            DB::commit();
            return response()->json(['data' => ['account_ref_1' => $accountCreate->id, 
            'account_ref_2' => $accountCreate->account_no, 'account_ref_3' => $accountCreate->merchant_name,
            // 'account_ref_4' => $accountCreate->code
                ]
            ],201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function fetchBill(string $ref, string|int $account_no): JsonResponse
    {
        try {
            $bill = $this->account_repo->fetchBillCurrent($account_no, $ref);
            // return response()->json(['data' => $bill[0]], 200);
            return response()->json(['data' => count($bill) > 0 ? $bill[0] : null], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function fetchBills(string $ref, string|int $account_no): JsonResponse
    {
        try {
            $bill = $this->account_repo->fetchBillCurrent($account_no, $ref);
            return response()->json(['data' => $bill], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function getTransactionPayments(int $bill_id): JsonResponse
    {
        try {
            $payments = $this->account_repo->fetchPayments($bill_id);
            return response()->json(['data' => $payments], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function getMyBillsByMerchant(Request $request): JsonResponse
    {
        try {
            $merchantBills = $this->account_repo->fetchBillMerchantList($request->merchant_ref, $request->account_no);
            return response()->json(['data' => $merchantBills], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }


}
