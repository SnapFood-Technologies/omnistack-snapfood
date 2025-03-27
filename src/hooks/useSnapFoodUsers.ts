// hooks/useSnapFoodUsers.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useClient } from './useClient';
import { createSnapFoodUsersApi } from '@/app/api/external/omnigateway/snapfood-users';
import toast from 'react-hot-toast';

interface UserParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
}

export const useSnapFoodUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { gatewayApiKey } = useClient();
  
  const snapFoodUsersApi = useMemo(() => {
    return gatewayApiKey ? createSnapFoodUsersApi(gatewayApiKey) : null;
  }, [gatewayApiKey]);

  const fetchUsers = useCallback(async (params: UserParams = {}) => {
    if (!snapFoodUsersApi) {
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await snapFoodUsersApi.getUsers({ 
        page: params.page || page,
        limit: params.per_page || pageSize,
        search: params.search || searchQuery,
        sort: '-external_ids.snapFoodId' // Sort by SnapFood ID in descending order
      });
      
      setUsers(response.data || []);
      setTotalItems(response.meta.total);
      setTotalPages(response.meta.pages);
    } catch (error) {
      console.error('Error fetching SnapFood users:', error);
      toast.error('Failed to fetch SnapFood users');
    } finally {
      setIsLoading(false);
    }
  }, [snapFoodUsersApi, page, pageSize, searchQuery]);

  const syncUsers = useCallback(async () => {
    if (!snapFoodUsersApi) {
      return null;
    }
    
    try {
      setIsSyncing(true);
      const response = await snapFoodUsersApi.syncUsers({
        page: 1,
        limit: 100 // Sync a larger batch at once
      });
      
      return response;
    } catch (error) {
      console.error('Error syncing SnapFood users:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [snapFoodUsersApi]);

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
    if (snapFoodUsersApi) {
      fetchUsers();
    }
  }, [snapFoodUsersApi, fetchUsers, page, pageSize, searchQuery]);

  return {
    users,
    isLoading,
    isSyncing,
    page,
    pageSize,
    totalItems,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    fetchUsers,
    syncUsers,
    isInitialized: !!snapFoodUsersApi
  };
};