"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RestaurantInfo } from "./restaurant-info"
import { OperatingHours } from "./operating-hours"
import { DeliverySettings } from "./delivery-settings"
import { LocationMap } from "./location-map"
import { RewardsSettings } from "./rewards-settings"
import { 
  Store, 
  Clock, 
  Truck, 
  MapPin, 
  Gift
} from "lucide-react"

const TABS = [
  {
    title: "Restaurant Info",
    shortTitle: "Info",
    value: "info",
    icon: Store,
    component: RestaurantInfo
  },
  {
    title: "Operating Hours",
    shortTitle: "Hours",
    value: "hours",
    icon: Clock,
    component: OperatingHours
  },
  {
    title: "Delivery & Pickup",
    shortTitle: "Delivery",
    value: "delivery",
    icon: Truck,
    component: DeliverySettings
  },
  {
    title: "Location",
    shortTitle: "Location",
    value: "location",
    icon: MapPin,
    component: LocationMap
  },
  {
    title: "Rewards",
    shortTitle: "Rewards",
    value: "rewards",
    icon: Gift,
    component: RewardsSettings
  }
]

export function RestaurantSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Configure your restaurant profile, hours, and delivery settings
        </p>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 h-auto bg-muted p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 h-9 px-4 py-2 data-[state=active]:bg-background"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline-block">{tab.title}</span>
                <span className="sm:hidden">{tab.shortTitle}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <tab.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}