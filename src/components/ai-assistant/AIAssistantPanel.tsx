// components/ai-assistant/AIAssistantPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    Bot, X, Send, Users, ShoppingBag, 
    BarChart2, Share2, PieChart, Settings 
} from "lucide-react";
import { AIAssistantType } from '@/app/api/external/omnigateway/types/snapfood-ai';

interface AIAssistantPanelProps {
    open: boolean;
    onClose: () => void;
}

export function AIAssistantPanel({ open, onClose }: AIAssistantPanelProps) {
    const [selectedType, setSelectedType] = useState<AIAssistantType>(AIAssistantType.CUSTOMER);
    const [query, setQuery] = useState("");
    
    const assistantTypes = [
        { type: AIAssistantType.CUSTOMER, icon: Users, label: "Customers" },
        { type: AIAssistantType.FOOD, icon: ShoppingBag, label: "Food" },
        { type: AIAssistantType.SALES, icon: BarChart2, label: "Sales" },
        { type: AIAssistantType.SOCIAL, icon: Share2, label: "Social" },
        { type: AIAssistantType.ANALYTICS, icon: PieChart, label: "Analytics" },
        { type: AIAssistantType.ADMIN, icon: Settings, label: "Admin" }
    ];

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
                    <ScrollArea className="flex-1 p-4">
                        <div className="flex justify-start mb-4">
                            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                                Hi! I'm your SnapFood Assistant. How can I help you today?
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="border-t p-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ask me anything..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1"
                            />
                            <Button size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}