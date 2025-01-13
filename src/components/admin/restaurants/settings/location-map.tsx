import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

export function LocationMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Controls */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Map</Button>
          <Button variant="outline" size="sm">Satellite</Button>
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search Box"
              className="pl-8"
            />
          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-96 rounded-md overflow-hidden border border-input">
          {/* This would be replaced with actual Google Maps integration */}
          <div className="absolute inset-0 bg-muted">
            <img 
              src="/api/placeholder/800/400" 
              alt="Map of restaurant location"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="h-8 w-8 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">
                  Map centered on Tirana, Albania
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

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit">Save Location</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default LocationMap;