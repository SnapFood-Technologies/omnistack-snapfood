"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Trash2, Upload, ExternalLink, Loader2, Save } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export function LandingPageEditor({ restaurantId, restaurant }: { 
    restaurantId: string, 
    restaurant: any // Ideally type this properly
  }) {
  const { toast } = useToast()
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Landing page data
  const [landingPage, setLandingPage] = useState({
    isActive: true,
    title: "",
    subtitle: "",
    description: "",
    wifiCode: "",
    preparationTime: "",
    googleReviewLink: "",
    appDeepLink: "",
    logoPath: "",
    backgroundImage: "",
    popularItems: [],
    reviews: [],
    testimonials: [],
    stats: []
  })
  
  // File upload state
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null)
  
  // Load landing page data
  useEffect(() => {
    async function loadLandingPage() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/restaurants/${restaurantId}/landing-page`)
        
        if (response.ok) {
          const data = await response.json()

           // If app deep link is not set, pre-fill it
           if (!data.appDeepLink && restaurant) {
            data.appDeepLink = `https://reward.snapfood.al/referral/?link=https://snapfood.al/reward?restaurantId=${restaurant.externalSnapfoodId || ''}&apn=com.snapfood.app&isi=1314003561&ibi=com.snapfood.al`;
          }
          

          setLandingPage(data)
          
          // Set previews if images exist
          if (data.logoPath) {
            setLogoPreview(data.logoPath)
          }
          if (data.backgroundImage) {
            setBackgroundPreview(data.backgroundImage)
          }
        } else {
           const defaultData = {
            isActive: true,
            title: restaurant?.name || "",
            subtitle: "",
            description: "",
            wifiCode: "",
            preparationTime: "",
            googleReviewLink: "",
            appDeepLink: `https://reward.snapfood.al/referral/?link=https://snapfood.al/reward?restaurantId=${restaurant?.externalSnapfoodId || ''}&apn=com.snapfood.app&isi=1314003561&ibi=com.snapfood.al`,
            logoPath: "",
            backgroundImage: "",
            popularItems: [],
            reviews: [],
            testimonials: [],
            stats: []
          };
          setLandingPage(defaultData);
        }
      } catch (error) {
        console.error("Error loading landing page:", error)
        toast({
          title: "Error",
          description: "Failed to load landing page data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadLandingPage()
  }, [restaurantId, toast])
  
  // Handle file uploads
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setLogoFile(file)
    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)
  }
  
  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setBackgroundFile(file)
    const previewUrl = URL.createObjectURL(file)
    setBackgroundPreview(previewUrl)
  }
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLandingPage(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSwitchChange = (checked: boolean) => {
    setLandingPage(prev => ({
      ...prev,
      isActive: checked
    }))
  }
  
  // Handle popular items
  const addPopularItem = () => {
    setLandingPage(prev => ({
      ...prev,
      popularItems: [
        ...prev.popularItems,
        {
          id: `temp-${Date.now()}`,
          title: "",
          price: 0,
          description: "",
          imagePath: "",
          isActive: true,
          order: prev.popularItems.length
        }
      ]
    }))
  }
  
  const updatePopularItem = (index: number, field: string, value: any) => {
    setLandingPage(prev => {
      const updatedItems = [...prev.popularItems]
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: field === 'price' ? parseFloat(value) : value
      }
      return {
        ...prev,
        popularItems: updatedItems
      }
    })
  }
  
  const removePopularItem = (index: number) => {
    setLandingPage(prev => {
      const updatedItems = [...prev.popularItems]
      updatedItems.splice(index, 1)
      return {
        ...prev,
        popularItems: updatedItems
      }
    })
  }
  
  // Handle reviews
  const addReview = () => {
    setLandingPage(prev => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        {
          id: `temp-${Date.now()}`,
          name: "",
          title: "",
          content: "",
          rating: 5.0,
          isActive: true,
          order: prev.reviews.length
        }
      ]
    }))
  }
  
  const updateReview = (index: number, field: string, value: any) => {
    setLandingPage(prev => {
      const updatedReviews = [...prev.reviews]
      updatedReviews[index] = {
        ...updatedReviews[index],
        [field]: field === 'rating' ? parseFloat(value) : value
      }
      return {
        ...prev,
        reviews: updatedReviews
      }
    })
  }
  
  const removeReview = (index: number) => {
    setLandingPage(prev => {
      const updatedReviews = [...prev.reviews]
      updatedReviews.splice(index, 1)
      return {
        ...prev,
        reviews: updatedReviews
      }
    })
  }
  
  // Handle testimonials
  const addTestimonial = () => {
    setLandingPage(prev => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          id: `temp-${Date.now()}`,
          content: "",
          isActive: true,
          order: prev.testimonials.length
        }
      ]
    }))
  }
  
  const updateTestimonial = (index: number, field: string, value: any) => {
    setLandingPage(prev => {
      const updatedTestimonials = [...prev.testimonials]
      updatedTestimonials[index] = {
        ...updatedTestimonials[index],
        [field]: value
      }
      return {
        ...prev,
        testimonials: updatedTestimonials
      }
    })
  }
  
  const removeTestimonial = (index: number) => {
    setLandingPage(prev => {
      const updatedTestimonials = [...prev.testimonials]
      updatedTestimonials.splice(index, 1)
      return {
        ...prev,
        testimonials: updatedTestimonials
      }
    })
  }
  
  // Handle stats
  const addStat = () => {
    setLandingPage(prev => ({
      ...prev,
      stats: [
        ...prev.stats,
        {
          id: `temp-${Date.now()}`,
          title: "",
          value: "",
          isActive: true,
          order: prev.stats.length
        }
      ]
    }))
  }
  
  const updateStat = (index: number, field: string, value: any) => {
    setLandingPage(prev => {
      const updatedStats = [...prev.stats]
      updatedStats[index] = {
        ...updatedStats[index],
        [field]: value
      }
      return {
        ...prev,
        stats: updatedStats
      }
    })
  }
  
  const removeStat = (index: number) => {
    setLandingPage(prev => {
      const updatedStats = [...prev.stats]
      updatedStats.splice(index, 1)
      return {
        ...prev,
        stats: updatedStats
      }
    })
  }
  
  // Handle drag and drop reordering
  const handleDragEnd = (result: any, listName: string) => {
    if (!result.destination) return
    
    const items = Array.from(landingPage[listName])
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    // Update the order property for each item
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index
    }))
    
    setLandingPage(prev => ({
      ...prev,
      [listName]: reorderedItems
    }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // First upload images if needed
      let logoUrl = landingPage.logoPath
      let backgroundUrl = landingPage.backgroundImage
      
      if (logoFile) {
        const formData = new FormData()
        formData.append('file', logoFile)
        formData.append('restaurantId', restaurantId)
        formData.append('type', 'logo')
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (uploadResponse.ok) {
          const data = await uploadResponse.json()
          logoUrl = data.url
        } else {
          throw new Error('Failed to upload logo')
        }
      }
      
      if (backgroundFile) {
        const formData = new FormData()
        formData.append('file', backgroundFile)
        formData.append('restaurantId', restaurantId)
        formData.append('type', 'background')
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (uploadResponse.ok) {
          const data = await uploadResponse.json()
          backgroundUrl = data.url
        } else {
          throw new Error('Failed to upload background image')
        }
      }
      
      // Now save landing page data
      const response = await fetch(`/api/restaurants/${restaurantId}/landing-page`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...landingPage,
          logoPath: logoUrl,
          backgroundImage: backgroundUrl
        })
      })
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Landing page saved successfully",
        })
      } else {
        throw new Error('Failed to save landing page')
      }
    } catch (error) {
      console.error("Error saving landing page:", error)
      toast({
        title: "Error",
        description: "Failed to save landing page",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  // Handle preview button click
  const handlePreview = () => {
    // Open the landing page in a new tab using hashId directly from props
    window.open(`https://snapfood.al/landing/${restaurant.hashId}/Delivery`, '_blank')
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Landing Page Customization - {restaurant.name} </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your restaurant landing page that customers will see when scanning your QR code
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={landingPage.isActive}
              onCheckedChange={handleSwitchChange}
              id="landing-active"
            />
            <Label htmlFor="landing-active">Active</Label>
          </div>
          <Button variant="outline" onClick={handlePreview}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="popular-items">Popular Items</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        
        {/* General Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
                 <div className="mb-4">
                <h2 className="text-lg font-bold tracking-tight">Basic Information</h2>
                <p className="text-sm text-muted-foreground mt-0">
                Set the title, subtitle, and description for your landing page
                </p>
            </div>
             
            
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={landingPage.title || ''}
                    onChange={handleInputChange}
                    placeholder="Restaurant Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    value={landingPage.subtitle || ''}
                    onChange={handleInputChange}
                    placeholder="A short tagline for your restaurant"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={landingPage.description || ''}
                  onChange={handleInputChange}
                  placeholder="A description of your restaurant"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>

            <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight">Additional Information</h2>
        <p className="text-sm text-muted-foreground mt-0">
        Provide additional details for your landing page
        </p>
      </div>
             
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wifiCode">WiFi Code</Label>
                  <Input
                    id="wifiCode"
                    name="wifiCode"
                    value={landingPage.wifiCode || ''}
                    onChange={handleInputChange}
                    placeholder="Your restaurant WiFi code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preparationTime">Preparation Time (minutes)</Label>
                  <Input
                    id="preparationTime"
                    name="preparationTime"
                    value={landingPage.preparationTime || ''}
                    onChange={handleInputChange}
                    placeholder="20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="googleReviewLink">Google Review Link</Label>
                  <Input
                    id="googleReviewLink"
                    name="googleReviewLink"
                    value={landingPage.googleReviewLink || ''}
                    onChange={handleInputChange}
                    placeholder="https://g.page/r/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appDeepLink">App Deep Link</Label>
                  <Input
                    id="appDeepLink"
                    name="appDeepLink"
                    value={landingPage.appDeepLink || ''}
                    onChange={handleInputChange}
                    placeholder="https://snapfood.al/restaurant/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
            <div className="mb-4">
                <h2 className="text-lg font-bold tracking-tight">Images</h2>
                <p className="text-sm text-muted-foreground mt-0">
                Upload logo and background images for your landing page
                </p>
            </div>
            
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="logo-upload">Logo Image</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 h-48">
                    {logoPreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="object-contain w-full h-full"
                        />
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="absolute top-0 right-0 m-2"
                          onClick={() => {
                            setLogoPreview(null)
                            setLogoFile(null)
                            setLandingPage(prev => ({...prev, logoPath: ""}))
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                          Select file
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="background-upload">Background Image</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 h-48">
                    {backgroundPreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={backgroundPreview} 
                          alt="Background preview" 
                          className="object-cover w-full h-full rounded-md"
                        />
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="absolute top-0 right-0 m-2"
                          onClick={() => {
                            setBackgroundPreview(null)
                            setBackgroundFile(null)
                            setLandingPage(prev => ({...prev, backgroundImage: ""}))
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <Input
                          id="background-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleBackgroundUpload}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => document.getElementById('background-upload')?.click()}
                        >
                          Select file
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Popular Items Tab */}
        <TabsContent value="popular-items" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="mb-4">
                <h2 className="text-lg font-bold tracking-tight">Popular Items</h2>
                <p className="text-sm text-muted-foreground mt-0">
                Add the most popular items from your menu
                </p>
            </div>
              
              <Button onClick={addPopularItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'popularItems')}>
                <Droppable droppableId="popular-items-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {landingPage.popularItems.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No popular items added yet. Click "Add Item" to get started.</p>
                        </div>
                      ) : (
                        landingPage.popularItems.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border rounded-md p-4"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <h3 className="font-medium">Item #{index + 1}</h3>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={item.isActive}
                                      onCheckedChange={(checked) => updatePopularItem(index, 'isActive', checked)}
                                      id={`item-active-${index}`}
                                    />
                                    <Label htmlFor={`item-active-${index}`}>Active</Label>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removePopularItem(index)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`item-title-${index}`}>Title</Label>
                                    <Input
                                      id={`item-title-${index}`}
                                      value={item.title || ''}
                                      onChange={(e) => updatePopularItem(index, 'title', e.target.value)}
                                      placeholder="Item name"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`item-price-${index}`}>Price</Label>
                                    <Input
                                      id={`item-price-${index}`}
                                      type="number"
                                      step="0.01"
                                      value={item.price || ''}
                                      onChange={(e) => updatePopularItem(index, 'price', e.target.value)}
                                      placeholder="0.00"
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`item-description-${index}`}>Description</Label>
                                  <Textarea
                                    id={`item-description-${index}`}
                                    value={item.description || ''}
                                    onChange={(e) => updatePopularItem(index, 'description', e.target.value)}
                                    placeholder="Item description"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
            <div className="mb-4">
                <h2 className="text-lg font-bold tracking-tight">Customer Reviews</h2>
                <p className="text-sm text-muted-foreground mt-0">
                Add customer reviews to showcase on your landing page
                </p>
            </div>
             
              <Button onClick={addReview}>
                <Plus className="mr-2 h-4 w-4" />
                Add Review
              </Button>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'reviews')}>
                <Droppable droppableId="reviews-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {landingPage.reviews.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No reviews added yet. Click "Add Review" to get started.</p>
                        </div>
                      ) : (
                        landingPage.reviews.map((review, index) => (
                          <Draggable key={review.id} draggableId={review.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border rounded-md p-4"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <h3 className="font-medium">Review #{index + 1}</h3>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={review.isActive}
                                      onCheckedChange={(checked) => updateReview(index, 'isActive', checked)}
                                      id={`review-active-${index}`}
                                    />
                                    <Label htmlFor={`review-active-${index}`}>Active</Label>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeReview(index)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`review-name-${index}`}>Customer Name</Label>
                                    <Input
                                      id={`review-name-${index}`}
                                      value={review.name || ''}
                                      onChange={(e) => updateReview(index, 'name', e.target.value)}
                                      placeholder="Customer name"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`review-rating-${index}`}>Rating (1-5)</Label>
                                    <Input
                                      id={`review-rating-${index}`}
                                      type="number"
                                      min="1"
                                      max="5"
                                      step="0.1"
                                      value={review.rating || '5.0'}
                                      onChange={(e) => updateReview(index, 'rating', e.target.value)}
                                      placeholder="5.0"
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                  <Label htmlFor={`review-title-${index}`}>Review Title</Label>
                                  <Input
                                    id={`review-title-${index}`}
                                    value={review.title || ''}
                                    onChange={(e) => updateReview(index, 'title', e.target.value)}
                                    placeholder="Review title"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`review-content-${index}`}>Review Content</Label>
                                  <Textarea
                                    id={`review-content-${index}`}
                                    value={review.content || ''}
                                    onChange={(e) => updateReview(index, 'content', e.target.value)}
                                    placeholder="Review content"
                                    rows={3}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Testimonials Tab */}
        <TabsContent value="testimonials" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
            <div className="mb-4">
                <h2 className="text-lg font-bold tracking-tight">Testimonials</h2>
                <p className="text-sm text-muted-foreground mt-0">
                Add testimonial quotes to showcase on your landing page
                </p>
            </div>
             
              <Button onClick={addTestimonial}>
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'testimonials')}>
                <Droppable droppableId="testimonials-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {landingPage.testimonials.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No testimonials added yet. Click "Add Testimonial" to get started.</p>
                        </div>
                      ) : (
                        landingPage.testimonials.map((testimonial, index) => (
                          <Draggable key={testimonial.id} draggableId={testimonial.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border rounded-md p-4"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <h3 className="font-medium">Testimonial #{index + 1}</h3>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={testimonial.isActive}
                                      onCheckedChange={(checked) => updateTestimonial(index, 'isActive', checked)}
                                      id={`testimonial-active-${index}`}
                                    />
                                    <Label htmlFor={`testimonial-active-${index}`}>Active</Label>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeTestimonial(index)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`testimonial-content-${index}`}>Testimonial Content</Label>
                                  <Textarea
                                    id={`testimonial-content-${index}`}
                                    value={testimonial.content || ''}
                                    onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                                    placeholder="Testimonial content"
                                    rows={3}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
            <div className="mb-4">
                <h2 className="text-lg font-bold tracking-tight">Statistics</h2>
                <p className="text-sm text-muted-foreground mt-0">
                Add impressive statistics about your restaurant
                </p>
            </div>
             
              <Button onClick={addStat}>
                <Plus className="mr-2 h-4 w-4" />
                Add Statistic
              </Button>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'stats')}>
                <Droppable droppableId="stats-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {landingPage.stats.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No statistics added yet. Click "Add Statistic" to get started.</p>
                        </div>
                      ) : (
                        landingPage.stats.map((stat, index) => (
                          <Draggable key={stat.id} draggableId={stat.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border rounded-md p-4"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <h3 className="font-medium">Statistic #{index + 1}</h3>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={stat.isActive}
                                      onCheckedChange={(checked) => updateStat(index, 'isActive', checked)}
                                      id={`stat-active-${index}`}
                                    />
                                    <Label htmlFor={`stat-active-${index}`}>Active</Label>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeStat(index)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`stat-title-${index}`}>Title</Label>
                                    <Input
                                      id={`stat-title-${index}`}
                                      value={stat.title || ''}
                                      onChange={(e) => updateStat(index, 'title', e.target.value)}
                                      placeholder="e.g., Orders per week"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`stat-value-${index}`}>Value</Label>
                                    <Input
                                      id={`stat-value-${index}`}
                                      value={stat.value || ''}
                                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                                      placeholder="e.g., 500+"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="h-8"></div>
    </div>
  )
}