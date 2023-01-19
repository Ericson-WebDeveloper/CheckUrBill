<?php

namespace App\Http\Controllers\Administrator;

use App\Events\AdministratorCreateNotifyEvent;
use App\Http\Controllers\Controller;
use App\Http\Controllers\LinkController;
use App\Http\Requests\RequestAdministrato;
use App\Interface\DashBoardInterface;
use App\Interface\RolePermissionInterface;
use App\Interface\UserInterface;
use App\Models\User;
use App\Models\VerifyUserAccount;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;


class AdminController extends Controller
{

    private UserInterface $userrepo;
    private RolePermissionInterface $rolepermissionrepo;
    private DashBoardInterface $dashboardrepo;
    private $otherhelper;

    public function __construct(UserInterface $userrepo, RolePermissionInterface $rolepermissionrepo, DashBoardInterface $dashrepo)
    {
        $this->userrepo = $userrepo;
        $this->rolepermissionrepo = $rolepermissionrepo;
        $this->dashboardrepo = $dashrepo;
        $this->otherhelper = new LinkController;
        
    }

    public function createNewAdministrator(RequestAdministrato $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $data1 = [
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'middlename' => $request->middlename,
                'status' => 'Not Activated',
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'remember_token' => Str::random(10)
            ];

            $data2 = [
                'gender' => $request->gender,
                'avatar' => $request->avatar,
                'contact_no' => $request->contact_no,
            ];

            $user = $this->userrepo->createUser($data1);
            if (!$user) {
                return response()->json(['message' => 'Unable to create new administrator user'], 400);
            }
            $userinfo = $this->userrepo->createUserInfo($user, $data2);
            if (!$userinfo) {
                return response()->json(['message' => 'Unable to create new administrator user'], 400);
            }
            $role = $this->rolepermissionrepo->findRole('name', 'administrator');
            $permission = $this->rolepermissionrepo->findPermission('id', $request->permission);
            $this->userrepo->assignRolePermission($role, $permission, $user);
            $code = $this->otherhelper->getTokenCode(70);
            $codeResponse = VerifyUserAccount::create([
                'email' => $user->email,
                'code' => $code,
                'created' => Carbon::now('Asia/Manila')
            ]);

            if(!$codeResponse) {
                return response()->json(['message' => 'Unable to generate verify code'], 400);
            }
            // send email link with account
            // with activation link
            AdministratorCreateNotifyEvent::dispatch($user, $userinfo, $code, $request->password);
            
            DB::commit();
            return response()->json(['message' => 'New Administrator Created Success'], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function getDashBoardDatas(): JsonResponse 
    {
        try {
            $totalRoleUser = $this->dashboardrepo->getTotalRoleUsers();
            // $PermissionAdminnistrator = $this->dashboardrepo->getTotalRolePermission('administrator');
            // $PermissionMerchant = $this->dashboardrepo->getTotalRolePermission('merchant');
            return response()->json([
                'data' => [
                    'total_user_per_role' => $totalRoleUser,
                    // 'total_administrator_user' => $PermissionAdminnistrator,
                    // 'total_merchant_user' => $PermissionMerchant,
                    // User::all()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage() ,
                'error' => get_class($e)
            ], 500);
        }
    }

    public function adminDeActivate(Request $request): JsonResponse 
    {   
        DB::beginTransaction();
        try {
            if($this->userrepo->manualDeActivateUser($request->user_id, $request->email)) {
                DB::commit();
                return response()->json(['message' => 'User DeActivated Success'], 200);
            }
            return response()->json(['message' => 'User DeActivated Failed'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage() ,
                'error' => get_class($e)
            ], 500);
        }
    }

    public function adminActivate(Request $request): JsonResponse 
    {   
        DB::beginTransaction();
        try {
            if($this->userrepo->manualActivateUser($request->user_id, $request->email)) {
                DB::commit();
                return response()->json(['message' => 'User Activated Success'], 200);
            }
            return response()->json(['message' => 'User Activated Failed'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage() ,
                'error' => get_class($e)
            ], 500);
        }
    }

    public function deletingUserAccount(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            if($this->userrepo->deleteUserAdmin($request->user_id, $request->email)) {
                $this->rolepermissionrepo->deleteRoleUser($request->user_id);
                $this->rolepermissionrepo->deletePermissionUser($request->user_id);
                
                DB::commit();
                return response()->json(['message' => "User Account with an email of: {{$request->email}} deleted Success"], 200);
            }
            return response()->json(['message' => "User Account with an email of: {{$request->email}} deleted Failed. try again later"], 400);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage() ,
                'error' => get_class($e)
            ], 500);
        }
    }

}
