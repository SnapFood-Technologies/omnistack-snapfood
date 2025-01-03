import { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface BusinessDetailsFormProps {
    control: Control<any>
}

export function BusinessDetailsForm({ control }: BusinessDetailsFormProps) {
    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="businessDetails.name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Restaurant Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your restaurant name" {...field} />
                        </FormControl>
                        <FormDescription>This is how your restaurant will be known on our platform.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="businessDetails.description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Describe your restaurant" {...field} />
                        </FormControl>
                        <FormDescription>Provide a brief description of your restaurant.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="businessDetails.type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Restaurant Type</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Italian, Fast Food, Fine Dining" {...field} />
                        </FormControl>
                        <FormDescription>What type of cuisine or dining experience do you offer?</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

