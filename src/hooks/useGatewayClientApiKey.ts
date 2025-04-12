// hooks/useGatewayClientApiKey.ts
import { useClient } from './useClient';

export const useGatewayClientApiKey = () => {
    const { gatewayApiKey } = useClient();
    return { 
        apiKey: gatewayApiKey || '',
        error: !gatewayApiKey ? new Error('No API key available') : null
    };
};