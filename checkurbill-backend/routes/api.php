<?php

// use App\Http\Controllers\AuthController;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

use App\Http\Controllers\Administrator\AdminController;
use App\Http\Controllers\HelperController;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use AmrShawky\LaravelCurrency\Facade\Currency;
use App\Exports\BillReportExportExcel;
use App\Jobs\CsvReportJobs;
use App\Models\Transaction;
use Maatwebsite\Excel\Facades\Excel;

require('api/auth.php');
require('api/administrator.php');
require('api/merchant.php');
require('api/user.php');

Route::get('/essetials-data/permissions', [HelperController::class, 'getPermissions']);
Route::get('/essetials-data/roles', [HelperController::class, 'getRoles']);

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/dashboard/datas-administrator', [AdminController::class, 'getDashBoardDatas']);
    Route::get('/upload-member/progress/{batchId}', function (string $batchId) {
        $batchJobData = Bus::findBatch($batchId);
        return response()->json(['data' => $batchJobData], 200);
    });
    Route::get('/report/progress/{batchId}', function (string $batchId) {
        $batchJobData = Bus::findBatch($batchId);
        return response()->json(['data' => $batchJobData], 200);
    });
});


Route::get('/get-institutions/list', [HelperController::class, 'institutions']);
Route::get('/get-categories/list', [HelperController::class, 'categories']);
Route::get('/get-types/list', [HelperController::class, 'types']);

Route::get('/get/billers/{category}', [HelperController::class, 'billers']);

// Route::get('/get-types/list', [HelperController::class, 'types']);

Route::post('/test-dashboard', function (Request $request, string|null $merchant_ref = null): mixed {

    try {
        return Transaction::join('bill_costumers', 'bill_costumers.id', '=', 'bill_payment_transactions.bill_costumer_id')
        ->where('bill_payment_transactions.batch_no', '=', 'BN202212100-ER-20221130093357')->paginate(10);
        // $amount = Currency::convert()
        // ->from('USD')
        // ->to('PHP')
        // ->amount(100.00)
        // ->get();

        // return response()->json($amount, 200);

        // return DB::table('bill_costumers')->where('bill_costumers.Account No', '=', '13180855')->get();
        //     $data = Role::query()
        // ->select(['name'])
        // ->withCount(['users'])
        // ->when($request->query('role') == null, function ($q) {
        //     $q->groupBy('name');
        // }, function ($q) use ($request) {
        //     $q->where('name', '=', $request->query('role'));
        // })
        // ->get();
        // $data = Permission::query()
        // ->select(['name'])
        // ->withCount(['users'])
        // ->whereHas('users', function($query) {
        //     $query->whereHas('roles', function($query) {
        //         $query->where('name', '=', 'administrator');
        //     });
        // })
        // ->groupBy('name')
        // ->get();
        // $data['key'] = 'administrator';
        // return response()->json($data, 200);




        // return  DB::table('users')
        //         ->select(DB::raw('COUNT(users.id) as count_total'), 'roles.name as name')
        //         ->join('model_has_roles', 'model_has_roles.model_id', '=', 'users.id')
        //         ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
        //         // ->where('roles.name', '=', 'administrator')
        //         ->groupBy('roles.name')
        //         ->get();

        // return  DB::table('users')
        // ->select(DB::raw('COUNT(users.id) as count_total'))
        // ->leftJoin('model_has_permissions', 'model_has_permissions.model_id', '=', 'users.id')
        // ->leftJoin('permissions', 'permissions.id', '=', 'model_has_permissions.permission_id')
        // ->leftJoin('model_has_roles', 'model_has_roles.model_id', '=', 'users.id')
        // ->leftJoin('roles', 'roles.id', '=', 'model_has_roles.role_id')
        // ->where('roles.name', '=', 'administrator')
        // ->where('permissions.name', '=', 'authorizer')
        // ->get();

        // return  DB::table('users')
        // ->select(DB::raw('COUNT(users.id) as count_total'), 'permissions.name as permission', 'roles.name as role')
        // ->leftJoin('model_has_permissions', 'model_has_permissions.model_id', '=', 'users.id')
        // ->leftJoin('permissions', 'permissions.id', '=', 'model_has_permissions.permission_id')
        // ->leftJoin('model_has_roles', 'model_has_roles.model_id', '=', 'users.id')
        // ->leftJoin('roles', 'roles.id', '=', 'model_has_roles.role_id')
        // ->where('roles.name', '=', 'merchant')
        // ->groupBy('permissions.name')
        // // ->groupBy('roles.name')
        // ->get();

        // $directories = Storage::directories('uploaded/bills');
        // return in_array("uploaded/bills/merchant-1s", $directories);

        // $myfile = fopen("testfile.txt", "w");
        // $txt = "John Doe\n";
        // fwrite($myfile, $txt);
        // $filename = 'HAHAHAFILE.txt';
        // Log::info($request->bills);

        // return Storage::put("bills/ER-20221130093357", $request->bills);

        // return Storage::get('bills/ER-20221130093357/cfQJIT2ZBQUHJyMVa1K3lWWKowaSRDhGU4z0nyyi.csv');
        // return Storage::exists('bills/ER-20221130093357/cfQJIT2ZBQUHJyMVa1K3lWWKowaSRDhGU4z0nyyi.csv') ? true : false;
        // return collect($directories)->map(fn($d) => $d == "uploaded/bills/merchant-1" ? true : false);

        // return DB::table('members')
        // ->select(DB::raw('COUNT(members.id) as count_total'))
        // ->when($merchant_ref, fn($query) => $query->where('merchant_ref', '=', $merchant_ref))->get();

    } catch (\Exception $e) {
        return response()->json($e->getMessage(), 500);
    }
});

Route::get('/test-api/data', function (Request $request, string|null $merchant_ref = null): mixed {
    try {
        $category = DB::table('merchant_categories')->where('merchant_category_name', '=', 'Government')->select('id')->first();
        return $category->id;
    } catch (\Exception $e) {
        return response()->json($e->getMessage(), 500);
    }
});

Route::get('/test-api/laravel-excel', function (Request $request, string|null $merchant_ref = null) {
    try {
    //    $response = Excel::queue(new BillReportExportExcel('BN202301120-SL-20230112155214'), "transactions/report-test.xlsx");
    //     return response()->json([$response], 200);
    Storage::makeDirectory("csv");
    $path = storage_path('app/public/csv/');
    $fileName = 'file test-'.rand(1,99).'.csv';
    $file = fopen($path.$fileName, 'w');
    $headers = array('Account No','Transaction Type','Name',
    'Address','Email','Bill From','Bill To','Due Date','Reference No','Status',
    'Amount Payment','Amount');
    fputcsv($file, $headers);
    fclose($file);
    $batch = Bus::batch([])->dispatch();
    $bills = DB::table('bill_costumers')->get()->toArray();
    // Log::info($bills);
    $chunks = array_chunk((array)$bills, 100);
    
    foreach ($chunks as $key => $chunk) {
        $jobs[] = new CsvReportJobs($chunk, $fileName);
    }

    $batch->add($jobs);
    return response()->json([
        'data' => [
            'batchId' => $batch->id
        ]
    ], 200);


    } catch (\Exception $e) {
        return response()->json($e->getMessage(), 500);
    }
});


Route::get('/test-csv/reports', function () {
    try {
        $filename = 'reports.csv';

        // open csv file for writing
        $f = fopen($filename, 'w');
        // $bills = DB::table('bill_costumers')->get();
        $query = DB::connection()->getPdo()->query("select * from bill_costumers");

        $bills = $query->fetchAll(PDO::FETCH_ASSOC);

        $billschunks = array_chunk((array)$bills, 100);

        $batch = Bus::batch([])->dispatch();

        foreach ($billschunks as $key => $chunk) {
            $jobs[] = new CsvReportJobs($chunk, $filename);
        }

        $batch->add($jobs);

        return 'ok';
    } catch (\Exception $e) {
        return $e->getMessage();
    }
});
