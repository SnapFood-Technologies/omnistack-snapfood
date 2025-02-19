import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    RefreshCcw, 
    TrendingUp, 
    Users, 
    ShoppingCart, 
    Gift, 
    Wallet, 
    Activity,
    ArrowUp,
    ArrowDown
} from "lucide-react";

// Helper Components
interface MetricCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon?: React.ElementType;
}

function MetricCard({ label, value, subValue, icon: Icon }: MetricCardProps) {
    return (
        <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                <div className="text-sm text-muted-foreground">{label}</div>
            </div>
            <div className="text-2xl font-semibold">{value}</div>
            {subValue && (
                <div className="text-sm text-muted-foreground mt-1">{subValue}</div>
            )}
        </div>
    );
}

function WalletStats({ data }: { data: any }) {
    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('sq-AL', {
            style: 'currency',
            currency: 'ALL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Number(amount));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <MetricCard
                    label="Total Transfers"
                    value={formatCurrency(data.total_transfers)}
                    icon={Wallet}
                />
                <MetricCard
                    label="From Cashback"
                    value={formatCurrency(data.total_from_cashback)}
                    icon={Gift}
                />
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-3">Outgoing Credits</div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm">Orders</span>
                        <span className="text-sm font-medium">
                            {formatCurrency(data.outgoing_credits.order_payments.amount)}
                            <span className="text-muted-foreground ml-1">
                                ({data.outgoing_credits.order_payments.percentage}%)
                            </span>
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm">Transfers</span>
                        <span className="text-sm font-medium">
                            {formatCurrency(data.outgoing_credits.transfers.amount)}
                            <span className="text-muted-foreground ml-1">
                                ({data.outgoing_credits.transfers.percentage}%)
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}


function CustomerInsightSection({ data }: { data: any }) {
    // Data is directly in the response, not under customerStats
    if (!data?.customers?.data) return null;

    const customerData = data.customers;
    const sources = customerData.data.reduce((acc: any, customer: any) => {
        acc[customer.source] = (acc[customer.source] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <MetricCard
                    label="Total Customers"
                    value={customerData.total}
                    icon={Users}
                />
                <MetricCard
                    label="New Today"
                    value={data.new_today}
                    subValue="Active customers"
                    icon={TrendingUp}
                />
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm font-medium mb-3">Customer Sources</div>
                <div className="space-y-2">
                    {Object.entries(sources).map(([source, count]) => (
                        <div key={source} className="flex justify-between">
                            <span className="text-sm">{source || 'Unknown'}</span>
                            <span className="text-sm font-medium">{count as number} users</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm font-medium mb-3">Recent Customers</div>
                <div className="space-y-2">
                    {customerData.data.slice(0, 5).map((customer: any) => (
                        <div key={customer.id} className="flex justify-between items-center">
                            <div>
                                <div className="text-sm font-medium">
                                    {customer.full_name || 'Unnamed User'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {new Date(customer.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="text-sm">{customer.source}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function HealthCheckSection({ data }: { data: any }) {
    if (!data?.platform_health) return null;

    const health = data.platform_health;
    const risks = health.risk_factors;

    const getRiskColor = (score: number) => {
        if (score <= 3) return 'text-green-500';
        if (score <= 7) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getGrowthIcon = (value: number) => {
        if (value > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
        if (value < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
        return null;
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
                <MetricCard
                    label="Platform Health Status"
                    value={health.overall_health}
                    icon={Activity}
                />
            </div>

            <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm font-medium mb-3">Customer Risks</div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Churn Risk</span>
                            <span className={`text-sm font-medium ${getRiskColor(risks.customer_risks.churn_risk.risk_score)}`}>
                                {risks.customer_risks.churn_risk.risk_level}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Engagement Risk</span>
                            <span className={`text-sm font-medium ${getRiskColor(risks.customer_risks.engagement_risk.risk_score)}`}>
                                {risks.customer_risks.engagement_risk.interaction_frequency}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm font-medium mb-3">Growth Indicators</div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">User Growth</span>
                            <div className="flex items-center gap-1">
                                {getGrowthIcon(health.growth_indicators.platform_growth.user_growth)}
                                <span className="text-sm font-medium">
                                    {health.growth_indicators.platform_growth.user_growth}%
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Revenue Growth</span>
                            <div className="flex items-center gap-1">
                                {getGrowthIcon(health.growth_indicators.revenue_growth.growth_rate)}
                                <span className="text-sm font-medium">
                                    {health.growth_indicators.revenue_growth.growth_rate}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface InsightCardProps {
    title: string;
    data: any;
    loading: boolean;
    onClick: () => void;
    error?: string;
}

export function InsightCard({ title, data, loading, onClick, error }: InsightCardProps) {
    if (!data) {
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
                <div className="min-h-[200px] flex items-center justify-center">
                    {loading ? (
                        <div className="w-full space-y-4">
                            <div className="h-20 bg-muted animate-pulse rounded" />
                            <div className="h-20 bg-muted animate-pulse rounded opacity-60" />
                            <div className="h-20 bg-muted animate-pulse rounded opacity-30" />
                        </div>
                    ) : error ? (
                        <p className="text-sm text-red-500">{error}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground">Click refresh to load data</p>
                    )}
                </div>
            </Card>
        );
    }

    const responseData = data.data;

    return (
        <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{title}</h3>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onClick}
                    disabled={loading}
                    className="gap-2"
                >
                    {loading ? <RefreshCcw className="h-4 w-4 animate-spin" /> : 'Refresh'}
                </Button>
            </div>

            {title.toLowerCase().includes("customer") && (
    <CustomerInsightSection data={responseData} />
)}

            {title === "Health Check" && (
                <HealthCheckSection data={responseData} />
            )}

            <div className="space-y-6">
                {responseData.order_stats && (
                    <div className="grid grid-cols-2 gap-3">
                        <MetricCard
                            label="Delivered Orders"
                            value={responseData.order_stats.delivered_orders}
                            icon={ShoppingCart}
                        />
                        <MetricCard
                            label="Order Completion"
                            value={`${responseData.metrics?.order_completion}%`}
                            icon={TrendingUp}
                        />
                    </div>
                )}
                
                {responseData.wallet_stats && (
                    <WalletStats data={responseData.wallet_stats} />
                )}

                {responseData.feature_usage && (
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-sm font-medium mb-3">Top Features</div>
                        <div className="space-y-2">
                            {[...responseData.feature_usage]
                                .sort((a, b) => b.click - a.click)
                                .slice(0, 5)
                                .map(feature => (
                                    <div key={feature.name} className="flex justify-between items-center">
                                        <span className="text-sm">{feature.name}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium">{feature.click} clicks</span>
                                            <span className="text-sm text-muted-foreground">{feature.usage} users</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}