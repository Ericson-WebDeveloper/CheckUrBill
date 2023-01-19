<?php

declare(strict_types=1);

namespace App\Interface;

use App\Models\User;
use Illuminate\Http\JsonResponse;

interface AuthInterface {

    
    public function checkEmail(string|null $email): User | null;

    public function authAttemp(array $credentials): bool;

}