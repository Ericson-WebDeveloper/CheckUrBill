<?php

declare(strict_types=1);

namespace App\Repository;

use App\Interface\RolePermissionInterface;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class RolePermissionRepository implements RolePermissionInterface
{

    public function findRole(string $field, string $ref): Role | null
    {
        $role = DB::table('roles')->where($field, $ref)->first();
        return $role ? new Role((array)$role) : null;
    }

    public function findPermission(string $field, string $ref): Permission | null
    {
        $permission = DB::table('permissions')->where($field, $ref)->first();
        return $permission ? new Permission((array)$permission) : null;
    }

    public function permissions(): array {
        return DB::table('permissions')->get()->toArray();
    }

    public function roles(): array {
        return DB::table('roles')->get()->toArray();
    }

    public function deleteRoleUser(string $user_id): bool {
        $response = DB::table('model_has_roles')->where('model_id', '=', $user_id)->delete();
        return $response == 0 ? false : true;
    }

    public function deletePermissionUser(string $user_id): bool {
        $response = DB::table('model_has_permissions')->where('model_id', '=', $user_id)->delete();
        return $response == 0 ? false : true;
    }

}
