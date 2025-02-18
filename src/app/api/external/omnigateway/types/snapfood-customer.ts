// types/snapfood-customer.ts
export interface Customer {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    registered_at: string;
    source: string;
    birthdate: string | null;
    sex: string | null;
    first_order: string | null;
    last_order: string | null;
    cashback_amount: number;
    cashback_level: {
        name: string;
    } | null;
}

export interface CustomerParams {
    page?: number;
    per_page?: number;
    search?: string;
    start_date?: string;
    end_date?: string;
}

export interface CustomerMetrics {
    new_today: number;
    deleted_today: number;
}

export interface CustomerListResponse {
    customers: {
        current_page: number;
        data: Customer[];
        first_page_url: string;
        from: number | null;
        last_page: number;
        last_page_url: string;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number | null;
        total: number;
    };
    new_today: number;
    deleted_today: number;
}
