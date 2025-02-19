// app/api/external/omnigateway/ai.ts
import { AIAssistantType, AIQueryContext, AIQueryResponse } from '@/app/api/external/omnigateway/types/snapfood-ai';
import { createOmniGateway } from './index';

export const createAIApi = (apiKey: string) => {
    const omniGateway = createOmniGateway(apiKey);

    return {
        askAssistant: async (query: string, context: AIQueryContext): Promise<AIQueryResponse> => {
            const { data } = await omniGateway.post('/ai/ask', { query, context });
            return data;
        },

        getSuggestions: async (type: AIAssistantType): Promise<string[]> => {
            const { data } = await omniGateway.get(`/ai/suggestions?type=${type}`);
            return data;
        },

        getInsights: async (type: AIAssistantType, startDate?: string, endDate?: string): Promise<AIQueryResponse> => {
            const { data } = await omniGateway.get(`/ai/insights/${type}`, {
                params: { startDate, endDate }
            });
            return data;
        },

        getHealthCheck: async (): Promise<AIQueryResponse> => {
            const { data } = await omniGateway.get('/ai/health-check');
            return data;
        },

        getQuickStats: async (): Promise<AIQueryResponse> => {
            const { data } = await omniGateway.get('/ai/quick-stats');
            return data;
        }
    };
};