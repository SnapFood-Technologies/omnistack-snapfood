// api/external/omnigateway/snapfood-vendor.ts
import { createOmniGateway } from './index';
import { VendorParams, VendorListResponse } from '@/app/api/external/omnigateway/types/snapfood-vendor';

export const createSnapFoodVendorApi = (clientApiKey: string) => {
  const omniGateway = createOmniGateway(clientApiKey);

  return {
    getVendors: async (params: VendorParams = {}): Promise<VendorListResponse> => {
      try {
        const response = await omniGateway.get('/sf/vendors', { params });
        
        // Handle the response directly as it already comes in the expected format
        // The PHP API is returning data in the format { success: true, data: { vendors: [...], pagination: {...} } }
        return response.data;
      } catch (error) {
        console.error('Error fetching vendors:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: null
        };
      }
    }
  };
};