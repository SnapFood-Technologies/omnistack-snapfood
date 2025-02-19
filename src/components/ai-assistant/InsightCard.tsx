import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { WalletStats } from "./WalletStats";
import { FeatureUsageSection } from "./FeatureUsageSection";

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

    // The data.data contains the structured data from the API response
    const responseData = data?.data || {};

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
            <div className="space-y-6">
                {responseData.order_stats && (
                    <div className="grid grid-cols-2 gap-2">
                        <MetricCard
                            label="Delivered Orders"
                            value={responseData.order_stats.delivered_orders}
                        />
                        <MetricCard
                            label="Order Completion"
                            value={`${responseData.metrics?.order_completion}%`}
                        />
                    </div>
                )}
                
                {responseData.customer_stats && (
                    <div className="grid grid-cols-2 gap-2">
                        <MetricCard
                            label="New Customers"
                            value={responseData.customer_stats.new_customers}
                        />
                        <MetricCard
                            label="Repeat Customers"
                            value={responseData.customer_stats.repeat_customers}
                            subValue={`${responseData.metrics?.customer_retention}% retention`}
                        />
                    </div>
                )}

                {responseData.wallet_stats && (
                    <WalletStats data={responseData.wallet_stats} />
                )}

                {responseData.feature_usage && (
                    <FeatureUsageSection data={responseData.feature_usage} />
                )}

                {/* Fallback for text-only responses */}
                {(!responseData.order_stats && 
                  !responseData.customer_stats && 
                  !responseData.wallet_stats && 
                  !responseData.feature_usage) && (
                    <div className="prose prose-sm">
                        <p>{data.answer || 'No data available'}</p>
                    </div>
                )}
            </div>
        </Card>
    );
}