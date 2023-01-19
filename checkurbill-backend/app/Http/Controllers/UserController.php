<?php

namespace App\Http\Controllers;

use App\Events\AdministratorCreateNotifyEvent;
use App\Events\ResendAccountConfirmationEvent;
use App\Http\Requests\ProfileInfoRequest;
use App\Http\Resources\UsersAdministratorResource;
use App\Interface\UserInterface;
use App\Mapper\UserMapper;
use App\Models\VerifyUserAccount;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{

    private UserInterface $userrepo;

    public function __construct(UserInterface $userrepo)
    {
        $this->userrepo = $userrepo;
    }

    public function users(Request $request): JsonResponse
    {
        try {
            $users = $this->userrepo->users($request->query('search'));
            return response()->json([
                'data' => $users
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function user(Request $request, $user_id): JsonResponse
    {
        try {
            // $user = $this->user->users($user_id);
            return response()->json([
                // 'data' => $user
                'data' => null
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function activateUserAccount(Request $request): JsonResponse
    {
        try {
            $role = $request->user()->getRoleNames();
            Log::info($role[0]);
            $users = $this->userrepo->usersAdministrator($request->query('type') ? $request->query('type') : 'admin', 
            $request->user()->id, $role[0] ? $role[0] : 'administrator');
            return response()->json([
                'data' => new UsersAdministratorResource($users)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' =>  $e->getMessage(),
                'error' =>  get_class($e)
            ], 500);
        }
    }

    public function updateAvatar(Request $request): JsonResponse
    {   
        DB::beginTransaction();
        try {
            if (!$request->avatar || !$request->user_id) {
                return response()->json(['message' => 'Cannot Update Avatar. please try again'], 400);
            }
            $response = $this->userrepo->updateProfile($request->user_id, $request->avatar);
            if (!$response) {
                return response()->json(['message' => 'Update Avatar Failed. please try again'], 400);
            }
            DB::commit();
            $user = $this->userrepo->user($request->user()->id);
            return response()->json(['message' => 'Update Avatar Success', 'data' => $user], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function updateUserProfileInfo(ProfileInfoRequest $request): JsonResponse
    {   
        DB::beginTransaction();
        try {
            $datas = UserMapper::profileInfo($request);
            $response = $this->userrepo->updateProfileInfo($request->user_id, $datas);
            if (!$response) {
                return response()->json(['message' => 'Update Profile Info Failed. please try again'], 400);
            }
            DB::commit();
            $user = $this->userrepo->user($request->user()->id);
            return response()->json(['message' => 'Update Profile Info Success', 'data' => $user], 200);
        } catch (\Exception $e) {
            // DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') === true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') === true ? get_class($e) : ''
            ], 500);
        }
    }

    public function updateUserPassword(Request $request): JsonResponse
    {   
        DB::beginTransaction();
        try {
            $new_password = Hash::make($request->new_password);
            if(!Hash::check($request->old_password, $request->user()->password)) {
                return response()->json(['message' => 'Old Password Not Match. please try again'], 400);
            }
            $response = $this->userrepo->updatePasswordInfoUser($request->user_id, $new_password);
            if (!$response) {
                return response()->json(['message' => 'Update Password Failed. please try again'], 400);
            }
            DB::commit();
            return response()->json(['message' => 'Update Password Success', 'data' => null ], 200);
        } catch (\Exception $e) {
            // DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') === true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') === true ? get_class($e) : ''
            ], 500);
        }
    }

    public function resendAcountConfirmation(Request $request): JsonResponse {
        DB::beginTransaction();
        try {

            if(!$request->email) {
                return response()->json(['message' => 'email is required!'], 400);
            }

            $user = $this->userrepo->userFindbyEmail($request->email);
            
            if(!$user) {
                return response()->json(['message' => 'invalid email. user not found!'], 400);
            }

            if($user->status != "Not Activated" && $user->email_verified_at != null) {
                return response()->json(['message' => 'invalid email. user not found!'], 400);
            }

            $user_info = $user->info;
            $code = (new LinkController)::generateTokenCode(70);
            $password = (new LinkController)::generatePassword(12); // add jan 12 2023
            $user->password = Hash::make($password); // add jan 12 2023
            $userpasswordreset = $user->save();
            $codeResponse = VerifyUserAccount::create([
                'email' => $user->email,
                'code' => $code,
                'created' => Carbon::now('Asia/Manila')
            ]);
                                 // add jan 12 2023
            if(!$codeResponse && !$userpasswordreset) {
                return response()->json(['message' => 'Unable to generate verify code'], 400);
            }
            // send email link with account
            // with activation link
            ResendAccountConfirmationEvent::dispatch($user, $user_info, $code, $password);
            DB::commit();
            return response()->json(['message' => 'Email Send for Confirmation Account Success'], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => $e->getMessage(),
                'error' => get_class($e)
            ], 500);
        }
    }

}
