// components/admin/restaurants/menu/manage-menu.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import InputSelect from "@/components/Common/InputSelect"
import { MoreVertical, PenIcon, Plus, Settings2, Trash2Icon } from "lucide-react"
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Category {
  id: string
  title: string
  description: string
  products: Product[]
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  isAvailable: boolean
}

const DUMMY_CATEGORIES = [
  {
    id: "1",
    title: "SUPE",
    description: "",
    products: [
      {
        id: "1",
        title: "SUPË PULE E PATATE",
        description: "Empty",
        price: 260,
        isAvailable: true
      },
      {
        id: "2",
        title: "SUPË QIQRA",
        description: "Empty",
        price: 260,
        isAvailable: true
      }
    ]
  },
  {
    id: "2",
    title: "SALATA & VEGGIE BOWL",
    description: "",
    products: [
      {
        id: "3",
        title: "SALLATË CEASAR",
        description: "Sallatë jeshile, fileto pule, krutonë, salcë caesar",
        price: 530,
        isAvailable: true
      }
    ]
  }
]

export function ManageMenu() {
  const [categories, setCategories] = useState<Category[]>(DUMMY_CATEGORIES)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openAddProductModal, setOpenAddProductModal] = useState(false)
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false)

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight">Menu</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Manage your menu categories and products structure
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => setOpenAddCategoryModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
          <Button variant="outline">
            <Settings2 className="mr-2 h-4 w-4" /> Menu Settings
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          {categories.length} Categories • {categories.reduce((acc, cat) => acc + cat.products.length, 0)} Products
        </span>
      </div>

      {/* Categories with Products */}
      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-visible group">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {category.title}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({category.products.length} items)
                  </span>
                </CardTitle>
                {category.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setOpenAddProductModal(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-muted"
                    >
                    <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    align="end" 
                    className="w-[200px] bg-white border shadow-md"
                >
                    <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                    <PenIcon className="mr-2 h-4 w-4" /> Edit Category
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-red-50 text-destructive">
                    <Trash2Icon className="mr-2 h-4 w-4" /> Delete Category
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {category.products.map((product) => (
                    <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                    <div className="flex-1 min-w-0 mr-4">
                        <h4 className="font-medium">{product.title}</h4>
                        <p className="text-sm text-muted-foreground">
                        {product.description === "Empty" ? "No description available" : product.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-base font-semibold tabular-nums">
                        {product.price.toLocaleString()} Lekë
                        </span>
                        <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                            <PenIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-destructive hover:text-destructive">
                            <Trash2Icon className="h-4 w-4" />
                        </Button>
                        </div>
                    </div>
                    </div>
                ))}
                {category.products.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No products in this category yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Product Modal */}
      <Dialog open={openAddProductModal} onOpenChange={setOpenAddProductModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Products</DialogTitle>
            <DialogDescription>
              Select products to add to "{categories.find(c => c.id === selectedCategory)?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="font-medium">Select Products</Label>
              <InputSelect
                name="products"
                label=""
                value=""
                onChange={() => {}}
                options={[
                  { value: "sashimi-levrek", label: "Sashimi Levrek" },
                  { value: "sashimi-salmon", label: "Sashimi Salmon" },
                  { value: "nigiri-tuna", label: "Nigiri Tuna" },
                ]}
                multiple
              />
              <p className="text-xs text-muted-foreground">
                You can select multiple products to add
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddProductModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Selected Products</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Modal */}
      <Dialog open={openAddCategoryModal} onOpenChange={setOpenAddCategoryModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Add a new category and optionally select products
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="font-medium">Category</Label>
              <InputSelect
                name="category"
                label=""
                value=""
                onChange={() => {}}
                options={[
                  { value: "appetizers", label: "Appetizers" },
                  { value: "main-course", label: "Main Course" },
                  { value: "desserts", label: "Desserts" },
                ]}
              />
            </div>
            <div className="grid gap-2">
              <Label className="font-medium">Products (Optional)</Label>
              <InputSelect
                name="products"
                label=""
                value=""
                onChange={() => {}}
                options={[
                  { value: "product-1", label: "Product 1" },
                  { value: "product-2", label: "Product 2" },
                  { value: "product-3", label: "Product 3" },
                ]}
                multiple
              />
              <p className="text-xs text-muted-foreground">
                You can add products later as well
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddCategoryModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}