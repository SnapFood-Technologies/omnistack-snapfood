// components/admin/qr-code/qr-configuration.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Link as LinkIcon, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import InputSelect from "@/components/Common/InputSelect"

interface QRConfiguration {
  qrType: 'app_only' | 'app_with_google';
  hasLandingPage: boolean;
  landingPageUrl?: string;
  feeType: 'none' | 'fixed' | 'percentage';
  feeAmount?: number;
  isActive: boolean;
}

export function QRConfiguration() {
  const [openConfigModal, setOpenConfigModal] = useState(false)
  const [config, setConfig] = useState<QRConfiguration>({
    qrType: 'app_only',
    hasLandingPage: false,
    feeType: 'none',
    isActive: true
  })

  const qrTypeOptions = [
    { value: 'app_only', label: 'Restaurant in App Only' },
    { value: 'app_with_google', label: 'App with Google Reviews' },
  ]

  const feeOptions = [
    { value: 'none', label: 'Free' },
    { value: 'fixed', label: 'Fixed Fee per Order' },
    { value: 'percentage', label: 'Percentage of Order' },
  ]

  return (
    <div className="space-y-6">
      {/* Configuration Preview Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg font-semibold">QR Code Configuration</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Current QR code settings and fees
            </p>
          </div>
          <Button onClick={() => setOpenConfigModal(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            {/* QR Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">QR Type</Label>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-700 px-2 py-1">
                  {qrTypeOptions.find(opt => opt.value === config.qrType)?.label}
                </Badge>
              </div>
            </div>

            {/* Landing Page */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Landing Page</Label>
              <div className="flex items-center space-x-2">
                <Badge 
                  className={cn(
                    "px-2 py-1",
                    config.hasLandingPage ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  )}
                >
                  {config.hasLandingPage ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              {config.hasLandingPage && config.landingPageUrl && (
                <p className="text-sm text-muted-foreground truncate">
                  {config.landingPageUrl}
                </p>
              )}
            </div>

            {/* Fee Configuration */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Fee Structure</Label>
              <div className="flex items-center space-x-2">
                <Badge 
                  className={cn(
                    "px-2 py-1",
                    config.feeType === 'none' 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  )}
                >
                  {config.feeType === 'fixed' && config.feeAmount 
                    ? `${config.feeAmount} ALL per order`
                    : config.feeType === 'percentage' && config.feeAmount
                    ? `${config.feeAmount}% per order`
                    : 'Free'}
                </Badge>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex items-center space-x-2">
                <Badge 
                  className={cn(
                    "px-2 py-1",
                    config.isActive 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  )}
                >
                  {config.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Modal */}
      <Dialog open={openConfigModal} onOpenChange={setOpenConfigModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>QR Code Configuration</DialogTitle>
            <DialogDescription>
              Configure your QR code settings and fee structure
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                QR Settings
              </TabsTrigger>
              <TabsTrigger value="fees" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Fee Structure
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="p-4 space-y-4 pt-4">
              <div className="space-y-4">
                {/* QR Type Selection */}
                <InputSelect
                  name="qrType"
                  label="QR Code Type"
                  value={config.qrType}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    qrType: e.target.value as QRConfiguration['qrType']
                  }))}
                  options={qrTypeOptions}
                />

                {/* Landing Page Toggle */}
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>Landing Page</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable custom landing page for this restaurant
                    </p>
                  </div>
                  <Switch
                    checked={config.hasLandingPage}
                    onCheckedChange={(checked) => setConfig(prev => ({
                      ...prev,
                      hasLandingPage: checked,
                      landingPageUrl: checked ? prev.landingPageUrl : undefined
                    }))}
                  />
                </div>

                {/* Landing Page URL */}
                {config.hasLandingPage && (
                  <div className="space-y-2">
                    <Label>Landing Page URL</Label>
                    <Input
                      placeholder="https://your-landing-page.com"
                      value={config.landingPageUrl}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        landingPageUrl: e.target.value
                      }))}
                    />
                  </div>
                )}

                {/* Active Status */}
                <div className="flex items-center justify-between space-x-2 pt-4">
                  <div className="space-y-0.5">
                    <Label>Active Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable QR code functionality
                    </p>
                  </div>
                  <Switch
                    checked={config.isActive}
                    onCheckedChange={(checked) => setConfig(prev => ({
                      ...prev,
                      isActive: checked
                    }))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fees" className="p-4 pt-4">
              <div className="space-y-6">
                <InputSelect
                  name="feeType"
                  label="Fee Type"
                  value={config.feeType}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    feeType: e.target.value as QRConfiguration['feeType'],
                    feeAmount: undefined
                  }))}
                  options={feeOptions}
                />

                {config.feeType !== 'none' && (
                  <div className="space-y-2">
                    <Label>
                      {config.feeType === 'fixed' ? 'Fee Amount (ALL)' : 'Fee Percentage (%)'}
                    </Label>
                    <Input
                      type="number"
                      placeholder={config.feeType === 'fixed' ? "Enter amount in ALL" : "Enter percentage"}
                      value={config.feeAmount}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        feeAmount: parseFloat(e.target.value)
                      }))}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfigModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}