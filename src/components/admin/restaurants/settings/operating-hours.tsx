import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, X } from 'lucide-react';

export function OperatingHours() {
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const defaultTimes = {
    open: '11:00',
    close: '22:45'
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Opening and Closing days</h3>
          
          <div className="space-y-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center space-x-8">
                <div className="w-32 flex items-center space-x-2">
                  <Checkbox id={day} defaultChecked />
                  <label htmlFor={day} className="text-sm font-medium">
                    {day}
                  </label>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-sm text-muted-foreground mb-1 block">
                      Open:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        defaultValue={defaultTimes.open}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
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

                  <div className="relative">
                    <label className="text-sm text-muted-foreground mb-1 block">
                      Close:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        defaultValue={defaultTimes.close}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
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

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OperatingHours;