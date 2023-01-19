import { Category, Institution, Type } from "./MerchantAttribute";


export interface Merchant {
    id: string;
    merchant_ref: string;
    merchant_code: string;
    merchant_name: string;
    lbp_enrolled_account?: string;
    checkurbills_schema: 'Api' | 'StandAlone' | 'Costumize';
    status: 'Activated' | 'Deactivated' | 'Not Activated';
    API_URL?: string;
    created_at?: Date,
	updated_at?: Date,
}

export interface MerchantDetail {
    id: string;
    merchant_id: string;
    address: string;
    institution_type_id: number | Institution;
    merchant_category_id: number | Category;
    merchant_type_id: number | Type;
    contact_no: string;
    logo: string;
    created_at?: Date,
	updated_at?: Date,
}