"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Download,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function FeatureUsageContent() {
    const featuresData = [
        {
            featureName: "Favourites",
            clicks: 18,
            timesUsed: 3
        },
        {
            featureName: "Chat",
            clicks: 14,
            timesUsed: 5
        },
        {
            featureName: "Wallet",
            clicks: 12,
            timesUsed: 2
        },
        {
            featureName: "Blog",
            clicks: 10,
            timesUsed: 8
        },
        {
            featureName: "Promotions",
            clicks: 9,
            timesUsed: 0
        },
        {
            featureName: "D&T",
            clicks: 8,
            timesUsed: 2
        },
        {
            featureName: "Interests",
            clicks: 5,
            timesUsed: 2
        },
        {
            featureName: "Payment Methods",
            clicks: 4,
            timesUsed: 1
        },
        {
            featureName: "Gallery",
            clicks: 3,
            timesUsed: 2
        },
        {
            featureName: "Become a Partner",
            clicks: 2,
            timesUsed: 0
        },
        {
            featureName: "Refer",
            clicks: 1,
            timesUsed: 0
        },
        {
            featureName: "Review App",
            clicks: 1,
            timesUsed: 1
        },
        {
            featureName: "Earn",
            clicks: 0,
            timesUsed: 0
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Features Usage</h2>
                    <p className="text-sm text-muted-foreground">
                        Indicates how many times features are clicked and how many times used
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

            {/* Features Table */}
            <Card className="relative shadow-none">
            <CardHeader>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Features Usage</h2>
                        <p className="text-sm text-muted-foreground mt-0">
                        Track feature engagement and usage patterns
                        </p>
                    </div>
                </CardHeader>
                <div className="absolute top-6 right-6">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                </div>
                <CardContent className="mt-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Feature Name</TableHead>
                                <TableHead>Clicks</TableHead>
                                <TableHead>Number of Times Used</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {featuresData.map((feature, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        {feature.featureName}
                                    </TableCell>
                                    <TableCell>{feature.clicks}</TableCell>
                                    <TableCell>{feature.timesUsed}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <div className="h-8"></div> 
        </div>
    );
}