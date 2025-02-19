// components/ai-assistant/AIMessage.tsx
interface AIMessageProps {
    message: string;
    type: 'user' | 'assistant';
}

export function AIMessage({ message, type }: AIMessageProps) {
    return (
        <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`rounded-lg p-3 max-w-[80%] ${
                type === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-muted'
            }`}>
                {message}
            </div>
        </div>
    );
}