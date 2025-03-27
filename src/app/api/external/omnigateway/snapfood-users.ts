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
      console.log('Syncing with params:', params); // Debug log
      
      const { data } = await omniGateway.post('/snapfoodie/users/sync', {
        page: params.page || 1,
        limit: params.limit || 200 // Changed default from 50 to 200
      });
      return data;
    },

    // New login function using the gateway
    loginAsUser: async (user: { email: string; _id?: string }): Promise<{ id: string; token: string } | null> => {
      if (!user || !user.email) {
        throw new Error('User email not available');
      }
      
      const { data } = await omniGateway.post('/auth/snapfood/login', {
        email: user.email,
        password: 'admin-login' // Backend should handle this special case
      });
      
      if (data && data.token) {
        return {
          id: data.userId || user._id,
          token: data.token
        };
      }
      
      throw new Error('Invalid response from login API');
    }
  };
};