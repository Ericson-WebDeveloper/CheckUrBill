<?php

namespace Database\Seeders;

use App\Models\Permission as ModelsPermission;
use App\Models\Role as ModelsRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role = ModelsRole::where('name', 'Administrator')->first();
        $permission = ModelsPermission::where('name', 'Admin')->first();
        \App\Models\User::factory(1)->create()->each(function ($user) use($role, $permission) {
            $user->assignRole($role);
            $user->givePermissionTo($permission);
            $user->info()->save(\App\Models\UserInfo::factory()->make());
        });
    }
}
