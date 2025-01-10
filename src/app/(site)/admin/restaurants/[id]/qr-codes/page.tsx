"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Download, Share2, Palette, Type, Link as LinkIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function QRCodesPage() {
  const [selectedDesign, setSelectedDesign] = useState('classic')
  const [customText, setCustomText] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  const [showLogo, setShowLogo] = useState(false)
  const [size, setSize] = useState('medium')

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

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* QR Code Preview */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Preview</CardTitle>
            <CardDescription>
              See how your QR code will look
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              QR Preview
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="w-full mr-2">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" className="w-full ml-2">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </Card>

        {/* QR Code Customization */}
        <Card>
          <CardHeader>
            <CardTitle>Customize QR Code</CardTitle>
            <CardDescription>
              Personalize your QR code design
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="design" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design">
                  <Palette className="mr-2 h-4 w-4" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="content">
                  <Type className="mr-2 h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-4">
                <div className="space-y-2">
                  <Label>Design Style</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {designs.map((design) => (
                      <Button
                        key={design.id}
                        variant={selectedDesign === design.id ? "default" : "outline"}
                        className="h-20"
                        onClick={() => setSelectedDesign(design.id)}
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
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-10 w-full"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Background Color</Label>
                      <Input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="h-10 w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select value={size} onValueChange={setSize}>
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

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label>Custom Text</Label>
                  <Input
                    placeholder="Enter text to display below QR code"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Restaurant Logo</Label>
                    <div className="text-sm text-muted-foreground">
                      Add your logo to the center of the QR code
                    </div>
                  </div>
                  <Switch
                    checked={showLogo}
                    onCheckedChange={setShowLogo}
                  />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-2">
                  <Label>Error Correction Level</Label>
                  <Select defaultValue="M">
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
          </CardContent>
        </Card>
      </div>

      {/* Download Dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full">Generate QR Code</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Download QR Code</AlertDialogTitle>
            <AlertDialogDescription>
              Your QR code has been generated. Choose your preferred format to download.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button variant="outline" className="w-full">
              PNG Format
            </Button>
            <Button variant="outline" className="w-full">
              SVG Format
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}