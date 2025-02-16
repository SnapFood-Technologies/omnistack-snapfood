"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Calendar, 
    Wallet, 
    UserCheck, 
    UserX, 
    Clock, 
    ArrowUp, 
    ArrowDown, 
    Minus,
    ArrowRightLeft,
    PiggyBank,
    Gift,
    CreditCard,
    Award,
    Repeat,
} from "lucide-react";
import { 
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    Label
} from 'recharts';

export function WalletContent() {
    const creditUsageData = [
        { name: "Transferred", value: 1000, color: "#8884d8" },
        { name: "Cashback", value: 2574, color: "#45B7B7" }
    ];

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor="middle" 
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const topMetrics = [
        {
            title: "Customers with Wallet Credit",
            value: "0",
            subtitle: "Total customers with wallet credit",
            icon: <Wallet className="h-5 w-5 text-blue-500" />,
            trend: 'neutral'
        },
        {
            title: "Customers Used Credits",
            value: "0",
            subtitle: "Total customers who used credits",
            icon: <UserCheck className="h-5 w-5 text-green-500" />,
            trend: 'down',
            trendValue: '-12%'
        },
        {
            title: "Customers Never Used Credits",
            value: "0",
            subtitle: "Total customers who never used credits",
            icon: <UserX className="h-5 w-5 text-red-500" />,
            trend: 'up',
            trendValue: '+8%'
        },
        {
            title: "Most Recent Used Credit",
            value: "1",
            subtitle: "Most recent credit usage",
            icon: <Clock className="h-5 w-5 text-purple-500" />,
            lastUsed: '2 hours ago'
        }
    ];

    const statCards = [
        {
            title: "Total Transfers",
            label: "Total Amount Of Transfers:",
            value: "1,000 ALL",
            type: "blue",
            icon: <ArrowRightLeft className="h-5 w-5 text-blue-500" />
        },
        {
            title: "Total Deposit",
            label: "Total Amount Of Deposits:",
            value: "0 ALL",
            type: "green",
            icon: <PiggyBank className="h-5 w-5 text-green-500" />
        },
        {
            title: "Total Earning From Referral",
            label: "Total Earnings From Referrals:",
            value: "0 ALL",
            type: "orange",
            icon: <Gift className="h-5 w-5 text-orange-500" />
        },
        {
            title: "From Orders Earnings",
            label: "Total From Earn Orders:",
            value: "100 ALL",
            type: "purple",
            icon: <CreditCard className="h-5 w-5 text-purple-500" />
        },
        {
            title: "Total From Cashback",
            label: "Total From Cashback:",
            value: "5,062 ALL",
            type: "red",
            icon: <Repeat className="h-5 w-5 text-red-500" />
        },
        {
            title: "Total Bonus",
            label: "Total Bonus:",
            value: "0 ALL",
            type: "gray",
            icon: <Award className="h-5 w-5 text-gray-500" />
        }
    ];

    return (
        <div className="space-y-6">
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {topMetrics.map((metric, index) => (
                    <Card key={index} className="shadow-none">
                        <CardContent className="p-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-base font-medium">{metric.title}</h3>
                                    <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
                                    <div className="flex items-center gap-2 mt-4">
                                        <p className="text-2xl font-bold">{metric.value}</p>
                                        {metric.trend && (
                                            <div className={`flex items-center text-sm ${
                                                metric.trend === 'up' ? 'text-green-600' : 
                                                metric.trend === 'down' ? 'text-red-600' : 
                                                'text-gray-600'
                                            }`}>
                                                {metric.trend === 'up' ? <ArrowUp className="h-4 w-4" /> :
                                                 metric.trend === 'down' ? <ArrowDown className="h-4 w-4" /> :
                                                 <Minus className="h-4 w-4" />}
                                                {metric.trendValue}
                                            </div>
                                        )}
                                        {metric.lastUsed && (
                                            <span className="text-sm text-muted-foreground">
                                                {metric.lastUsed}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-2 bg-gray-100/50 rounded-lg">
                                    {metric.icon}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                <Card className="shadow-none md:col-span-3">
                    <CardHeader>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Use Credits Reasons</h2>
                            <p className="text-sm text-muted-foreground mt-0">
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
                                        labelLine={false}
                                        label={<CustomLabel />}
                                    >
                                        {creditUsageData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => `${value} ALL`}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36}
                                        iconType="circle"
                                    />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-4 grid gap-6 grid-cols-2">
                    {statCards.map((stat, index) => (
                        <Card key={index} className="shadow-none">
                            <CardContent className="p-2">
                                <div className="flex justify-between items-start">
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
                                    <div className="p-2 bg-gray-100/50 rounded-lg">
                                        {stat.icon}
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