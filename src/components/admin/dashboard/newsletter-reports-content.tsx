"use client";

import { Button } from "@/components/ui/button";
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
import { Calendar, RefreshCw } from "lucide-react";

export function NewsletterContent() {
    const campaignData = [
        {
            name: "Porosi dhuratë",
            platform: "TM Email Delivery",
            sentDate: "05/09/2024",
            totalRecipients: "3303",
            subject: "Si të thuash 'Të dua' apo 'Mendoj për ty' nëpërmjet SnapFood",
            openRate: "3.09%",
            clickRate: "1.82%"
        },
        {
            name: "Personalizim porositje",
            platform: "TM Email Delivery",
            sentDate: "03/09/2024",
            totalRecipients: "3303",
            subject: "Si SnapFood personalizon përvojën tënde të porositjes",
            openRate: "3%",
            clickRate: "1.21%"
        },
        {
            name: "Tartufi",
            platform: "TM Email Delivery",
            sentDate: "30/08/2024",
            totalRecipients: "3303",
            subject: "Magjia e tartufit: Thesari i fshehur i natyrës",
            openRate: "3.3%",
            clickRate: "1.82%"
        },
        {
            name: "Kuriozitete ushqimesh",
            platform: "TM Email Delivery",
            sentDate: "27/08/2024",
            totalRecipients: "3303",
            subject: "Kuriozitete të pabësueshmë rreth ushqimeve",
            openRate: "5.87%",
            clickRate: "1.21%"
        },
        {
            name: "Sugjerime filmash",
            platform: "TM Email Delivery",
            sentDate: "22/08/2024",
            totalRecipients: "3303",
            subject: "Magjia e mbrëmjes së filmit me festën perfekte nga SnapFood",
            openRate: "12.14%",
            clickRate: "3.12%"
        },
        {
            name: "Bakshishi",
            platform: "TM Email Delivery",
            sentDate: "19/08/2024",
            totalRecipients: "3303",
            subject: "Bakshish apo jo? Dilema që po ndan botën!",
            openRate: "5%",
            clickRate: "0.91%"
        },
        {
            name: "SF+",
            platform: "TM Email Delivery",
            sentDate: "15/08/2024",
            totalRecipients: "3302",
            subject: "Si të jesh më i privilegjuari në SnapFood?",
            openRate: "18.02%",
            clickRate: "4%"
        },
        {
            name: "Split the bill",
            platform: "TM Email Delivery",
            sentDate: "12/08/2024",
            totalRecipients: "3302",
            subject: "E ke ndarë ndonjëherë faturën në SnapFood?",
            openRate: "20.01%",
            clickRate: "6%"
        },
        {
            name: "Evolucioni i delivery",
            platform: "TM Email Delivery",
            sentDate: "08/08/2024",
            totalRecipients: "3302",
            subject: "Nga porositë në restorant tej teknologjia: Evolucioni i food delivery",
            openRate: "14.01%",
            clickRate: "3%"
        },
        {
            name: "Harta SF",
            platform: "TM Email Delivery",
            sentDate: "05/08/2024",
            totalRecipients: "3302",
            subject: "Zbuloni një botë të re me hartën e SnapFood",
            openRate: "16.02%",
            clickRate: "5.01%"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Email Campaign List</h2>
                    <p className="text-sm text-muted-foreground">
                        Track and Analyze SubAccount Email Campaigns Performance
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

            {/* Campaigns Table */}
            <div className="rounded-md border">
                <div className="flex justify-between items-center p-4 border-b">
                    <div>
                        <h3 className="text-xl font-semibold">Email Campaign List</h3>
                        <p className="text-sm text-muted-foreground">
                            Track and Analyze SubAccount Email Campaigns Performance
                        </p>
                    </div>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Campaign Name</TableHead>
                            <TableHead>Platform</TableHead>
                            <TableHead>Sent Date</TableHead>
                            <TableHead>Total Recipients</TableHead>
                            <TableHead className="max-w-[400px]">Subject</TableHead>
                            <TableHead>Open Rate</TableHead>
                            <TableHead>Click Rate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {campaignData.map((campaign, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{campaign.name}</TableCell>
                                <TableCell>{campaign.platform}</TableCell>
                                <TableCell>{campaign.sentDate}</TableCell>
                                <TableCell>{campaign.totalRecipients}</TableCell>
                                <TableCell className="max-w-[400px] truncate">
                                    {campaign.subject}
                                </TableCell>
                                <TableCell>{campaign.openRate}</TableCell>
                                <TableCell>{campaign.clickRate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-end p-4 border-t">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}