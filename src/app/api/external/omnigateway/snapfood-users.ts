// api/external/omnigateway/snapfood-users.ts
import { createOmniGateway } from './index';

interface UserParams {
  page?: number;
  limit?: number;
  search?: string;
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
      const { data } = await omniGateway.get('/users/snapfood', { params });
      return data;
    },
    
    syncUsers: async (params: { page?: number; limit?: number } = {}): Promise<SyncResponse> => {
      const { data } = await omniGateway.post('/snapfoodie/users/sync', params);
      return data;
    }
  };
};