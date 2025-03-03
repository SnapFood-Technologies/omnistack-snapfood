"use client"

import { useState, useEffect } from "react"
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
import { CreditCard, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import InputSelect from "@/components/Common/InputSelect"
import { useToast } from "@/components/ui/use-toast"
import { QRConfigurationData } from "@/types/qr-code"

interface QRConfigurationProps {
  restaurantId: string;
}

export function QRConfiguration({ restaurantId }: QRConfigurationProps) {
  const { toast } = useToast()
  const [openConfigModal, setOpenConfigModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [config, setConfig] = useState<QRConfigurationData>({
    landingPageUrl: "",
    feeType: 'none',
    isActive: true
  })

  // Load configuration from API
  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}/qr-config`)
        if (!response.ok) {
          throw new Error('Failed to fetch QR configuration')
        }
        const data = await response.json()
        setConfig(data)
      } catch (error) {
        console.error('Error loading QR configuration:', error)
        toast({
          title: "Error",
          description: "Failed to load QR configuration",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [restaurantId, toast])

  const saveConfiguration = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/qr-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...config,
          restaurantId,
        }),
      })

      if (!response.ok) {
        throw new Error(response)
      }

      toast({
        title: "Success",
        description: "QR configuration saved successfully",
      })
      setOpenConfigModal(false)
    } catch (error) {
      console.error('Error saving configuration:', error)
      toast({
        title: "Error",
        description: "Failed to save QR configuration",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const feeOptions = [
    { value: 'none', label: 'Free' },
    { value: 'fixed', label: 'Fixed Fee per Order' },
    { value: 'percentage', label: 'Percentage of Order' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

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
            <CreditCard className="mr-2 h-4 w-4" />
            Configure Fees
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">

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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code Configuration</DialogTitle>
            <DialogDescription>
              Configure landing page and fee structure
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="fees" className="w-full">
            <TabsList className="grid w-full">
              <TabsTrigger value="fees" className="flex items-center justify-center">
                <CreditCard className="h-4 w-4 mr-2" />
                <span>Fee Structure</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fees" className="p-4 pt-4">
              <div className="space-y-6">
                <InputSelect
                  name="feeType"
                  label="Fee Type"
                  value={config.feeType}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    feeType: e.target.value as QRConfigurationData['feeType'],
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
                      value={config.feeAmount || ''}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        feeAmount: parseFloat(e.target.value) || undefined
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
            <Button 
              type="submit" 
              onClick={saveConfiguration}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}