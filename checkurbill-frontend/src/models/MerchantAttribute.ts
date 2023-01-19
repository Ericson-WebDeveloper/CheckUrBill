

export interface Institution {
    id: number;
    institution_name: string;
    created_at?: Date,
	updated_at?: Date,
}

export interface Category {
    id: number;
    merchant_category_name: string;
    created_at?: Date,
	updated_at?: Date,
}

export interface Type {
    id: number;
    merchant_type_name: string;
    created_at?: Date,
	updated_at?: Date,
}

