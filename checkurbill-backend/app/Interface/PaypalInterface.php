<?php

declare(strict_types=1);

namespace App\Interface;

use Illuminate\Http\JsonResponse;

interface PaypalInterface {

    public function paypalPost(string $credentials, int|float $amount, array $datas);

    public function generateBearerToken(string $client_id, string $secret_id);

    public function paypalCapturePost(string $credentials, string $approvalId, string $PayerID): mixed;
    
}