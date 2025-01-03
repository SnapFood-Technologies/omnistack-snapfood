import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface LocationInfoFormProps {
    control: Control<any>
}

export function LocationInfoForm({ control }: LocationInfoFormProps) {
    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="locationInfo.address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormDescription>Enter the street address of your restaurant.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="locationInfo.city"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="locationInfo.state"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                            <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="locationInfo.zipCode"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                            <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

