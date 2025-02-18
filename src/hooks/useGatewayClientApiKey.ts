import { useClient } from './useClient';

export const useGatewayClientApiKey = () => {
    const { gatewayApiKey } = useClient();
    return gatewayApiKey || '';
};