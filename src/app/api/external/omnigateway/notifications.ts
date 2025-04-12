// api/external/omnigateway/notifications.ts
import { createOmniGateway } from './index';


interface NotificationResponse {
  data: any[];
  meta?: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export const createNotificationsApi = (clientApiKey: string) => {
  const omniGateway = createOmniGateway(clientApiKey);

  return {
  
    getNotificationTypesWithMethods: async (): Promise<NotificationResponse> => {
      const { data } = await omniGateway.get('/core-notifications/types-with-methods');
      return data;
    },

  };
};