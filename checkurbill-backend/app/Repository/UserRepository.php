<?php

declare(strict_types=1);

namespace App\Repository;

use App\Interface\UserInterface;
use App\Models\Merchant;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\UserInfo;
use App\Models\VerifyUserAccount;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PhpParser\Node\Expr\Cast\Array_;

class UserRepository implements UserInterface
{

    public function createUser(array $data): User
    {
        return User::create($data);
    }

    public function createUserInfo(User $user, array $data): UserInfo
    {
        $datas = array_merge($data, ['user_id' => $user->id]);
        return UserInfo::create($datas);
    }

    public function assignRolePermission(Role | null $role, Permission | null $permission, User $user): void
    {
        if ($role) $user->assignRole($role);
        if ($permission) $user->givePermissionTo($permission);
    }

    // Merchant Admin
    public function activateUser(string $user_id, string $merchant_ref): bool
    {
        $response = User::where('id', $user_id)
            ->whereHas('info', function ($query) use ($merchant_ref) {
                $query->where('merchant_ref', $merchant_ref);
            })->update(['status' => 'Activated', 'email_verified_at' => now()]);
        return $response ? true : false;
    }

    public function DeactivateUser(string $user_id, string $merchant_ref): bool
    {
        $response = User::where('id', $user_id)
            ->whereHas('info', function ($query) use ($merchant_ref) {
                $query->where('merchant_ref', $merchant_ref);
            })->update(['status' => 'Deactivated']);
        return $response ? true : false;
    }
    // Merchant Admin

    public function users(string|null $search = ''): Paginator
    {
        $users = DB::table('users')
            ->join('user_infos', 'users.id', '=', 'user_infos.user_id')
            ->leftJoin('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->leftJoin('roles', 'roles.id', '=', 'model_has_roles.role_id')
            // ->when($search, function($query) use ($search) {
            //     $query->where('firstname', 'like', $search.'%')
            //     ->orWhere('lastname', 'like', $search.'%')
            //     ->orWhere('email', 'like', $search.'%')
            //     ->orWhere('lastname', 'like', $search.'%');
            // })
            ->select('users.id', 'users.firstname', 'roles.name as role_name');
        $users = $users->groupBy('roles.id')
            // ->orderBy('users.created_at', 'asc')
            // ->map(function($user) {
            //     return [
            //         $user,
            //         'roles' =>  $user->getRoleNames(),
            //         'permissions' => $user->getAllPermissions()
            //     ];
            // })
            ->paginate(2);
        // ->through(function($user) {
        //     return [
        //         $user,
        //         'roles' =>  $user->getRoleNames(),
        //         'permissions' => $user->getAllPermissions()
        //     ];
        // });
        return $users;
    }

    public function user(string|null $user_id): User | null
    {
        return User::with('info')->where('id', '=', $user_id)->first();
    }

    public function userFindbyEmail(string $email): User | null 
    {
        return User::with('info')->where('email', '=', $email)->first();
    }

    public function usersAdministrator(string $type, string $user_id, string $role): Paginator {
        return User::query()
        ->with('info')
        ->where('id', '!=', $user_id)
        ->whereHas('roles', function($q) use($role) {
            return $q->where('name', '=', $role);
        })
        ->whereHas('permissions', function($query) use ($type) {
            return $query->where('name', '=', $type);
        })->paginate(5);
    }

    public function updateProfile(string $user_id, string $avatar): bool {
        $response = DB::table('user_infos')->where('user_id', '=', $user_id)->update(['avatar' => $avatar]);
        return $response == 1 ? true : false;
    }

    public function updateProfileInfo(string $user_id, array $datas): bool {
        
        $response = DB::table('users')
        ->join('user_infos', 'users.id', '=', 'user_infos.user_id')
        ->where('users.id', '=', $user_id)
        ->update($datas);
        // 1, 2 is true
        return $response == 0 ? false : true;
    }

    public function updatePasswordInfoUser(string $user_id, string $password): bool {
        $response = DB::table('users')
        ->where('users.id', '=', $user_id)
        ->update(['password' => $password]);
        // 1, 2 is true
        return $response == 0 ? false : true;
    }

    public function verifyOldPassword(string $user_id, string $password): bool
    {
        $response = DB::table('users')
        ->where('users.id', '=', $user_id)
        ->where('users.password', '=', $password)
        ->first();
        // 1, 2 is true
        return $response ? true : false;
    }


    // Manual Activate in Administrator Role Side and in merchant
    public function manualActivateUser(string $user_id, string $email): bool
    {
        $response = User::where('id', '=', $user_id)
        ->where('email', '=', $email)
        ->update(['status' => 'Activated']);
        return $response ? true : false;
    }

    public function manualDeActivateUser(string $user_id, string $email): bool
    {
        $response = User::where('id', '=', $user_id)
        ->where('email', '=', $email)
        ->update(['status' => 'Deactivated']);
        return $response ? true : false;
    }

    public function deleteUserAdmin(string $user_id, string $email): bool {
        $response = User::where('id', '=', $user_id)->where('email', '=', $email)->delete();
        return $response ? true : false;
    }

    public function fetchMerchantUserDetails(string $merchant_ref): Merchant
    {
        // return DB::table('merchants')
        // ->join('merchant_details', 'merchants.id', '=', 'merchant_details.merchant_id')
        // ->join('institution_types', 'institution_types.id', '=', 'merchant_details.institution_type_id')
        // ->join('merchant_categories', 'merchant_categories.id', '=', 'merchant_details.merchant_category_id')
        // ->join('merchant_types', 'merchant_types.id', '=', 'merchant_details.merchant_type_id')
        // ->where('merchants.merchant_ref', '=', $merchant_ref)
        // ->select(
        //     'merchants.*',
        //     'merchant_details.id as detail_id',
        //     'merchant_details.merchant_id as detail_merchant_id',
        //     'merchant_details.address as detail_address',
        //     'merchant_details.institution_type_id',
        //     'merchant_details.merchant_category_id',
        //     'merchant_details.merchant_type_id',

        //     'institution_types.institution_name as merchant_institution',
        //     'merchant_categories.merchant_category_name as merchant_category',
        //     'merchant_types.merchant_type_name as merchant_type',

        //     'merchant_details.contact_no as detail_contact_no',
        //     'merchant_details.logo as detail_logo',
        //     'merchant_details.created_at as detail_created_at',
        //     'merchant_details.updated_at as detail_updated_at',
        // )->first();
        return Merchant::query()->where('merchant_ref', '=', $merchant_ref)->first();
    }

    public function generateVerificationToken(string $email, string $code): bool
    {
        try {
            VerifyUserAccount::create([
                'email' => $email,
                'code' => $code,
                'created' => Carbon::now('Asia/Manila')
            ]);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function createUserMerchant(array $data): User | JsonResponse
    {
        try {
            return User::create($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Request Failed. Server Encounter Error. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        }
    }

    public function createUserInfoMerchant(User $user, array $data): UserInfo | JsonResponse
    {
        try {
            $datas = array_merge($data, ['user_id' => $user->id]);
            return UserInfo::create($datas);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Request Failed. Server Encounter Error. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
            die();
        }

    }

}
