<?php

declare(strict_types=1);

namespace App\Repository;

use App\Interface\BillInterface;
use App\Models\Bill;
use App\Models\BillCostumer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use Illuminate\Contracts\Pagination\Paginator;

class BillRepository implements BillInterface
{


    public function countBill(string $merchant_id): mixed
    {
        return DB::table('bills')
            ->select(DB::raw('COUNT(id) as bill_total'))
            ->where('merchant_id', '=', $merchant_id)->get();
    }

    public function billLists(string $merchant_id): Paginator
    {
        $bill = DB::table('bills')
            ->where('merchant_id', '=', $merchant_id)
            ->orderBy('bill_month')
            ->paginate(5);
        return $bill;
    }

    public function billCostumerList(string $batch_no): Paginator 
    {
        try {
            $bill = DB::table('bill_costumers')
                ->where('batch_no', '=', $batch_no)
                ->paginate(10);
            return $bill;
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Request Failed. Server Error Encounter. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        } catch (QueryException $e) {
            return response()->json([
                'message' => "Request Failed. Server Error Encounter. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        }
    }

    public function bill(string $bill_id, string $merchant_id)
    {
        try {
            $bill = DB::table('bills')
                ->where('merchant_id', '=', $merchant_id)
                ->where('id', '=', $bill_id)
                // ->orderBy('bill_month')
                ->first();
            return $bill;
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Request Failed. Server Error Encounter. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        } catch (QueryException $e) {
            return response()->json([
                'message' => "Request Failed. Server Error Encounter. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        }
    }

    public function billCostumerbyId(int $bill_id)
    {
        try {
            // return DB::table('bill_costumers')
            return BillCostumer::where('id', '=', $bill_id)
                ->first();
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Request Failed. Server Error Encounter. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        } 
    }

    public function billCostumer(int $bill_id, string $merchant_ref, string $account_no)
    {
        try {
            // return DB::table('bill_costumers')
            return BillCostumer::
                where('merchant_ref', '=', $merchant_ref)
                ->where('id', '=', $bill_id)
                ->where('Account No', '=', $account_no)
                // ->orderBy('bill_month')
                ->first();
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Request Failed. Server Error Encounter. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        } 
    }

    public function approvedBill(string $bill_id, string $merchant_id): bool
    {
        try {
            $response = DB::table('bills')
                ->where('id', '=', $bill_id)
                ->where('merchant_id', '=', $merchant_id)
                ->update(['date_approved' => now(), 'status' => 'Approved']);
            return $response == 0 ? false : true;
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Request Failed. Server Error Encounter. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        } catch (QueryException $e) {
            return response()->json([
                'message' => "Request Failed. Server Error Encounter. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        }
    }

    public function rejectBill(string $bill_id, string $merchant_id): bool
    {
        try {
            $response = DB::table('bills')
                ->where('id', '=', $bill_id)
                ->where('merchant_id', '=', $merchant_id)
                ->update(['date_reject' => now(), 'status' => 'Reject']);
            return $response == 0 ? false : true;
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Request Failed. Server Error Encounter. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        } catch (QueryException $e) {
            return response()->json([
                'message' => "Request Failed. Server Error Encounter. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        }
    }

    public function storeBillDdetails(array $datas): bool | JsonResponse
    {
        try {
            // $bill = DB::table('bills')->insert($datas);
            $bill =  Bill::create($datas);
            return $bill ? true : false;
            // Log::info($bill);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Request Failed. Server Error Encounter. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        } catch (QueryException $e) {
            return response()->json([
                'message' => "Request Failed. Server Error Encounter. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        }
    }

    public function billReportList(string $bill_reference)
    {
        return DB::table('bill_costumers')->where('batch_no', '=', $bill_reference)->get()->toArray();
    }

}
