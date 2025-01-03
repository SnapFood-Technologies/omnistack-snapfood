import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

interface SubTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
    inset?: boolean;
    className?: string;
    children: React.ReactNode;
}

const DropdownMenuSubTrigger = React.forwardRef<HTMLDivElement, SubTriggerProps>(
    ({ className = "", inset, children, ...props }, ref) => (
        <DropdownMenuPrimitive.SubTrigger
            ref={ref}
            className={cn(
                "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
                inset && "pl-8",
                className
            )}
            {...props}
        >
            {children}
            <ChevronRight className="ml-auto h-4 w-4" />
        </DropdownMenuPrimitive.SubTrigger>
    )
);
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

interface SubContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}

const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, SubContentProps>(
    ({ className = "", children, ...props }, ref) => (
        <DropdownMenuPrimitive.SubContent
            ref={ref}
            className={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
                className
            )}
            {...props}
        >
            {children}
        </DropdownMenuPrimitive.SubContent>
    )
);
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    sideOffset?: number;
    children: React.ReactNode;
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, ContentProps>(
    ({ className = "", sideOffset = 4, children, ...props }, ref) => (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
                ref={ref}
                sideOffset={sideOffset}
                className={cn(
                    "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                    className
                )}
                {...props}
            >
                {children}
            </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
    )
);
DropdownMenuContent.displayName = "DropdownMenuContent";

interface MenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
    inset?: boolean;
    className?: string;
    children: React.ReactNode;
}

const DropdownMenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
    ({ className = "", inset, children, ...props }, ref) => (
        // @ts-ignore
        <DropdownMenuPrimitive.Item
            ref={ref}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
                inset && "pl-8",
                className
            )}
            {...props}
        >
            {children}
        </DropdownMenuPrimitive.Item>
    )
);
DropdownMenuItem.displayName = "DropdownMenuItem";

interface CheckboxItemProps extends React.HTMLAttributes<HTMLDivElement> {
    checked?: boolean;
    className?: string;
    children: React.ReactNode;
}

const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, CheckboxItemProps>(
    ({ className = "", children, checked, ...props }, ref) => (
        // @ts-ignore
        <DropdownMenuPrimitive.CheckboxItem
            ref={ref}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
                className
            )}
            checked={checked}
            {...props}
        >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    )
);
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

interface LabelProps extends React.HTMLAttributes<HTMLDivElement> {
    inset?: boolean;
    className?: string;
    children: React.ReactNode;
}

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, LabelProps>(
    ({ className = "", inset, children, ...props }, ref) => (
        <DropdownMenuPrimitive.Label
            ref={ref}
            className={cn(
                "px-2 py-1.5 text-sm font-semibold",
                inset && "pl-8",
                className
            )}
            {...props}
        >
            {children}
        </DropdownMenuPrimitive.Label>
    )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, SeparatorProps>(
    ({ className = "", ...props }, ref) => (
        <DropdownMenuPrimitive.Separator
            ref={ref}
            className={cn("-mx-1 my-1 h-px bg-muted", className)}
            {...props}
        />
    )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
};