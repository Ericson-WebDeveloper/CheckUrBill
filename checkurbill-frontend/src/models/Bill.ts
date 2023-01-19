import { string } from "yup";


export interface Bill {
    id: string;
    batch_no: string;
    merchant_id: string;
    path_file: string;
    status: 'Pending' | 'Approved' | 'Reject';
    bill_month: Date;
    date_uploaded: Date;
    date_approved: null | Date;
    date_reject: null | Date;
    remarks: string;
    created_at: Date;
    updated_at: Date;
}


export interface BillCostumer {
    id: number;
    batch_no: string;
    merchant_ref: string;
    'Account No': string;
    'Transaction Type': string;
    Name: string;
    Address: string;
    Email: string;
    'Bill From': Date;
    'Bill To': Date;
    'Due Date': Date;
    'Reference No': string;
    Status: string;
    Balance: string;
    'Amount Payment': string;
    Amount: string;
    created_at?: Date;
    updated_at?: Date;
} 