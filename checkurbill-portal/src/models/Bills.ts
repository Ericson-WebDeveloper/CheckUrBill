



export interface BillPayment {
    id: string;
    bill_costumer_id: number;
    status: boolean|number;
    remarks: 'Success'|'Pending'|'In-Process'|'Cancel';
    amount: string;
    transaction_fee: string | number;
    payment_option: string|null;
    payment_ref_no: string|null;
    transaction_date: Date;
    transaction_payment_date: Date|null;
    created_at?: Date|null;
    updated_at?: Date|null;
}