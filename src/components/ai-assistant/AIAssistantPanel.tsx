// components/ai-assistant/AIAssistantPanel.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    Bot, X, Send, Users, ShoppingBag, 
    BarChart2, Share2, PieChart, Settings,
    RefreshCcw 
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

export function AIAssistantPanel({ open, onClose }: AIAssistantPanelProps) {
    const [selectedType, setSelectedType] = useState<AIAssistantType>(AIAssistantType.CUSTOMER);
    const [query, setQuery] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    
    const { 
        isLoading, 
        messages, 
        suggestions, 
        askAssistant, 
        loadSuggestions 
    } = useAIAssistant();

    const assistantTypes = [
        { type: AIAssistantType.CUSTOMER, icon: Users, label: "Customers" },
        { type: AIAssistantType.FOOD, icon: ShoppingBag, label: "Food" },
        { type: AIAssistantType.SALES, icon: BarChart2, label: "Sales" },
        { type: AIAssistantType.SOCIAL, icon: Share2, label: "Social" },
        { type: AIAssistantType.ANALYTICS, icon: PieChart, label: "Analytics" },
        { type: AIAssistantType.ADMIN, icon: Settings, label: "Admin" }
    ];

    useEffect(() => {
        loadSuggestions(selectedType);
    }, [selectedType, loadSuggestions]);

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

        await askAssistant(query, {
            assistantType: selectedType,
            startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
        });

        setQuery("");
    };

    return (
        <Sheet open={open}>
            <SheetContent className="w-full md:w-[900px] p-0">
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            <h2 className="font-semibold">SnapFood Assistant</h2>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
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

                    {/* Chat Area */}
                    <ScrollArea ref={scrollRef} className="flex-1 p-4">
                        {messages.length === 0 ? (
                            <>
                                <div className="flex justify-start mb-4">
                                    <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                                        Hi! I'm your SnapFood Assistant. How can I help you today?
                                    </div>
                                </div>
                                
                                {/* Suggestions */}
                                {suggestions.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Try asking:
                                        </p>
                                        {suggestions.map((suggestion, index) => (
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
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div key={index} className={`flex ${
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}>
                                        <div className={`rounded-lg p-3 max-w-[80%] ${
                                            message.role === 'user' 
                                                ? 'bg-primary text-white' 
                                                : 'bg-muted'
                                        }`}>
                                            {message.content}
                                        </div>
                                    </div>
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
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
                </div>
            </SheetContent>
        </Sheet>
    );
}