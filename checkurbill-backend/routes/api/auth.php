<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\UserController;
use App\Http\Resources\UserAuthResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth:sanctum'])->group(function() {
    Route::get('/user', function (Request $request) {
        sleep(2);
        return response()->json(['data' => new UserAuthResource($request->user()->load('info'))],200);
    })->middleware('throttle:200,1');

    Route::post('/user/signout', function (Request $request) {
        try {
            $request->user()->tokens()->delete();
            return response()->json([
                'message' => 'Logout Success'
            ], 200);
        } catch(Exception $e) {
            $request->user('web')->tokens()->delete();
            return response()->json([
                'message' => 'Logout Failed'
            ], 500);
        }
    });

    Route::post('/user/avatar-update', [UserController::class, 'updateAvatar']);
    Route::post('/user/profile-info/update', [UserController::class, 'updateUserProfileInfo']);
    Route::post('/user/profile-password/update', [UserController::class, 'updateUserPassword']);

    Route::get('/merchant/fetch/{merchant_code}', [MerchantController::class, 'merchant']);
});

Route::post('/user/signin', [AuthController::class, 'signin']);

Route::post('/verify/account/user', [AuthController::class, 'verifycode']);

Route::post('/request/reset-password', [AuthController::class, 'confirmResetPass']);
Route::post('/send-post/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/users', [UserController::class, 'users']);