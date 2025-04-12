// api/external/omnigateway/snapfood-customer
import { createOmniGateway } from './index';

import { CustomerParams, CustomerListResponse } from '@/app/api/external/omnigateway/types/snapfood-customer';

export const createSnapFoodApi = (clientApiKey: string) => {
    const omniGateway = createOmniGateway(clientApiKey);

    return {
        getCustomers: async (params: CustomerParams = {}): Promise<CustomerListResponse> => {
            const { data } = await omniGateway.get('/sf/customers', { params });
            return data;
        }
    };
};
