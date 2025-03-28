// hooks/useNotifications.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useClient } from './useClient';
import { createNotificationsApi } from '@/app/api/external/omnigateway/notifications';
import toast from 'react-hot-toast';


export const useNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notificationTypesWithMethods, setNotificationTypesWithMethods] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { gatewayApiKey } = useClient();
  
  const notificationsApi = useMemo(() => {
    return gatewayApiKey ? createNotificationsApi(gatewayApiKey) : null;
  }, [gatewayApiKey]);

 

  const fetchNotificationTypesWithMethods = useCallback(async () => {
    if (!notificationsApi) {
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await notificationsApi.getNotificationTypesWithMethods();
      
      setNotificationTypesWithMethods(response.data || []);
    } catch (error) {
      console.error('Error fetching notification types with methods:', error);
      toast.error('Failed to fetch notification types with methods');
    } finally {
      setIsLoading(false);
    }
  }, [notificationsApi]);


  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
  }, []);

  // Initial fetch
  useEffect(() => {
    if (notificationsApi) {
      fetchNotificationTypesWithMethods();
    }
  }, [notificationsApi, fetchNotificationTypesWithMethods]);

  return {
    notificationTypesWithMethods,
    isLoading,
    selectedType,
    setSelectedType,
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    fetchNotificationTypesWithMethods,
    isInitialized: !!notificationsApi
  };
};