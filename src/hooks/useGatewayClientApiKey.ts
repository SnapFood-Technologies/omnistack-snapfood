// hooks/useGatewayClientApiKey.ts
import { useEffect, useState } from 'react';
import { useClient } from './useClient';

export const useGatewayClientApiKey = () => {
    const { clientId } = useClient();
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
              
        const fetchApiKey = async () => {
            if (!clientId) {
                console.log('No clientId available');
                return;
            }

            try {
                console.log('Fetching API key for clientId:', clientId);
                const response = await fetch(`/api/client/gateway-api-key?clientId=${clientId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch API key');
                }

                const data = await response.json();
                setApiKey(data.apiKey);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            }
        };

        fetchApiKey();
    }, [clientId]);

    return { apiKey, error };
};