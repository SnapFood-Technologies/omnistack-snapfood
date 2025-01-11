// components/admin/dashboard/dashboard-content.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Users, ArrowUp, ArrowDown, ShoppingBag, Clock } from "lucide-react"

export function DashboardContent() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold">Welcome back, Griseld 👋</h2>
                <p className="text-muted-foreground mt-2">
                    Monitor your restaurant network and delivery performance metrics
                </p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Partner Restaurants
                        </CardTitle>
                        <div className="p-2 bg-blue-100/50 rounded-lg dark:bg-blue-900/50">
                            <Store className="h-4 w-4 text-blue-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline justify-between">
                            <div className="text-2xl font-bold">124</div>
                            <div className="flex items-center space-x-1 text-sm text-green-500">
                                <ArrowUp className="h-4 w-4" />
                                <span>8%</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +12 this month
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
                            <div className="text-2xl font-bold">14,592</div>
                            <div className="flex items-center space-x-1 text-sm text-green-500">
                                <ArrowUp className="h-4 w-4" />
                                <span>12%</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +892 since last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Delivered Orders
                        </CardTitle>
                        <div className="p-2 bg-green-100/50 rounded-lg dark:bg-green-900/50">
                            <ShoppingBag className="h-4 w-4 text-green-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline justify-between">
                            <div className="text-2xl font-bold">8,374</div>
                            <div className="flex items-center space-x-1 text-green-500">
                                <ArrowUp className="h-4 w-4" />
                                <span>23%</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +1,234 this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avg. Delivery Time
                        </CardTitle>
                        <div className="p-2 bg-amber-100/50 rounded-lg dark:bg-amber-900/50">
                            <Clock className="h-4 w-4 text-amber-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline justify-between">
                            <div className="text-2xl font-bold">28.5m</div>
                            <div className="flex items-center space-x-1 text-sm text-green-500">
                                <ArrowDown className="h-4 w-4" />
                                <span>2.3m</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Improved by 2.3 mins
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}