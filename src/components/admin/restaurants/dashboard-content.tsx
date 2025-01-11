// src/components/restaurant/dashboard-content.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/general/restaurants/overview"
import { RecentOrders } from "@/components/general/restaurants/recent-orders"
import { DollarSign, Users, Package, Activity } from "lucide-react"

export function RestaurantDashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Monitor your restaurant performance and manage orders
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <div className="p-2 bg-green-100/50 rounded-lg dark:bg-green-900/50">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">$45,231.89</div>
              <div className="flex items-center space-x-1 text-sm text-green-500">
                <span>+20.1%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Orders
            </CardTitle>
            <div className="p-2 bg-blue-100/50 rounded-lg dark:bg-blue-900/50">
              <Package className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">2,350</div>
              <div className="flex items-center space-x-1 text-sm text-green-500">
                <span>+180.1%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Orders
            </CardTitle>
            <div className="p-2 bg-amber-100/50 rounded-lg dark:bg-amber-900/50">
              <Activity className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">12</div>
              <div className="flex items-center space-x-1 text-sm text-green-500">
                <span>+19%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +19% from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customers
            </CardTitle>
            <div className="p-2 bg-violet-100/50 rounded-lg dark:bg-violet-900/50">
              <Users className="h-4 w-4 text-violet-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">573</div>
              <div className="flex items-center space-x-1 text-sm text-green-500">
                <span>+201</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +201 since last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
