<?php

declare(strict_types=1);

namespace App\Repository;

use App\Interface\PaypalInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaypalRepository implements PaypalInterface
{

    public function paypalPost(string $credentials, int|float $amount, array $datas)
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => "Basic {$credentials}"
            ])->post('https://api-m.sandbox.paypal.com/v2/checkout/orders', [
                "intent" => "CAPTURE",
                "purchase_units" => [
                    0 => [
                        "amount" => [
                            "currency_code" => 'PHP',
                            "value" => $amount
                        ]
                    ]
                ],
                "payer" => [
                    'email_addressstring' => 'KDKDKD@Gmail.com',
                    "name" => [
                        'given_name' => $datas['firstname'],
                        'surname' => $datas['lastname']
                    ],
                    "address" => [
                        "address_line_1" => "",
                        "address_line_2" => "",
                        "admin_area_1" => "",
                        "admin_area_2" => "",
                        "postal_code" => "",
                        "country_code" => "PH",
                    ],
                ],

                "application_context" => [
                    "brand_name" => "CheckUrbill",
                    "shipping_preference" => "NO_SHIPPING",
                    "user_action" => "PAY_NOW",
                    "return_url" => "http://localhost:3002/app/auth/payment-paypal/redirect?success=true",
                    "cancel_url" => "http://localhost:3002/app/auth/payment-paypal/redirect?success=false"
                ]

                // "payment_source" => [
                //     "paypal" => [
                //       "experience_context" => [
                //         "payment_method_preference" => "IMMEDIATE_PAYMENT_REQUIRED",
                //         "payment_method_selected" => "PAYPAL",
                //         "brand_name" => "CheckUrbill",
                //         "locale" => "en-US",
                //         "landing_page" => "LOGIN",
                //         "shipping_preference" => "SET_PROVIDED_ADDRESS",
                //         "user_action" => "PAY_NOW",
                //         "return_url" => "http://localhost:3000/payment-paypal/redirect?success=true",
                //         "cancel_url" => "http://localhost:3000/payment-paypal/redirect?success=false"
                //         ]
                //     ]
                // ]

            ]);


            if ($response->serverError() || $response->clientError() || $response->failed()) {
                return response()->json([
                    'error' => 'Paypal Payment Request Failed. Please Try again later'
                ], 500);
                die();
            }

            $response = $response->json();
            if (isset($response['error']) && $response['error'] != "") {
                return response()->json([
                    'error' => $response->error
                ], 500);
                die();
            }

            return $response;
        } catch (\Exception $e) {
            // update / delete transaction attempt
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => config('app.debug') ? $e->getMessage() : '',
                'error' => config('app.debug') ? get_class($e) : ''
            ], 500);
            die();
        }
    }

    public function generateBearerToken(string $client_id, string $secret_id)
    {
        try {
            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, 'https://api-m.sandbox.paypal.com/v1/oauth2/token');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials");
            curl_setopt($ch, CURLOPT_USERPWD, "{$client_id}" . ':' . "{$secret_id}");

            $headers = array();
            $headers[] = 'Content-Type: application/x-www-form-urlencoded';
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

            $result = curl_exec($ch);
            if (curl_errno($ch)) {
                return response()->json([
                    'message' => "Paypal Server Not Response. Please Try Again Later.",
                    'error' => curl_error($ch)
                ], 400);
                die();
            }
            curl_close($ch);
            $response = json_decode($result);
            // sample response
            // {
            //     "scope": "https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/disputes/read-buyer https://uri.paypal.com/services/payments/realtimepayment https://uri.paypal.com/services/disputes/update-seller https://uri.paypal.com/services/payments/payment/authcapture openid https://uri.paypal.com/services/disputes/read-seller https://uri.paypal.com/services/payments/refund https://api-m.paypal.com/v1/vault/credit-card https://api-m.paypal.com/v1/payments/.* https://uri.paypal.com/payments/payouts https://api-m.paypal.com/v1/vault/credit-card/.* https://uri.paypal.com/services/subscriptions https://uri.paypal.com/services/applications/webhooks",
            //     "access_token": "A21AAFEpH4PsADK7qSS7pSRsgzfENtu-Q1ysgEDVDESseMHBYXVJYE8ovjj68elIDy8nF26AwPhfXTIeWAZHSLIsQkSYz9ifg",
            //     "token_type": "Bearer",
            //     "app_id": "APP-80W284485P519543T",
            //     "expires_in": 31668,
            //     "nonce": "2020-04-03T15:35:36ZaYZlGvEkV4yVSz8g6bAKFoGSEzuy3CQcz3ljhibkOHg"
            //   }
            Log::info($response);
            return $response;
        } catch (\Exception $e) {

            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => config('app.debug') ? $e->getMessage() : '',
                'error' => config('app.debug') ? get_class($e) : ''
            ], 500);
            die();
        }
    }

    public function paypalCapturePost(string $credentials, string $approvalId, string $PayerID): mixed
    {
        try {

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => "Basic {$credentials}",
                'Paypal-Request-Id' => "{$PayerID}"
            ])->post("https://api-m.sandbox.paypal.com/v2/checkout/orders/{$approvalId}/capture", ['paypal' => '']);

            if ($response->serverError() || $response->clientError() || $response->failed()) {
                // update / delete transaction attempt
                return response()->json([
                    'error' => 'Payment Error Cannot Confirm. Please Try again'
                ], 400);
                die();
            }

            $response = $response->json();
            if (!isset($response['id']) || !isset($response['status']) || $response['status'] != "COMPLETED") {
                // update / delete transaction attempt
                return response()->json([
                    'error' => 'Payment Error Cannot Confirm. Please Try again'
                ], 500);
                die();
            }
            // Log::info($response);

            return $response;

            // $ch = curl_init();
            // curl_setopt($ch, CURLOPT_URL, "https://api-m.sandbox.paypal.com/v2/checkout/orders/{$approvalId}/capture");
            // curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            // curl_setopt($ch, CURLOPT_POST, 1);

            // $headers = array();
            // $headers[] = 'Content-Type: application/json';
            // $headers[] = "Authorization: Basic {$credentials}";
            // $headers[] = "Paypal-Request-Id: {$PayerID}";
            // curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

            // $response = curl_exec($ch);
            // $err = curl_error($ch);
            // curl_close($ch);
            // if ($err) {
            //     return response()->json([
            //         'message' => 'Payment using Paypal Platform Cannot ConFirm. Please Try Again Later.',
            //     ], 500);
            // }

            // // use the data
            // // $res = json_encode($response);
            // $res = json_decode( json_encode($response), true);
            // Log::info($res->id);
            // if (!$res) {
            //     return response()->json([
            //         'error' => 'Payment using Paypal Platform Failed. Please Try Again Later.'
            //     ], 400);
            //     die();
            // }

            // return $res;
        } catch (\Exception $e) {
            // update / delete transaction attempt
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => config('app.debug') ? $e->getMessage() : '',
                'error' => config('app.debug') ? get_class($e) : ''
            ], 500);
            die();
        }
    }
}
