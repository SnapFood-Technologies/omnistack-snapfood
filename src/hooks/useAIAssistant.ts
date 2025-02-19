// hooks/useAIAssistant.ts
import { useState, useCallback } from 'react';
import { AIAssistantType, AIQueryContext, AIQueryResponse } from '@/app/api/external/omnigateway/types/snapfood-ai';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import { createAIApi } from '@/app/api/external/omnigateway/ai';
import { toast } from '@/components/ui/use-toast';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const useAIAssistant = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [healthStats, setHealthStats] = useState<any>(null);

    const apiKey = useGatewayClientApiKey();
    const aiApi = createAIApi(apiKey);

    const askAssistant = useCallback(async (query: string, context: AIQueryContext) => {
        if (!aiApi) return;

        try {
            setIsLoading(true);
            setMessages(prev => [...prev, { role: 'user', content: query }]);

            const response = await aiApi.askAssistant(query, context);
            
            setMessages(prev => [...prev, { role: 'assistant', content: response.answer }]);
            return response;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to get AI response",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [aiApi]);

    const loadSuggestions = useCallback(async (type: AIAssistantType) => {
        if (!aiApi) return;

        try {
            const suggestions = await aiApi.getSuggestions(type);
            setSuggestions(suggestions);
        } catch (error) {
            console.error('Failed to load suggestions:', error);
        }
    }, [aiApi]);

    const loadHealthStats = useCallback(async () => {
        if (!aiApi) return;

        try {
            const response = await aiApi.getHealthCheck();
            setHealthStats(response.data);
        } catch (error) {
            console.error('Failed to load health stats:', error);
        }
    }, [aiApi]);

    return {
        isLoading,
        messages,
        suggestions,
        healthStats,
        askAssistant,
        loadSuggestions,
        loadHealthStats,
        clearMessages: () => setMessages([])
    };
};