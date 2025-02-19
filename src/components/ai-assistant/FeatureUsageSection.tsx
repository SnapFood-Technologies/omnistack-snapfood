interface FeatureUsageSectionProps {
    data: Array<{
        name: string;
        click: number;
        usage: number;
    }>;
}

export function FeatureUsageSection({ data }: FeatureUsageSectionProps) {
    const sortedByClicks = [...data].sort((a, b) => b.click - a.click).slice(0, 5);
    const sortedByUsage = [...data].sort((a, b) => b.usage - a.usage).slice(0, 5);

    return (
        <div className="space-y-4">
            <h4 className="font-medium text-sm">Top Features by Clicks</h4>
            <div className="space-y-2">
                {sortedByClicks.map(feature => (
                    <div key={feature.name} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                        <span className="text-sm">{feature.name}</span>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">{feature.click} clicks</span>
                            <span className="text-sm text-muted-foreground">{feature.usage} users</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}