<?php

namespace App\Jobs;

use App\Exports\BillReportExportExcel;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Maatwebsite\Excel\Facades\Excel;

class GenerateBillReportJobs implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    // public $filename;
    // public $reference;
    // public function __construct(string $filename, string $reference)
    // {
    //     $this->filename = $filename;
    //     $this->reference = $reference;
    // }

    /**
     * Execute the job.
     *
     * @return void
     */
    // public function handle()
    // {
    //     Excel::store(new BillReportExportExcel($this->reference), "transactions/{$this->filename}");
    // }




    public $bills;
    public $filename;
    public $path;
    public function __construct($bills, $filename, $path)
    {
        $this->bills = $bills;
        $this->filename = $filename;
        $this->path = $path;
    }

    public function handle()
    {
        $file = fopen($this->path.$this->filename, 'a');
        foreach($this->bills as $data) {
            // convert object to associative array ex:$data->Name => $data['Name']
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
