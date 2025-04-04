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
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
    Users, Calendar, TrendingUp, Phone, Mail, 
    Apple, Smartphone, Globe, UserCircle, 
    Check, MoreHorizontal, RefreshCcw, 
    UserPlus
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import { useRouter } from 'next/navigation';


export function CustomersContent() {
    const { 
        isLoading, 
        customers, 
        totalItems, 
        totalPages, 
        metrics,
        fetchCustomers,
        isInitialized 
    } = useSnapFoodCustomers();

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const startItem = (currentPage - 1) * pageSize + 1;
const endItem = Math.min(currentPage * pageSize, totalItems);

    // Only fetch when page or size changes
    useEffect(() => {
        if (isInitialized) {
            fetchCustomers({
                page: currentPage,
                per_page: pageSize
            });
        }
    }, [currentPage, pageSize, fetchCustomers, isInitialized]);

    const customerMetrics = [
        {
            title: "Total Customers",
            value: totalItems.toString(),
            change: `${metrics.new_today > 0 ? '+' : ''}${metrics.new_today}`,
            trend: metrics.new_today >= 0 ? "up" : "down",
            icon: Users,
            subtitle: "New today",
            color: "blue"
        },
        {
            title: "Deleted Customers",
            value: metrics.deleted_today.toString(),
            change: `${metrics.deleted_today > 0 ? '+' : ''}${metrics.deleted_today}`,
            trend: "down",
            icon: UserPlus,
            subtitle: "Today",
            color: "red"
        }
    ];

    const getSourceIcon = (source: string) => {
        switch (source.toLowerCase()) {
            case 'ios':
                return <Apple className="h-4 w-4 text-gray-500" />;
            case 'android':
                return <Smartphone className="h-4 w-4 text-gray-500" />;
            case 'web':
                return <Globe className="h-4 w-4 text-gray-500" />;
            default:
                return <UserCircle className="h-4 w-4 text-gray-500" />;
        }
    };

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
                    <Button 
  className="h-10"
  variant="soft"
  onClick={() => router.push('/admin/snapfoodies')}
>
  <Users className="h-4 w-4 mr-2" />
  Snapfoodies Sync
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
                            <TableHead>Registration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : customers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                        <AvatarFallback className="bg-primary text-white uppercase">
                                                {customer.full_name ? customer.full_name.substring(0, 2) : "NA"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">
                                            {customer.full_name || "Unnamed"}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm">
                                            <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                            {customer.email}
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                            {customer.phone}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {new Date(customer.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={customer.active ? "success" : "secondary"}>
                                        {customer.active ? "Active" : "Inactive"}
                                    </Badge>
                                    {customer.verified_by_mobile && (
                                        <Badge variant="outline" className="ml-2">
                                            <Check className="h-3 w-3 mr-1" />
                                            Verified
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getSourceIcon(customer.source)}
                                        <span className="capitalize">{customer.source || 'Manual'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="border-t px-4 py-3">
    <div className="flex items-center justify-between gap-4">
        <InputSelect
            name="pageSize"
            label=""
            value={pageSize.toString()}
            onChange={(e) => {
                const newSize = parseInt(e.target.value);
                setPageSize(newSize);
                setCurrentPage(1); // Reset to first page when changing page size
            }}
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
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                            // Show first page, last page, current page and pages around current
                            return page === 1 || 
                                   page === totalPages || 
                                   Math.abs(page - currentPage) <= 2
                        })
                        .map((page, i, array) => {
                            // If there's a gap, show ellipsis
                            if (i > 0 && page - array[i - 1] > 1) {
                                return (
                                    <React.Fragment key={`gap-${page}`}>
                                        <PaginationItem>
                                            <PaginationLink disabled>...</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#"
                                                isActive={currentPage === page}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </React.Fragment>
                                );
                            }
                            return (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === page}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}
                    <PaginationItem>
                        <PaginationNext 
                            href="#" 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>

        <p className="text-sm text-muted-foreground min-w-[180px] text-right">
            Showing <span className="font-medium">{startItem}-{endItem}</span> of{" "}
            <span className="font-medium">{totalItems}</span> customers
        </p>
    </div>
</div>
            </CardContent>
        </Card>
          {/* Bottom spacing */}
      <div className="h-4"></div>
        </div>
    );
}