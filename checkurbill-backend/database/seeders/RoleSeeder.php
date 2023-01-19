<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role as AppModelsRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Contracts\Role;
use Spatie\Permission\Models\Role as ModelsRole;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = ['administrator', 'merchant', 'user'];
        $permissions = ['admin', 'uploader', 'authorizer'];

        foreach($roles as $role) {
            AppModelsRole::create(['name' => $role, 'guard_name' => 'web']);
        }

        foreach($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }
        
        // $roles->each(function($role) {
        //     Log::info($role);
        //     ModelsRole::create(['name' => $role, 'guard_name' => 'web']);
        //  });
        
    }
}
