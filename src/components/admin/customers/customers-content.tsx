// components/admin/customers/customers-content.tsx
"use client";

import { useSnapFoodCustomers } from "@/hooks/useSnapFoodCustomers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar, Users, TrendingUp, UserPlus, Phone, Mail } from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { useEffect, useState } from "react";

export function CustomersContent() {
    const { 
        isLoading, 
        customers, 
        totalItems, 
        totalPages, 
        metrics,
        fetchCustomers 
    } = useSnapFoodCustomers();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState("10");

    useEffect(() => {
        fetchCustomers({
            page: currentPage,
            per_page: parseInt(pageSize)
        });
    }, [fetchCustomers, currentPage, pageSize]);

    const customerMetrics = [
        {
            title: "Total Customers",
            value: totalItems.toString(),
            change: `+${metrics?.new_today || 0}`,
            trend: "up",
            icon: Users,
            subtitle: "New today",
            color: "blue"
        },
        {
            title: "Active Customers",
            value: "157",
            change: "+12%",
            trend: "up",
            icon: UserPlus,
            subtitle: "Last 30 days",
            color: "green"
        }
    ];

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Customer Management</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        View and manage your customer base
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-10">
                        <Calendar className="h-4 w-4 mr-2" />
                        Last 30 Days
                    </Button>
                    <Button className="h-10">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Export List
                    </Button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid gap-6 md:grid-cols-2">
                {customerMetrics.map((metric) => (
                    <Card key={metric.title} className="shadow-none">
                        <CardContent className="p-2">
                            <div className="flex justify-between items-start space-y-0">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {metric.title}
                                    </p>
                                    <div className="mt-0">
                                        <h3 className="text-2xl font-bold">{metric.value}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="text-green-600 flex items-center text-sm">
                                                {metric.change}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {metric.subtitle}
                                            </p>
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

            {/* Customers List */}
            <Card className="shadow-none">
                <CardHeader>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Customers List</h2>
                        <p className="text-sm text-muted-foreground mt-0">
                            Manage and view customer details
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Registration Date</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>Last Order</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell>{customer.full_name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                <span className="text-sm">{customer.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                <span className="text-sm">{customer.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(customer.registered_at).toLocaleDateString()}</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>{customer.last_order ? new Date(customer.last_order).toLocaleDateString() : '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                                            Active
                                        </Badge>
                                    </TableCell>
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
                                value={pageSize}
                                onChange={(e) => setPageSize(e.target.value)}
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
                                            <PaginationPrevious 
                                                href="#" 
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            />
                                        </PaginationItem>
                                        {/* Add page numbers here if needed */}
                                        <PaginationItem>
                                            <PaginationNext 
                                                href="#" 
                                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>

                            <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                                Showing <span className="font-medium">{customers.length}</span> of{" "}
                                <span className="font-medium">{totalItems}</span> customers
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}