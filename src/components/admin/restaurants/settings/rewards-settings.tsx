import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputSelect from "@/components/Common/InputSelect"
import { Clock } from 'lucide-react';

export function RewardsSettings() {
  // Options for different select inputs
  const rewardsTypeOptions = [
    { value: 'none', label: 'None' },
    { value: 'points', label: 'Points' },
    { value: 'discount', label: 'Discount' }
  ];

  const recordsPerPageOptions = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' }
  ];

  return (
    <div className="space-y-6">
      {/* Rewards Type Selection */}
      <Card>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="rewards-type">Rewards/Discount Type</Label>
            <InputSelect
              name="rewardsType"
              label=""
              value="none"
              onChange={() => {}}
              options={rewardsTypeOptions}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rewards Rate Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Reservation Rewards Rate Setting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Rate Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rewards-rate">Rewards Rate *</Label>
              <Input id="rewards-rate" type="number" />
            </div>
            <div className="space-y-2">
              <Label>From *</Label>
              <div className="relative">
                <Input type="text" defaultValue="1:45" />
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
              <Label>To *</Label>
              <div className="relative">
                <Input type="text" defaultValue="1:45" />
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

          <Button variant="outline">Add New</Button>

          {/* Rewards Times Table */}
          <div className="border rounded-md">
            <div className="flex items-center p-4 bg-muted/50">
              <div className="flex items-center gap-2">
                <InputSelect
                  name="recordsPerPage"
                  label=""
                  value="10"
                  onChange={() => {}}
                  options={recordsPerPageOptions}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">records</span>
              </div>
              <div className="ml-auto">
                <Input
                  placeholder="Search..."
                  className="w-48"
                />
              </div>
            </div>

            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Nr</th>
                    <th className="pb-2">From</th>
                    <th className="pb-2">To</th>
                    <th className="pb-2">Rewards Rate</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <td colSpan={5} className="py-4 text-muted-foreground">
                      No data available in table
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-sm text-muted-foreground mt-2">
                Showing 0 to 0 of 0 entries
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discount Rate Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Reservation Discount Rate Setting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Discount Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount-rate">Discount Rate *</Label>
              <Input id="discount-rate" type="number" />
            </div>
            <div className="space-y-2">
              <Label>From *</Label>
              <div className="relative">
                <Input type="text" defaultValue="1:45" />
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
              <Label>To *</Label>
              <div className="relative">
                <Input type="text" defaultValue="1:45" />
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

          <Button variant="outline">Add New</Button>

          {/* Discount Times Table */}
          <div className="border rounded-md">
            <div className="flex items-center p-4 bg-muted/50">
              <div className="flex items-center gap-2">
                <InputSelect
                  name="recordsPerPage"
                  label=""
                  value="10"
                  onChange={() => {}}
                  options={recordsPerPageOptions}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">records</span>
              </div>
              <div className="ml-auto">
                <Input
                  placeholder="Search..."
                  className="w-48"
                />
              </div>
            </div>

            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Nr</th>
                    <th className="pb-2">From</th>
                    <th className="pb-2">To</th>
                    <th className="pb-2">Discount Rate</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <td colSpan={5} className="py-4 text-muted-foreground">
                      No data available in table
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-sm text-muted-foreground mt-2">
                Showing 0 to 0 of 0 entries
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RewardsSettings;