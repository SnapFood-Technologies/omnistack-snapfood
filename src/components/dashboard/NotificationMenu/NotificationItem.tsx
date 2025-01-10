// components/Common/Dashboard/Header/NotificationMenu/NotificationItem.tsx
import { NotificationItem } from '@/types/notifications';

interface NotificationProps {
  notification: NotificationItem;
}

export default function Notification({ notification }: NotificationProps) {
	const Icon = notification.icon;
	
	return (
		<div className="mb-3">
		  <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
			<div className="h-[42px] w-[42px] flex items-center justify-center bg-blue-500 rounded-[44px] flex-shrink-0">
			  <Icon className="h-6 w-6 text-white" />
			</div>
			<div>
			  <h5 className="text-base font-medium text-gray-900 dark:text-white">
				{notification.title}
			  </h5>
			  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
				{notification.message}
			  </p>
			  <span className="text-sm text-gray-400 dark:text-gray-500 mt-1 block">
				{notification.time}
			  </span>
			</div>
		  </div>
		</div>
	  );
  }