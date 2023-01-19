<?php

namespace App\Jobs;

use App\Exports\TransactionsExport;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Maatwebsite\Excel\Facades\Excel;


class GenerateTransactionPaymentReport implements ShouldQueue
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
    //     Excel::store(new TransactionsExport($this->reference), "payments/{$this->filename}");
    // }


    
    public $transactions;
    public $filename;
    public $path;
    public function __construct($transactions, $filename, $path)
    {
        $this->transactions = $transactions;
        $this->filename = $filename;
        $this->path = $path;
    }

    public function handle()
    {
        $file = fopen($this->path.$this->filename, 'a');
        foreach($this->transactions as $data) {
            $data = get_object_vars($data);
            $datas = [
                'Account No' => $data['Account No'],
                'Transaction Type' => $data['Transaction Type'],
                'Name' => $data['Name'],
                'Payment Remarks' => $data['remarks'],
                'Amount Payment' => $data['Amount Payment'], 
                'Transaction Date' => $data['transaction_date'], 
                'Transaction Payment Date' => $data['transaction_payment_date'], 
                'Email' => $data['Email'], 
                'Bill From' => $data['Bill From'], 
                'Bill To' => $data['Bill To']
            ];
           fputcsv($file, $datas);
        }
        fclose($file);
    }

}
