import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputSelect from "@/components/Common/InputSelect"
import { Upload, X } from 'lucide-react';

export function RestaurantInfo() {
  // Image preview states
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    title: 'Te Komuna',
    address: 'Rruga Tish Daija',
    partner: 'Te Komuna',
    country: 'shqiperi',
    categories: ['pizza', 'mediterranean'],
    vendorType: 'restaurant',
    deliveryType: 'snapfood',
    orderMethod: 'both',
    defaultOrder: 'delivery',
    phone: '0694792408',
    profileImage: null as File | null,
    coverImage: null as File | null,
  });

  // Options for different select inputs
  const categoryOptions = [
    { value: 'pizza', label: 'Pizza' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'sushi', label: 'Sushi' },
    { value: 'burger', label: 'Burger' },
    { value: 'pasta', label: 'Pasta' },
    { value: 'meat', label: 'Meat' }
  ];

  const countryOptions = [
    { value: 'shqiperi', label: 'Shqiperi' }
  ];

  const vendorTypeOptions = [
    { value: 'restaurant', label: 'Restaurant' }
  ];

  const deliveryTypeOptions = [
    { value: 'snapfood', label: 'Snapfood Delivery' }
  ];

  const orderMethodOptions = [
    { value: 'both', label: 'Delivery and Pickup and Reserve' }
  ];

  const defaultOrderOptions = [
    { value: 'delivery', label: 'Delivery' }
  ];

  // Image upload handlers
  const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, coverImage: file }));
    }
  };

  // Remove image handlers
  const handleRemoveProfile = () => {
    setProfilePreview(null);
    setFormData(prev => ({ ...prev, profileImage: null }));
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    setFormData(prev => ({ ...prev, coverImage: null }));
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-6">
        {/* Title & Address Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input 
              id="title" 
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Restaurant name" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input 
              id="address" 
              value={formData.address}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Street address" 
            />
          </div>
        </div>

        {/* Restaurant Images Section */}
        <div className="space-y-4">
          <Label>Restaurant Images</Label>
          
          {/* Profile Picture Upload */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Profile Picture</Label>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {profilePreview ? (
                  <div className="relative">
                    <img
                      src={profilePreview}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive hover:bg-destructive/90"
                      onClick={handleRemoveProfile}
                    >
                      <X className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileUpload}
                  className="hidden"
                  id="profile-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("profile-upload")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Profile Picture
                </Button>
                <p className="text-sm text-muted-foreground">
                  Recommended: Square image, at least 300x300px
                </p>
              </div>
            </div>
          </div>

          {/* Cover Photo Upload */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Cover Photo</Label>
            <div className="space-y-4">
              {coverPreview ? (
                <div className="relative">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-48 rounded-lg object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-destructive hover:bg-destructive/90"
                    onClick={handleRemoveCover}
                  >
                    <X className="h-4 w-4 text-white" />
                  </Button>
                </div>
              ) : (
                <div className="w-full h-48 rounded-lg bg-muted flex flex-col items-center justify-center border-2 border-dashed">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No cover photo uploaded</p>
                </div>
              )}
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                  id="cover-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("cover-upload")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Cover Photo
                </Button>
                <p className="text-sm text-muted-foreground">
                  Recommended: 1200x400px or larger, 3:1 ratio
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Partner & Country Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="partner">Partner</Label>
            <Input id="partner" value={formData.partner} readOnly className="bg-gray-50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <InputSelect
              name="country"
              label=""
              value={formData.country}
              onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
              options={countryOptions}
            />
          </div>
        </div>

        {/* Food Categories Section */}
        <div className="space-y-2">
          <Label>Food Categories *</Label>
          <InputSelect
            name="categories"
            label=""
            value={formData.categories}
            onChange={(value) => setFormData(prev => ({ ...prev, categories: value }))}
            options={categoryOptions}
            multiple
          />
          <p className="text-sm text-muted-foreground">
            Select multiple food categories for your restaurant
          </p>
        </div>

        {/* Vendor Type & Delivery Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vendor-type">Vendor Type *</Label>
            <InputSelect
              name="vendorType"
              label=""
              value={formData.vendorType}
              onChange={(value) => setFormData(prev => ({ ...prev, vendorType: value }))}
              options={vendorTypeOptions}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery-type">Vendor Delivery Type *</Label>
            <InputSelect
              name="deliveryType"
              label=""
              value={formData.deliveryType}
              onChange={(value) => setFormData(prev => ({ ...prev, deliveryType: value }))}
              options={deliveryTypeOptions}
            />
          </div>
        </div>

        {/* Order Method & Default Order Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="order-method">Order Method *</Label>
            <InputSelect
              name="orderMethod"
              label=""
              value={formData.orderMethod}
              onChange={(value) => setFormData(prev => ({ ...prev, orderMethod: value }))}
              options={orderMethodOptions}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="default-order">Default Order Method *</Label>
            <InputSelect
              name="defaultOrder"
              label=""
              value={formData.defaultOrder}
              onChange={(value) => setFormData(prev => ({ ...prev, defaultOrder: value }))}
              options={defaultOrderOptions}
            />
          </div>
        </div>

        {/* Phone Number Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number *</Label>
            <Input 
              id="phone" 
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">e.g: 0691234567</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default RestaurantInfo;