<?php

use App\Http\Controllers\Administrator\AuthorizerController;
use App\Http\Controllers\Administrator\UploaderController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\DashBoardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\Merchant\AdminController;
use App\Http\Controllers\Merchant\UploaderController as MerchantUploaderController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\Portal\AccountController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth:sanctum', 'role:merchant'])->prefix('merchant')->group(function () {
    Route::middleware(["checkpermission:admin"])->group(function () {
        Route::post('/create-admin', [AdminController::class, 'createMerchantAdminUser']);
        Route::post('/user-not-activated/resend/confirmation', [UserController::class, 'resendAcountConfirmation']);

        Route::post('/user-admin/activated', [AdminController::class, 'activateMerchantUser']);
        Route::post('/user-admin/deactivated', [AdminController::class, 'deactivateMerchantUser']);
    });

    Route::middleware(["checkpermission:uploader"])->group(function () {
        Route::post('/uploads/member-data', [MerchantUploaderController::class, 'uploadMember']);
        Route::post('/upload-manual/member-data', [MerchantUploaderController::class, 'addMember']);
        Route::post('/upload/bill-data', [MerchantUploaderController::class, 'uploadBills']);
    });

    Route::middleware(["checkpermission:authorizer|admin"])->group(function () {
        Route::post('/removing/member-data/list', [MemberController::class, 'deleteMember']);
        Route::post('/upload/bills/approved', [BillController::class, 'approvingBillUpload']);
        Route::post('/upload/bills/reject', [BillController::class, 'rejectingBillUpload']);

        Route::post('/requesting/file-report/bill', [AdminController::class, 'generateReportBills']);
        Route::get('/downloading/file-report/bill', [AdminController::class, 'downloadFile']);

        Route::post('/generate/report/transaction', [AdminController::class, 'generateReportTransactions']);
        Route::get('/downloading/file/transaction', [AdminController::class, 'downloadFileTransactions']);


        Route::post('/updating/member/status', [AdminController::class, 'updateStatusMember']);

        Route::get('/fetch/merchant/detail/{email}', [MemberController::class, 'memberDetail']);
        Route::get('/bill-current/{ref}/member/{account_no}', [AccountController::class, 'fetchBill']);
        Route::get('/bills/{ref}/member/{account_no}', [AccountController::class, 'fetchBills']);
    });

    Route::get('/fetch-payments/list/{reference}', [TransactionController::class, 'fetchTransactionPayments']);


    Route::get('/administrator-list/{merchant_ref}', [AdminController::class, 'merchantAdminLists']);
    Route::get('/members/list', [MemberController::class, 'members']);
    Route::get('/member/{merchant_ref}/detail/{email}', [MemberController::class, 'member']);
    Route::get('/dashboard/datas', [DashBoardController::class, 'merchantAdminsDashBoard']);

    Route::get('/bill/lists', [BillController::class, 'userBillLists']);
    Route::get('/bill/costumer/lists/{ref}', [BillController::class, 'fetchBillCostumerListByBatchNo']);
});
