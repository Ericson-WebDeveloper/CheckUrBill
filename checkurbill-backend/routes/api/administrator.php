<?php

use App\Http\Controllers\Administrator\AdminController;
use App\Http\Controllers\Administrator\AuthorizerController;
use App\Http\Controllers\Administrator\UploaderController;
use App\Http\Controllers\DashBoardController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth:sanctum', 'role:administrator'])->prefix('administrator')->group(function() {
    
    Route::get('/dashboard/datas', [DashBoardController::class, 'administratorDashBoardDatas']);
    Route::get('/dashboard/data-chart', [DashBoardController::class, 'administratorDashBoardDatas']);

    Route::middleware(["checkpermission:admin"])->group(function() {
        Route::post('/create-admin', [AdminController::class, 'createNewAdministrator']);

        // resend email for account confirmation
        

        // activate/deactivate user under administrator role only
        Route::post('/user/deactivated-status', [AdminController::class, 'adminDeActivate']);
        Route::post('/user/activated-status', [AdminController::class, 'adminActivate']);
        
        // delete user admin
        Route::post('/removing/user-account', [AdminController::class, 'deletingUserAccount']);
    });

    Route::middleware(["checkpermission:uploader"])->group(function() {
        Route::post('/uploader/onboard-merchant', [UploaderController::class, 'onBoardMerchant']);
    });

    Route::middleware(["checkpermission:authorizer"])->group(function() {
        Route::post('/authorizer/approve-merchant', [AuthorizerController::class, 'approveMerchantOnBoard']);
        Route::post('/authorizer/create/{merchant_id}/admin-merchant/{merchant_code}', [AuthorizerController::class, 'createMerchantAdminUser']);
        Route::post('/authorizer/activate/merchant-user', [AuthorizerController::class, 'activateMerchantUser']);
        Route::post('/authorizer/deactivate/merchant-user', [AuthorizerController::class, 'deactivateMerchantUser']);
    });

    Route::middleware(["checkpermission:admin|authorizer"])->group(function() {
        Route::post('/user-not-activated/resend/confirmation', [UserController::class, 'resendAcountConfirmation']);

        Route::post('/update/merchant-url-api', [MerchantController::class, 'updateAPiUrlMerchant']);
        Route::post('/update/merchant-data/info', [MerchantController::class, 'updateInfoMerchant']);
    });

    Route::get('/admins-list', [UserController::class, 'activateUserAccount']);
    Route::get('/merchants/list', [MerchantController::class, 'merchants']);
    Route::get('/merchant/administrator-list/{merchant_ref}', [MerchantController::class, 'merchantAdminLists']);
});