<?php

declare(strict_types=1);

namespace App\Repository;

use App\Interface\DashBoardInterface;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;

// use Spatie\Permission\Models\Permission as ModelsPermission;
// use Spatie\Permission\Models\Role as ModelsRole;

class DashBoardRepository implements DashBoardInterface
{

    public function getTotalRoleUsers(string | null $role = null): mixed
    {
        return DB::table('users')
            ->select(DB::raw('COUNT(users.id) as count_total'), 'roles.name as name')
            ->join('model_has_roles', 'model_has_roles.model_id', '=', 'users.id')
            ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
            // ->where('roles.name', '=', 'administrator')
            ->groupBy('roles.name')
            ->get();

        // result
        // [
        //     {
        //         "count_total": 4,
        //         "name": "administrator"
        //     },
        //     {
        //         "count_total": 1,
        //         "name": "merchant"
        //     }
        // ]

        // $data = User::query()
        //     ->select(['roles.name'])
        //     ->whereHas('roles', function($q) use($role) {
        //         $q->when($role == null, function ($q) {
        //             $q->groupBy('name');
        //         }, function ($q) use ($role) {
        //             $q->where('roles.name', '=', $role);
        //         });
        //     })
        //     ->count();
        // return $data;
    }

    public function getTotalRolePermission(string|null $role = null): mixed
    {
        //    return DB::table('users')
        //             ->select(DB::raw('COUNT(users.id) as count_total'), 'permissions.name as name')
        //             ->leftJoin('model_has_permissions', 'model_has_permissions.model_id', '=', 'users.id')
        //             ->leftJoin('permissions', 'permissions.id', '=', 'model_has_permissions.permission_id')
        //             ->leftJoin('model_has_roles', 'model_has_roles.model_id', '=', 'users.id')
        //             ->leftJoin('roles', 'roles.id', '=', 'model_has_roles.role_id')
        //             ->where('roles.name', '=', 'administrator')
        //             ->groupBy('permissions.name')
        //             ->get();

        return DB::table('users')
            ->select(DB::raw('COUNT(users.id) as count_total'), 'permissions.name as permission', 'roles.name as role')
            ->leftJoin('model_has_permissions', 'model_has_permissions.model_id', '=', 'users.id')
            ->leftJoin('permissions', 'permissions.id', '=', 'model_has_permissions.permission_id')
            ->leftJoin('model_has_roles', 'model_has_roles.model_id', '=', 'users.id')
            ->leftJoin('roles', 'roles.id', '=', 'model_has_roles.role_id')

            ->groupBy('permissions.name')
            ->groupBy('roles.name')
            ->get();
            // result
            // [
            //     {
            //         "count_total": 1,
            //         "permission": "admin",
            //         "role": "administrator"
            //     },
            //     {
            //         "count_total": 1,
            //         "permission": "admin",
            //         "role": "merchant"
            //     },
            //     {
            //         "count_total": 2,
            //         "permission": "authorizer",
            //         "role": "administrator"
            //     },
            //     {
            //         "count_total": 1,
            //         "permission": "uploader",
            //         "role": "administrator"
            //     }
            // ]
    }

    public function getTotalUserPermissionRole(string $role): mixed {
        return DB::table('users')
            ->select(DB::raw('COUNT(users.id) as count_total'), 'permissions.name as permission')
            ->leftJoin('model_has_permissions', 'model_has_permissions.model_id', '=', 'users.id')
            ->leftJoin('permissions', 'permissions.id', '=', 'model_has_permissions.permission_id')
            ->leftJoin('model_has_roles', 'model_has_roles.model_id', '=', 'users.id')
            ->leftJoin('roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->where('roles.name', '=', $role)
            ->groupBy('permissions.name')
            ->get();
    }

    public function countMembers(string|null $merchant_ref = null): mixed
    {
        return DB::table('members')
        ->select(DB::raw('COUNT(members.id) as count_total'))
        ->when($merchant_ref, fn($query) => $query->where('merchant_ref', '=', $merchant_ref))->get();
    }
}
