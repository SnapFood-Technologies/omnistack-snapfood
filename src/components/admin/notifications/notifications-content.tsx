// components/admin/notifications/notifications-list.tsx
"use client";

import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/new-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search } from "lucide-react";

export function NotificationsContent() {
  const [searchInput, setSearchInput] = useState("");
  
  const {
    notificationTypesWithMethods,
    isLoading,
    fetchNotificationTypesWithMethods
  } = useNotifications();

  // Helper to format notification type name for display
  const getNotificationTypeDisplayName = (type) => {
    return type
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Helper to get the function name that sends this notification
  const getSendingFunction = (method) => {
    switch (method) {
      case "general_notification":
        return "sendGeneralNotification()";
      case "birthday_notification":
        return "sendBirthdayNotification()";
      case "user_category_notification":
        return "sendUserCategoryNotification()";
      case "friend_request_notification":
        return "sendFriendRequestNotification()";
      case "friend_accept_notification":
        return "sendFriendAcceptNotification()";
      case "order_notification":
        return "sendOrderNotification()";
      case "chat_notification":
        return "sendChatMessageNotification()";
      case "call_notification":
        return "sendCallNotification()";
      case "balance_transfer_success_notification":
        return "sendBalanceTransferNotification()";
      case "courier_notification":
        return "sendCourierNotification()";
      case "group_chat_invite_notification":
        return "sendGroupChatInviteNotification()";
      case "story_notification":
        return "sendStoryNotification()";
      case "split_order_request_notification":
        return "sendSplitOrderRequestNotification()";
      case "friend_order_notification":
        return "sendFriendOrderNotification()";
      default:
        return "sendPushNotification()";
    }
  };

  // Handle search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is handled inline via filtering
  };

  // Filter notifications based on search input
  const filteredNotifications = notificationTypesWithMethods.filter(item => 
    !searchInput || 
    item.type.toLowerCase().includes(searchInput.toLowerCase()) || 
    item.method.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notification Types</h1>
          <p className="text-muted-foreground">
            List of all available notification types in the system
          </p>
        </div>
        <Button onClick={fetchNotificationTypesWithMethods} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            All notification types with their delivery methods and sending functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6">
            <Input
              placeholder="Search notification types..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Notification Type</TableHead>
                <TableHead>Delivery Method</TableHead>
                <TableHead>Sending Function</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredNotifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <p className="text-muted-foreground">No notification types found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotifications.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{getNotificationTypeDisplayName(item.type)}</div>
                      <div className="text-xs text-muted-foreground">{item.type}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-blue-500">PUSH</Badge>
                      <div className="text-xs text-muted-foreground mt-1">{item.method}</div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                        {getSendingFunction(item.method)}
                      </code>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}