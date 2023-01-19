<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Http\Controllers\LinkController;
use App\Http\Requests\PortalRegisterRequest;
use App\Http\Requests\UpdatePortalAccount;
use App\Http\Resources\UserAuthResource;
use App\Interface\AuthInterface;
use App\Interface\PortalUserInterface;
use App\Interface\RolePermissionInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;


class AuthController extends Controller
{

    private PortalUserInterface $portalrepo;
    private $otherhelper;
    private RolePermissionInterface $rolepermissionrepo;

    public function __construct(PortalUserInterface $portalrepo, RolePermissionInterface $rolepermissionrepo)
    {
        $this->portalrepo = $portalrepo;
        $this->otherhelper = new LinkController;
        $this->rolepermissionrepo = $rolepermissionrepo;
    }
    
    public function auth(Request $request): JsonResponse
    {
        try {
            $user = $this->portalrepo->checkEmail($request->email);
            if (!$user) {
                return response()->json(['message' => 'Invalid Credentials'], 400);
            }

            if ($user->status == 'Not Activated' && $user->email_verified_at == null) {
                return response()->json(['message' => 'Account was not active'], 400);
            }

            if ($user->status == 'Deactivated') {
                return response()->json(['message' => 'Account was Deactivated. Contact system admin to activate you account'], 400);
            }
            
            $response = $this->portalrepo->authAttemp(['email' => $request->email, 'password' => $request->password]);
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
                'stack' => env('APP_DEBUG') ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') ? get_class($e) : ''
            ], 500);
        }
    }

    public function register(PortalRegisterRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $data = [
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'middlename' => $request->middlename,
                'status' => 'Activated',
                'email' => $request->email,
                'email_verified_at' => now('Asia/Manila'),
                'password' => Hash::make($request->password),
                'remember_token' => Str::random(10),
            ];
            
            $user = $this->portalrepo->createUser($data);
            if (!$user) {
                return response()->json(['message' => 'Unable to create new administrator user'], 400);
            }
            $user->email_verified_at = now('Asia/Manila');
            $user->save();
            $role = $this->rolepermissionrepo->findRole('name', 'user');
            $this->portalrepo->assignRole($role, $user);

            DB::commit();
            return response()->json(['message' => 'Register Success. you can login now'], 201);
            
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') ? get_class($e) : ''
            ], 500);
        }
    }

    public function updateInfoUser(UpdatePortalAccount $request): JsonResponse
    {
        try {
            $datas = [
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'middlename' => $request->middlename,
                'email' => $request->email,
            ];
            if($this->portalrepo->updateAccountInfo($request->user()->id, $datas)) {
                return response()->json(['message' => 'Updating Account Info Success'], 200);
            } else {
                return response()->json(['message' => 'Updating Account Info Failed'], 400);
            }
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') ? get_class($e) : ''
            ], 500);
        }
    }

    public function updatePasswordPortalUser(Request $request): JsonResponse
    {
        try {
            if(!$request->password) {
                return response()->json(['message' => 'Password is invalid'], 400);
            }
            $datas = [
                'password' => Hash::make($request->password),
            ];
            if($this->portalrepo->updateAccountInfo($request->user()->id, $datas)) {
                return response()->json(['message' => 'Updating Credential Info Success'], 200);
            } else {
                return response()->json(['message' => 'Updating Credential Info Failed'], 400);
            }
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Server Error Failed. Please Try Again Later.",
                'stack' => env('APP_DEBUG') ? $e->getMessage() : '',
                'error' => env('APP_DEBUG') ? get_class($e) : ''
            ], 500);
        }
    }

}
