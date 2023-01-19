<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserAuthResource;
use App\Http\Resources\UserResource;
use App\Interface\AuthInterface;
use App\Mail\ResetPassMail;
use App\Models\User;
use App\Models\VerifyUserAccount;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{

    private AuthInterface $authrepo;
    private $otherhelper;
    public function __construct(AuthInterface $authrepo)
    {
        $this->authrepo = $authrepo;
        $this->otherhelper = new LinkController;
    }

    public function resetPassword(Request $request): JsonResponse
    {   
        DB::beginTransaction();
        try {
            $response = VerifyUserAccount::where('code', '=', $request->code)->first();
            $now = Carbon::now('Asia/Manila');
            if (!$response) {
                return response()->json(['message' => 'Invalid Code Verification'], 400);
            }
            $seconds = $now->diffInSeconds($response->created);
            if ($seconds >= 600) {
                $response->delete();
                return response()->json(['message' => 'Token Code Expires. Please Request new Account'], 400);
            }
            // do the update email
            $updateResponse = User::where('email', '=', $response->email)->update(['password' => Hash::make($request->password)]);
            if (!$updateResponse) {
                return response()->json(['message' => 'Unable to verify account this time. please try agan later.'], 400);
            }
            $response->delete();
            DB::commit();
            return response()->json(['message' => 'Password Reset Success.'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function confirmResetPass(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $verify = $this->authrepo->checkEmail($request->email);
            if(!$verify || $verify == null) {
                return response()->json(['message' => 'invalid email/ not exist in system'], 400);
            }
            $user = $verify;

            $code = $this->otherhelper->getTokenCode(70);
            $codeResponse = VerifyUserAccount::create([
                'email' => $user->email,
                'code' => $code,
                'created' => Carbon::now('Asia/Manila')
            ]);

            if(!$codeResponse) {
                return response()->json(['message' => 'Unable to generate verify code'], 400);
            }

            // create send email with link of ResetPass.tsx page
            Mail::to($request->email)->send(
                new ResetPassMail($request->email, $code));

            DB::commit();

            return response()->json(['message' => 'Link was send to your email for reset password page link.'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function verifycode(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $response = VerifyUserAccount::where('code', '=', $request->code)->latest('created')->first();

            $now = Carbon::now('Asia/Manila');

            if (!$response) {
                return response()->json(['message' => 'Invalid Code Verification'], 400);
            }
            $seconds = $now->diffInSeconds($response->created);
            // 300 seconds -> 5 minutes
            // 86400 seconds -> 1 day
            if ($seconds >= 300) {
                $response->delete();
                return response()->json(['message' => 'Token Code Expires. Please Request new Account'], 400);
            }

            $updateResponse = User::where('email', '=', $response->email)->update(['status' => 'Activated', 'email_verified_at' => now('Asia/Manila')]);
            if (!$updateResponse) {
                return response()->json(['message' => 'Unable to verify account this time. please try agan later.'], 400);
            }
            $response->delete();
            
            DB::commit();
            return response()->json(['message' => 'Account Verified Success.'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }

    public function signin(Request $request): JsonResponse
    {
        try {
            Log::info(request()->header('origin') . ' ' . 'from front end origin');
            Log::info(request()->header('referer') . ' ' . 'from front end referer');
            $user = $this->authrepo->checkEmail($request->email);
            if (!$user) {
                return response()->json(['message' => 'Invalid Credentials'], 400);
            }

            if ($user->status == 'Not Activated' && $user->email_verified_at == null) {
                return response()->json(['message' => 'Account was not active'], 400);
            }

            if ($user->status == 'Deactivated') {
                return response()->json(['message' => 'Account was Deactivated. Contact system admin to activate you account'], 400);
            }

            $response = $this->authrepo->authAttemp(['email' => $request->email, 'password' => $request->password]);
            if ($response && $user) {
                $token = $user->createToken('CheckUrBill')->plainTextToken;
                return response()->json([
                    'message' => 'Login Success!',
                    'data' => [
                        'token' => $token,
                        'user' => new UserAuthResource($user)
                    ]
                ], 200);
            } else {
                return response()->json(['message' => 'Invalid Credentials'], 400);
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') == true ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') == true ? get_class($e) : ''
            ], 500);
        }
    }
}
