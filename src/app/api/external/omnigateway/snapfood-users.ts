// api/external/omnigateway/snapfood-users.ts
import { createOmniGateway } from './index';

interface UserParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

interface UserResponse {
  data: any[];
  meta: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

interface SyncResponse {
  success: boolean;
  message: string;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  errorDetails?: Array<{userId: string, error: string}>;
}

export const createSnapFoodUsersApi = (clientApiKey: string) => {
  const omniGateway = createOmniGateway(clientApiKey);

  return {
    getUsers: async (params: UserParams = {}): Promise<UserResponse> => {
      const { data } = await omniGateway.get('/snapfoodie/users', { 
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
          sort: params.sort || '-external_ids.snapFoodId'
        } 
      });
      return data;
    },
    
    syncUsers: async (params: { page?: number; limit?: number } = {}): Promise<SyncResponse> => {
      const { data } = await omniGateway.post('/snapfoodie/users/sync', {
        page: params.page || 1,
        limit: params.limit || 50
      });
      return data;
    }
  };
};