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
  const [loggingInUserId, setLoggingInUserId] = useState<string | null>(null);
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginData, setLoginData] = useState<{ id: string; token: string } | null>(null);

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
        sort: '-external_ids.snapFoodId'
      });
      
      setUsers(response.data || []);
      setTotalItems(response.meta.total);
      setTotalPages(response.meta.pages);
    } catch (error) {
      console.error('Error fetching SnapFood users:', error);
      toast.error('Failed to fetch SnapFoodies');
    } finally {
      setIsLoading(false);
    }
  }, [snapFoodUsersApi, page, pageSize, searchQuery]);

  const syncUsers = useCallback(async (batchPage: number = 1, batchSize: number = 200) => {
    if (!snapFoodUsersApi) {
      return null;
    }
    
    try {
      setIsSyncing(true);
      console.log(`Syncing with page ${batchPage} and limit ${batchSize}`); // Debug log
      
      // Pass both batchPage and batchSize parameters
      const response = await snapFoodUsersApi.syncUsers({
        page: batchPage,
        limit: batchSize
      });
      
      return response;
    } catch (error) {
      console.error('Error syncing SnapFood users:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [snapFoodUsersApi]);

  // Login function using the API in the gateway
  const loginAsUser = useCallback(async (user) => {
    if (!snapFoodUsersApi) {
      return null;
    }
    
    setLoggingInUserId(user._id);
    try {
      // Use the gateway API's loginAsUser function
      const data = await snapFoodUsersApi.loginAsUser(user);
      setLoginData(data);
      return data;
    } catch (error) {
      console.error('Error logging in as user:', error);
      const errorMessage = error.message || 'Unknown error';
      toast.error(`Login failed: ${errorMessage}`);
      return null;
    } finally {
      setLoggingInUserId(null);
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
    loggingInUserId,
    loginData,
    page,
    pageSize,
    totalItems,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    fetchUsers,
    syncUsers,
    loginAsUser,
    isInitialized: !!snapFoodUsersApi
  };
};