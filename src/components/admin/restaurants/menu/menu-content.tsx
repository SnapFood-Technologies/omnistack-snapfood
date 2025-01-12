// components/admin/restaurants/menu/menu-content.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Upload } from "lucide-react"
import { MenuPreview } from "./preview/menu-preview"
import { cn } from "@/lib/utils"
import InputSelect from "@/components/Common/InputSelect"

interface Category {
  id: string
  title: string
  description?: string
  isActive: boolean
  order: number
}

interface Product {
  id: string
  image?: string
  title: string
  description: string
  price: number
  isPopular: boolean
  nepsOrder: boolean
  isAvailable: boolean
  categoryId: string
}

// Dummy data
const dummyCategories: Category[] = [
  {
    id: "1",
    title: "Sushi",
    description: "Fresh and authentic Japanese sushi",
    isActive: true,
    order: 1
  },
  {
    id: "2",
    title: "Salads",
    description: "Healthy and fresh salads",
    isActive: true,
    order: 2
  },
  {
    id: "3",
    title: "Main Course",
    description: "Delicious main dishes",
    isActive: true,
    order: 3
  },
  {
    id: "4",
    title: "Desserts",
    description: "Sweet treats and desserts",
    isActive: false,
    order: 4
  }
]

const dummyProducts: Product[] = [
  {
    id: "1",
    title: "California Roll",
    description: "Crab, avocado, cucumber",
    price: 1200,
    isPopular: true,
    isAvailable: true,
    nepsOrder: true,
    categoryId: "1",
    image: "/images/dummy/pizza-dummy.jpg"
  },
  {
    id: "2",
    title: "Greek Salad",
    description: "Feta cheese, olives, tomatoes",
    price: 950,
    isPopular: false,
    nepsOrder: true,
    isAvailable: true,
    categoryId: "2"
  },
  {
    id: "3",
    title: "Grilled Salmon",
    description: "Fresh salmon with vegetables",
    price: 2200,
    isPopular: true,
    nepsOrder: false,
    isAvailable: true,
    categoryId: "3",
    image: "/images/dummy/pizza-dummy.jpg"
  }
]

export function MenuContent() {
  const [categories, setCategories] = useState<Category[]>(dummyCategories)
  const [products, setProducts] = useState<Product[]>(dummyProducts)
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const [openProductModal, setOpenProductModal] = useState(false)
  const [openDeleteProductDialog, setOpenDeleteProductDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditingProduct, setIsEditingProduct] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const categoryColumns = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Order",
      accessorKey: "order",
    },
    {
        header: "Status",
        accessorKey: "isActive",
        cell: (row: any) => (
          <Badge 
            className={cn(
              "px-2 py-0.5 w-20 text-center justify-center",
              row.isActive 
                ? "bg-green-100 text-green-700 hover:bg-green-100" 
                : "bg-red-100 text-red-700 hover:bg-red-100"
            )}
          >
            {row.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
    
  ]

  const productColumns = [
    {
      header: "Image",
      accessorKey: "image",
      cell: (row: Product) => (
        row.image ? (
          <img
            src={row.image}
            alt={row.title}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )
      ),
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (row: Product) => (
        <span className="max-w-[200px] truncate block">{row.description}</span>
      ),
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (row: Product) => (
        <span className="font-medium">{row.price.toLocaleString()} L</span>
      ),
    },
    {
      header: "Popular",
      accessorKey: "isPopular",
      cell: (row: Product) => (
        <Badge 
          className={cn(
            "px-2 py-0.5 w-20 text-center justify-center",
            row.isPopular 
              ? "bg-green-100 text-green-700 hover:bg-green-100" 
              : "bg-red-100 text-red-700 hover:bg-red-100"
          )}
        >
          {row.isPopular ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
        header: "Neps Order",
        accessorKey: "nepsOrder",
        cell: (row: Product) => (
          <Badge 
            className={cn(
              "px-2 py-0.5 w-20 text-center justify-center",
              row.nepsOrder 
                ? "bg-green-100 text-green-700 hover:bg-green-100" 
                : "bg-red-100 text-red-700 hover:bg-red-100"
            )}
          >
            {row.nepsOrder ? "Yes" : "No"}
          </Badge>
        ),
      },
    {
      header: "Available",
      accessorKey: "isAvailable",
      cell: (row: Product) => (
        <Badge 
          className={cn(
            "px-2 py-0.5 w-20 text-center justify-center",
            row.isAvailable 
              ? "bg-green-100 text-green-700 hover:bg-green-100" 
              : "bg-red-100 text-red-700 hover:bg-red-100"
          )}
        >
          {row.isAvailable ? "Yes" : "No"}
        </Badge>
      ),
    },
]

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsEditing(true)
    setOpenCategoryModal(true)
  }

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category)
    setOpenDeleteDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight">Menu</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Manage your restaurant's menu, categories, and products
        </p>
      </div>

      {/* Categories Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="mb-[-2px]">Categories</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage menu categories and their order
            </p>
          </div>
          <Button onClick={() => {
            setIsEditing(false)
            setSelectedCategory(null)
            setOpenCategoryModal(true)
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={categories}
            columns={categoryColumns}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        </CardContent>
      </Card>

      {/* Products Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="mb-[-2px]">Products</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your menu items and their details
            </p>
          </div>
          <Button onClick={() => {
        setIsEditingProduct(false)
        setSelectedProduct(null)
        setImagePreview(null)
        setOpenProductModal(true)
        }}>
        <Plus className="mr-2 h-4 w-4" />
        Add Product
        </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={products}
            columns={productColumns}
            onEdit={(product) => {
                setSelectedProduct(product)
                setIsEditingProduct(true)
                setImagePreview(product.image || null)
                setOpenProductModal(true)
              }}
              onDelete={(product) => {
                setSelectedProduct(product)
                setOpenDeleteProductDialog(true)
              }}
          />
        </CardContent>
      </Card>

      {/* Preview Section */}
    <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
        <CardTitle className="mb-[-2px]">Menu Preview</CardTitle>
        <span className="text-sm text-muted-foreground">
            Preview how your menu looks to customers
        </span>
        </div>
        <Button variant="soft">
        View Menu Page
        </Button>
    </CardHeader>
    <CardContent>
        <MenuPreview />
    </CardContent>
    </Card>

      {/* Category Modal */}
      <Dialog open={openCategoryModal} onOpenChange={setOpenCategoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Make changes to your category here.' 
                : 'Add a new category to your menu.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter category title"
                defaultValue={selectedCategory?.title}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter category description"
                defaultValue={selectedCategory?.description}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                placeholder="Enter display order"
                defaultValue={selectedCategory?.order}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                defaultChecked={selectedCategory?.isActive ?? true}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCategoryModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
    <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
    <AlertDialogContent>
        <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            category and remove all associated products.
        </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel className="border border-input bg-background hover:bg-accent hover:text-accent-foreground">
            Cancel
        </AlertDialogCancel>
        <AlertDialogAction
            onClick={() => {
            // Handle delete
            setOpenDeleteDialog(false)
            }}
        >
            Delete
        </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>

    {/* Product Modal */}
    <Dialog open={openProductModal} onOpenChange={setOpenProductModal}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>{isEditingProduct ? "Edit Product" : "Create Product"}</DialogTitle>
      <DialogDescription>
        {isEditingProduct
          ? "Make changes to your product here."
          : "Add a new product to your menu."}
      </DialogDescription>
    </DialogHeader>

    {/* Updated grid: 2 columns on md+ breakpoints, 1 column on smaller screens */}
    <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
      {/* Left Column */}
      <div className="space-y-4">
        {/* Title */}
        <div className="grid gap-2">
          <Label htmlFor="title">Title*</Label>
          <Input
            id="title"
            placeholder="Enter product title"
            defaultValue={selectedProduct?.title}
          />
        </div>

        {/* Description */}
        <div className="grid gap-2">
          <Label htmlFor="description">Description*</Label>
          <Textarea
            id="description"
            placeholder="Enter product description"
            defaultValue={selectedProduct?.description}
            className="resize-none"
          />
        </div>

        {/* Price */}
        <div className="grid gap-2">
          <Label htmlFor="price">Price*</Label>
          <Input
            id="price"
            type="number"
            placeholder="Enter price"
            defaultValue={selectedProduct?.price}
          />
        </div>

        {/* Order Method */}
        <div className="grid gap-2">
          <Label>Order Method*</Label>
          <InputSelect
            name="orderMethod"
            label="" // We’re using the <Label> above instead
            value={selectedProduct?.orderMethod || "Delivery"}
            onChange={(e) => {
              setSelectedProduct((prev) =>
                prev ? { ...prev, orderMethod: e.target.value } : null
              )
            }}
            options={[
              { value: "Delivery", label: "Delivery" },
              { value: "Pickup", label: "Pickup" },
              { value: "Both", label: "Both" },
            ]}
            required
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Image Upload */}
        <div className="grid gap-2">
          <Label>Upload Product Image</Label>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="product-image"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("product-image")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose Image
            </Button>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-10 w-10 object-cover rounded-md"
              />
            )}
          </div>
        </div>

        {/* Switches */}
        <div className="flex flex-col gap-2">
          {/* Use Full Size Image */}
          <div className="flex items-center space-x-2">
            <Switch id="use-full-size" defaultChecked={selectedProduct?.useFullSize} />
            <Label htmlFor="use-full-size">Use Full Size Image</Label>
          </div>

          {/* Neps Order */}
          <div className="flex items-center space-x-2">
            <Switch id="neps-order" defaultChecked={selectedProduct?.nepsOrder ?? true} />
            <Label htmlFor="neps-order">Neps.al Order</Label>
          </div>

          {/* Published */}
          <div className="flex items-center space-x-2">
            <Switch id="published" defaultChecked={selectedProduct?.published ?? true} />
            <Label htmlFor="published">Published</Label>
          </div>

          {/* Age Restricted */}
          <div className="flex items-center space-x-2">
            <Switch id="age-restricted" defaultChecked={selectedProduct?.ageRestricted} />
            <Label htmlFor="age-restricted">Age +18</Label>
          </div>
        </div>
      </div>
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setOpenProductModal(false)}>
        Cancel
      </Button>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


{/* Delete Product Confirmation */}
<AlertDialog open={openDeleteProductDialog} onOpenChange={setOpenDeleteProductDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete this
        product from your menu.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={() => {
          // Handle delete
          setOpenDeleteProductDialog(false)
        }}
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  )
}