// app/admin/restaurants/[id]/delivery-zones/page.tsx
import { DeliveryZones } from "@/components/admin/restaurants/delivery/zones"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Delivery Zones - Restaurant Admin",
    description: "Configure your restaurant delivery zones",
}

export default function DeliveryZonesPage() {
    return (
        <div>
            <DeliveryZones />
        </div>
    )
}