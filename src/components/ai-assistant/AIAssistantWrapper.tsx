// components/ai-assistant/AIAssistantWrapper.tsx
"use client";

import { useState } from "react";
import { AIAssistantButton } from "./AIAssistantButton";
import { AIAssistantPanel } from "./AIAssistantPanel";

export function AIAssistantWrapper() {
    const [assistantOpen, setAssistantOpen] = useState(false);

    return (
        <>
            <AIAssistantButton onOpen={() => setAssistantOpen(true)} />
            <AIAssistantPanel 
                open={assistantOpen} 
                onClose={() => setAssistantOpen(false)}
            />
        </>
    );
}