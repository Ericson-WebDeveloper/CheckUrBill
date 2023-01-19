<?php

namespace App\Http\Controllers\Administrator;

use App\Events\MerchantAdminCreateEvents;
use App\Http\Controllers\Controller;
use App\Http\Controllers\LinkController;
use App\Http\Requests\RequestAdministrato;
use App\Interface\MerchantInterface;
use App\Interface\RolePermissionInterface;
use App\Interface\UserInterface;
use App\Models\User;
use App\Models\VerifyUserAccount;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthorizerController extends Controller
{

    private MerchantInterface $merchant_repo;
    private UserInterface $userrepo;
    private RolePermissionInterface $rolepermissionrepo;

    public function __construct(MerchantInterface $merchant_repo, UserInterface $userrepo, RolePermissionInterface $rolepermissionrepo)
    {
        $this->merchant_repo = $merchant_repo;
        $this->userrepo = $userrepo;
        $this->rolepermissionrepo = $rolepermissionrepo;
    }

    public function approveMerchantOnBoard(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $merchant_code = base64_decode($request->merchant_code);
            $merchant = $this->merchant_repo->fetchMerchantNotActive($request->id, $merchant_code);

            if (!$merchant) {
                return response()->json(['message' => 'Unable to find the Merchant Data.'], 400);
            }

            if($merchant->status === 'Not Activated' | $merchant->status === 'Deactivated') {
                $response = $this->merchant_repo->activateMerchantOnboard($merchant->id); 
                $message = 'Approve the Merchant Success. please create admin user for this merchant immediately.';
            } else {
                $response = $this->merchant_repo->deactivateMerchantOnboard($merchant->id);
                $message = 'DeActivate the Merchant Success.';
                // Send Email notifcation to admin of merchant system that there account was deactivated
            }
            
            if (!$response) {
                return response()->json(['message' => 'Unable to Activate/DeActivate the Merchant Onboarding. please try again later.'], 400);
            }
            
            DB::commit();
            return response()->json(['message' => $message], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function createMerchantAdminUser(RequestAdministrato $request, string $merchant_id, string $merchant_code): JsonResponse
    {
        DB::beginTransaction();
        try {
            $merchant_code = base64_decode($merchant_code);
            $merchant = $this->merchant_repo->fetchMerchantNotActive($merchant_id, $merchant_code);

            if (!$merchant) {
                return response()->json(['message' => 'Unable to Find Merchant Details.'], 400);
            }

            if ($merchant->status !== 'Activated') {
                return response()->json(['message' => 'Merchant was not active. please activated merchant first.'], 400);
            }

            $password = (new LinkController)::generatePassword(12);
            $data1 = [
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'middlename' => $request->middlename,
                'status' => 'Not Activated',
                'email' => $request->email,
                // 'password' => Hash::make($request->password),
                'password' => Hash::make($password)
            ];

            $data2 = [
                'gender' => $request->gender,
                'avatar' => $request->avatar,
                'contact_no' => $request->contact_no,
                'merchant_ref' => $merchant->merchant_ref
            ];
            // add send email notification that merchant account was approve and attach user account
            // and link to activate user

            $user = $this->userrepo->createUser($data1);
            if (!$user) {
                return response()->json(['message' => 'Unable to create new administrator user'], 400);
            }
            $userinfo = $this->userrepo->createUserInfo($user, $data2);
            if (!$userinfo) {
                return response()->json(['message' => 'Unable to create new administrator user'], 400);
            }
            $role = $this->rolepermissionrepo->findRole('name', 'merchant');
            $permission = $this->rolepermissionrepo->findPermission('name', 'admin');
            $this->userrepo->assignRolePermission($role, $permission, $user);

            $code = (new LinkController)::generateTokenCode(70);
            $codeResponse = VerifyUserAccount::create([
                'email' => $user->email,
                'code' => $code,
                'created' => Carbon::now('Asia/Manila')
            ]);

            if(!$codeResponse) {
                return response()->json(['message' => 'Unable to generate verify code'], 400);
            }
            
            $emailRespond = MerchantAdminCreateEvents::dispatch($user, $userinfo, $merchant, $code, $password);
            if(!$emailRespond) {
                return response()->json(['message' => 'account sending email failed. please try again.'], 400);
            }
            DB::commit();
            return response()->json(['message' => "New Administrator For Merchant {{$merchant->merchant_name}} Created Success"], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function activateMerchantUser(Request $request): JsonResponse
    {   // use this in manually update
        DB::beginTransaction();
        try {
            if (!$request->user_id || !$request->merchant_ref) {
                return response()->json(['message' => 'Invalid data.'], 400);
            }
            $response = $this->userrepo->activateUser($request->user_id, $request->merchant_ref);
            if (!$response) {
                return response()->json(['message' => 'Sorry Cannot Find User or Unable to Activate user for the mean time. please try again later.'], 400);
            }
            DB::commit();
            // send email to user with attach details account
            return response()->json(['message' => 'User Activate Success.'], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function deactivateMerchantUser(Request $request): JsonResponse
    {   // use this in manually update
        DB::beginTransaction();
        try {
            if (!$request->user_id || !$request->merchant_ref) {
                return response()->json(['message' => 'Invalid data.'], 400);
            }
            $response = $this->userrepo->DeactivateUser($request->user_id, $request->merchant_ref);
            if (!$response) {
                return response()->json(['message' => 'Sorry Unable to DeActivate user for the mean time. please try again later.'], 400);
            }
            DB::commit();
            // send email to user with attach details account
            return response()->json(['message' => 'User DeActivate Success.'], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }
}
