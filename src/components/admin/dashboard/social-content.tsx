"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    ArrowUp,
    ArrowDown,
    Map,
    Users,
    UserPlus,
    UserX,
    Eye,
    Download,
    ArrowRight,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SocialContent() {
    const mapMetrics = [
        {
            title: "Map Used",
            value: "300",
            subtitle: "Frequency of map feature usage",
            icon: <Map className="h-5 w-5 text-blue-500" />,
            trend: 'up'
        }
    ];

    const socialMetrics = [
        {
            title: "Friend Requests Sent",
            value: "120",
            subtitle: "Outgoing connection attempts",
            icon: <UserPlus className="h-5 w-5 text-green-500" />,
            trend: 'up'
        },
        {
            title: "Friend Requests Declined",
            value: "30",
            subtitle: "Unsuccessful connection attempts",
            icon: <UserX className="h-5 w-5 text-red-500" />,
            trend: 'up'
        },
        {
            title: "Friendships Formed",
            value: "90",
            subtitle: "Successful user connections",
            icon: <Users className="h-5 w-5 text-purple-500" />,
            trend: 'down'
        },
        {
            title: "Profile Visits",
            value: "150",
            subtitle: "SnapFoodie profile view count",
            icon: <Eye className="h-5 w-5 text-orange-500" />,
            trend: 'down'
        }
    ];

    const chatData = [
        { day: 'Monday', singleChats: 40, groupChats: 24 },
        { day: 'Tuesday', singleChats: 30, groupChats: 13 },
        { day: 'Wednesday', singleChats: 20, groupChats: 98 },
        { day: 'Thursday', singleChats: 27, groupChats: 39 },
        { day: 'Friday', singleChats: 18, groupChats: 48 },
        { day: 'Saturday', singleChats: 23, groupChats: 38 },
        { day: 'Sunday', singleChats: 34, groupChats: 43 }
    ];

    const snapStoryMetrics = [
        {
            title: "SnapStory - Total Created",
            value: "120",
            subtitle: "Total number of items created",
            trend: 'up',
            trendValue: '+12%'
        },
        {
            title: "SnapStory - Total Viewed",
            value: "1,450",
            subtitle: "Total number of views",
            trend: 'up',
            trendValue: '+25%'
        },
        {
            title: "SnapStory - Total Replied",
            value: "280",
            subtitle: "Total number of replies",
            trend: 'down',
            trendValue: '-5%'
        },
        {
            title: "SnapStory - Notification Sent",
            value: "890",
            subtitle: "Total number of notifications sent",
            trend: 'up',
            trendValue: '+15%'
        }
    ];

    const storiesData = [
        {
            user: "John Doe",
            avatar: "/avatars/john.jpg",
            initials: "JD",
            image: "/story1.jpg",
            datePosted: "2025-02-16 14:30",
            views: 245,
            interactions: 56
        },
        {
            user: "Alice Smith",
            avatar: "/avatars/alice.jpg",
            initials: "AS",
            image: "/story2.jpg",
            datePosted: "2025-02-16 13:15",
            views: 189,
            interactions: 42
        },
        {
            user: "Robert Johnson",
            avatar: "/avatars/robert.jpg",
            initials: "RJ",
            image: "/story3.jpg",
            datePosted: "2025-02-16 12:45",
            views: 167,
            interactions: 38
        },
        {
            user: "Emma Wilson",
            avatar: "/avatars/emma.jpg",
            initials: "EW",
            image: "/story4.jpg",
            datePosted: "2025-02-16 11:20",
            views: 143,
            interactions: 31
        },
        {
            user: "Michael Brown",
            avatar: "/avatars/michael.jpg",
            initials: "MB",
            image: "/story5.jpg",
            datePosted: "2025-02-16 10:55",
            views: 132,
            interactions: 28
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Social Dashboard</h2>
                    <p className="text-sm text-muted-foreground">
                        Monitor social interactions and engagement metrics
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

            {/* Map Usage Metric */}
            <div className="grid gap-6 md:grid-cols-1">
                {mapMetrics.map((metric, index) => (
                    <Card key={index} className="shadow-none">
                        <CardContent className="p-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-base font-medium">{metric.title}</h3>
                                    <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
                                    <div className="flex items-center gap-2 mt-4">
                                        <p className="text-2xl font-bold">{metric.value}</p>
                                        {metric.trend && (
                                            <div className="flex items-center text-sm text-green-600">
                                                <ArrowUp className="h-4 w-4" />
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

            {/* Social Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {socialMetrics.map((metric, index) => (
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
                                                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {metric.trend === 'up' ? 
                                                    <ArrowUp className="h-4 w-4" /> : 
                                                    <ArrowDown className="h-4 w-4" />
                                                }
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

            {/* Chat Activity Chart */}
            <Card className="shadow-none">
                <CardHeader>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">SnapFood Chat Activity</h2>
                        <p className="text-sm text-muted-foreground mt-0">
                            User communication metrics
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="mt-4">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chatData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="singleChats" name="Single Chats" fill="#8884d8" />
                                <Bar dataKey="groupChats" name="Group Chats" fill="#45B7B7" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* SnapStory Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {snapStoryMetrics.map((metric, index) => (
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
                                                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {metric.trend === 'up' ? 
                                                    <ArrowUp className="h-4 w-4" /> : 
                                                    <ArrowDown className="h-4 w-4" />
                                                }
                                                {metric.trendValue}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Stories Table */}
            {/* Stories Table */}
            <Card className="shadow-none relative">
                <CardHeader>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Top Stories</h2>
                        <p className="text-sm text-muted-foreground mt-0">
                            Most engaging user stories
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
                                <TableHead>User</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Date Posted</TableHead>
                                <TableHead>Number of Views</TableHead>
                                <TableHead>Number of Interactions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {storiesData.map((story, index) => (
                                <TableRow key={index}>
                                    <TableCell className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarImage src={story.avatar} alt={story.user} />
                                            <AvatarFallback className="bg-primary text-white">
                                                {story.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{story.user}</span>
                                    </TableCell>
                                    <TableCell>
                                        <img 
                                            src="/api/placeholder/48/48" 
                                            alt="Story thumbnail" 
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    </TableCell>
                                    <TableCell>{story.datePosted}</TableCell>
                                    <TableCell>{story.views}</TableCell>
                                    <TableCell>{story.interactions}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-center">
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
                                    <PaginationLink href="#">3</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href="#" />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}