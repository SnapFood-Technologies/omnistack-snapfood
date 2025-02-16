"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  UserPlus,
  UserMinus,
  ShoppingBag,
  PieChart,
  BarChart2,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/* Mock data for charts */
const customersBySourceData = [
  { source: "Web", count: 400 },
  { source: "iOS", count: 300 },
  { source: "Android", count: 500 },
];

const registrationsData = [
  { week: "Week 1", registrations: 100 },
  { week: "Week 2", registrations: 150 },
  { week: "Week 3", registrations: 130 },
  { week: "Week 4", registrations: 200 },
];

const installsData = [
  { name: "Week 1", iOS: 700, Android: 850, Web: 300 },
  { name: "Week 2", iOS: 600, Android: 800, Web: 250 },
  { name: "Week 3", iOS: 650, Android: 900, Web: 280 },
  { name: "Week 4", iOS: 800, Android: 950, Web: 310 },
];

const uninstallsData = [
  { week: "Week 1", uninstalls: 40 },
  { week: "Week 2", uninstalls: 35 },
  { week: "Week 3", uninstalls: 50 },
  { week: "Week 4", uninstalls: 45 },
];

/* Top-level customer metrics */
const customerStats = [
  {
    title: "New Customers",
    value: "0",
    subtitle: "Fresh faces joining our foodie family",
    icon: <UserPlus className="h-5 w-5 text-blue-500" />,
  },
  {
    title: "Lost Customers",
    value: "0",
    subtitle: "Diners we need to win back",
    icon: <UserMinus className="h-5 w-5 text-red-500" />,
  },
  {
    title: "Ordered Customers",
    value: "0",
    subtitle: "Hungry patrons who placed orders",
    trend: "up",
    trendValue: "+75%",
    icon: <ShoppingBag className="h-5 w-5 text-green-500" />,
  },
  {
    title: "Not Ordered Customers",
    value: "0",
    subtitle: "Registered users yet to place an order",
    trend: "down",
    trendValue: "-25%",
    icon: <ShoppingBag className="h-5 w-5 text-orange-500" />,
  },
];

/* Bottom-level stats (single-value cards) */
const additionalStats = [
  {
    title: "Deleted Users",
    value: "120",
    subtitle: "Accounts closed and opportunities for improvement",
    icon: <Users className="h-5 w-5 text-red-500" />,
  },
  {
    title: "Customer Retention Rate",
    value: "80%",
    subtitle: "Keeping our diners coming back for more",
    icon: <PieChart className="h-5 w-5 text-green-500" />,
  },
  {
    title: "Average Order Frequency",
    value: "2.3",
    subtitle: "How often our customers satisfy their cravings",
    icon: <BarChart2 className="h-5 w-5 text-blue-500" />,
  },
  {
    title: "Customer Lifetime Value (CLV)",
    value: "350",
    subtitle: "The long-term value of our hungry snapfoodies",
    icon: <Users classsName="h-5 w-5 text-purple-500" />,
  },
];

export function CustomerInsightsContent() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Insights</h2>
          <p className="text-sm text-muted-foreground">
            Get an overview of your customers' engagement and behavior
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

      {/* Top Stats Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {customerStats.map((stat, index) => (
          <Card key={index} className="shadow-none">
            <CardContent className="p-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-base font-medium">{stat.title}</h3>
                  <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.trend && (
                      <div
                        className={`flex items-center text-sm ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : stat.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {stat.trend === "up" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : stat.trend === "down" ? (
                          <ArrowDown className="h-4 w-4" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                        {stat.trendValue}
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-2 bg-gray-100/50 rounded-lg">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Middle Row: Customers by Source & Registrations */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Customers by Source (Bar Chart) */}
        <Card className="shadow-none">
          <CardHeader>
            <h2 className="text-xl font-bold tracking-tight">
              Customers by Source
            </h2>
            <p className="text-sm text-muted-foreground mt-0">
              Where our food lovers come from
            </p>
          </CardHeader>
          <CardContent className="mt-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customersBySourceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Registrations (Line Chart) */}
        <Card className="shadow-none">
          <CardHeader>
            <h2 className="text-xl font-bold tracking-tight">Registrations</h2>
            <p className="text-sm text-muted-foreground mt-0">
              New sign-ups ready to explore
            </p>
          </CardHeader>
          <CardContent className="mt-1">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={registrationsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="registrations" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Row: Installs & Uninstalls */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Installs (Stacked Bar Chart Example) */}
        <Card className="shadow-none">
          <CardHeader>
            <h2 className="text-xl font-bold tracking-tight">Installs</h2>
            <p className="text-sm text-muted-foreground mt-0">
              App adoptions across devices
            </p>
          </CardHeader>
          <CardContent className="mt-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={installsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="iOS" stackId="a" fill="#8884d8" />
                  <Bar dataKey="Android" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="Web" stackId="a" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Uninstalls (Line Chart) */}
        <Card className="shadow-none">
          <CardHeader>
            <h2 className="text-xl font-bold tracking-tight">Uninstalls</h2>
            <p className="text-sm text-muted-foreground mt-0">
              App removals we aim to reduce
            </p>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={uninstallsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="uninstalls"
                    stroke="#ff6b6b"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Stats Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {additionalStats.map((stat, index) => (
          <Card key={index} className="shadow-none">
            <CardContent className="p-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-base font-medium">{stat.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {stat.subtitle}
                  </p>
                  <div className="mt-4">
                    <Badge className="text-sm text-white font-semibold">
                      {stat.value}
                    </Badge>
                  </div>
                </div>
                <div className="p-2 bg-gray-100/50 rounded-lg">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="h-8"></div>
    </div>
  );
}
