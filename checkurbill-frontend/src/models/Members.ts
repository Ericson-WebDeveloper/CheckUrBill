

export interface Member {
    id: number;
    account_no: string | number;
    merchant_ref: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    email: string;
    password: string;
    status?: 'active'|'warning'|'deleted';
    remember_token?: string;
    created_at: Date;
    updated_at: Date;
}