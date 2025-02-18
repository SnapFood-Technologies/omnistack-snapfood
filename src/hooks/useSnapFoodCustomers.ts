// hooks/useSnapFoodCustomers.ts
import { useState, useCallback } from 'react';
import { createSnapFoodApi } from '@/api/external/omnigateway/snapfood';
import { CustomerParams, CustomerMetrics, Customer } from '@/app/api/external/omnigateway/types/snapfood-customer';

import { useToast } from '@/components/ui/use-toast';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';

export const useSnapFoodCustomers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [metrics, setMetrics] = useState<CustomerMetrics | null>(null);

    const { toast } = useToast();
    const apiKey = useGatewayClientApiKey();
    const snapFoodApi = createSnapFoodApi(apiKey || '');

    const fetchCustomers = useCallback(async (params: CustomerParams = {}) => {
        if (!apiKey) return;
        try {
            setIsLoading(true);
            const response = await snapFoodApi.getCustomers(params);
            
            setCustomers(response.customers.data);
            setTotalItems(response.customers.total);
            setTotalPages(response.customers.last_page);
            setMetrics({
                new_today: response.new_today,
                deleted_today: response.deleted_today
            });
            
            return response;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch customers",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [toast, apiKey, snapFoodApi]);

    return {
        isLoading,
        customers,
        totalItems,
        totalPages,
        metrics,
        fetchCustomers,
    };
};