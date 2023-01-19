<?php

declare(strict_types=1);

namespace App\Interface;

use App\Models\Permission;
use App\Models\Role;


interface RolePermissionInterface {

    public function findRole(string $field, string $ref): Role | null;

    public function findPermission(string $field, string $ref): Permission | null;

    public function permissions(): array;

    public function roles(): array;

    public function deleteRoleUser(string $user_id): bool;

    public function deletePermissionUser(string $user_id): bool;
    
}