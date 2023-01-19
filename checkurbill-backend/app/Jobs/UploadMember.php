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

class UploadMember implements ShouldQueue
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
        sleep(2);
        foreach($this->datas as $data) {
            Member::query()->create(array_combine($this->headers, $data)); 
            // DB::table('members')->insert(array_combine($this->headers, $data));
        }
    }
}
