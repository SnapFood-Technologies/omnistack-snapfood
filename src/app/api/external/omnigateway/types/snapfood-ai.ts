// types/snapfood-ai.ts
export enum AIAssistantType {
    CUSTOMER = 'customer',
    SOCIAL = 'social',
    FOOD = 'food',
    SALES = 'sales',
    ANALYTICS = 'analytics',
    ADMIN = 'admin'
}

export interface AIQueryContext {
    assistantType: AIAssistantType;
    startDate?: string;
    endDate?: string;
    customerId?: string;
    vendorId?: string;
    searchTerm?: string;
}

export interface AIQueryResponse {
    answer: string;
    data: any;
    suggestions?: string[];
    relatedQueries?: string[];
}
