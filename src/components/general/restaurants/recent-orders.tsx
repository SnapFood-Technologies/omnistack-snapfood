// src/components/geneeral/restaurants/recent-orders.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

const recentOrders = [
  {
    id: "1",
    customer: "John Doe",
    items: "2x Pizza Margherita, 1x Coke",
    total: "$42.50",
    status: "Delivered",
    initials: "JD"
  },
  {
    id: "2",
    customer: "Sarah Smith",
    items: "1x Pasta Carbonara, 1x Tiramisu",
    total: "$28.90",
    status: "In Progress",
    initials: "SS"
  },
  {
    id: "3",
    customer: "Mike Johnson",
    items: "3x Chicken Wings, 2x Beer",
    total: "$35.20",
    status: "Pending",
    initials: "MJ"
  },
]

export function RecentOrders() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{order.initials}</AvatarFallback>
                </Avatar>
                {order.customer}
              </div>
            </TableCell>
            <TableCell>{order.items}</TableCell>
            <TableCell>{order.total}</TableCell>
            <TableCell>{order.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
