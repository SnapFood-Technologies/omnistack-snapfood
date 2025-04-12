// hooks/useRestaurants.ts
import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  email?: string;
  externalSnapfoodId?: number;
  isOpen?: boolean;
  isActive: boolean;
  status: string;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseRestaurantsParams {
  initialPage?: number;
  initialPageSize?: number;
  initialSearch?: string;
}

export const useRestaurants = ({ 
  initialPage = 1, 
  initialPageSize = 10,
  initialSearch = ''
}: UseRestaurantsParams = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchRestaurants = useCallback(async (options?: { 
    page?: number; 
    pageSize?: number;
    search?: string;
  }) => {
    const fetchPage = options?.page ?? page;
    const fetchPageSize = options?.pageSize ?? pageSize;
    const fetchSearch = options?.search ?? search;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: fetchPage.toString(),
        pageSize: fetchPageSize.toString(),
      });

      if (fetchSearch) {
        params.append('search', fetchSearch);
      }

      const response = await fetch(`/api/restaurants?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      
      const data = await response.json();
      
      setRestaurants(data.restaurants);
      setTotalItems(data.pagination.totalItems);
      setTotalPages(data.pagination.totalPages);
      
      // Update state to match what we fetched
      if (options?.page) setPage(options.page);
      if (options?.pageSize) setPageSize(options.pageSize);
      if (options?.search !== undefined) setSearch(options.search);
      
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search]);

  // Initial fetch
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handlePageChange = (newPage: number) => {
    fetchRestaurants({ page: newPage });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    fetchRestaurants({ page: 1, pageSize: newPageSize });
  };

  const handleSearch = (searchTerm: string) => {
    fetchRestaurants({ page: 1, search: searchTerm });
  };

  return {
    restaurants,
    isLoading,
    page,
    pageSize,
    search,
    totalItems,
    totalPages,
    fetchRestaurants,
    handlePageChange,
    handlePageSizeChange,
    handleSearch
  };
};