<?php

namespace App\Jobs;

use Carbon\Carbon;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Ramsey\Uuid\Type\Decimal;

class UploadBills implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public $headers;
    public $datas;
    public $batch_no;
    public function __construct(array $headers, array $datas, string $batch_no)
    {
        $this->headers = $headers;
        $this->datas = $datas;
        $this->batch_no = $batch_no;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        DB::beginTransaction();
        try {
                // Log::info($this->convertDate($data))
            foreach($this->datas as $data) {
                $data = $this->convertDate($data);
                $datas = array_combine($this->headers, $data);
                $datas = array_merge($datas, ['batch_no' => $this->batch_no]);
                $datas = $this->convertAmount($datas);
                DB::table('bill_costumers')->insert($datas);
            }
            DB::commit();
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            DB::rollBack();
        }
    }

    public function convertDate(array $datas): array 
    {
        for($x = 0; $x < count($datas); $x++) {
            if(str_contains($datas[$x], '/')) {
                // $datas[$x] = str_replace("/", "-", $datas[$x]);
                $datas[$x] = date("Y-m-d", strtotime($datas[$x]));
            } 
        }
        return $datas;
    }

    public function convertAmount(array $data): array 
    {
        $data['Amount'] = (float)str_replace(",", "", $data['Amount']);
        return $data;
    }
}
