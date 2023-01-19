


export interface ITransaction {
    id: string;
    'Transaction Type': string;
    'Account No': string;
    Name: string;
    status: number;
    remarks: string;
    amount: number;
    transaction_fee: number;
    payment_option: string;
    payment_ref_no: string;
    transaction_date: Date;
    transaction_payment_date: Date;
}