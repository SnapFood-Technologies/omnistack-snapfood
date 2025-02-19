// components/ai-assistant/AIAssistantButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface AIAssistantButtonProps {
    onOpen: () => void;
}

export function AIAssistantButton({ onOpen }: AIAssistantButtonProps) {
    return (
        <Button 
            onClick={onOpen}
            className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
            size="icon"
        >
            <Bot className="h-6 w-6" />
        </Button>
    );
}