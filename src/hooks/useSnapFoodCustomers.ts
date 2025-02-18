// hooks/useSnapFoodCustomers.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { CustomerParams } from '@/app/api/external/omnigateway/types/snapfood-customer';
import { useClient } from './useClient';
import { createSnapFoodApi } from '@/app/api/external/omnigateway/snapfood-customer';
import toast from 'react-hot-toast';

export const useSnapFoodCustomers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [metrics, setMetrics] = useState({
        new_today: 0,
        deleted_today: 0
    });

    const { gatewayApiKey } = useClient();
    
    const snapFoodApi = useMemo(() => {
        return gatewayApiKey ? createSnapFoodApi(gatewayApiKey) : null;
    }, [gatewayApiKey]);

    const fetchCustomers = useCallback(async (params: CustomerParams = {}) => {
        if (!snapFoodApi) {
            return;
        }
        
        try {
            setIsLoading(true);
            const response = await snapFoodApi.getCustomers(params);
            
            setCustomers(response.customers.data || []);
            setTotalItems(response.customers.total);
            setTotalPages(response.customers.last_page);
            setMetrics({
                new_today: response.new_today,
                deleted_today: response.deleted_today
            });
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to fetch customers');
        } finally {
            setIsLoading(false);
        }
    }, [snapFoodApi]);

    // Initial fetch
    useEffect(() => {
        if (snapFoodApi) {
            fetchCustomers({ page: 1, per_page: 10 });
        }
    }, [snapFoodApi, fetchCustomers]);

    return {
        isLoading,
        customers,
        totalItems,
        totalPages,
        metrics,
        fetchCustomers,
        isInitialized: !!snapFoodApi
    };
};