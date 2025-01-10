// src/app/admin/users/page.tsx
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Plus} from "lucide-react";

export default function Users() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Restaurant</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>john@example.com</TableCell>
                        <TableCell>Restaurant Owner</TableCell>
                        <TableCell>Pizza Place</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="sm">
                                Edit
                            </Button>
                        </TableCell>
                    </TableRow>
                    {/* Add more rows as needed */}
                </TableBody>
            </Table>
        </div>
    )
}