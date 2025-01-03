"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const revenueData = [
    { month: 'Jan', amount: 1000 },
    { month: 'Feb', amount: 500 },
    { month: 'Mar', amount: 300 },
    { month: 'Apr', amount: 200 },
    { month: 'May', amount: 100 },
    { month: 'Jun', amount: 400 }
]

const orderData = [
    { month: 'Jan', orders: 200 },
    { month: 'Feb', orders: 400 },
    { month: 'Mar', orders: 900 },
    { month: 'Apr', orders: 300 },
    { month: 'May', orders: 800 },
    { month: 'Jun', orders: 200 }
]

export function DashboardCharts() {
    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card className="bg-white shadow-sm">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-lg font-yellix-semibold">Total Revenue</CardTitle>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Filter</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#50B7ED"
                                    fill="#50B7ED"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-lg font-yellix-semibold">Total Orders</CardTitle>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Last 8 Months</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={orderData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="orders"
                                    fill="#50B7ED"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}