import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ChefHat, Users } from "lucide-react"
import { DashboardCharts } from "@/components/restaurant/dashboard-charts"

export default function RestaurantDashboard() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-yellix-bold">Dashboard</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="bg-[#EEF5FF] p-3 rounded-lg">
                            <DollarSign className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-base font-yellix-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-yellix-bold">$130,800</div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="bg-[#EEF5FF] p-3 rounded-lg">
                            <Package className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-base font-yellix-medium">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-yellix-bold">11,000</div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="bg-[#EEF5FF] p-3 rounded-lg">
                            <ChefHat className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-base font-yellix-medium">Total Menu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-yellix-bold">120</div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="bg-[#EEF5FF] p-3 rounded-lg">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-base font-yellix-medium">Total Staff</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-yellix-bold">100</div>
                    </CardContent>
                </Card>
            </div>

            <DashboardCharts />
        </div>
    )
}