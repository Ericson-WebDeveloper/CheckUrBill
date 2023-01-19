<?php

declare(strict_types=1);

namespace App\Interface;

interface DashBoardInterface {
    
    public function getTotalRoleUsers(string | null $role = null): mixed;

    public function getTotalRolePermission(string|null $role = null): mixed;

    public function countMembers(string|null $merchant_ref = null): mixed;

    public function getTotalUserPermissionRole(string $role): mixed;
}