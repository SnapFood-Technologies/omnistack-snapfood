import { 
    LayoutDashboard, 
    Store, 
    Users, 
    Settings,
    Utensils,
    PieChart,
    Share2,
    UserPlus,
    Wallet,
    Mail,
    BarChart3,
    ShoppingBag,
    Gift,
    MessageSquare,
    BadgePercent,
    Bell,
    DollarSign,
    UserCog,
    Newspaper,
    LineChart,
    BarChart
  } from "lucide-react";
  
  export const getSidebarDataForType = (businessType: string = 'FOOD'): { 
    mainMenu: any[],
    sales: any[],
    crm: any[],
    marketing: any[],
    communication: any[],
    finance: any[],
    settings: any[]
  } => {
    if (businessType === 'FOOD') {
      return {
        mainMenu: [
          {
            id: 1,
            title: "Dashboard",
            icon: <LayoutDashboard className="w-5 h-5"/>,
            path: "/admin/dashboard",
            children: [
              {
                id: 11,
                title: "Food Dashboard",
                icon: <PieChart className="w-4 h-4"/>,
                path: "/admin/dashboard",
              },
              {
                id: 12,
                title: "Social Dashboard",
                icon: <Share2 className="w-4 h-4"/>,
                path: "/admin/dashboard/social",
              },
              {
                id: 13,
                title: "Customer Insights",
                icon: <UserPlus className="w-4 h-4"/>,
                path: "/admin/dashboard/customer-insights",
              },
              {
                id: 14,
                title: "Wallet Stats",
                icon: <Wallet className="w-4 h-4"/>,
                path: "/admin/dashboard/wallet",
              },
              {
                id: 15,
                title: "Feature Usage Stats",
                icon: <LineChart className="w-4 h-4"/>,
                path: "/admin/dashboard/feature-usage",
              },
              {
                id: 16,
                title: "Newsletter Reports",
                icon: <Newspaper className="w-4 h-4"/>,
                path: "/admin/dashboard/newsletter-reports",
              },
              {
                id: 17,
                title: "Landing Page Stats",
                icon: <BarChart className="w-4 h-4"/>,
                path: "/admin/dashboard/landing-page-stats",
              }
            ]
          }
        ],
        sales: [
          {
            id: 2,
            title: "Orders",
            icon: <ShoppingBag className="w-5 h-5"/>,
            path: "/admin/orders",
            children: [
              {
                id: 21,
                title: "All Orders",
                icon: <ShoppingBag className="w-4 h-4"/>,
                path: "/admin/orders",
              },
              {
                id: 22,
                title: "Order Reports",
                icon: <BarChart3 className="w-4 h-4"/>,
                path: "/admin/orders/reports",
              }
            ]
          },
          {
            id: 3,
            title: "Restaurants",
            icon: <Store className="w-5 h-5"/>,
            path: "/admin/restaurants",
            children: [
              {
                id: 31,
                title: "All Restaurants",
                icon: <Utensils className="w-4 h-4"/>,
                path: "/admin/restaurants",
              },
              {
                id: 32,
                title: "Performance",
                icon: <BarChart3 className="w-4 h-4"/>,
                path: "/admin/restaurants/performance",
              }
            ]
          }
        ],
        crm: [
          {
            id: 4,
            title: "Customers",
            icon: <Users className="w-5 h-5"/>,
            path: "/admin/customers",
            children: [
              {
                id: 41,
                title: "All Customers",
                icon: <Users className="w-4 h-4"/>,
                path: "/admin/customers",
              },
              {
                id: 42,
                title: "Customer Support",
                icon: <UserCog className="w-4 h-4"/>,
                path: "/admin/customers/support",
              }
            ]
          }
        ],
        marketing: [
          {
            id: 5,
            title: "Promotions",
            icon: <Gift className="w-5 h-5"/>,
            path: "/admin/promotions",
            children: [
              {
                id: 51,
                title: "Active Promotions",
                icon: <BadgePercent className="w-4 h-4"/>,
                path: "/admin/promotions",
              },
              {
                id: 52,
                title: "Campaign Stats",
                icon: <BarChart3 className="w-4 h-4"/>,
                path: "/admin/promotions/stats",
              }
            ]
          }
        ],
        communication: [
          {
            id: 6,
            title: "Notifications",
            icon: <Bell className="w-5 h-5"/>,
            path: "/admin/notifications",
          },
          {
            id: 7,
            title: "Messages",
            icon: <MessageSquare className="w-5 h-5"/>,
            path: "/admin/messages",
          }
        ],
        finance: [
          {
            id: 8,
            title: "Payments",
            icon: <DollarSign className="w-5 h-5"/>,
            path: "/admin/payments",
            children: [
              {
                id: 81,
                title: "Transactions",
                icon: <Wallet className="w-4 h-4"/>,
                path: "/admin/payments/transactions",
              },
              {
                id: 82,
                title: "Reports",
                icon: <BarChart3 className="w-4 h-4"/>,
                path: "/admin/payments/reports",
              }
            ]
          }
        ],
        settings: [
          {
            id: 9,
            title: "Settings",
            icon: <Settings className="w-5 h-5"/>,
            path: "/admin/settings",
          }
        ]
      };
    }
    return { mainMenu: [], sales: [], crm: [], marketing: [], communication: [], finance: [], settings: [] };
  };
  
  export const userMenuData = [
    {
      id: 1,
      title: "Account Settings",
      path: "/admin/account",
      icon: <Settings className="w-5 h-5"/>
    },
    {
      id: 2,
      title: "Notifications",
      path: "/admin/account/notifications",
      icon: <Bell className="w-5 h-5"/>
    },
    {
      id: 3,
      title: "Billing",
      path: "/admin/account/billing",
      icon: <Wallet className="w-5 h-5"/>
    }
  ];