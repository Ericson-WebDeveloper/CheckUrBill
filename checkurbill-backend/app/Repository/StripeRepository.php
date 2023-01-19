<?php

declare(strict_types=1);

namespace App\Repository;

use App\Interface\StripeInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class StripeRepository implements StripeInterface
{


    public function stripePost(int|float $amount, string $stripeToken): string|int|JsonResponse
    {
        try {
            $stripe = new \Stripe\StripeClient('sk_test_51H0dohKWzaP0y47nwJHdOzaVFfh0vQXjuKTT8izINS5GvuoUT1jNcM0WD5fvLn1bNOEhurk39Wfyq6rkmkXpWiuO00sWCHCqkB');
            $response = $stripe->paymentIntents->create([
                "amount" => $amount * 100,
                // "amount" => $amount,
                "currency" => "php",
                "payment_method" => $stripeToken,
                "confirmation_method" => "manual",
                'payment_method_types' => ['card'],
            ]);

            if (!$response->id || gettype($response->id) != 'string') {
                return response()->json([
                    'message' => "Payment Request Failed. Please try again/later.",
                ], 400);
                die();
            }
            return $response->id;
        } catch (\Stripe\Exception\RateLimitException $e) {
            // Too many requests made to the API too quickly
            return response()->json([
                'message' => "Too many requests made to the API too quickly"
            ], 500);
            die();
        } catch (\Stripe\Exception\InvalidRequestException $e) {
            // Invalid parameters were supplied to Stripe's API
            return response()->json([
                'message' => "Invalid parameters were supplied to Stripe's API"
            ], 500);
            die();
        } catch (\Stripe\Exception\AuthenticationException $e) {
            // Authentication with Stripe's API failed
            return response()->json([
                'message' => "Authentication with Stripe's API failed"
            ], 500);
            die();
            // (maybe you changed API keys recently)
        } catch (\Stripe\Exception\ApiConnectionException $e) {
            // Network communication with Stripe failed
            return response()->json([
                'message' => "Network communication with Stripe failed"
            ], 500);
            die();
        } catch (\Stripe\Exception\ApiErrorException $e) {
            // Display a very generic error to the user, and maybe send
            return response()->json([
                'message' => "isplay a very generic error to the user, and maybe send"
            ], 500);
            die();
            // yourself an email
        } catch (\Exception $e) {
            // update / delete transaction attempt
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') ? get_class($e) : ''
            ], 500);
            die();
        }
    }

    public function stripeConfirmPost(string $payment_intents_id, string|null $type_card = null)
    {
        try {
            // payment_method: optional
            $payment_method = $type_card == null ? [] : ($type_card == "Master Card" ? ['payment_method' => "pm_card_mastercard"] : 
            ['payment_method' => "pm_card_visa"]);
            $stripe = new \Stripe\StripeClient('sk_test_51H0dohKWzaP0y47nwJHdOzaVFfh0vQXjuKTT8izINS5GvuoUT1jNcM0WD5fvLn1bNOEhurk39Wfyq6rkmkXpWiuO00sWCHCqkB');
            $response =  $stripe->paymentIntents->confirm(
                $payment_intents_id,
                // ['payment_method' => 'pm_card_visa']
                // ['payment_method' => 'pm_card_mastercard']
                $payment_method
            );

            if (!$response->status && $response->status !== "succeeded") {
                // update / delete transaction attempt
                return response()->json([
                    'message' => "Payment Request Failed. Please try again/later.",
                ], 400);
                die();
            }
            return $response;
        } catch (\Exception $e) {
            // update / delete transaction attempt
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') ? get_class($e) : ''
            ], 500);
            die();
        }
    }

    public function stripePaymentPost()
    {
        // insert transaction data

    }

    public function stripeCapturePost()
    {
        // update transaction data
    }
}
