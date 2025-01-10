// utils/getSecurityMenuItems.tsx
import { Shield, Bell, FileText, ShieldAlert, Siren, Terminal, AlertTriangle, UserCog, UserCheck, Notebook } from 'lucide-react';

export const getSecurityMenuItems = (businessType: string = 'RETAIL') => {
  // Base items that show for all business types
  const baseItems = [
    {
      id: "5-1",
      title: "Overview",
      path: "/user/security",
      icon: <Shield className="w-4 h-4" />
    },
    {
      id: "5-3",
      title: "Alert Rules",
      path: "/user/security/alerts",
      icon: <Bell className="w-4 h-4" />
    },
    {
      id: "5-4",
      title: "Reports",
      path: "/user/security/reports",
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: "5-2",
      title: "Notes & Issues",  // New menu item
      path: "/user/security/notes",
      icon: <Notebook className="w-4 h-4" />
    },
  ];

  // Items only for retail businesses
  if (businessType === 'RETAIL') {
    return [
      ...baseItems,
      {
        id: "5-5",
        title: "Loss Prevention",
        path: "/user/security/loss-prevention",
        icon: <ShieldAlert className="w-4 h-4" />
      },
      {
        id: "5-6",
        title: "Emergency Response",
        path: "/user/security/emergency-response",
        icon: <Siren className="w-4 h-4" />
      },
      {
        id: "5-7",
        title: "POS Integration",
        path: "/user/security/pos-integration",
        icon: <Terminal className="w-4 h-4" />
      },
      {
        id: "5-8",
        title: "Incident Management",
        path: "/user/security/incident-management",
        icon: <AlertTriangle className="w-4 h-4" />
      },
      {
        id: "5-9",
        title: "Staff Monitoring",
        path: "/user/security/staff-monitoring",
        icon: <UserCog className="w-4 h-4" />
      }
    ];
  }

  // Items only for residential businesses
  if (businessType === 'MULTI_FAMILY_RESIDENTIAL') {
    return [
      ...baseItems,
      {
        id: "5-2",
        title: "Visitor Management",
        path: "/user/security/visitors",
        icon: <UserCheck className="w-4 h-4" />
      }
    ];
  }

  // Default return base items for other business types
  return baseItems;
};