<?php

declare(strict_types=1);

namespace App\Interface;

use App\Models\Role;
use App\Models\User;
use App\Models\UserPortal;
use Illuminate\Http\JsonResponse;

interface PortalUserInterface {

    public function checkEmail(string $email): User | null;

    public function createUser(array $datas): User;

    public function assignRole(Role|null $role, User $user): void;

    public function authAttemp(array $credentials): bool;

    public function updateAccountInfo(string $user_id, array $datas): bool;
}