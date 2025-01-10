// src/app/restaurant/menu/page.tsx
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

export default function MenuPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All Items</TabsTrigger>
                    <TabsTrigger value="food">Food</TabsTrigger>
                    <TabsTrigger value="drinks">Drinks</TabsTrigger>
                    <TabsTrigger value="desserts">Desserts</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Margherita Pizza</CardTitle>
                                <CardDescription>Classic tomato and mozzarella</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between">
                                    <span className="text-2xl font-bold">$12.99</span>
                                    <Button variant="outline" size="sm">Edit</Button>
                                </div>
                            </CardContent>
                        </Card>
                        {/* More menu items */}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}