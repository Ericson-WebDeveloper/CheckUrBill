<?php

namespace App\Exports;

use App\Models\BillCostumer;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Contracts\Queue\ShouldQueue;

class BillReportExportExcel implements FromQuery, WithMapping, WithHeadings
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
        return BillCostumer::query()->where('batch_no', '=', $this->reference);
    }


    /**
    * @var Invoice $invoice
    */
    public function map($bill): array
    {
        return [
            $bill->id,
            $bill->batch_no,
            $bill->merchant_ref,
            $bill['Account No'],
            $bill['Transaction Type'],
            $bill['Name'],
            $bill['Address'],
            $bill['Email'],
            $bill['Bill From'],
            $bill['Bill To'],
            $bill['Due Date'],
            $bill['Reference No'],
            $bill['Status'],
            $bill['Balance'],
            $bill['Amount Payment'],
            $bill['Amount']
        ];
    }

    public function headings(): array
    {
        return [
            'id', 
            'batch_no', 
            'merchant_ref', 
            'Account No', 
            'Transaction Type', 
            'Name', 
            'Address', 
            'Email', 
            'Bill From', 
            'Bill To', 
            'Due Date', 
            'Reference No', 
            'Status', 
            'Balance', 
            'Amount Payment', 
            'Amount'
        ];
    }
}
