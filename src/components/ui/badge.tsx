import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-white",
        secondary:
          "border-transparent bg-secondary text-white",
        destructive:
          "border-transparent bg-red-100 text-red-700 hover:bg-red-100/80",
        success:
          "border-transparent bg-green-100 text-green-700 hover:bg-green-100/80",
        warning:
          "border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
        info:
          "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-100/80",
        neutral:
          "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-100/80",
        purple:
          "border-transparent bg-purple-100 text-purple-700 hover:bg-purple-100/80",
        pink:
          "border-transparent bg-pink-100 text-pink-700 hover:bg-pink-100/80",
        orange:
          "border-transparent bg-orange-100 text-orange-700 hover:bg-orange-100/80",
        outline: 
          "text-foreground border-border",
        soft:
          "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, shape, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, shape }), className)} {...props} />
  )
}

export { Badge, badgeVariants }