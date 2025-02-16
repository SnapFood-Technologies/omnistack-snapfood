"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Store,
  Users,
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  Clock,
  // LineChart,
  // PieChart,
  Calendar,
  Download,
  ArrowRight,
  TrendingUp,
  RefreshCcw,
  Share,
  Headphones,
  Wallet,
  DollarSign,
  XCircle,
  Receipt,
  CheckCircle,
} from "lucide-react";
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis,
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell 
  } from 'recharts';
  import InputSelect from "@/components/Common/InputSelect";

export function DashboardContent() {
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

    const topVendors = [
        { id: 1, name: "Pizza Seni", orders: 53 },
        { id: 2, name: "Te Komuna", orders: 36 },
        { id: 3, name: "Monk", orders: 21 },
        { id: 4, name: "Bloom Bistro", orders: 21 },
        { id: 5, name: "FABRIKA", orders: 5 },
        { id: 6, name: "Top Snack", orders: 5 }
    ];

    const topCustomers = [
        { id: 1, name: "Marku", orders: 157 },
        { id: 2, name: "Redi Frasheri", orders: 3 },
        { id: 3, name: "Klea", orders: 3 },
        { id: 4, name: "Juri", orders: 1 },
        { id: 5, name: "Klajdi Zaimi", orders: 1 },
        { id: 6, name: "Genti Ndoj", orders: 1 }
    ];


    const deliveryMetrics = [
        {
            title: 'Delivered Orders',
            subtitle: 'Successfully completed deliveries',
            value: '329',
            icon: CheckCircle
        },
        {
            title: 'Cancelled Orders',
            subtitle: 'Orders terminated before completion',
            value: '-',
            icon: XCircle
        },
        {
            title: 'Average Order Value',
            subtitle: 'Mean monetary value per order',
            value: '1,898.906 ALL',
            icon: DollarSign
        }
    ];

    const quickLinks = [
        { icon: <Headphones className="h-6 w-6" />, label: "Customers" },
        { icon: <ShoppingBag className="h-6 w-6" />, label: "Orders" },
        { icon: <Wallet className="h-6 w-6" />, label: "Paid Ads" },
        { icon: <Share className="h-6 w-6" />, label: "Marketing" }
    ];
    

    const bottomMetrics = [
        {
            title: 'Total Orders',
            subtitle: 'Cumulative count of all placed orders',
            value: '329',
            valueType: 'blue',
            icon: ShoppingBag // Add icon
        },
        {
            title: 'Total Revenue',
            subtitle: 'Net income after all deductions',
            value: '624,740 ALL',
            valueType: 'green',
            icon: DollarSign // Add icon
        },
        {
            title: 'Total Tax',
            subtitle: 'Aggregate tax collected on orders',
            value: '110,081.1 ALL',
            valueType: 'gray',
            icon: Receipt // Add icon
        }
    ];

    const recentOrders = [
      {
        id: "PIZZASENI-38033",
        date: "15-02-2025 21:50:42",
        total: "700.00 L",
        tax: "120.00 L",
        vendor: "Pizza Seni",
        customer: "Marku",
        status: "Delivered",
        source: "iOS"
      },
      // Add more orders as needed
    ];

    const COLORS = ['#50B7ED', '#4CAF50', '#2196F3'];

    const orderReportData = [
        { name: "Jan", delivered: 400, cancelled: 200 },
        { name: "Feb", delivered: 300, cancelled: 150 },
        { name: "Mar", delivered: 500, cancelled: 250 },
        { name: "Apr", delivered: 450, cancelled: 300 },
        { name: "May", delivered: 600, cancelled: 350 },
        { name: "Jun", delivered: 550, cancelled: 400 }
    ];

    const metrics = [
      {
        title: "Partner Restaurants",
        value: "124",
        change: "+8%",
        trend: "up",
        icon: Store,
        subtitle: "+12 this month",
        color: "blue"
      },
      {
        title: "Active Customers",
        value: "14,592",
        change: "+12%",
        trend: "up",
        icon: Users,
        subtitle: "+892 since last month",
        color: "violet"
      },
      {
        title: "Delivered Orders",
        value: "8,374",
        change: "+23%",
        trend: "up",
        icon: ShoppingBag,
        subtitle: "+1,234 this week",
        color: "green"
      },
      {
        title: "Avg. Delivery Time",
        value: "28.5m",
        change: "-2.3m",
        trend: "down",
        icon: Clock,
        subtitle: "Improved by 2.3 mins",
        color: "amber"
      }
    ];

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
           
            <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Food Delivery Overview</h2>
          <p className="text-sm text-muted-foreground mt-2">
          Monitor your restaurant network and delivery performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
        <Button variant="outline" className="h-10">
                        <Calendar className="h-4 w-4 mr-2" />
                        Last 30 Days
                    </Button>
                    <Button className="h-10">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Analytics
                    </Button>
        </div>
         </div>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric) => (
                    <Card key={metric.title} className="shadow-none">
                        <CardContent className="p-2">
                            <div className="flex justify-between items-start space-y-0">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                                    <div className="mt-1">
                                        <h3 className="text-2xl font-bold">{metric.value}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`flex items-center text-sm ${
                                                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {metric.trend === 'up' ? (
                                                    <ArrowUp className="h-4 w-4" />
                                                ) : (
                                                    <ArrowDown className="h-4 w-4" />
                                                )}
                                                {metric.change}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-2 bg-${metric.color}-100/50 rounded-lg`}>
                                    <metric.icon className={`h-5 w-5 text-${metric.color}-500`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Order Report and Quick Links */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="shadow-none relative lg:col-span-2">
                    <CardHeader>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Order report</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Overview of order completion status
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={orderReportData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="delivered" stroke="#149f8c" strokeWidth={2} />
                                    <Line type="monotone" dataKey="cancelled" stroke="#ff0000" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-none relative">
                    <CardHeader>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Quick Links</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Direct access to key sections
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            {quickLinks.map((link, index) => (
                                <div key={index} className="text-center">
                                    <Button variant="outline" className="w-full h-20 mb-2">
                                        {link.icon}
                                    </Button>
                                    <span className="text-sm text-muted-foreground">{link.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Vendors & Customers */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-none relative">
                    <CardHeader>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Top 10 Vendors</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Highest performing restaurants
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No.</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Orders</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topVendors.map((vendor, index) => (
                                    <TableRow key={vendor.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{vendor.name}</TableCell>
                                        <TableCell>{vendor.orders}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="shadow-none relative">
    <CardHeader>
        <div>
            <h2 className="text-xl font-bold tracking-tight">Top 10 Customers</h2>
            <p className="text-sm text-muted-foreground mt-1">
                Users with highest order frequency
            </p>
        </div>
    </CardHeader>
    <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Orders</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {topCustomers.map((customer, index) => (
                    <TableRow key={customer.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.orders}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </CardContent>
</Card>
            </div>


            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-none relative">
                    <CardHeader>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Orders by Source</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Distribution of orders by platform
                            </p>
                        </div>
                    </CardHeader>
                    <div className="absolute top-6 right-6">
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </Button>
                    </div>
                    <CardContent className="pt-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sourceData}
                                        cx="50%"
                                        cy="50%"
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
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-none relative">
                    <CardHeader>
                        <div className="mb-2">
                            <h2 className="text-xl font-bold tracking-tight">Orders by Hour</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Hourly distribution of order volume
                            </p>
                        </div>
                    </CardHeader>
                    <div className="absolute top-6 right-6">
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </Button>
                    </div>
                    <CardContent className="pt-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={hourlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hour" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line 
                                        type="monotone" 
                                        dataKey="orders" 
                                        stroke="#50B7ED" 
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card className="shadow-none relative">
                <CardHeader>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Recent Orders</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Latest incoming orders from customers
                        </p>
                    </div>
                </CardHeader>
                <div className="absolute top-6 right-6">
                    <Button variant="outline" size="sm" className="gap-2">
                        View All
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
                <CardContent className="mt-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order Nr</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Tax</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>#{order.id}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>{order.total}</TableCell>
                                    <TableCell>{order.tax}</TableCell>
                                    <TableCell>{order.vendor}</TableCell>
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant="secondary"
                                            className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{order.source}</TableCell>
                                    <TableCell className="text-right">•••</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="border-t px-4 py-3">
                        <div className="flex items-center justify-between gap-4">
                            <InputSelect
                                name="pageSize"
                                label=""
                                value="10"
                                onChange={() => {}}
                                options={[
                                    { value: "10", label: "10 rows" },
                                    { value: "20", label: "20 rows" },
                                    { value: "50", label: "50 rows" }
                                ]}
                            />
                            
                            <div className="flex-1 flex items-center justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious href="#" />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#" isActive>1</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext href="#" />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>

                            <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                                Showing <span className="font-medium">10</span> of{" "}
                                <span className="font-medium">20</span> orders
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
    {bottomMetrics.map((metric, index) => (
        <Card key={index} className="shadow-none">
            <CardContent className="p-2">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="text-base font-medium">{metric.title}</h3>
                        <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
                        <div className="flex items-center gap-2 mt-4">
                            <Badge 
                                className={`${
                                    metric.valueType === 'blue' ? 'bg-blue-100 text-blue-700' :
                                    metric.valueType === 'green' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'
                                } hover:bg-opacity-100`}
                            >
                                {metric.value}
                            </Badge>
                        </div>
                    </div>
                    <div className="p-2 bg-gray-100/50 rounded-lg">
                        <metric.icon className="h-5 w-5 text-gray-500" />
                    </div>
                </div>
            </CardContent>
        </Card>
    ))}
</div>

            {/* Delivery Metrics */}
            <div className="grid gap-6 md:grid-cols-3">
    {deliveryMetrics.map((metric, index) => (
        <Card key={index} className="shadow-none">
            <CardContent className="p-2">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="text-base font-medium">{metric.title}</h3>
                        <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
                        <p className="text-2xl font-bold mt-4">{metric.value}</p>
                    </div>
                    <div className="p-2 bg-gray-100/50 rounded-lg">
                        <metric.icon className="h-5 w-5 text-gray-500" />
                    </div>
                </div>
            </CardContent>
        </Card>
    ))}
</div>
            <div className="h-4"></div>
        </div>
    );
}