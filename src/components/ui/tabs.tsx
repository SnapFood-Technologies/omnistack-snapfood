// components/ui/tabs.tsx
import * as React from "react"

interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string
  className?: string
  children: React.ReactNode
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, className = "", children, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue)

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>
        <div
          ref={ref}
          className={`bg-white rounded-lg shadow dark:bg-gray-800 ${className}`}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = "Tabs"

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex gap-4 p-4 border-b dark:border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  className?: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className = "", children, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsTrigger must be used within Tabs")
    const { activeTab, setActiveTab } = context

    return (
      <button
        ref={ref}
        className={`px-4 py-2 text-sm font-medium rounded-lg ${
          value === activeTab
            ? "bg-primary text-white"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        } ${className}`}
        onClick={() => setActiveTab(value)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  className?: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className = "", children, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsContent must be used within Tabs")
    const { activeTab } = context

    if (value !== activeTab) return null

    return (
      <div
        ref={ref}
        className={`p-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }