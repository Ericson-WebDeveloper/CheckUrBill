<?php

namespace App\Http\Controllers;

use App\Interface\TransactionInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    // paypal reference https://drive.google.com/drive/folders/1u6bPjlp8-PKADhksWTKfO6hao-pPnq2n
    private TransactionInterface $trans_repo;
    public function __construct(TransactionInterface $trans_repo)
    {
        $this->trans_repo = $trans_repo;
    }

    public function fetchTransactionPayments(Request $request, $reference): JsonResponse
    {
        try {
            if(!$reference) {
                return response()->json(['message' => 'invalid data. data not found'], 400);
            }
            $transactions = $this->trans_repo->getTransactions($reference);
            return response()->json(['data' => $transactions], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e) 
            ], 500);
        }
    }
}
