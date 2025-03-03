// components/admin/LandingPageStats.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, ResponsiveContainer } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Download, Eye, Star, Smartphone, UserPlus } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

type Restaurant = {
  id: string;
  name: string;
  hashId?: string;
}

export function LandingPageStats() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null)
  const [stats, setStats] = useState<any>({
    stats: [],
    logs: [],
    dailyStats: []
  })

  // Load restaurants
  useEffect(() => {
    async function loadRestaurants() {
      try {
        const response = await fetch('/api/restaurants?pageSize=1000')
        if (response.ok) {
          const data = await response.json()
          setRestaurants(data.restaurants)
        }
      } catch (error) {
        console.error("Failed to load restaurants:", error)
      }
    }
    
    loadRestaurants()
  }, [])

  // Load stats when filters change
  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        
        if (selectedRestaurantId) {
          queryParams.append('restaurantId', selectedRestaurantId)
        }
        
        if (dateRange?.from) {
          queryParams.append('startDate', dateRange.from.toISOString())
        }
        
        if (dateRange?.to) {
          queryParams.append('endDate', dateRange.to.toISOString())
        }
        
        const response = await fetch(`/api/admin/landing-page-stats?${queryParams}`)
        
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          toast({
            title: "Error",
            description: "Failed to load statistics",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to load stats:", error)
        toast({
          title: "Error",
          description: "Failed to load statistics",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadStats()
  }, [selectedRestaurantId, dateRange, toast])

  // Prepare chart data
  const chartData = stats.dailyStats?.map((item: any) => ({
    date: format(new Date(item.date), 'MMM d'),
    [item.actionType]: item.count,
    restaurant: item.restaurantId
  })) || []

  // Get total counts by action type
  const totalCounts = {
    PAGE_VIEW: stats.stats?.find((s: any) => s.actionType === 'PAGE_VIEW')?.count || 0,
    GOOGLE_REVIEW_CLICK: stats.stats?.find((s: any) => s.actionType === 'GOOGLE_REVIEW_CLICK')?.count || 0,
    APP_LINK_CLICK: stats.stats?.find((s: any) => s.actionType === 'APP_LINK_CLICK')?.count || 0,
    REGISTRATION_START: stats.stats?.find((s: any) => s.actionType === 'REGISTRATION_START')?.count || 0,
  }

  // Download stats as CSV
  const downloadStats = () => {
    // Convert logs to CSV
    const headers = ['Date', 'Restaurant', 'Action', 'IP Address', 'User Agent', 'Referrer']
    const rows = stats.logs.map((log: any) => [
      format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      log.restaurant.name,
      log.actionType,
      log.ipAddress || '',
      log.userAgent || '',
      log.referrer || ''
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'landing-page-stats.csv');
    link.click();
  }

  if (loading && !stats.logs.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Landing Page Statistics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track user engagement with your restaurant landing pages
          </p>
        </div>
        <Button variant="outline" onClick={downloadStats}>
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
      </div>
      
      <Card>
        <CardHeader>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Filters</h2>
          <p className="text-sm text-muted-foreground mt-1">
          Filter statistics by restaurant and date range
          </p>
        </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant-select">Restaurant</Label>
              <Select
                value={selectedRestaurantId}
                onValueChange={setSelectedRestaurantId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Restaurants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Restaurants</SelectItem>
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <DatePickerWithRange value={dateRange} onChange={setDateRange} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-base font-medium">Page Views</CardTitle>
            <Eye className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">{totalCounts.PAGE_VIEW}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-base font-medium">Google Reviews</CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">{totalCounts.GOOGLE_REVIEW_CLICK}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-base font-medium">App Clicks</CardTitle>
            <Smartphone className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">{totalCounts.APP_LINK_CLICK}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-base font-medium">Registrations</CardTitle>
            <UserPlus className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">{totalCounts.REGISTRATION_START}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="chart">
        <TabsList>
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
            <div>
            <h2 className="text-2xl font-semibold tracking-tight">Activity Over Time</h2>
            <p className="text-sm text-muted-foreground mt-1">
            Track all landing page actions over time
            </p>
            </div>
             
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="PAGE_VIEW" stroke="#8884d8" name="Page Views" />
                  <Line type="monotone" dataKey="GOOGLE_REVIEW_CLICK" stroke="#ffc658" name="Google Reviews" />
                  <Line type="monotone" dataKey="APP_LINK_CLICK" stroke="#0088FE" name="App Clicks" />
                  <Line type="monotone" dataKey="REGISTRATION_START" stroke="#00C49F" name="Registrations" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
            <div>
            <h2 className="text-2xl font-semibold tracking-tight">Actions Comparison</h2>
            <p className="text-sm text-muted-foreground mt-1">
            Compare different types of actions
            </p>
            </div>
             
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={[{
                  name: 'Actions',
                  'Page Views': totalCounts.PAGE_VIEW,
                  'Google Reviews': totalCounts.GOOGLE_REVIEW_CLICK,
                  'App Clicks': totalCounts.APP_LINK_CLICK,
                  'Registrations': totalCounts.REGISTRATION_START
                }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Page Views" fill="#8884d8" />
                  <Bar dataKey="Google Reviews" fill="#ffc658" />
                  <Bar dataKey="App Clicks" fill="#0088FE" />
                  <Bar dataKey="Registrations" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="table">
          <Card>
            <CardHeader>
            <div>
            <h2 className="text-2xl font-semibold tracking-tight">Recent Activities</h2>
            <p className="text-sm text-muted-foreground mt-1">
            Recent landing page interactions
            </p>
            </div>
              
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Restaurant</th>
                      <th className="text-left py-3 px-4">Action</th>
                      <th className="text-left py-3 px-4">IP Address</th>
                      <th className="text-left py-3 px-4">Referrer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.logs.slice(0, 50).map((log: any) => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">{format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}</td>
                        <td className="py-2 px-4">{log.restaurant.name}</td>
                        <td className="py-2 px-4">
                          {log.actionType === 'PAGE_VIEW' && <span className="flex items-center"><Eye className="h-4 w-4 mr-1" /> Page View</span>}
                          {log.actionType === 'GOOGLE_REVIEW_CLICK' && <span className="flex items-center"><Star className="h-4 w-4 mr-1 text-yellow-500" /> Google Review</span>}
                          {log.actionType === 'APP_LINK_CLICK' && <span className="flex items-center"><Smartphone className="h-4 w-4 mr-1 text-blue-500" /> App Click</span>}
                          {log.actionType === 'REGISTRATION_START' && <span className="flex items-center"><UserPlus className="h-4 w-4 mr-1 text-green-500" /> Registration</span>}
                        </td>
                        <td className="py-2 px-4">{log.ipAddress || '-'}</td>
                        <td className="py-2 px-4">{log.referrer || '-'}</td>
                      </tr>
                    ))}
                    {stats.logs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-muted-foreground">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {stats.logs.length > 50 && (
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Showing 50 of {stats.logs.length} records. Download CSV for complete data.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}