"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { 
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

export function WalletContent() {
    // Data for credit usage pie chart
    const creditUsageData = [
        { name: "Transferred", value: 1000, color: "#8884d8" },
        { name: "Cashback", value: 2574, color: "#45B7B7" }
    ];

    // Metrics data
    const topMetrics = [
        {
            title: "Customers with Wallet Credit",
            value: "0",
            subtitle: "Total customers with wallet credit"
        },
        {
            title: "Customers Used Credits",
            value: "0",
            subtitle: "Total customers who used credits"
        },
        {
            title: "Customers Never Used Credits",
            value: "0",
            subtitle: "Total customers who never used credits"
        },
        {
            title: "Most Recent Used Credit",
            value: "1",
            subtitle: "Most recent credit usage"
        }
    ];

    const statCards = [
        {
            title: "Total Transfers",
            label: "Total Amount Of Transfers:",
            value: "1,000 ALL",
            type: "blue"
        },
        {
            title: "Total Deposit",
            label: "Total Amount Of Deposits:",
            value: "0 ALL",
            type: "green"
        },
        {
            title: "Total Earning From Referral",
            label: "Total Earnings From Referrals:",
            value: "0 ALL",
            type: "orange"
        },
        {
            title: "From Orders Earnings",
            label: "Total From Earn Orders:",
            value: "100 ALL",
            type: "purple"
        },
        {
            title: "Total From Cashback",
            label: "Total From Cashback:",
            value: "5,062 ALL",
            type: "red"
        },
        {
            title: "Total Bonus",
            label: "Total Bonus:",
            value: "0 ALL",
            type: "gray"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Wallet Statistics</h2>
                    <p className="text-sm text-muted-foreground">
                        Monitor wallet usage and credit distribution
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-10">
                        <Calendar className="h-4 w-4 mr-2" />
                        2025-02-01
                    </Button>
                    <Button variant="outline" className="h-10">
                        <Calendar className="h-4 w-4 mr-2" />
                        2025-02-28
                    </Button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {topMetrics.map((metric, index) => (
                    <Card key={index} className="shadow-none">
                        <CardContent className="p-6">
                            <div className="space-y-1">
                                <h3 className="text-base font-medium">{metric.title}</h3>
                                <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
                                <p className="text-2xl font-bold mt-4">{metric.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Credit Usage and Stats */}
            <div className="grid gap-6 md:grid-cols-7">
                {/* Credit Usage Pie Chart */}
                <Card className="shadow-none md:col-span-3">
                    <CardHeader>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Use Credits Reasons</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Distribution of credit usage reasons
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={creditUsageData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {creditUsageData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="md:col-span-4 grid gap-6 grid-cols-2">
                    {statCards.map((stat, index) => (
                        <Card key={index} className="shadow-none">
                            <CardContent className="p-6">
                                <div className="space-y-1">
                                    <h3 className="text-base font-medium">{stat.title}</h3>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <div className="mt-4">
                                        <Badge 
                                            className={`
                                                ${stat.type === 'blue' ? 'bg-blue-100 text-blue-700' :
                                                  stat.type === 'green' ? 'bg-green-100 text-green-700' :
                                                  stat.type === 'orange' ? 'bg-orange-100 text-orange-700' :
                                                  stat.type === 'purple' ? 'bg-purple-100 text-purple-700' :
                                                  stat.type === 'red' ? 'bg-red-100 text-red-700' :
                                                  'bg-gray-100 text-gray-700'}
                                            `}
                                        >
                                            {stat.value}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}