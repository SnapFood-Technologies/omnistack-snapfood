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

// Login parameters supporting both email and SnapFood ID
interface LoginParams {
  email?: string;
  snapFoodId?: string;
  external_ids?: {
    snapFoodId?: string;
  };
  _id?: string;
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

    // Enhanced login function supporting both email and SnapFood ID
    loginAsUser: async (loginParams: LoginParams): Promise<{ id: string; token: string } | null> => {
      // Prepare login payload
      const payload: any = {};
      
      // Support different input formats
      if (loginParams.email) {
        payload.email = loginParams.email;
      } else if (loginParams.snapFoodId) {
        payload.snapFoodId = loginParams.snapFoodId;
      } else if (loginParams.external_ids?.snapFoodId) {
        payload.snapFoodId = loginParams.external_ids.snapFoodId;
      } else {
        throw new Error('No valid login credentials provided');
      }
      
      // Add admin login flag if needed
      payload.adminLogin = true;
      
      try {
        const { data } = await omniGateway.post('/auth/snapfood/login', payload);
        
        if (data && data.token) {
          return {
            id: data.userId || loginParams._id || '',
            token: data.token
          };
        }
        
        throw new Error('Invalid response from login API');
      } catch (error) {
        console.error('Login API error:', error);
        throw error;
      }
    }
  };
};