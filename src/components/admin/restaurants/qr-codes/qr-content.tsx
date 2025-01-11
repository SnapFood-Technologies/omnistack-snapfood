"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { QRCard } from "@/components/ui/qr-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Download, Palette, Type, Link as LinkIcon, Upload } from "lucide-react"
import { Menu, QRCodeData } from "@/types/qr-code"

export function QRCodeContent({ restaurantId }: { restaurantId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [menus, setMenus] = useState<Menu[]>([])
  const [useCustomUrl, setUseCustomUrl] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [qrPreview, setQrPreview] = useState<string | null>(null)


  const [formData, setFormData] = useState<QRCodeData>({
    design: 'classic',
    primaryColor: '#000000',
    backgroundColor: '#FFFFFF',
    size: 'medium',
    customText: '',
    hasLogo: false,
    errorLevel: 'M',
    type: 'TABLE',
    customUrl: '',
    logo: null
  })

  const designs = [
    { id: 'classic', name: 'Classic', preview: '⬛' },
    { id: 'modern', name: 'Modern', preview: '◼️' },
    { id: 'dots', name: 'Dots', preview: '⚫' },
  ]

  const sizes = [
    { value: 'small', label: 'Small (200x200)' },
    { value: 'medium', label: 'Medium (300x300)' },
    { value: 'large', label: 'Large (400x400)' },
  ]

  const qrTypes = [
    { value: 'TABLE', label: 'Table QR' },
    { value: 'TAKEOUT', label: 'Takeout Menu' },
    { value: 'SPECIAL', label: 'Special Event' }
  ]

  useEffect(() => {
    async function loadMenus() {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}/menus`)
        const data = await response.json()
        setMenus(data)
        if (data.length > 0 && !useCustomUrl) {
          setFormData(prev => ({ ...prev, menuId: data[0].id }))
        }
      } catch (error) {
        console.error('Error loading menus:', error)
        toast({
          title: "Error",
          description: "Failed to load menus",
          variant: "destructive",
        })
      }
    }
    loadMenus()
  }, [restaurantId, toast, useCustomUrl])

  const handleDownload = async (format: 'svg' | 'png') => {
    const element = document.createElement('a')
    element.href = qrPreview as string
    element.download = `qr-code.${format}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Preview the logo
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      setFormData(prev => ({ 
        ...prev, 
        logo: file,
        hasLogo: true 
      }))
    }
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (key === 'logo' && value instanceof File) {
            formDataToSend.append('logo', value)
          } else {
            formDataToSend.append(key, String(value))
          }
        }
      })

      const response = await fetch(`/api/restaurants/${restaurantId}/qr-codes`, {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) throw new Error('Failed to generate QR code')

      toast({
        title: "Success",
        description: "QR code generated successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">QR Codes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Generate and manage QR codes for your menus
        </p>
      </div>
  
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Preview Panel - Fixed width on desktop */}
        <div className="lg:w-1/3">
          <QRCard 
            title="QR Code Preview" 
            description="See how your QR code will look"
            className="sticky top-4"
            footer={
              <div className="flex justify-between gap-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleDownload('svg')}
                  disabled={!qrPreview}
                >
                  <Download className="mr-2 h-4 w-4" />
                  SVG
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleDownload('png')}
                  disabled={!qrPreview}
                >
                  <Download className="mr-2 h-4 w-4" />
                  PNG
                </Button>
              </div>
            }
          >
            <div className="flex items-center justify-center p-6">
              {qrPreview ? (
                <div 
                  className="w-64 h-64 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: qrPreview }}
                />
              ) : (
                <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                  QR Preview
                </div>
              )}
            </div>
          </QRCard>
  
          {/* Generate Button - Under preview on desktop */}
          <div className="mt-4 hidden lg:block">
            <Button 
              className="w-full"
              onClick={handleGenerate}
              disabled={isLoading || (!formData.menuId && !useCustomUrl) || (useCustomUrl && !formData.customUrl)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate QR Code'
              )}
            </Button>
          </div>
        </div>
  
        {/* Customization Panel */}
        <div className="lg:flex-1">
          <QRCard
            title="Customize QR Code"
            description="Personalize your QR code design"
          >
            {/* Basic Settings */}
            <div className="space-y-6 mb-6">
              <div className="p-0 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Use Custom URL</Label>
                  <Switch
                    checked={useCustomUrl}
                    onCheckedChange={setUseCustomUrl}
                  />
                </div>
  
                {useCustomUrl ? (
                  <div className="space-y-2">
                    <Label>Custom Menu URL</Label>
                    <Input
                      placeholder="https://your-menu-url.com"
                      value={formData.customUrl}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        customUrl: e.target.value,
                        menuId: undefined 
                      }))}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Select Menu</Label>
                    <Select 
                      value={formData.menuId} 
                      onValueChange={(value) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          menuId: value,
                          customUrl: undefined 
                        }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a menu" />
                      </SelectTrigger>
                      <SelectContent>
                        {menus && menus.length > 0 ? (
                          menus.map((menu) => (
                            <SelectItem key={menu.id} value={menu.id}>
                              {menu.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-menu" disabled>
                            No menus available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
  
              <div className="space-y-2">
                <Label>QR Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'TABLE' | 'TAKEOUT' | 'SPECIAL') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qrTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
  
              {formData.type === 'TABLE' && (
                <div className="space-y-2">
                  <Label>Table Number</Label>
                  <Input
                    type="number"
                    value={formData.tableNumber || ''}
                    onChange={(e) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        tableNumber: parseInt(e.target.value) 
                      }))
                    }
                    placeholder="Enter table number"
                  />
                </div>
              )}
            </div>
  
            {/* Design Tabs */}
            <Tabs defaultValue="design" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger className="flex items-center gap-2" value="design">
                  <Palette className="mr-2 h-4 w-4" />
                  Design
                </TabsTrigger>
                <TabsTrigger  className="flex items-center gap-2" value="content">
                  <Type className="mr-2 h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger className="flex items-center gap-2" value="advanced">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>
  
              <TabsContent value="design" className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label>Design Style</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {designs.map((design) => (
                      <Button
                        key={design.id}
                        variant={formData.design === design.id ? "default" : "outline"}
                        className="h-20"
                        onClick={() => setFormData(prev => ({ ...prev, design: design.id }))}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{design.preview}</div>
                          <div className="text-sm">{design.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
  
                <div className="space-y-2">
                  <Label>Colors</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Primary Color</Label>
                      <Input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          primaryColor: e.target.value 
                        }))}
                        className="h-10 w-full"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Background Color</Label>
                      <Input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          backgroundColor: e.target.value 
                        }))}
                        className="h-10 w-full"
                      />
                    </div>
                  </div>
                </div>
  
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select 
                    value={formData.size} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
  
              <TabsContent value="content" className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label>Custom Text</Label>
                  <Input
                    placeholder="Enter text to display below QR code"
                    value={formData.customText}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      customText: e.target.value 
                    }))}
                  />
                </div>
  
                <div className="space-y-2">
                  <Label>Upload Logo</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Logo
                    </Button>
                    {logoPreview && (
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="h-10 w-10 object-contain rounded-md"
                      />
                    )}
                  </div>
                </div>
  
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Add Logo to QR</Label>
                    <div className="text-sm text-muted-foreground">
                      Add your logo to the center of the QR code
                    </div>
                  </div>
                  <Switch
                    checked={formData.hasLogo}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      hasLogo: checked 
                    }))}
                  />
                </div>
              </TabsContent>
  
              <TabsContent value="advanced" className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label>Error Correction Level</Label>
                  <Select 
                    value={formData.errorLevel}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      errorLevel: value 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (7%)</SelectItem>
                      <SelectItem value="M">Medium (15%)</SelectItem>
                      <SelectItem value="Q">Quartile (25%)</SelectItem>
                      <SelectItem value="H">High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Higher correction levels make QR codes more reliable but larger
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </QRCard>
  
          {/* Generate Button - Shows on mobile */}
          <div className="mt-4 lg:hidden">
            <Button 
              className="w-full"
              onClick={handleGenerate}
              disabled={isLoading || (!formData.menuId && !useCustomUrl) || (useCustomUrl && !formData.customUrl)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate QR Code'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}