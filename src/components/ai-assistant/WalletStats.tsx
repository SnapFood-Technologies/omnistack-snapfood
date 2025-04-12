import { MetricCard } from "./MetricCard";

interface WalletStatsProps {
    data: {
        total_transfers: string | number;
        total_from_cashback: string | number;
        outgoing_credits: {
            order_payments: {
                amount: string | number;
                percentage: number;
            };
            transfers: {
                amount: string | number;
                percentage: number;
            };
        };
    };
}

function formatCurrency(amount: number | string) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(Number(amount));
}

export function WalletStats({ data }: WalletStatsProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                <MetricCard
                    label="Total Transfers"
                    value={formatCurrency(data.total_transfers)}
                />
                <MetricCard
                    label="Total Cashback"
                    value={formatCurrency(data.total_from_cashback)}
                />
            </div>
            <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium text-sm mb-3">Outgoing Credits</h4>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm">Order Payments</span>
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