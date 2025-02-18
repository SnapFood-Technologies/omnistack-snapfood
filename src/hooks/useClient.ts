export interface Client {
  id: string;
  name: string;
  isSuperClient: boolean;
  omniGatewayId?: string;
  omniGatewayApiKey?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  clientId?: string;
  client?: Client;
  restaurantId?: string;
}

// hooks/useClient.ts
import { useSession } from 'next-auth/react';

export const useClient = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  
  return {
    clientId: user?.clientId || '',
    client: user?.client || null,
    isSystemClient: user?.client?.isSuperClient || false,
    gatewayId: user?.client?.omniGatewayId,
    gatewayApiKey: user?.client?.omniGatewayApiKey,
    name: user?.name,
    role: user?.role,
  };
};