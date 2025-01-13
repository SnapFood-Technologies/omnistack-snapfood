"use client"

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputSelect from "@/components/Common/InputSelect"
import { MapPin, Search } from 'lucide-react';

interface ZoneDetails {
  minDeliveryTime: string;
  maxDeliveryTime: string;
  deliveryFee: string;
  minimumOrder: string;
  smallOrderFee: string;
}

export function DeliveryZones() {
  // Number of active zones (1-7)
  const [activeZones, setActiveZones] = useState<number>(4);
  
  // Zone details state
  const [zoneDetails, setZoneDetails] = useState<Record<number, ZoneDetails>>({
    1: {
      minDeliveryTime: '15',
      maxDeliveryTime: '25',
      deliveryFee: '100.00',
      minimumOrder: '500.00',
      smallOrderFee: '20.0'
    },
    2: {
      minDeliveryTime: '20',
      maxDeliveryTime: '30',
      deliveryFee: '150.00',
      minimumOrder: '600.00',
      smallOrderFee: '20.0'
    },
    3: {
      minDeliveryTime: '25',
      maxDeliveryTime: '35',
      deliveryFee: '200.00',
      minimumOrder: '600.00',
      smallOrderFee: '30.0'
    },
    4: {
      minDeliveryTime: '30',
      maxDeliveryTime: '35',
      deliveryFee: '250.00',
      minimumOrder: '1000.00',
      smallOrderFee: '50.0'
    }
  });

  // Zone selection options
  const zoneOptions = [
    { value: '1', label: '1 (Zone)' },
    { value: '2', label: '2 (Zones)' },
    { value: '3', label: '3 (Zones)' },
    { value: '4', label: '4 (Zones)' },
    { value: '5', label: '5 (Zones)' },
    { value: '6', label: '6 (Zones)' },
    { value: '7', label: '7 (Zones)' }
  ];

  // Handle zone detail updates
  const handleZoneDetailChange = (
    zoneNumber: number,
    field: keyof ZoneDetails,
    value: string
  ) => {
    setZoneDetails(prev => ({
      ...prev,
      [zoneNumber]: {
        ...prev[zoneNumber],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">DELIVERY ZONES</h2>
      </div>

      {/* Zone Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label className="text-base">
              Determine number of zones* (Minimum Allowed: 1 Zone | Maximum Allowed: 7 Zones)
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((zoneNum) => (
                <Button
                  key={zoneNum}
                  variant={activeZones >= zoneNum ? "default" : "outline"}
                  className={`${
                    zoneNum === 1 ? 'bg-cyan-500' :
                    zoneNum === 2 ? 'bg-orange-500' :
                    zoneNum === 3 ? 'bg-green-600' :
                    'bg-purple-600'
                  } ${activeZones >= zoneNum ? '' : '!bg-transparent'}`}
                  onClick={() => setActiveZones(zoneNum)}
                >
                  Zone {zoneNum}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputSelect
                name="zoneCount"
                label=""
                value={activeZones.toString()}
                onChange={(value) => setActiveZones(parseInt(value))}
                options={zoneOptions}
              />
              <Input className='mt-2' placeholder="Search for a location..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone Details */}
      <Card>
        <CardContent className="pt-6">
          <Label className="text-base mb-4 block">Zone Delivery Details*</Label>
          
          <div className="space-y-6">
            {Array.from({ length: activeZones }, (_, i) => i + 1).map((zoneNum) => (
              <div key={zoneNum} className="grid grid-cols-5 gap-4">
                <div className="col-span-5 mt-6 md:col-span-1">
                  <Button
                    variant="outline"
                    className={`w-full ${
                      zoneNum === 1 ? 'bg-cyan-500' :
                      zoneNum === 2 ? 'bg-orange-500' :
                      zoneNum === 3 ? 'bg-green-600' :
                      'bg-purple-600'
                    } text-white`}
                  >
                    Zone {zoneNum}
                  </Button>
                </div>
                <div className="col-span-5 md:col-span-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label className="text-sm">Min Delivery Time (min)</Label>
                    <Input
                      type="text"
                      value={zoneDetails[zoneNum]?.minDeliveryTime}
                      onChange={(e) => handleZoneDetailChange(zoneNum, 'minDeliveryTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Max Delivery Time (min)</Label>
                    <Input
                      type="text"
                      value={zoneDetails[zoneNum]?.maxDeliveryTime}
                      onChange={(e) => handleZoneDetailChange(zoneNum, 'maxDeliveryTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Delivery Fee (Lek)</Label>
                    <Input
                      type="text"
                      value={zoneDetails[zoneNum]?.deliveryFee}
                      onChange={(e) => handleZoneDetailChange(zoneNum, 'deliveryFee', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Minimum Order (Lek)</Label>
                    <Input
                      type="text"
                      value={zoneDetails[zoneNum]?.minimumOrder}
                      onChange={(e) => handleZoneDetailChange(zoneNum, 'minimumOrder', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Small Order Fee</Label>
                    <Input
                      type="text"
                      value={zoneDetails[zoneNum]?.smallOrderFee}
                      onChange={(e) => handleZoneDetailChange(zoneNum, 'smallOrderFee', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map Section */}
      <Card>
        <CardContent className="pt-6">
          <Label className="text-base mb-4 block">Delivery Zones Map*</Label>
          
          {/* Map Controls */}
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm">Map</Button>
            <Button variant="outline" size="sm">Satellite</Button>
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search Box" className="pl-8" />
            </div>
          </div>

          {/* Map Container */}
          <div className="relative w-full h-[600px] rounded-md overflow-hidden border">
            {/* This would be replaced with actual Google Maps integration */}
            <div className="absolute inset-0 bg-muted">
              <img 
                src="/api/placeholder/1200/600"
                alt="Map showing delivery zones"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-8 w-8 mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Interactive map with delivery zones
                  </p>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute right-4 bottom-4 flex flex-col gap-2">
              <Button size="icon" variant="outline" className="bg-background">
                <span>+</span>
              </Button>
              <Button size="icon" variant="outline" className="bg-background">
                <span>−</span>
              </Button>
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

export default DeliveryZones;