<?php

declare(strict_types=1);

namespace App\Repository;

use App\Interface\PortalUserInterface;
use App\Models\Role;
use App\Models\User;
use App\Models\UserPortal;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PortalUserRepository implements PortalUserInterface
{

    public function checkEmail(string $email): User | null
    {
        $user = User::query()
            ->with('info')
            ->where('email', $email)
            ->whereHas('roles', function($q) {
                return $q->where('name', '=', 'user');
            })
            ->first();
        if (!$user) {
            return null;
        }
        return $user;
    }

    public function createUser(array $datas): User
    {
        return User::create($datas);
    }

    public function assignRole(Role|null $role, User $user): void
    {
        if ($role) $user->assignRole($role);
    }

    public function authAttemp(array $credentials): bool
    {
        if (!Auth::attempt($credentials)) {
            return false;
        }
        return true;
    }

    public function updateAccountInfo(string $user_id, array $datas): bool
    {
        $response = DB::table('users')->where('id', '=', $user_id)
        ->update($datas);
        return $response == 0 ? false : true;
    }


}