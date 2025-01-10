// hooks/use-sidebar.ts
import { create } from 'zustand'

interface SidebarStore {
  isOpen: boolean
  isCollapsed: Record<string, boolean>
  toggleOpen: () => void
  toggleCollapsed: (href: string) => void
}

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: true,
  isCollapsed: {},
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleCollapsed: (href: string) =>
    set((state) => ({
      isCollapsed: {
        ...state.isCollapsed,
        [href]: !state.isCollapsed[href],
      },
    })),
}))