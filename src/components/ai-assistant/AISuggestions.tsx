import { AIAssistantType } from "@/app/api/external/omnigateway/types/snapfood-ai";
import { Button } from "../ui/button";

// components/ai-assistant/AISuggestions.tsx
interface AISuggestionsProps {
    type: AIAssistantType;
}

export function AISuggestions({ type }: AISuggestionsProps) {
    // Get suggestions based on type
    const suggestions = []; // You'll get these from your API
    
    return (
        <div className="mt-4 space-y-2">
            {suggestions.map((suggestion, index) => (
                <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left"
                >
                    {suggestion}
                </Button>
            ))}
        </div>
    );
}