// hooks/useSnapfoodVendors.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { VendorParams } from '@/app/api/external/omnigateway/types/snapfood-vendor';
import { useClient } from './useClient';
import { createSnapFoodVendorApi } from '@/app/api/external/omnigateway/snapfood-vendor';
import toast from 'react-hot-toast';

export const useSnapfoodVendors = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { gatewayApiKey } = useClient();
  
  const snapFoodApi = useMemo(() => {
    return gatewayApiKey ? createSnapFoodVendorApi(gatewayApiKey) : null;
  }, [gatewayApiKey]);

  const fetchVendors = useCallback(async (params: VendorParams = {}) => {
    if (!snapFoodApi) {
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await snapFoodApi.getVendors(params);
      
      if (response.success && response.data) {
        setVendors(response.data.vendors || []);
        setTotalItems(response.data.pagination.total);
        setTotalPages(response.data.pagination.lastPage);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to fetch vendors from Snapfood');
    } finally {
      setIsLoading(false);
    }
  }, [snapFoodApi]);

  // Initial fetch
  useEffect(() => {
    if (snapFoodApi) {
      fetchVendors({ page: 1, per_page: 10 });
    }
  }, [snapFoodApi, fetchVendors]);

  return {
    isLoading,
    vendors,
    totalItems,
    totalPages,
    fetchVendors,
    isInitialized: !!snapFoodApi
  };
};