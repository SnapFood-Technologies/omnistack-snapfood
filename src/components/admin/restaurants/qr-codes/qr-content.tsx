"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { QRCard } from "@/components/ui/qr-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import {
  Loader2,
  Download,
  Palette,
  Type,
  Link as LinkIcon,
  Upload,
  Info,
} from "lucide-react"
import { Menu, QRCodeData, QRCodeType } from "@/types/qr-code"
import InputSelect from "@/components/Common/InputSelect"

export function QRCodeContent({ restaurantId }: { restaurantId: string }) {
  const router = useRouter()
  const { toast } = useToast()

  // Loading states
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [loadingGenerate, setLoadingGenerate] = useState(false)
  const [loadingRestaurant, setLoadingRestaurant] = useState(true)

  // Data states
  const [menus, setMenus] = useState<Menu[]>([])
  const [restaurant, setRestaurant] = useState<any>(null)
  const [qrPreview, setQrPreview] = useState<string | null>(null)
  const [qrUrls, setQrUrls] = useState<{ png?: string; svg?: string }>({})
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generatedUrl, setGeneratedUrl] = useState<string>("")

  // Form data
  const [formData, setFormData] = useState<QRCodeData>({
    design: "classic",
    primaryColor: "#000000",
    backgroundColor: "#FFFFFF",
    size: "medium",
    customText: "",
    hasLogo: false,
    errorLevel: "M",
    type: "PROFILE_WEB",
    customUrl: "",
    logo: null,
  })

  // Options
  const designs = [
    { id: "classic", name: "Classic", preview: "⬛" },
    { id: "modern", name: "Modern", preview: "◼️" },
    { id: "dots", name: "Dots", preview: "⚫" },
  ]

  const sizes = [
    { value: "small", label: "Small (200x200)" },
    { value: "medium", label: "Medium (300x300)" },
    { value: "large", label: "Large (400x400)" },
  ]

  const qrTypes = [
    { value: "PROFILE_WEB", label: "Restaurant Profile in SnapFood Web" },
    { value: "PROFILE_APP", label: "Restaurant Profile in SnapFood App" },
    { value: "LANDING_PAGE", label: "Restaurant Landing Page on SnapFood" },
    { value: "CUSTOM_URL", label: "Custom URL" },
  ]

  // Load restaurant info
  useEffect(() => {
    async function loadRestaurant() {
      setLoadingRestaurant(true)
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`)
        const data = await response.json()
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant')
        }
        setRestaurant(data)
      } catch (error) {
        console.error("Error loading restaurant:", error)
        toast({
          title: "Error",
          description: "Failed to load restaurant data",
          variant: "destructive",
        })
      } finally {
        setLoadingRestaurant(false)
      }
    }
    loadRestaurant()
  }, [restaurantId, toast])

  // Load menus on mount
  useEffect(() => {
    async function loadMenus() {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}/menus`)
        const data = await response.json()
        setMenus(data)

        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, menuId: data[0].id }))
        }
      } catch (error) {
        console.error("Error loading menus:", error)
        toast({
          title: "Error",
          description: "Failed to load menus",
          variant: "destructive",
        })
      }
    }
    loadMenus()
  }, [restaurantId, toast])

  // Generate URL based on QR type when formData.type or restaurant data changes
  useEffect(() => {
    if (!restaurant) return;

    const baseUrl = 'https://snapfood.al';
    let url = '';

    switch (formData.type) {
      case 'PROFILE_WEB':
        // Web profile URL - https://snapfood.al/restaurant/{vendor_hash_id}/{vendor_slug}
        url = `${baseUrl}/restaurant/${restaurant.hashId || ''}/${restaurant.slug || ''}`;
        break;
      
      case 'PROFILE_APP':
        // App profile URL with deep linking
        url = `https://reward.snapfood.al/referral/?link=https://snapfood.al/reward?restaurantId=${restaurant.externalSnapfoodId || ''}&apn=com.snapfood.app&isi=1314003561&ibi=com.snapfood.al`;
        break;
      
      case 'LANDING_PAGE': 
        // Landing page URL - https://snapfood.al/landing/{....}/Delivery
        url = `${baseUrl}/landing/${restaurant.hashId}/Delivery`;
        break;
      
      case 'CUSTOM_URL':
        // Use custom URL provided by user
        url = formData.customUrl || '';
        break;
    }

    setGeneratedUrl(url);
  }, [formData.type, formData.customUrl, restaurant]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview)
      }
      if (qrUrls.svg) {
        URL.revokeObjectURL(qrUrls.svg)
      }
      if (qrUrls.png) {
        URL.revokeObjectURL(qrUrls.png)
      }
    }
  }, [logoPreview, qrUrls])

  const isValidForm = () => {
    if (formData.type === 'CUSTOM_URL' && !formData.customUrl) return false;
    if (formData.hasLogo && !formData.logo) return false;
    return true;
  };

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.type === 'CUSTOM_URL' && !formData.customUrl) {
      newErrors.customUrl = "Please enter a custom URL"
    }

    if (formData.hasLogo && !formData.logo) {
      newErrors.logo = "Please upload a logo"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePreview = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check all required fields",
        variant: "destructive",
      })
      return
    }

    if (!generatedUrl) {
      toast({
        title: "Error",
        description: "Unable to generate URL for the QR code",
        variant: "destructive",
      })
      return
    }

    setLoadingPreview(true)
    try {
      const formDataToSend = new FormData()
      
      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === "logo" && value instanceof File) {
            formDataToSend.append("logo", value)
          } else {
            formDataToSend.append(key, String(value))
          }
        }
      })
      
      // Add the generated URL
      formDataToSend.set("qrUrl", generatedUrl)

      const response = await fetch(
        `/api/restaurants/${restaurantId}/qr-codes/preview`,
        {
          method: "PUT",
          body: formDataToSend,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate preview")
      }

      setQrPreview(data.svgString)
      setQrUrls({ svg: data.svgDataUrl, png: data.pngDataUrl })

      toast({
        title: "Success",
        description: "Preview generated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate preview",
        variant: "destructive",
      })
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleDownload = async (format: "svg" | "png") => {
    if (!qrUrls[format]) return

    try {
      const response = await fetch(qrUrls[format]!)
      const blob = await response.blob()
      const element = document.createElement("a")
      element.href = URL.createObjectURL(blob)
      element.download = `qr-code-${Date.now()}.${format}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      URL.revokeObjectURL(element.href)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to download ${format.toUpperCase()} file`,
        variant: "destructive",
      })
    }
  }

  const handleGenerate = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check all required fields",
        variant: "destructive",
      })
      return
    }

    if (!generatedUrl) {
      toast({
        title: "Error",
        description: "Unable to generate URL for the QR code",
        variant: "destructive",
      })
      return
    }

    setLoadingGenerate(true)
    try {
      const formDataToSend = new FormData()
      
      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === "logo" && value instanceof File) {
            formDataToSend.append("logo", value)
          } else {
            formDataToSend.append(key, String(value))
          }
        }
      })
      
      // Add the generated URL
      formDataToSend.set("qrUrl", generatedUrl)

      const response = await fetch(`/api/restaurants/${restaurantId}/qr-codes`, {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate QR code")
      }

      setSuccessMessage("QR code generated successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)

      toast({
        title: "Success",
        description: "QR code generated and saved successfully",
      })

      // Generate new preview
      await handlePreview()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate QR code",
        variant: "destructive",
      })
    } finally {
      setLoadingGenerate(false)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Logo file size must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setFormData((prev) => ({
      ...prev,
      logo: file,
      hasLogo: true,
    }))
  }

  if (loadingRestaurant) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">QR Codes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Generate and manage QR codes for {restaurant?.name || 'your restaurant'}
        </p>
      </div>

      {successMessage && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Preview Section */}
        <div className="lg:w-1/3">
          <div className="sticky top-4 space-y-4">
            <QRCard
              title="QR Code Preview"
              description="See how your QR code will look"
              footer={
                <div className="flex justify-between gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDownload("svg")}
                    disabled={!qrUrls.svg}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    SVG
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDownload("png")}
                    disabled={!qrUrls.png}
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
                    No preview yet
                  </div>
                )}
              </div>
            </QRCard>

           {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handlePreview}
                variant="soft"
                className="w-full"
                disabled={!isValidForm() || loadingPreview}
              >
                {loadingPreview ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Preview"
                )}
              </Button>

              <Button
                onClick={handleGenerate}
                variant="default"
                className="w-full"
                disabled={!isValidForm() || loadingGenerate}
              >
                {loadingGenerate ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Customization Panel */}
        <div className="lg:flex-1">
          <QRCard title="Customize QR Code" description="Personalize your QR code design">
            {/* Basic Settings */}
            <div className="space-y-6 mb-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <InputSelect
                    name="type"
                    label="QR Type"
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value as QRCodeType;
                      setFormData((prev) => ({
                        ...prev,
                        type: newType,
                        // Reset customUrl if switching away from custom URL type
                        customUrl: newType === 'CUSTOM_URL' ? prev.customUrl : '',
                      }));
                    }}
                    options={qrTypes}
                    required
                  />
                </div>

                {formData.type === 'CUSTOM_URL' ? (
                  <div className="space-y-2">
                    <Label>Custom URL</Label>
                    <Input
                      placeholder="https://your-custom-url.com"
                      value={formData.customUrl || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customUrl: e.target.value,
                        }))
                      }
                    />
                    {errors.customUrl && (
                      <p className="text-sm text-destructive">{errors.customUrl}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Generated URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={generatedUrl}
                        disabled
                        className="flex-1 bg-muted/50"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedUrl);
                          toast({
                            title: "URL Copied",
                            description: "URL copied to clipboard",
                          });
                        }}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      This URL is automatically generated based on the QR type
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Design Tabs */}
            <Tabs defaultValue="design" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design" className="flex items-center gap-2">
                  <Palette className="mr-2 h-4 w-4" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <Type className="mr-2 h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-2">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              {/* ========== DESIGN TAB ========== */}
              <TabsContent value="design" className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label>Design Style</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {designs.map((design) => (
                      <Button
                        key={design.id}
                        variant={
                          formData.design === design.id ? "default" : "outline"
                        }
                        className="h-20"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, design: design.id }))
                        }
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
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            primaryColor: e.target.value,
                          }))
                        }
                        className="h-10 w-full"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Background Color</Label>
                      <Input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            backgroundColor: e.target.value,
                          }))
                        }
                        className="h-10 w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <InputSelect
                    name="size"
                    label="Size"
                    value={formData.size ?? "Select Option"}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        size: e.target.value,
                      }))
                    }}
                    options={sizes}
                    required
                  />
                </div>
              </TabsContent>

              {/* ========== CONTENT TAB ========== */}
              <TabsContent value="content" className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label>Custom Text</Label>
                  <Input
                    placeholder="Enter text to display below QR code"
                    value={formData.customText || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customText: e.target.value,
                      }))
                    }
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
                      onClick={() => document.getElementById("logo-upload")?.click()}
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
                  {errors.logo && (
                    <p className="text-sm text-destructive">{errors.logo}</p>
                  )}
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
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        hasLogo: checked,
                      }))
                    }
                  />
                </div>
              </TabsContent>

              {/* ========== ADVANCED TAB ========== */}
              <TabsContent value="advanced" className="space-y-4 mb-6">
                <div className="space-y-2">
                  <InputSelect
                    name="errorLevel"
                    label="Error Correction Level"
                    value={formData.errorLevel ?? "Select Option"}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        errorLevel: e.target.value,
                      }))
                    }}
                    options={[
                      { value: "L", label: "Low (7%)" },
                      { value: "M", label: "Medium (15%)" },
                      { value: "Q", label: "Quartile (25%)" },
                      { value: "H", label: "High (30%)" },
                    ]}
                    required
                  />

                  <p className="text-sm text-muted-foreground">
                    Higher correction levels make QR codes more reliable but larger.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </QRCard>
        </div>
      </div>
      <div className="h-10"></div>
    </div>
  )
}