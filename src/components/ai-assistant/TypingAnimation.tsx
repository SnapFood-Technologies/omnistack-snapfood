// components/ai-assistant/TypingAnimation.tsx
export function TypingAnimation() {
    return (
        <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
                <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce"></div>
            </div>
        </div>
    );
}