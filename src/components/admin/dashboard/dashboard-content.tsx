"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Users, ArrowUp, ArrowDown, ShoppingBag, Clock, LineChart, PieChart } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

export function DashboardContent() {
    const dateRange = {
        start: "2025-02-01",
        end: "2025-02-28"
    };

    const hourlyData = [
        { hour: "7:00-11:59", orders: 15 },
        { hour: "12:00-15:59", orders: 12 },
        { hour: "16:00-19:59", orders: 28 },
        { hour: "20:00-23:59", orders: 18 }
    ];

    const sourceData = [
        { name: "iOS", value: 170 },
        { name: "Android", value: 5 },
        { name: "Web", value: 3 }
    ];

    const COLORS = ['#FFB547', '#4CAF50', '#2196F3'];

    return (
        <div className="space-y-6">
            {/* Header with Date Range */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">Welcome back, Griseld 👋</h2>
                    <p className="text-muted-foreground mt-2">
                        Monitor your restaurant network and delivery performance metrics
                    </p>
                </div>
                <div className="flex gap-4">
                    <input type="date" defaultValue={dateRange.start} className="border rounded p-2" />
                    <input type="date" defaultValue={dateRange.end} className="border rounded p-2" />
                </div>
            </div>

            {/* Customer Stats Section */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>New customers</CardTitle>
                        <p className="text-sm text-muted-foreground">First-time order users</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8,456</div>
                        <div className="text-sm text-green-500">+10.00%</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Repeat customers</CardTitle>
                        <p className="text-sm text-muted-foreground">Returning users</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">10,456</div>
                        <div className="text-sm text-red-500">-12.00%</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                        <p className="text-sm text-muted-foreground">Net income after all deductions</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$39,098.00</div>
                        <div className="text-sm text-green-500">+20.00%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <div className="p-2 bg-blue-100/50 rounded-lg dark:bg-blue-900/50">
                            <ShoppingBag className="h-4 w-4 text-blue-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">329</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All orders this period
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <div className="p-2 bg-green-100/50 rounded-lg dark:bg-green-900/50">
                            <LineChart className="h-4 w-4 text-green-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">624,740 ALL</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Net income after deductions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tax</CardTitle>
                        <div className="p-2 bg-violet-100/50 rounded-lg dark:bg-violet-900/50">
                            <PieChart className="h-4 w-4 text-violet-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">110,081.1 ALL</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Aggregate tax collected
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                        <div className="p-2 bg-amber-100/50 rounded-lg dark:bg-amber-900/50">
                            <Clock className="h-4 w-4 text-amber-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,898.906 ALL</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Mean value per order
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Top Performers Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top 10 Vendors</CardTitle>
                        <p className="text-sm text-muted-foreground">Highest performing restaurants</p>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full">
                            <thead>
                                <tr className="text-sm text-muted-foreground">
                                    <th className="text-left py-2">No.</th>
                                    <th className="text-left py-2">Vendor</th>
                                    <th className="text-right py-2">Orders</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2">1</td>
                                    <td className="py-2">Pizza Seni</td>
                                    <td className="text-right py-2">53</td>
                                </tr>
                                <tr>
                                    <td className="py-2">2</td>
                                    <td className="py-2">Te Komuna</td>
                                    <td className="text-right py-2">36</td>
                                </tr>
                                {/* Add more rows as needed */}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top 10 Customers</CardTitle>
                        <p className="text-sm text-muted-foreground">Users with highest order frequency</p>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full">
                            <thead>
                                <tr className="text-sm text-muted-foreground">
                                    <th className="text-left py-2">No.</th>
                                    <th className="text-left py-2">Customer</th>
                                    <th className="text-right py-2">Orders</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2">1</td>
                                    <td className="py-2">Marku</td>
                                    <td className="text-right py-2">157</td>
                                </tr>
                                <tr>
                                    <td className="py-2">2</td>
                                    <td className="py-2">Redi Frasheri</td>
                                    <td className="text-right py-2">3</td>
                                </tr>
                                {/* Add more rows as needed */}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Orders by Source</CardTitle>
                        <p className="text-sm text-muted-foreground">Distribution of orders by platform</p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <RechartsPieChart width={300} height={300}>
                                <Pie
                                    data={sourceData}
                                    cx={150}
                                    cy={150}
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </RechartsPieChart>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Orders by Hour</CardTitle>
                        <p className="text-sm text-muted-foreground">Hourly distribution of order volume</p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <RechartsLineChart
                                width={500}
                                height={300}
                                data={hourlyData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Line type="monotone" dataKey="orders" stroke="#8884d8" />
                            </RechartsLineChart>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders Section */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>10 Recent Orders</CardTitle>
                            <p className="text-sm text-muted-foreground">Most recent customer transactions</p>
                        </div>
                        <button className="bg-green-500 text-white px-4 py-2 rounded">All Orders</button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-sm text-muted-foreground">
                                    <th className="text-left py-2">Order Nr</th>
                                    <th className="text-left py-2">Ordered Date</th>
                                    <th className="text-left py-2">Total Price</th>
                                    <th className="text-left py-2">Total Tax</th>
                                    <th className="text-left py-2">Vendor</th>
                                    <th className="text-left py-2">Customer</th>
                                    <th className="text-left py-2">Status</th>
                                    <th className="text-left py-2">Source</th>
                                    <th className="text-left py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2">#PIZZASENI-38033</td>
                                    <td className="py-2">15-02-2025 21:50:42</td>
                                    <td className="py-2">700.00 L</td>
                                    <td className="py-2">120.00 L</td>
                                    <td className="py-2">Pizza Seni</td>
                                    <td className="py-2">Marku</td>
                                    <td className="py-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded">Delivered</span></td>
                                    <td className="py-2">ios</td>
                                    <td className="py-2">•••</td>
                                </tr>
                                {/* Add more rows as needed */}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}