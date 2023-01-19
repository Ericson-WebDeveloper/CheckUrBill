<?php

namespace App\Jobs;

use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CsvReportJobs implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public $bills;
    public $filename;
    public function __construct($bills, $filename)
    {
        $this->bills = $bills;
        $this->filename = $filename;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $path = storage_path('app/public/csv/');
        $file = fopen($path.$this->filename, 'a');
        foreach($this->bills as $data) {
            $data = get_object_vars($data);
            $datas = [
                'Account No' => $data['Account No'],
                'Transaction Type' => $data['Transaction Type'],
                'Name' => $data['Name'],
                'Address' => $data['Address'],
                'Email' => $data['Email'],
                'Bill From' => $data['Bill From'],
                'Bill To' => $data['Bill To'],
                'Due Date' => $data['Due Date'],
                'Reference No' => $data['Reference No'],
                'Status' => $data['Status'],
                'Balance' => $data['Balance'],
                'Amount Payment' => $data['Amount Payment'],
                'Amount' => $data['Amount']
            ];
           fputcsv($file, $datas);
        }
        fclose($file);
    }
}
