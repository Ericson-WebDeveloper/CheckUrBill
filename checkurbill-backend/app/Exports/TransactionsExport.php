<?php

namespace App\Exports;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class TransactionsExport implements FromQuery, WithMapping, WithHeadings
{
    use Exportable;

    public $reference;

    public function __construct(string $reference)
    {
        $this->reference = $reference;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    // public function collection()
    // {
    //     //
    // }

    public function query()
    {
        return Transaction::query()
        ->join('bill_costumers', 'bill_costumers.id', '=', 'bill_payment_transactions.bill_costumer_id')
        ->where('bill_payment_transactions.batch_no', '=', $this->reference)
        ->orderBy('bill_costumers.Account No', 'DESC');
    }

    /**
    * @var Invoice $invoice
    */
    public function map($transaction): array
    {
        return [
            $transaction['Account No'],
            $transaction['Transaction Type'],
            $transaction['Name'],
            $transaction->remarks,
            $transaction['Amount Payment'],
            $transaction->transaction_date,
            $transaction->transaction_payment_date,
            $transaction['Email'],
            $transaction['Bill From'],
            $transaction['Bill To'],
        ];
    }

    public function headings(): array
    {
        return [
            'Account No', 
            'Transaction Type', 
            'Name', 
            'Payment Remarks', 
            'Amount Payment', 
            'Transaction Date', 
            'Transaction Payment Date', 
            'Email', 
            'Bill From', 
            'Bill To'
        ];
    }


}
