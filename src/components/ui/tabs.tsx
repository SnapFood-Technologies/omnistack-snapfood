import * as React from "react";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-white rounded-lg shadow dark:bg-gray-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
Tabs.displayName = "Tabs";

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
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
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  className?: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className = "", isActive, children, ...props }, ref) => (
    <button
      ref={ref}
      className={`px-4 py-2 text-sm font-medium rounded-lg ${
        isActive
          ? "bg-primary text-white"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  activeTab: string;
  className?: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className = "", value, activeTab, children, ...props }, ref) => {
    if (value !== activeTab) return null;
    
    return (
      <div
        ref={ref}
        className={`p-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };