export interface Merchant {
    id: string;
    merchant_ref: string;
    merchant_code: string;
    merchant_name: string;
    lbp_enrolled_account: string | null;
    checkurbills_schema: "Api" | "StandAlone" | "Costumize";
    status: "Activated" | "Deactivated" | "Not Activated";
    API_URL: string | null;
    created_at: Date;
    updated_at: Date;
    detail_id: string;
    detail_merchant_id: string;
    detail_address: string;
    institution_type_id?: number;
    merchant_category_id?: number;
    merchant_type_id?: number;
    merchant_institution?: string;
    merchant_category?: string;
    merchant_type?: string;
    detail_contact_no: string;
    detail_logo: string;
    detail_created_at: Date;
    detail_updated_at: Date;
  }


export interface Category {
  id:number;
  merchant_category_name: string;
  icon: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Institution {
  id:number;
  institution_name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Type {
  id:number;
  merchant_type_name: string;
  created_at?: Date;
  updated_at?: Date;
}