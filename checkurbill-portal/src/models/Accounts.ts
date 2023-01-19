

export interface Account  {
    id: string;
    user_id: string;
    member_id: number;
    account_no: string| number; 
    merchant_ref: string;
    merchant_name: string;
    firstname: string;
    lastname: string;
    middlename: string;
    email: string;
    confirm: boolean|number;
    status?: 'active'|'warning'|'deleted';
    code: string|null;
    code_generate: Date|null;
    created_at: Date;
    updated_at: Date;
}