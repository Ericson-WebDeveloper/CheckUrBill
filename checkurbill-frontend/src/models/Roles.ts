

export interface Role {
    id: number;
    name: string;
    pivot?: {
        model_id: string;
        role_id: string;
        model_type: string;
    }
}