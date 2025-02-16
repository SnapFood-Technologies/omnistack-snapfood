"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  Star,
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
    { featureName: "Favourites", clicks: 18, timesUsed: 3 },
    { featureName: "Chat", clicks: 14, timesUsed: 5 },
    { featureName: "Wallet", clicks: 12, timesUsed: 2 },
    { featureName: "Blog", clicks: 10, timesUsed: 8 },
    { featureName: "Promotions", clicks: 9, timesUsed: 0 },
    { featureName: "D&T", clicks: 8, timesUsed: 2 },
    { featureName: "Interests", clicks: 5, timesUsed: 2 },
    { featureName: "Payment Methods", clicks: 4, timesUsed: 1 },
    { featureName: "Gallery", clicks: 3, timesUsed: 2 },
    { featureName: "Become a Partner", clicks: 2, timesUsed: 0 },
    { featureName: "Refer", clicks: 1, timesUsed: 0 },
    { featureName: "Review App", clicks: 1, timesUsed: 1 },
    { featureName: "Earn", clicks: 0, timesUsed: 0 },
  ];

  // Compute aggregate statistics
  const totalClicks = featuresData.reduce(
    (acc, feature) => acc + feature.clicks,
    0
  );
  const totalUses = featuresData.reduce(
    (acc, feature) => acc + feature.timesUsed,
    0
  );
  const avgClicks = (totalClicks / featuresData.length).toFixed(1);
  const mostEngagedFeature = featuresData.reduce((max, feature) =>
    feature.timesUsed > max.timesUsed ? feature : max
  ).featureName;

  const maxClicksFeature = featuresData.reduce((max, feature) =>
    feature.clicks > max.clicks ? feature : max
  );
  const minClicksFeature = featuresData.reduce((min, feature) =>
    feature.clicks < min.clicks ? feature : min
  );
  const maxUsesFeature = featuresData.reduce((max, feature) =>
    feature.timesUsed > max.timesUsed ? feature : max
  );
  const minUsesFeature = featuresData.reduce((min, feature) =>
    feature.timesUsed < min.timesUsed ? feature : min
  );

  const featureUsageTopMetrics = [
    {
      title: "Total Clicks",
      value: totalClicks.toString(),
      subtitle: "Aggregate clicks across all features",
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Total Uses",
      value: totalUses.toString(),
      subtitle: "Total times features were used",
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Avg Clicks per Feature",
      value: avgClicks.toString(),
      subtitle: "Average clicks per feature",
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
    },
    {
      title: "Most Engaged Feature",
      value: mostEngagedFeature,
      subtitle: "Feature with highest usage",
      icon: <Star className="h-5 w-5 text-yellow-500" />,
    },
  ];

  const featureUsageStatCards = [
    {
      title: "Max Clicks",
      label: "Highest clicks on a feature:",
      value: `${maxClicksFeature.clicks} (${maxClicksFeature.featureName})`,
      type: "blue",
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Min Clicks",
      label: "Lowest clicks on a feature:",
      value: `${minClicksFeature.clicks} (${minClicksFeature.featureName})`,
      type: "red",
      icon: <TrendingDown className="h-5 w-5 text-red-500" />,
    },
    {
      title: "Max Uses",
      label: "Highest usage count:",
      value: `${maxUsesFeature.timesUsed} (${maxUsesFeature.featureName})`,
      type: "green",
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Min Uses",
      label: "Lowest usage count:",
      value: `${minUsesFeature.timesUsed} (${minUsesFeature.featureName})`,
      type: "orange",
      icon: <TrendingDown className="h-5 w-5 text-orange-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Outer Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Features Usage
          </h2>
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

      {/* Feature Usage Top Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {featureUsageTopMetrics.map((metric, index) => (
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

      {/* Feature Usage Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {featureUsageStatCards.map((stat, index) => (
          <Card key={index} className="shadow-none">
            <CardContent className="p-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-base font-medium">{stat.title}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="mt-4">
                    <span
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
                        px-2 py-1 rounded text-sm font-semibold
                      `}
                    >
                      {stat.value}
                    </span>
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

      {/* Features Table */}
      <Card className="relative shadow-none">
        <CardHeader>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Features Usage
            </h2>
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
