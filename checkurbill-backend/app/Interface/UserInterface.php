<?php

declare(strict_types=1);

namespace App\Interface;

use App\Models\Merchant;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\UserInfo;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Http\JsonResponse;

interface UserInterface {

    public function createUser(array $data): User;

    public function createUserInfo(User $user, array $data): UserInfo;

    public function assignRolePermission( Role | null $role, Permission | null $permission, User $user): void;

    public function activateUser(string $user_id, string $merchant_ref): bool;

    public function DeactivateUser(string $user_id, string $merchant_ref): bool;

    public function users(string|null $search = ''): Paginator;

    public function user(string|null $user_id): User | null;

    public function userFindbyEmail(string $email): User | null;

    public function usersAdministrator(string $type, string $user_id, string $role): Paginator;

    public function updateProfile(string $user_id, string $avatar): bool;

    public function updateProfileInfo(string $user_id, array $datas): bool;

    public function updatePasswordInfoUser(string $user_id, string $password): bool;

    public function verifyOldPassword(string $user_id, string $password): bool;

    
    public function manualActivateUser(string $user_id, string $email): bool;

    public function manualDeActivateUser(string $user_id, string $email): bool;

    public function deleteUserAdmin(string $user_id, string $email): bool;

    public function generateVerificationToken(string $email, string $code): bool;

    public function fetchMerchantUserDetails(string $merchant_ref): Merchant;

    public function createUserMerchant(array $data): User | JsonResponse;

    public function createUserInfoMerchant(User $user, array $data): UserInfo | JsonResponse;
    
}