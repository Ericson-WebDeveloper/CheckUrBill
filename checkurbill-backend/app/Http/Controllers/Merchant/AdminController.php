<?php

namespace App\Http\Controllers\Merchant;

use App\Events\MerchantAdminCreateEvents;
use App\Exports\BillReportExportExcel;
use App\Helpers\FileUploadHelper;
use App\Http\Controllers\Controller;
use App\Http\Controllers\LinkController;
use App\Http\Requests\RequestAdministrato;
use App\Interface\AccountInterface;
use App\Interface\BillInterface;
use App\Interface\MemberInterface;
use App\Interface\MerchantInterface;
use App\Interface\RolePermissionInterface;
use App\Interface\TransactionInterface;
use App\Interface\UserInterface;
use App\Jobs\GenerateBillReportJobs;
use App\Jobs\GenerateTransactionPaymentReport;
use App\Mapper\MerchantMapper;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class AdminController extends Controller
{

    use FileUploadHelper;
    
    private UserInterface $userrepo;
    private MerchantInterface $merchant_repository;
    private RolePermissionInterface $rolepermissionrepo;
    private MemberInterface $member_repo;
    private AccountInterface $account_repo;
    private BillInterface $bill_repo;
    private TransactionInterface $trans_repo;

    public function __construct(UserInterface $userrepo, MerchantInterface $merchant_repository, RolePermissionInterface $rolepermissionrepo, 
    MemberInterface $member_repo, AccountInterface $account_repo, BillInterface $bill_repo, TransactionInterface $trans_repo)
    {
        $this->userrepo = $userrepo;
        $this->merchant_repository = $merchant_repository;
        $this->rolepermissionrepo = $rolepermissionrepo;
        $this->member_repo = $member_repo;
        $this->account_repo = $account_repo;

        $this->bill_repo = $bill_repo;
        $this->trans_repo = $trans_repo;
    }

    public function billLists(Request $request): JsonResponse
    {
        try {
            $user = $request->user()->load('info');

            if (!$user->info->merchant_ref) {
                return response()->json(['message' => 'Unable to Create New Administrator.'], 400);
            }
            // fetch bills all here

        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function createMerchantAdminUser(RequestAdministrato $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $userAuth = $request->user()->load('info');
            if (!$userAuth->info->merchant_ref) {
                return response()->json(['message' => 'Unable to Create New Administrator.'], 400);
            }
            $merchant = $this->userrepo->fetchMerchantUserDetails($userAuth->info->merchant_ref);
            // password in front end generated
            // or in activated user will follow in email 
            $password = (new LinkController)::generatePassword(12);
            $data1 = MerchantMapper::addNewAdmin($request, $password);
            // [
            //     'firstname' => $request->firstname,
            //     'lastname' => $request->lastname,
            //     'middlename' => $request->middlename,
            //     'status' => 'Not Activated',
            //     'email' => $request->email,
            //     'password' => Hash::make($password),
            //     'remember_token' => Str::random(10)
            // ];

            $data2 = MerchantMapper::addNewAdminInfo($request, $userAuth->info->merchant_ref);
            //  [
            //     'gender' => $request->gender,
            //     'avatar' => $request->avatar,
            //     'contact_no' => $request->contact_no,
            //     'merchant_ref' => $userAuth->info->merchant_ref
            // ];

            // add send email link to activate user account
            // $user = $this->userrepo->createUser($data1);
            // if (!$user) {
            //     return response()->json(['message' => 'Unable to create new administrator user'], 400);
            // }
            $user = $this->userrepo->createUserMerchant($data1);

            // $userinfo = $this->userrepo->createUserInfo($user, $data2);
            // if (!$userinfo) {
            //     return response()->json(['message' => 'Unable to create new administrator user'], 400);
            // }
            $userinfo = $this->userrepo->createUserInfoMerchant($user, $data2);

            $role = $this->rolepermissionrepo->findRole('name', 'merchant');
            $permission = $this->rolepermissionrepo->findPermission('id', $request->permission);
            $this->userrepo->assignRolePermission($role, $permission, $user);

            $code = (new LinkController)::generateTokenCode(70);

            $codeResponse = $this->userrepo->generateVerificationToken($user->email, $code);

            if(!$codeResponse) {
                return response()->json(['message' => 'Unable to generate verify code'], 400);
            }

            MerchantAdminCreateEvents::dispatch($user, $userinfo, $merchant, $code, $password);

            DB::commit();
            return response()->json(['message' => 'New Administrator Created Success. Authorizer will Approved this user.'], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    // manual activate
    // in front end in page the request to activate user is from email
    public function activateMerchantUser(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            if (!$request->user_id || !$request->merchant_ref) {
                return response()->json(['message' => 'Invalid data.'], 400);
            }
            $response = $this->userrepo->activateUser($request->user_id, $request->merchant_ref);
            if (!$response) {
                return response()->json(['message' => 'Sorry Cannot Find User or Unable to Activate user for the mean time. 
                please try again later.'], 400);
            }
            DB::commit();
            // send email to user with attach details account
            return response()->json(['message' => 'User Activate Success.'], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    // manual deactivate
    public function deactivateMerchantUser(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            if (!$request->user_id || !$request->merchant_ref) {
                return response()->json(['message' => 'Invalid data.'], 400);
            }
            $response = $this->userrepo->DeactivateUser($request->user_id, $request->merchant_ref);
            if (!$response) {
                return response()->json(['message' => 'Sorry Unable to DeActivate user for the mean time. please try again later.'], 400);
            }
            DB::commit();
            // send email to user with attach details account
            return response()->json(['message' => 'User DeActivate Success.'], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function merchantAdminLists(Request $request): JsonResponse
    {
        try {
            $user = $request->user()->load('info');
            $admins = $this->merchant_repository->adminLists($user->info->merchant_ref, $user->id);
            return response()->json(['data'=> $admins], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function generateReportBills(Request $request): JsonResponse
    {
        try {
            // first process
            $user = $request->user()->load('info');
            if(!$request->bill_reference) {
                return response()->json(['message' => 'required data missing'], 400);
            }
            
            $filename = $request->bill_reference.".csv"; // $filename = $request->bill_reference.".xlsx";
            $path = storage_path('app/public/transactions/'.$user->info->merchant_ref."/");

            if(!$this->makeFolder('transactions', $user->info->merchant_ref)) {
                return response()->json(['message' => 'Sorry Unable to Generate Bill Report File. please try again'], 400);
            }

            $this->createPutHeadersCsv($path,$filename,array('Account No','Transaction Type','Name','Address','Email',
            'Bill From','Bill To','Due Date','Reference No','Status','Balance','Amount Payment','Amount'));

            if(!$this->checkIfFileExist('transactions', $user->info->merchant_ref, $filename)) {
                return response()->json(['message' => 'Sorry Unable to Generate Bill Report File. please try again'], 400);
            }
            // pwde tong hatiin sa 2 process
            // 2nd process
            $batch = Bus::batch([])->dispatch();
            $bills = $this->bill_repo->billReportList($request->bill_reference);
            $chunks = array_chunk((array)$bills, 100);
            foreach ($chunks as $key => $chunk) {
                $jobs[] = new GenerateBillReportJobs($chunk, $filename, $path);
            }
            $batch->add($jobs);
            return response()->json([
               'data' => [
                'progress_ref' => $batch->id,
                'filename_downloaded' => $user->info->merchant_ref."/".$filename
               ]
            ], 200);
            // Excel::store(new BillReportExportExcel($request->bill_reference), "transactions/{$filename}");
            // $batch = Bus::batch([new GenerateBillReportJobs($filename, $request->bill_reference)])->dispatch();
            // return response()->json(['data' => [
            //         'progress_ref' => $batch->id,
            //         // 'progress_ref' => 1,
            //         'filename_downloaded' => $filename
            //     ]
            // ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function downloadFile(Request $request)
    {
        try {
            if(!$request->query('filename_downloaded')) {
                return response()->json(['message' => 'required data missing. please try again.'], 400);
            }
            $filename = $request->query('filename_downloaded');
            $stringnames = explode('/', $filename);
            $folder = $stringnames[0];
            $filen = $stringnames[1];
            
            if(!$this->checkIfFileExist('transactions', $folder, $filen)) {
                return response()->json(['message' => 'Sorry Unable to Generate Bill Report File. please try again'], 400);
            }
            $headers = [
                // 'Content-Type' => 'application/xlsx',
                "Content-type" => "text/csv", // 'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ];
            $path = 'app/public/transactions/'.$folder."/".$filen;
            $file = storage_path($path);
            // return response()->json(['data' => 
            // return   Storage::download("public/transaction/{$filename}", 'Bill Report.xlsx', $headers)
                // ], 200);
            return response()->download($file, $filen, $headers)->deleteFileAfterSend(true);
            // return response()->download(Storage::path("app/public/transactions/".$filename));
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function updateStatusMember(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            if(!$request->member && !$request->account_no && !$request->status) {
                return response()->json(['message' => 'invalid data. please try again.'], 400);
            }
            $member = $this->member_repo->fetchMember($request->member, $request->account_no);
            $account = $this->account_repo->getAccount2($request->member);
            // Log::info($member);
            // Log::info($account);
            if(!$member || !$account || $member->id != $request->member) {
                return response()->json(['message' => 'invalid data. data not found. please try again.'], 400);
            }
            // update status of member data -> active, warning & deleted
            if(!$this->member_repo->updateMember($request->member, ['status' => $request->status], $request->account_no)) {
                return response()->json(['message' => 'unable to update status of member account. please try again.'], 400);
            }
            
            // account
            if($account) {
                if($request->account_no != $account->account_no) {
                    return response()->json(['message' => 'invalid data. data not found. please try again.'], 400);
                } else {
                    
                    if(!$this->account_repo->updateAccountStatus($account->account_no, $account->id, ['status' => $request->status])) {
                        return response()->json(['message' => 'unable to update status of account. please try again.'], 400);
                    }
                }
            }
            DB::commit();
            return response()->json(['message' => 'Account Member Update Success'], 200);
            
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }





    public function generateReportTransactions(Request $request): JsonResponse
    {
        try {
            $user = $request->user()->load('info');

            if(!$request->trans_reference) {
                return response()->json(['message' => 'required data missing'], 400);
            }
            // $filename = $request->trans_reference.".xlsx";
            $filename = $request->trans_reference.".csv"; // $filename = $request->bill_reference.".xlsx";
            $path = storage_path('app/public/payments/'.$user->info->merchant_ref."/");

            if(!$this->makeFolder('payments', $user->info->merchant_ref)) {
                return response()->json(['message' => 'Sorry Unable to Generate Bill Report File. please try again'], 400);
            }

            $this->createPutHeadersCsv($path,$filename,array('Account No','Transaction Type','Name','Payment Remarks','Amount Payment',
            'Transaction Date', 'Transaction Payment Date', 'Email', 'Bill From',  'Bill To'));

            if(!$this->checkIfFileExist('payments', $user->info->merchant_ref, $filename)) {
                return response()->json(['message' => 'Sorry Unable to Generate Bill Report File. please try again'], 400);
            }
            // $batch = Bus::batch([new GenerateTransactionPaymentReport($filename, $request->trans_reference)])->dispatch();

            $batch = Bus::batch([])->dispatch();

            $transactions = $this->trans_repo->transactionReportList($request->trans_reference);
 
            $chunks = array_chunk((array)$transactions, 100);
            foreach ($chunks as $key => $chunk) {
                $jobs[] = new GenerateTransactionPaymentReport($chunk, $filename, $path);
            }
            $batch->add($jobs);

            return response()->json(['data' => [
                    'progress_ref' => $batch->id,
                    'filename_downloaded' => $user->info->merchant_ref."/".$filename
                ]], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function downloadFileTransactions(Request $request)
    {
        try {
            if(!$request->query('filename_downloaded')) {
                return response()->json(['message' => 'required data missing. please try again.'], 400);
            }
            $filename = $request->query('filename_downloaded');
            $stringnames = explode('/', $filename);
            $folder = $stringnames[0];
            $filen = $stringnames[1];
            $headers = [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ];
            // $file = storage_path("app/public/payments/".$filename);
            $file = storage_path("app/public/payments/".$folder."/".$filen);
            return response()->download($file, $filen, $headers)->deleteFileAfterSend(true);
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

}
