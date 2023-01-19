<?php

declare(strict_types=1);

namespace App\Interface;

use Illuminate\Http\JsonResponse;

interface StripeInterface {

    public function stripePost(int|float $amount, string $stripeToken): string|int|JsonResponse;

    public function stripeConfirmPost(string $payment_intents_id, string|null $type_card = null);
}