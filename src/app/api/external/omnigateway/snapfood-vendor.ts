// api/external/omnigateway/snapfood-vendor.ts
import { createOmniGateway } from './index';
import { VendorParams, VendorListResponse } from '@/app/api/external/omnigateway/types/snapfood-vendor';

export const createSnapFoodVendorApi = (clientApiKey: string) => {
  const omniGateway = createOmniGateway(clientApiKey);

  return {
    getVendors: async (params: VendorParams = {}): Promise<VendorListResponse> => {
      const { data } = await omniGateway.get('/sf/vendors', { params });
      return data;
    }
  };
};