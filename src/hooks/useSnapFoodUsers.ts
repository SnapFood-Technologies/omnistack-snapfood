// hooks/useSnapFoodUsers.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useClient } from './useClient';
import { createOmniGateway } from '@/app/api/external/omnigateway';
import toast from 'react-hot-toast';

interface UserParams {
  page?: number;
  per_page?: number;
  search?: string;
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
  
  const omniGateway = useMemo(() => {
    return gatewayApiKey ? createOmniGateway(gatewayApiKey) : null;
  }, [gatewayApiKey]);

  const fetchUsers = useCallback(async (params: UserParams = {}) => {
    if (!omniGateway) {
      return;
    }
    
    try {
      setIsLoading(true);
      const { data } = await omniGateway.get('/users/snapfood', { 
        params: {
          page: params.page || page,
          limit: params.per_page || pageSize,
          search: params.search || searchQuery
        }
      });
      
      setUsers(data.data || []);
      setTotalItems(data.meta.total);
      setTotalPages(data.meta.pages);
    } catch (error) {
      console.error('Error fetching SnapFood users:', error);
      toast.error('Failed to fetch SnapFood users');
    } finally {
      setIsLoading(false);
    }
  }, [omniGateway, page, pageSize, searchQuery]);

  const syncUsers = useCallback(async () => {
    if (!omniGateway) {
      return null;
    }
    
    try {
      setIsSyncing(true);
      const { data } = await omniGateway.post('/snapfoodie/users/sync', {
        page: 1,
        limit: 100 // Sync a larger batch at once
      });
      
      return data;
    } catch (error) {
      console.error('Error syncing SnapFood users:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [omniGateway]);

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
    if (omniGateway) {
      fetchUsers();
    }
  }, [omniGateway, fetchUsers, page, pageSize, searchQuery]);

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
    isInitialized: !!omniGateway
  };
};