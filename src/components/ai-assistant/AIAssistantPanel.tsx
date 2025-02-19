// components/ai-assistant/AIAssistantPanel.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import DOMPurify from 'dompurify';
import { 
    Bot, X, Send, Users, ShoppingBag, 
    BarChart2, Share2, PieChart, Settings,
    RefreshCcw, MessageSquare, Lightbulb 
} from "lucide-react";
import { AIAssistantType } from '@/app/api/external/omnigateway/types/snapfood-ai';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { TypingAnimation } from "./TypingAnimation";

interface AIAssistantPanelProps {
    open: boolean;
    onClose: () => void;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

function FormattedMessage({ content, role }: { content: string; role: 'user' | 'assistant' }) {
    const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'ul', 'ol', 'li', 'br', 'span', 'div'],
        ALLOWED_ATTR: ['class', 'style']
    });

    return (
        <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg p-3 max-w-[80%] ${
                role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-muted whitespace-pre-wrap'
            }`}>
                {role === 'user' ? (
                    content
                ) : (
                    <div 
                        className="prose prose-sm max-w-none [&>p]:mb-3 [&>p:last-child]:mb-0
                                 [&>ul]:mb-3 [&>ul:last-child]:mb-0 [&>li]:mb-1"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
                    />
                )}
            </div>
        </div>
    );
}

function InsightCard({ title, data, loading, onClick, error }: any) {
    return (
        <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{title}</h3>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onClick}
                    disabled={loading}
                >
                    {loading ? <RefreshCcw className="h-4 w-4 animate-spin" /> : 'Refresh'}
                </Button>
            </div>
            <div className="min-h-[100px]">
                {loading ? (
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                ) : error ? (
                    <p className="text-sm text-red-500">{error}</p>
                ) : data ? (
                    <div className="prose prose-sm">
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data) }} />
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Click refresh to load data</p>
                )}
            </div>
        </Card>
    );
}

export function AIAssistantPanel({ open, onClose }: AIAssistantPanelProps) {
    const [activeView, setActiveView] = useState<'chat' | 'insights'>('chat');
    const [selectedType, setSelectedType] = useState<AIAssistantType>(AIAssistantType.CUSTOMER);
    const [messages, setMessages] = useState<Message[]>([]);
    const [query, setQuery] = useState("");
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    const { 
        isLoading,
        suggestions,
        askAssistant,
        loadSuggestions,
        getInsights,
        getHealthCheck,
        getQuickStats
    } = useAIAssistant();

    const [insightsData, setInsightsData] = useState<any>(null);
    const [healthCheckData, setHealthCheckData] = useState<any>(null);
    const [quickStatsData, setQuickStatsData] = useState<any>(null);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [loadingHealth, setLoadingHealth] = useState(false);
    const [loadingStats, setLoadingStats] = useState(false);

    const assistantTypes = [
        { type: AIAssistantType.CUSTOMER, icon: Users, label: "Customers" },
        { type: AIAssistantType.FOOD, icon: ShoppingBag, label: "Food" },
        { type: AIAssistantType.SALES, icon: BarChart2, label: "Sales" },
        { type: AIAssistantType.SOCIAL, icon: Share2, label: "Social" },
        { type: AIAssistantType.ANALYTICS, icon: PieChart, label: "Analytics" },
        { type: AIAssistantType.ADMIN, icon: Settings, label: "Admin" }
    ];

    useEffect(() => {
        const resetAndLoadTab = async (type: AIAssistantType) => {
            setMessages([]);
            setQuery('');
            setLoadingSuggestions(true);
            try {
                await loadSuggestions(type);
            } finally {
                setLoadingSuggestions(false);
            }
        };

        resetAndLoadTab(selectedType);
    }, [selectedType]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!query.trim()) return;

        const userMessage: Message = {
            role: 'user',
            content: query
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await askAssistant(query, {
                assistantType: selectedType,
                startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
            });

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.answer
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        }

        setQuery("");
    };

    const loadHealthCheck = async () => {
        setLoadingHealth(true);
        try {
            const data = await getHealthCheck();
            setHealthCheckData(data.answer);
        } catch (error) {
            console.error('Failed to load health check:', error);
        } finally {
            setLoadingHealth(false);
        }
    };

    const loadQuickStats = async () => {
        setLoadingStats(true);
        try {
            const data = await getQuickStats();
            setQuickStatsData(data.answer);
        } catch (error) {
            console.error('Failed to load quick stats:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    const loadTypeInsights = async () => {
        setLoadingInsights(true);
        try {
            const data = await getInsights(selectedType);
            setInsightsData(data.answer);
        } catch (error) {
            console.error('Failed to load insights:', error);
        } finally {
            setLoadingInsights(false);
        }
    };

    return (
        <Sheet open={open}>
            <SheetContent className="w-full md:w-[1200px] p-0">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            <h2 className="font-semibold">SnapFood Assistant</h2>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={activeView === 'chat' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setActiveView('chat')}
                                className="gap-2"
                            >
                                <MessageSquare className="h-4 w-4" />
                                Chat
                            </Button>
                            <Button
                                variant={activeView === 'insights' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setActiveView('insights')}
                                className="gap-2"
                            >
                                <Lightbulb className="h-4 w-4" />
                                Insights
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={onClose}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Assistant Types */}
                    <div className="border-b p-4">
                        <div className="flex flex-wrap gap-2">
                            {assistantTypes.map(({ type, icon: Icon, label }) => (
                                <Button
                                    key={type}
                                    variant={selectedType === type ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSelectedType(type)}
                                    className="gap-2"
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {activeView === 'chat' ? (
                        <>
                            {/* Chat Area */}
                            <ScrollArea ref={scrollRef} className="flex-1 p-4">
                                {messages.length === 0 ? (
                                    <>
                                        <div className="flex justify-start mb-4">
                                            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                                                <p className="font-medium mb-2">
                                                    Hi! I'm your {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Assistant.
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    How can I help you analyze {selectedType.toLowerCase()} data today?
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Suggestions */}
                                        <div className="mt-4 space-y-2">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Try asking:
                                            </p>
                                            {loadingSuggestions ? (
                                                <div className="space-y-2">
                                                    <div className="h-10 bg-muted animate-pulse rounded"></div>
                                                    <div className="h-10 bg-muted animate-pulse rounded"></div>
                                                    <div className="h-10 bg-muted animate-pulse rounded"></div>
                                                </div>
                                            ) : (
                                                suggestions.map((suggestion, index) => (
                                                    <Button
                                                        key={index}
                                                        variant="outline"
                                                        className="w-full justify-start text-left"
                                                        onClick={() => {
                                                            setQuery(suggestion);
                                                            handleSend();
                                                        }}
                                                    >
                                                        {suggestion}
                                                    </Button>
                                                ))
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((message, index) => (
                                            <FormattedMessage 
                                                key={index}
                                                content={message.content}
                                                role={message.role}
                                            />
                                        ))}
                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-muted rounded-lg p-3">
                                                    <TypingAnimation />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </ScrollArea>

                            {/* Input Area */}
                            <div className="border-t p-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Ask me anything..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                        className="flex-1"
                                        disabled={isLoading}
                                    />
                                    <Button 
                                        size="icon"
                                        onClick={handleSend}
                                        disabled={isLoading || !query.trim()}
                                    >
                                        {isLoading ? (
                                            <RefreshCcw className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 p-4 space-y-4 overflow-auto">
                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                <InsightCard
                                    title="Health Check"
                                    data={healthCheckData}
                                    loading={loadingHealth}
                                    onClick={loadHealthCheck}
                                />
                                <InsightCard
                                    title="Quick Stats"
                                    data={quickStatsData}
                                    loading={loadingStats}
                                    onClick={loadQuickStats}
                                />
                                <InsightCard
                                    title={`${selectedType} Insights`}
                                    data={insightsData}
                                    loading={loadingInsights}
                                    onClick={loadTypeInsights}
                                />
                            </div>
                            
                            {/* Additional explanation text */}
                            <div className="mt-4 text-sm text-muted-foreground">
                                <p>
                                    Click the refresh buttons above to load the latest insights and statistics.
                                    The data is updated in real-time based on your selected assistant type.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}