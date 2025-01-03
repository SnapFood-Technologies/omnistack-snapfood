import { useFieldArray, Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from 'lucide-react'

interface OperatingHoursFormProps {
    control: Control<any>
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function OperatingHoursForm({ control }: OperatingHoursFormProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "operatingHours",
    })

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-md">
                    <FormField
                        control={control}
                        name={`operatingHours.${index}.day`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Day</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a day" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {daysOfWeek.map((day) => (
                                            <SelectItem key={day} value={day}>
                                                {day}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`operatingHours.${index}.open`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Opening Time</FormLabel>
                                <FormControl>
                                    <input type="time" {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`operatingHours.${index}.close`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Closing Time</FormLabel>
                                <FormControl>
                                    <input type="time" {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Remove Hours
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => append({ day: "", open: "", close: "" })}
            >
                <Plus className="mr-2 h-4 w-4" /> Add Operating Hours
            </Button>
        </div>
    )
}

