// src/components/ui/qr-card.tsx
import * as React from "react"

// @ts-ignore
interface QRCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
}

export const QRCard = React.forwardRef<HTMLDivElement, QRCardProps>(
  ({ className = "", title, description, footer, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-white rounded-lg border shadow-sm dark:bg-gray-800 ${className}`}
      {...props}
    >
      {(title || description) && (
        <div className="p-6 pb-3">
          {title && (
            <h3 className="text-lg font-semibold">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="px-6">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 mt-3 border-t">
          {footer}
        </div>
      )}
    </div>
  )
)
QRCard.displayName = "QRCard"