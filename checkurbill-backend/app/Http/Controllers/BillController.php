<?php

namespace App\Http\Controllers;

use App\Helpers\FileUploadHelper;
use App\Interface\BillInterface;
use App\Jobs\UploadBills;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BillController extends Controller
{   
    use FileUploadHelper;

    protected BillInterface $bill_repo;

    public function __construct(BillInterface $bill_repo)
    {
        $this->bill_repo = $bill_repo;
    }

    // paypal reference https://drive.google.com/drive/folders/1u6bPjlp8-PKADhksWTKfO6hao-pPnq2n

    public function userBillLists(Request $request): JsonResponse
    {
        try {
            $user = $request->user()->load('info');

            if (!$user->info->merchant_ref) {
                return response()->json(['message' => 'Unable to Create New Administrator.'], 400);
            }
            $userMerchant = $user->info->merchant();
            // fetch bills all here
            $bills = $this->bill_repo->billLists($userMerchant->id);
            // user user_id and merchant_ref
            return response()->json(['data' => $bills], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function userBill(Request $request, $biil_id): JsonResponse
    {
        try {
            $user = $request->user()->load('info');

            if (!$user->info->merchant_ref) {
                return response()->json(['message' => 'Unable to Create New Administrator.'], 400);
            }
            $userMerchant = $user->info->merchant();
            // fetch single bill
            $bill = $this->bill_repo->bill($biil_id, $userMerchant->id);
            // user user_id and merchant_ref
            // use if latest or not -> use $request->query('latest)
            return response()->json(['data' => $bill], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function approvingBillUpload(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            // get the bill data
            $bill = $this->bill_repo->bill($request->bill_id, $request->merchant_id);
            // if($bill) {
            if($bill && $this->bill_repo->approvedBill($request->bill_id, $request->merchant_id)) {
                $datas = $this->getFile($bill->path_file);
                // fetch file content
                $chunks = array_chunk((array)$datas, 100);
                // create Job and Dispatch
                $batch = Bus::batch([])->dispatch();
                $headers = [];
                foreach ($chunks as $key => $chunk) {
                    $datas = array_map('str_getcsv', $chunk);
                    if ($key == 0) {
                        $headers = $datas[0];
                        unset($datas[0]);
                    }
                    $jobs[] = new UploadBills($headers, $datas, $bill->batch_no);
                }
               
                $batch->add($jobs);
                DB::commit();
                return response()->json([
                    'message' => 'Bill Approved And Uploaded data in system', 
                    'data' => [
                    'batchId' => $batch->id
                        ]
                    ], 200);
            } else {
                DB::rollBack();
                return response()->json(['message' => 'Bill Approved And Uploaded Failed'], 400);
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

    public function rejectingBillUpload(Request $request): JsonResponse
    {
        try {
            if($this->bill_repo->rejectBill($request->bill_id, $request->merchant_id)) {
                return response()->json(['message' => 'Bill Reject Success'], 200);
            } else {
                return response()->json(['message' => 'Bill Reject Failed'], 400);
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function fetchBillCostumerListByBatchNo(string $ref): JsonResponse
    {
        try {
            $bills = $this->bill_repo->billCostumerList($ref);
            return response()->json(['data' => $bills], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }
}
