

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    middlename: string;
    status: 'Activated' | 'Deactivated' | 'Not Activated';
    email: string;
    email_verified_at?: Date;
    password?: string;
    created_at?: Date,
	updated_at?: Date,
}

export interface UserInfo {
    id: string;
    user_id: string;
    gender: string;
    avatar: string;
    contact_no: string;
    merchant_ref: string;
    created_at?: Date,
	updated_at?: Date,
}