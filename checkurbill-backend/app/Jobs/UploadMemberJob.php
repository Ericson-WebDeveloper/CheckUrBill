<?php

namespace App\Jobs;

use App\Models\Member;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UploadMemberJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public $headers;
    public $datas;

    public function __construct(array $headers, array $datas)
    {
        $this->headers = $headers;
        $this->datas = $datas;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // try {
            foreach($this->datas as $data) {
                // Log::info(array_combine($this->headers, $data)); 
                // Member::create(array_combine($this->headers, $data)); 
                DB::table('members')->insert(array_merge(array_combine($this->headers, $data), 
                ['created_at' => \Carbon\Carbon::now(), 'updated_at' => \Carbon\Carbon::now()]));
            }
        // } catch (\Exception $e) {
        //     Log::error($e->getMessage());
        // }
        
    }
}
