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
} from "lucide-react"
import { Menu, QRCodeData } from "@/types/qr-code"
import InputSelect from "@/components/Common/InputSelect"

export function QRCodeContent({ restaurantId }: { restaurantId: string }) {
  const router = useRouter()
  const { toast } = useToast()

  // Separate loading states
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [loadingGenerate, setLoadingGenerate] = useState(false)

  const [menus, setMenus] = useState<Menu[]>([])
  const [useCustomUrl, setUseCustomUrl] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Store raw HTML/SVG for inline preview
  const [qrPreview, setQrPreview] = useState<string | null>(null)
  // Store data URLs for downloads
  const [qrUrls, setQrUrls] = useState<{ png?: string; svg?: string }>({})

  // Full QR code config form
  const [formData, setFormData] = useState<QRCodeData>({
    design: "classic",
    primaryColor: "#000000",
    backgroundColor: "#FFFFFF",
    size: "medium",
    customText: "",
    hasLogo: false,
    errorLevel: "M",
    type: "TABLE",
    customUrl: "",
    logo: null,
    // tableNumber, menuId will be set dynamically
  })

  // Some example design styles
  const designs = [
    { id: "classic", name: "Classic", preview: "⬛" },
    { id: "modern", name: "Modern", preview: "◼️" },
    { id: "dots", name: "Dots", preview: "⚫" },
  ]

  // Some example sizes
  const sizes = [
    { value: "small", label: "Small (200x200)" },
    { value: "medium", label: "Medium (300x300)" },
    { value: "large", label: "Large (400x400)" },
  ]

  // Types for the QR code
  const qrTypes = [
    { value: "TABLE", label: "Table QR" },
    { value: "TAKEOUT", label: "Takeout Menu" },
    { value: "SPECIAL", label: "Special Event" },
  ]

  // Load menus on mount
  useEffect(() => {
    async function loadMenus() {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}/menus`)
        const data = await response.json()
        setMenus(data)

        // If there's a default menu, set it unless we’re using custom URL
        if (data.length > 0 && !useCustomUrl) {
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
  }, [restaurantId, toast, useCustomUrl])

  /**
   * Generate a preview by calling a special endpoint (you must implement).
   * e.g.: POST /api/restaurants/{restaurantId}/qr-codes/preview
   * Returns:
   *  - svgString: raw SVG code
   *  - svgDataUrl: data:image/svg+xml;base64,...
   *  - pngDataUrl: data:image/png;base64,...
   */
  const handlePreview = async () => {
    setLoadingPreview(true)
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === "logo" && value instanceof File) {
            formDataToSend.append("logo", value)
          } else {
            formDataToSend.append(key, String(value))
          }
        }
      })

      // Example: adjust to your actual route
      const response = await fetch(
        `/api/restaurants/${restaurantId}/qr-codes/preview`,
        {
          method: "POST",
          body: formDataToSend,
        }
      )

      if (!response.ok) throw new Error("Failed to generate QR preview")

      // Suppose your endpoint returns: { svgString, svgDataUrl, pngDataUrl }
      const data = await response.json()

      // For inline rendering
      setQrPreview(data.svgString || null)
      // For downloads
      setQrUrls({ svg: data.svgDataUrl, png: data.pngDataUrl })

      toast({
        title: "Preview Updated",
        description: "QR code preview generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate preview",
        variant: "destructive",
      })
    } finally {
      setLoadingPreview(false)
    }
  }

  /**
   * Download the current QR code in either .svg or .png format.
   * We rely on data URLs stored in `qrUrls`.
   */
  const handleDownload = (format: "svg" | "png") => {
    if (!qrUrls[format]) return
    const element = document.createElement("a")
    element.href = qrUrls[format]!
    element.download = `qr-code.${format}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  /**
   * Officially "Generate" the QR code (e.g. saving in DB, or finalizing).
   * This may be similar or identical to handlePreview, but to a different endpoint.
   */
  const handleGenerate = async () => {
    setLoadingGenerate(true)
    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === "logo" && value instanceof File) {
            formDataToSend.append("logo", value)
          } else {
            formDataToSend.append(key, String(value))
          }
        }
      })

      const response = await fetch(`/api/restaurants/${restaurantId}/qr-codes`, {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) throw new Error("Failed to generate QR code")

      toast({
        title: "Success",
        description: "QR code generated and saved",
      })
      // Optionally refresh or navigate
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
    } finally {
      setLoadingGenerate(false)
    }
  }

  /**
   * Handle file upload for the logo and show a local preview.
   */
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
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
        {/* Preview & Generate Section in a sticky container */}
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

            {/* Buttons for Preview & Generate */}
            <div className="flex gap-2">
              {/* Preview Button (soft variant, separate loading) */}
              <Button
                onClick={handlePreview}
                variant="soft"
                className="w-full"
                disabled={
                  loadingPreview ||
                  (!formData.menuId && !useCustomUrl) ||
                  (useCustomUrl && !formData.customUrl)
                }
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

              {/* Generate Button (default variant, separate loading) */}
              <Button
                onClick={handleGenerate}
                variant="default" // primary background, white text
                className="w-full"
                disabled={
                  loadingGenerate ||
                  (!formData.menuId && !useCustomUrl) ||
                  (useCustomUrl && !formData.customUrl)
                }
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customUrl: e.target.value,
                          menuId: undefined,
                        }))
                      }
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                  <InputSelect
                    name="menuId"
                    label="Select Menu"
                    value={formData.menuId ?? "Select Option"}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        menuId: e.target.value,
                        customUrl: undefined,
                      }))
                    }}
                    options={
                      menus && menus.length > 0
                        ? menus.map((menu) => ({
                            value: menu.id,
                            label: menu.name,
                          }))
                        : [
                            {
                              value: "no-menu",
                              label: "No menus available",
                            },
                          ]
                    }
                    required
                  />
                </div>
                
                )}
              </div>

              <div className="space-y-2">
              <InputSelect
                name="type"
                label="QR Type"
                value={formData.type ?? "Select Option"}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as "TABLE" | "TAKEOUT" | "SPECIAL",
                  }))
                }}
                options={qrTypes}
                required
              />
            </div>


              {formData.type === "TABLE" && (
                <div className="space-y-2">
                  <Label>Table Number</Label>
                  <Input
                    type="number"
                    value={formData.tableNumber || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tableNumber: parseInt(e.target.value) || 0,
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
                    value={formData.customText}
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
    </div>
  )
}
