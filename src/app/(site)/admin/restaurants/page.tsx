// src/app/admin/restaurants/page.tsx
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus } from "lucide-react"

export default function Restaurants() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Restaurants</h2>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Restaurant
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Pizza Place</TableCell>
                        <TableCell>New York</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>1,234</TableCell>
                        <TableCell>$12,234</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="sm">
                                View
                            </Button>
                        </TableCell>
                    </TableRow>
                    {/* Add more rows as needed */}
                </TableBody>
            </Table>
        </div>
    )
}