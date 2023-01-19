

export interface Permission {
    id: number;
    name: string;
    pivot?: {
        model_id: string;
        permission_id: string;
        model_type: string;
    }
}