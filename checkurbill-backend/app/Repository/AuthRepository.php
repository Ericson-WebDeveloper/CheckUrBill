<?php

declare(strict_types=1);

namespace App\Repository;

use App\Interface\AuthInterface;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthRepository implements AuthInterface
{

    public function checkEmail(string|null $email): User | null
    {

        $user = User::query()
            ->with('info')
            ->where('email', $email)->first();
        // $user = DB::table('users')->where('email', '=', $email)->first();
        if (!$user) {
            // return response()->json(['message' => 'Invalid Credentials'], 400);
            // die();
            return null;
        }

        return $user;
    }

    public function authAttemp(array $credentials): bool
    {

        if (!Auth::attempt($credentials)) {
            return false;
            // return response()->json(['message' => 'Invalid Credentials'], 400);
            // die();
        }

        return true;
    }
}
