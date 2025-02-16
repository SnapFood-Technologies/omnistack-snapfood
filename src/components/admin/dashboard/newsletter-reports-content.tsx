"use client";

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
  Calendar,
  RefreshCw,
  Mail,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

export function NewsletterContent() {
  // Top metrics for newsletter campaigns
  const newsletterTopMetrics = [
    {
      title: "Total Campaigns",
      value: "10",
      subtitle: "Total campaigns executed",
      icon: <Mail className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Average Open Rate",
      value: "12.5%",
      subtitle: "Across all campaigns",
      icon: <ArrowUp className="h-5 w-5 text-green-500" />,
      trend: "up",
      trendValue: "+1.2%",
    },
    {
      title: "Average Click Rate",
      value: "5.2%",
      subtitle: "Across all campaigns",
      icon: <ArrowDown className="h-5 w-5 text-red-500" />,
      trend: "down",
      trendValue: "-0.8%",
    },
    {
      title: "Total Recipients",
      value: "33,000",
      subtitle: "Cumulative recipients reached",
      icon: <Mail className="h-5 w-5 text-purple-500" />,
    },
  ];

  // Additional stat cards for newsletter details
  const newsletterStatCards = [
    {
      title: "Total Emails Sent",
      label: "Aggregate number of emails sent:",
      value: "35,000",
      type: "blue",
      icon: <Mail className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Bounce Rate",
      label: "Percentage of bounced emails:",
      value: "2.5%",
      type: "red",
      icon: <ArrowDown className="h-5 w-5 text-red-500" />,
    },
    {
      title: "Unsubscribe Rate",
      label: "Users unsubscribed:",
      value: "0.5%",
      type: "orange",
      icon: <Minus className="h-5 w-5 text-orange-500" />,
    },
    {
      title: "Conversion Rate",
      label: "Emails leading to action:",
      value: "4.8%",
      type: "green",
      icon: <ArrowUp className="h-5 w-5 text-green-500" />,
    },
  ];

  const campaignData = [
    {
      name: "Porosi dhuratë",
      platform: "TM Email Delivery",
      sentDate: "05/09/2024",
      totalRecipients: "3303",
      subject:
        "Si të thuash 'Të dua' apo 'Mendoj për ty' nëpërmjet SnapFood",
      openRate: "3.09%",
      clickRate: "1.82%",
    },
    {
      name: "Personalizim porositje",
      platform: "TM Email Delivery",
      sentDate: "03/09/2024",
      totalRecipients: "3303",
      subject: "Si SnapFood personalizon përvojën tënde të porositjes",
      openRate: "3%",
      clickRate: "1.21%",
    },
    {
      name: "Tartufi",
      platform: "TM Email Delivery",
      sentDate: "30/08/2024",
      totalRecipients: "3303",
      subject: "Magjia e tartufit: Thesari i fshehur i natyrës",
      openRate: "3.3%",
      clickRate: "1.82%",
    },
    {
      name: "Kuriozitete ushqimesh",
      platform: "TM Email Delivery",
      sentDate: "27/08/2024",
      totalRecipients: "3303",
      subject: "Kuriozitete të pabësueshmë rreth ushqimeve",
      openRate: "5.87%",
      clickRate: "1.21%",
    },
    {
      name: "Sugjerime filmash",
      platform: "TM Email Delivery",
      sentDate: "22/08/2024",
      totalRecipients: "3303",
      subject:
        "Magjia e mbrëmjes së filmit me festën perfekte nga SnapFood",
      openRate: "12.14%",
      clickRate: "3.12%",
    },
    {
      name: "Bakshishi",
      platform: "TM Email Delivery",
      sentDate: "19/08/2024",
      totalRecipients: "3303",
      subject: "Bakshish apo jo? Dilema që po ndan botën!",
      openRate: "5%",
      clickRate: "0.91%",
    },
    {
      name: "SF+",
      platform: "TM Email Delivery",
      sentDate: "15/08/2024",
      totalRecipients: "3302",
      subject: "Si të jesh më i privilegjuari në SnapFood?",
      openRate: "18.02%",
      clickRate: "4%",
    },
    {
      name: "Split the bill",
      platform: "TM Email Delivery",
      sentDate: "12/08/2024",
      totalRecipients: "3302",
      subject: "E ke ndarë ndonjëherë faturën në SnapFood?",
      openRate: "20.01%",
      clickRate: "6%",
    },
    {
      name: "Evolucioni i delivery",
      platform: "TM Email Delivery",
      sentDate: "08/08/2024",
      totalRecipients: "3302",
      subject:
        "Nga porositë në restorant tej teknologjia: Evolucioni i food delivery",
      openRate: "14.01%",
      clickRate: "3%",
    },
    {
      name: "Harta SF",
      platform: "TM Email Delivery",
      sentDate: "05/08/2024",
      totalRecipients: "3302",
      subject: "Zbuloni një botë të re me hartën e SnapFood",
      openRate: "16.02%",
      clickRate: "5.01%",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Outer Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Campaign & Newsletter Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Uncover actionable insights into your email campaigns and newsletters
            for improved reach.
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

      {/* Newsletter Top Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {newsletterTopMetrics.map((metric, index) => (
          <Card key={index} className="shadow-none">
            <CardContent className="p-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-base font-medium">{metric.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {metric.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    {metric.trend && (
                      <div
                        className={`flex items-center text-sm ${
                          metric.trend === "up"
                            ? "text-green-600"
                            : metric.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {metric.trend === "up" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : metric.trend === "down" ? (
                          <ArrowDown className="h-4 w-4" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                        {metric.trendValue}
                      </div>
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

      {/* Newsletter Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {newsletterStatCards.map((stat, index) => (
          <Card key={index} className="shadow-none">
            <CardContent className="p-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-base font-medium">{stat.title}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="mt-4">
                    <Badge
                      className={`
                        ${
                          stat.type === "blue"
                            ? "bg-blue-100 text-blue-700"
                            : stat.type === "green"
                            ? "bg-green-100 text-green-700"
                            : stat.type === "orange"
                            ? "bg-orange-100 text-orange-700"
                            : stat.type === "red"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }
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

      {/* Campaigns Table Card */}
      <Card className="relative shadow-none">
        <CardHeader>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Campaign & Newsletter Analytics
            </h2>
            <p className="text-sm text-muted-foreground mt-0">
              Uncover actionable insights into your email campaigns and newsletters
              for improved reach.
            </p>
          </div>
        </CardHeader>
        <div className="absolute top-6 right-6">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
        </div>
        <CardContent className="mt-2">
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
                  <TableCell className="font-medium">
                    {campaign.name}
                  </TableCell>
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
        </CardContent>
        <div className="flex items-center justify-end p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
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
      </Card>
      <div className="h-8"></div>
    </div>
  );
}
