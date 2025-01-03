import { useFieldArray, Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from 'lucide-react'

interface MenuCreationFormProps {
    control: Control<any>
}

export function MenuCreationForm({ control }: MenuCreationFormProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "menu",
    })

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-md">
                    <FormField
                        control={control}
                        name={`menu.${index}.name`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Dish name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`menu.${index}.description`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe the dish" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`menu.${index}.price`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Remove Item
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: "", description: "", price: 0 })}
            >
                <Plus className="mr-2 h-4 w-4" /> Add Menu Item
            </Button>
        </div>
    )
}

