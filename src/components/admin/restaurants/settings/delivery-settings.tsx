import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export function DeliverySettings() {
  return (
    <div className="space-y-6">
      {/* Delivery Section */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Time Settings */}
            <div className="space-y-2">
              <Label htmlFor="min-delivery">Minimum Delivery Time (min)</Label>
              <Input 
                id="min-delivery" 
                type="number" 
                defaultValue="15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-delivery">Maximum Delivery Time (min)</Label>
              <Input 
                id="max-delivery" 
                type="number" 
                defaultValue="40"
              />
            </div>

            {/* Delivery Fee Settings */}
            <div className="space-y-2">
              <Label htmlFor="delivery-fee">Delivery Fee ( Lek )</Label>
              <Input 
                id="delivery-fee" 
                type="number" 
                defaultValue="100.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-order">Delivery Minimum Order ( Lek )</Label>
              <Input 
                id="min-order" 
                type="number" 
                defaultValue="500.00"
              />
            </div>

            {/* Additional Settings */}
            <div className="space-y-2">
              <Label htmlFor="delivery-range">Enter maximum Delivery Range in Meters</Label>
              <Input 
                id="delivery-range" 
                type="number" 
                defaultValue="3000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="small-order">Small Order Fee</Label>
              <Input 
                id="small-order" 
                type="number" 
                defaultValue="20.0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pickup Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pickup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pickup Time Settings */}
            <div className="space-y-2">
              <Label htmlFor="min-pickup">Minimum Pickup Time (min)</Label>
              <Input 
                id="min-pickup" 
                type="number" 
                defaultValue="15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-pickup">Maximum Pickup Time (max)</Label>
              <Input 
                id="max-pickup" 
                type="number" 
                defaultValue="40"
              />
            </div>

            {/* Pickup Hours */}
            <div className="space-y-2">
              <Label>Start Pickup</Label>
              <div className="relative">
                <Input 
                  type="text" 
                  defaultValue="11:00"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>End Pickup</Label>
              <div className="relative">
                <Input 
                  type="text" 
                  defaultValue="22:35"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </div>
  );
}

export default DeliverySettings;