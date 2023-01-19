<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Http\Requests\MemberAddRequest;
use App\Http\Requests\UploadBillRequest;
use App\Http\Requests\UploadMemberRequest;
use App\Interface\BillInterface;
use App\Interface\MemberInterface;
use App\Jobs\UploadMember;
use App\Jobs\UploadMemberJob;
use App\Mapper\MemberMapper;
use Exception;
use Illuminate\Bus\Batch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;
use App\Helpers\FileUploadHelper;
use Carbon\Carbon;
use Ramsey\Uuid\Uuid;

class UploaderController extends Controller
{

    use FileUploadHelper;

    private MemberInterface $member_repo;
    private BillInterface $bill_repo;
    
    public function __construct(MemberInterface $member_repo, BillInterface $bill_repo)
    {
        $this->member_repo = $member_repo;
        $this->bill_repo = $bill_repo;
    }
    

    public function uploadBill(Request $request): JsonResponse
    {
        try {
            $user = $request->user()->load('info');
            if (!$user->info->merchant_ref) {
                return response()->json(['message' => 'Unable to Upload Bills Data.'], 400);
            }
            // validate bill
            //code...
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function uploadBills(UploadBillRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $user = $request->user()->load('info');
            $userMerchant = $user->info->merchant();
            $countBill = $this->bill_repo->countBill($userMerchant->id);
            $batchNo = "BN" . date('Y') . date('m') . date('d') . $countBill[0]->bill_total."-".$userMerchant->merchant_ref;
            // upload file return path_file
            // create folder
            // validate bill_month have no overlap -> build repository query checking have no same month bill


            if(!$this->makeFolder('bills', $userMerchant->merchant_ref)) {
                return response()->json(['message' => 'Sorry Unable to Upload Bill. Error Encounter in Saving Bill'], 400);
            }

            if(!$path_file = $this->storeFile('bills', $userMerchant->merchant_ref, "{$batchNo}".".csv", $request->bills)) {
                return response()->json(['message' => 'Sorry Unable to Upload Bill. Error Encounter in Saving Bill'], 400);
            }
            // $path_file = "public/bills/{$userMerchant->merchant_ref}/{$batchNo}.csv";
            $datas = [
                'id' => Uuid::uuid4(),
                'batch_no' => $batchNo,
                'merchant_id' => $userMerchant->id,
                'path_file' => $path_file,
                'bill_month' => date("Y-m-d", strtotime($request->bill_month)),
                'remarks' => $request->remarks,
                'date_uploaded' => now('Asia/Manila')
            ];

            $this->bill_repo->storeBillDdetails($datas);
            DB::commit();
            return response()->json(['message' => 'Uploading Bill Success'], 200);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }


    public function uploadMember(UploadMemberRequest $request): JsonResponse
    {

        try {
            $user = $request->user()->load('info');
            if (!$user->info->merchant_ref) {
                return response()->json(['message' => 'Unable to Upload Members Data.'], 400);
            }
            // validate bill
            // Log::info(request()->has('members'));
            if (request()->has('members')) {
                $datas = file($request->members);
                $chunks = array_chunk($datas, 100);

                $batch = Bus::batch([])->dispatch();
                $headers = [];
                foreach ($chunks as $key => $chunk) {
                    $datas = array_map('str_getcsv', $chunk);
                    if ($key == 0) {
                        $headers = $datas[0];
                        unset($datas[0]);
                    }

                    $jobs[] = new UploadMemberJob($headers, $datas);
                }

                $batch->add($jobs);

                // Bus::batch($jobs)
                //     ->then(function (Batch $batch) {
                //         return response()->json([
                //             'data' => [
                //                 'batchId' => $batch->id
                //             ]
                //         ], 200);
                //     })
                //     ->catch(function (Batch $batch, Throwable $e) {
                //         return response()->json([
                //             'message' => $e->getMessage(),
                //             'data' => [
                //                 'batch' => $batch
                //             ]
                //         ], 400);
                //     })
                //     ->dispatch();
                return response()->json([
                    'data' => [
                        'batchId' => $batch->id
                    ]
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Error Reuqest'
                ], 400);
            }
        } catch (Exception $e) {
            // DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function addMember(MemberAddRequest $request): JsonResponse 
    {
        try {
            $user = $request->user()->load('info');
            $datas = MemberMapper::AddMemberMapper($request);
            $this->member_repo->addMemberManual($datas, $user->info->merchant_ref);
            return response()->json(['message' => 'Add Member Request Success.'], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }
    
}
