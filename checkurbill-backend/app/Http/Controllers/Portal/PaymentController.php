<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Interface\BillInterface;
use App\Interface\StripeInterface;
use App\Interface\StripInterface;
use App\Interface\TransactionInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use AmrShawky\LaravelCurrency\Facade\Currency;
use App\Interface\PaypalInterface;

class PaymentController extends Controller
{

    private StripeInterface $stripe_repo;
    private BillInterface $bill_repo;
    private TransactionInterface $trans_repo;
    private PaypalInterface $paypal_repo;

    public function __construct(StripeInterface $stripe_repo, BillInterface $bill_repo, TransactionInterface $trans_repo, PaypalInterface $paypal_repo)
    {
        $this->stripe_repo = $stripe_repo;
        $this->paypal_repo = $paypal_repo;
        $this->bill_repo = $bill_repo;
        $this->trans_repo = $trans_repo;
    }

    // public function convertTo($amount)
    // {
    //     return Currency::convert()
    //     ->from('PHP')
    //     ->to('USD')
    //     ->amount($amount)
    //     ->get();
    // }

    // public function convertReverse($amount)
    // {
    //     return Currency::convert()
    //     ->from('USD')
    //     ->to('PHP')
    //     ->amount($amount)
    //     ->get();
    // }

    public function paypalPayPost(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            if (!$request->merchant_id || !$request->merchant_ref || !$request->bill_id || !$request->account_no) {
                return response()->json(['message' => 'Invalid Data. Sorry Payment Failed'], 400);
            }

            $bill = $this->bill_repo->billCostumer($request->bill_id, $request->merchant_ref, $request->account_no);
            $client = config('app.paypal-public-key');
            $secret = config('app.paypal-secret-key');
            $credentials = base64_encode("{$client}:{$secret}");

            // paypal post payment_intent
            $paypalResponse = $this->paypal_repo->paypalPost(
                $credentials,
                $request->amount,
                ['firstname' => $request->user()->firstname, 'lastname' => $request->user()->lastname]
            );








            foreach ($paypalResponse['links'] as $link) {
                if ($link['rel'] === "approve") {
                    $orderLinks = $link['href'];
                }
            }
            if (!isset($orderLinks)) {
                return response()->json([
                    'message' => "Paypal Server Not Response. Please Try Again Later."
                ], 400);
            }

            $data = [
                'bill_costumer_id' => $bill->id,
                'amount' => floatval($bill->Amount),
                'payment_option' => 'paypal',
                'batch_no' => $bill->batch_no,
                'payment_ref_no' => $paypalResponse['id'],
                'transaction_date' => now('Asia/Manila') 
            ];

            $transaction = $this->trans_repo->createTransaction($data);

            if ($transaction) {
                DB::commit();
                return response()->json([
                    'data' => [
                        'link' => $orderLinks,
                        'payment_ref' => $paypalResponse['id'],
                        'trans_id' => $transaction->id,
                    ]
                ], 200);
            } else {
                DB::rollBack();
                return response()->json([
                    'message' => "Payment Request Cannot Execute Now. Please Try Again Later."
                ], 400);
            }
            //code...
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function stripePayPost(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            if (!$request->merchant_id || !$request->merchant_ref || !$request->payment_intent_reference || !$request->bill_id || !$request->account_no) {
                return response()->json(['message' => 'Invalid Data. Sorry Payment Failed'], 400);
            }
            $bill = $this->bill_repo->billCostumer($request->bill_id, $request->merchant_ref, $request->account_no);

            $payment_intent_id = $this->stripe_repo->stripePost(floatval($bill->Amount), $request->payment_intent_reference);

            if ($payment_intent_id) {
                // insert temporary payment transaction record return transaction
                $data = [
                    'bill_costumer_id' => $bill->id,
                    'amount' => floatval($bill->Amount),
                    'payment_option' => 'card',
                    'batch_no' => $bill->batch_no,
                    'payment_ref_no' => $request->payment_intent_reference,
                    'transaction_date' => now('Asia/Manila') // add jan 13 2023
                ];
                $transaction = $this->trans_repo->createTransaction($data);
                if (!$transaction) {
                    return response()->json(['message' => 'Cannot Process You Payment Now. Please Try Again Later.'], 400);
                }
                DB::commit();
                return response()->json([
                    'data' => [
                        'payment_id_ref' => $payment_intent_id,
                        'transaction_id' => $transaction->id
                    ]
                ], 200);
            } else {
                DB::rollback();
                return response()->json(['message' => 'Sorry Payment Failed. Please Try Again Later'], 400);
            }
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function paymentConfirmCancel(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            if (!$request->trans_id) {
                return response()->json(['message' => 'Invalid Data. unable to cancel payment. Sorry Payment Failed'], 200);
            }
            // $transactionpayment = $this->trans_repo->getTransaction($request->trans_id);
            // if (!$transactionpayment) {
            //     return response()->json(['message' => 'Payment Sorry Payment Failed'], 200);
            // }
            $response = $this->trans_repo->updateTransaction($request->trans_id, ['remarks' => 'Cancel', 'transaction_payment_date' => now('Asia/Manila')]);
            if($response) {
                DB::commit();
                return response()->json(['message' => 'Payment Sorry Payment Failed. Cancelling Payment.'], 200);  
            } else {
                return response()->json(['message' => 'Payment Sorry Payment Failed.'], 200);
            }

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function paypalConfirmPayment(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            if (!$request->payment_ref || !$request->PayerID || !$request->trans_id) {
                return response()->json(['message' => 'Invalid Data. Sorry Payment Failed'], 400);
            }
            $client = config('app.paypal-public-key');
            $secret = config('app.paypal-secret-key');
            $credentials = base64_encode("{$client}:{$secret}");

            $transactionpayment = $this->trans_repo->getTransaction($request->trans_id);
            $bill = $this->bill_repo->billCostumerbyId($transactionpayment->bill_costumer_id);
            if (!$transactionpayment || !$bill) {
                return response()->json(['message' => 'Payment Cannot Process Sorry. Please try again.'], 400);
            }
            $captureResponse = $this->paypal_repo->paypalCapturePost($credentials, $request->payment_ref, $request->PayerID);

            // icheck un business email account sa sandbox if my narerecieve n payment

            if ($captureResponse) {
                // update transaction amount from stripe confirm amount_recieve
                $this->trans_repo->updateTransaction($transactionpayment->id, [
                    'amount' => floatval($captureResponse['purchase_units'][0]['payments']['captures'][0]['amount']['value']), 
                    'status' => true,
                    'transaction_payment_date' => now('Asia/Manila'),
                    'remarks' => 'Success'
                ]);

                // compute from amount payment and transaction data. use floatval in computation
                $balance = floatval($bill->Amount) - floatval($captureResponse['purchase_units'][0]['payments']['captures'][0]['amount']['value']);

                $bill_costumer_datas = [
                    'Amount Payment' => floatval($bill['Amount Payment']) + floatval($captureResponse['purchase_units'][0]['payments']['captures'][0]['amount']['value']),
                    'Balance' => $balance,
                    'Status' => ($balance == 0.00 || $balance == 0 || $balance == "0.00" || $balance == "0") ? "Paid" : "Partial"
                ];

                // create array for update data transaction balance, amount pay, amount
                $responseLast = $this->trans_repo->updateBillCostumer($bill->id, $bill_costumer_datas);

                if ($responseLast) {
                    DB::commit();
                    return response()->json(['message' => 'Payment Success. It Will Reflect in DashBoard in a Few moments'], 200);
                } else {
                    return response()->json(['message' => 'Something wrong in Updating Bill Data'], 400);
                }

            } else {
                return response()->json(['message' => 'Something wrong. Cannot Confirm Your Payment in our System.'], 400);
            }
            // capture payment order
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

    public function stripeConfirm(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            if (
                !$request->merchant_id ||
                !$request->merchant_ref || !$request->payment_reference ||
                !$request->bill_id || !$request->account_no || !$request->trans_id || !$request->type_card
            ) {
                return response()->json(['message' => 'Invalid Data. Sorry Payment Failed'], 400);
            }
            $bill = $this->bill_repo->billCostumer($request->bill_id, $request->merchant_ref, $request->account_no);
            // get transaction data
            $transactionpayment = $this->trans_repo->getTransaction($request->trans_id);
            if (!$transactionpayment || !$bill) {
                return response()->json(['message' => 'Payment Cannot Process Sorry. Please try again.'], 400);
            }

            // repository confirm payment and get amount final
            $payment = $this->stripe_repo->stripeConfirmPost($request->payment_reference, $request->type_card);
            // if(!$payment) {
            //     return response()->json(['message' => 'Payment not Success. Please try again.'], 400);
            // }
            // 10055 -> 100.55
            Log::info($payment->amount_received);
            $amountArr = str_split((string)$payment->amount_received, strlen((string)$payment->amount_received) - 2);
            $payment->amount_received = $amountArr[0] . "." . $amountArr[1];

            // update transaction amount from stripe confirm amount_recieve
            $this->trans_repo->updateTransaction($transactionpayment->id, [
                'amount' => floatval($payment->amount_received),
                // 'amount' => floatval($amount_pay), 
                'payment_option' => $transactionpayment->payment_option." - {$request->type_card}",
                'status' => true,
                'transaction_payment_date' => now('Asia/Manila'), 'remarks' => 'Success'
            ]);

            // compute from amount payment and transaction data. use floatval in computation
            $balance = floatval($bill->Amount) - floatval($payment->amount_received);

            $bill_costumer_datas = [
                'Amount Payment' => floatval($bill['Amount Payment']) + floatval($payment->amount_received),
                'Balance' => $balance,
                'Status' => ($balance == 0.00 || $balance == 0 || $balance == "0.00" || $balance == "0") ? "Paid" : "Partial"
            ];

            // create array for update data transaction balance, amount pay, amount
            $responseLast = $this->trans_repo->updateBillCostumer($bill->id, $bill_costumer_datas);

            // update status and other data
            if ($responseLast) {
                DB::commit();
                return response()->json(['message' => 'Payment Success. It Will Reflect in DashBoard in a Few moments'], 200);
            } else {
                return response()->json(['message' => 'Something wrong in Updating Bill Data'], 400);
            }
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }
}
