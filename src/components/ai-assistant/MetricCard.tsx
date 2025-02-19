interface MetricCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    className?: string;
}

export function MetricCard({ label, value, subValue, className = "" }: MetricCardProps) {
    return (
        <div className={`bg-muted rounded-lg p-4 ${className}`}>
            <div className="text-sm text-muted-foreground mb-1">{label}</div>
            <div className="text-2xl font-semibold">{value}</div>
            {subValue && (
                <div className="text-sm text-muted-foreground mt-1">{subValue}</div>
            )}
        </div>
    );
}