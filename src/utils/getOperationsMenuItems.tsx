// utils/getOperationsMenuItems.tsx
import { 
    BarChart2, 
    Users, 
    Store, 
    PackageSearch, 
    UserCog 
  } from 'lucide-react';
  
  export const getOperationsMenuItems = (businessType: string = 'RETAIL') => {
    if (businessType === 'RETAIL') {
      return [
        {
          id: "8-1",
          title: "Store Analytics",
          path: "/user/operations/analytics",
          icon: <BarChart2 className="w-4 h-4" />
        },
        {
          id: "8-2",
          title: "Queue Management",
          path: "/user/operations/queue",
          icon: <Users className="w-4 h-4" />
        },
        {
          id: "8-3",
          title: "Display Monitoring",
          path: "/user/operations/displays",
          icon: <Store className="w-4 h-4" />
        },
        {
          id: "8-4",
          title: "Inventory Tracking",
          path: "/user/operations/inventory",
          icon: <PackageSearch className="w-4 h-4" />
        },
        {
          id: "8-5",
          title: "Staff Optimization",
          path: "/user/operations/staff-optimization",
          icon: <UserCog className="w-4 h-4" />
        }
      ];
    }
  
    return [];
  };