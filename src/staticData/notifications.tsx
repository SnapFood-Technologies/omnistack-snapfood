// staticData/notifications.tsx
import { AlertTriangle, Building2, Info, Shield, PenTool } from 'lucide-react';
// @ts-ignore
import { NotificationItem } from '@/types/notifications';

export const businessOwnerNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Fire Alarm Test',
    message: 'Scheduled fire alarm testing at Daisy Tower One tomorrow at 10 AM',
    time: '2 hours ago',
    icon: AlertTriangle
  },
  {
    id: '2',
    type: 'maintenance',
    title: 'Maintenance Request',
    message: 'New maintenance request submitted for Unit 303 at Tower Two',
    time: '1 hour ago',
    icon: PenTool
  },
  {
    id: '3',
    type: 'security',
    title: 'Security Alert',
    message: 'Unauthorized access attempt detected at Commercial Plaza parking',
    time: '30 min ago',
    icon: Shield
  }
];

export const adminNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'info',
    title: 'New Business Registration',
    message: 'Skyline Properties has registered on the platform',
    time: '1 hour ago',
    icon: Building2
  },
  {
    id: '2',
    type: 'alert',
    title: 'System Update',
    message: 'Platform maintenance scheduled for tonight at 2 AM',
    time: '3 hours ago',
    icon: Info
  },
  {
    id: '3',
    type: 'security',
    title: 'Multiple Login Attempts',
    message: 'Unusual login activity detected from IP 192.168.1.1',
    time: '15 min ago',
    icon: Shield
  }
];