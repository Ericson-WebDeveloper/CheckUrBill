<?php

use App\Http\Controllers\HelperController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\Portal\AccountController;
use App\Http\Controllers\Portal\AuthController;
use App\Http\Controllers\Portal\PaymentController;
use Illuminate\Support\Facades\Route;
use App\Http\Resources\UserAuthResource;
use Illuminate\Http\Request;

Route::middleware(['auth:sanctum', 'role:user'])->prefix('portal')->group(function () {
    Route::get('/user-auth', function (Request $request) {
        sleep(5);
        return response()->json(['data' => new UserAuthResource($request->user()->load('info'))], 200);
    })->middleware('throttle:200,1');

    Route::post('/user-auth/signout', function (Request $request) {
        try {
            sleep(5);
            $request->user()->tokens()->delete();
            return response()->json([
                'message' => 'Logout Success'
            ], 200);
        } catch (Exception $e) {
            $request->user()->tokens()->delete();
            return response()->json([
                'message' => 'Logout Failed'
            ], 500);
        }
    });

    Route::post('/link-account/create', [AccountController::class, 'enrollAccount']);
    Route::post('/link-account/confirm', [AccountController::class, 'confirmAccountLink']);

    Route::get('/accounts/list', [AccountController::class, 'accountLists']);
    Route::get('/accounts/{merchant_ref}/bills-merchant/list/{account_no}', [AccountController::class, 'accountLists']);

    Route::post('/account/update-info', [AuthController::class, 'updateInfoUser']);
    Route::post('/account/update-credentials', [AuthController::class, 'updatePasswordPortalUser']);

    Route::get('/bill-current/{ref}/{account_no}', [AccountController::class, 'fetchBill']);

    Route::get('/merchant-list', [MerchantController::class, 'merchantLists']);
    Route::get('/merchant/{ref}', [MerchantController::class, 'biller']);

    Route::get('/merchant/categories', [HelperController::class, 'categories']);
    Route::get('/merchant/types', [HelperController::class, 'types']);
    Route::get('/merchant/institutions', [HelperController::class, 'institutions']);

    Route::post('/user/pay-bill/cards-attempt', [PaymentController::class, 'stripePayPost']);
    Route::post('/user/pay-bill/cards-confirm', [PaymentController::class, 'stripeConfirm']);

    Route::post('/user/pay-bill/paypal', [PaymentController::class, 'paypalPayPost']);
    Route::post('/user/confirm/pay-bill/paypal', [PaymentController::class, 'paypalConfirmPayment']);

    Route::post('/user/cancel/payment', [PaymentController::class, 'paymentConfirmCancel']);

    Route::get('/payments/{bill_id}/bill-current', [AccountController::class, 'getTransactionPayments']);


    Route::post('/bills-history/merchant/list', [AccountController::class, 'getMyBillsByMerchant']);
});

Route::post('/portal/signin-user', [AuthController::class, 'auth']);
Route::post('/portal/signup-user', [AuthController::class, 'register']);
