// components/admin/notifications/notifications-content.tsx
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Search,
  BellRing,
  MessageSquare,
  Settings,
  Mail,
  Bell,
  Send,
  PanelLeft,
  PlusCircle,
  Info
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "react-hot-toast";

export function NotificationsContent() {
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedNotificationType, setSelectedNotificationType] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const {
    notificationTypesWithMethods,
    isLoading,
  } = useNotifications();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter notifications by search query if needed
  };


  const openDetailsModal = (notificationType) => {
    setSelectedNotificationType(notificationType);
    setIsDetailsModalOpen(true);
  };

  const getNotificationTypeDisplayName = (type) => {
    return type
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and send notifications to your users
          </p>
        </div>
        <Button onClick={() => setIsSendModalOpen(true)}>
          <Send className="mr-2 h-4 w-4" />
          Send Test Notification
        </Button>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            View and manage notification types and their delivery methods
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

          <Tabs defaultValue="types-with-methods">
            <TabsList className="mb-4">
              <TabsTrigger value="types-with-methods">Types with Methods</TabsTrigger>
              <TabsTrigger value="all-types">All Types</TabsTrigger>
            </TabsList>

            <TabsContent value="types-with-methods">
              {/* Notification Types with Methods Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Notification Type</TableHead>
                    <TableHead>Delivery Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : notificationTypesWithMethods.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        <p className="text-muted-foreground">No notification types found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    notificationTypesWithMethods
                      .filter(item => 
                        !searchInput || 
                        item.type.toLowerCase().includes(searchInput.toLowerCase()) || 
                        item.method.toLowerCase().includes(searchInput.toLowerCase())
                      )
                      .map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="font-medium">{getNotificationTypeDisplayName(item.type)}</div>
                            <div className="text-xs text-muted-foreground">{item.type}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getMethodBadgeVariant(item.method)} className="flex w-fit items-center gap-1">
                              {getMethodIcon(item.method)}
                              {item.method}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => openDetailsModal(item)}
                                  >
                                    <Info className="h-4 w-4" />
                                    <span className="sr-only">View details</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View notification details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      setSelectedNotificationType(item);
                                      setIsSendModalOpen(true);
                                    }}
                                  >
                                    <Send className="h-4 w-4" />
                                    <span className="sr-only">Send notification</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Send test notification</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="all-types">
              {/* All Notification Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  <div className="col-span-full flex justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : notificationTypes.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No notification types found</p>
                  </div>
                ) : (
                  notificationTypes
                    .filter(type => !searchInput || type.toLowerCase().includes(searchInput.toLowerCase()))
                    .map((type, index) => (
                      <Card key={index} className="flex flex-col justify-between">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{getNotificationTypeDisplayName(type)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xs text-muted-foreground mb-4">{type}</div>
                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedNotificationType({ type });
                                setIsSendModalOpen(true);
                              }}
                            >
                              <Send className="h-3 w-3 mr-2" />
                              Test
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Notification Templates Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Templates</CardTitle>
          <CardDescription>
            Manage templates for common notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="text-center">
              <PlusCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Create Notification Templates</h3>
              <p className="text-muted-foreground mb-4">
                Templates help you standardize notifications across your application
              </p>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Send Notification Modal */}
      <SendNotificationModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSend={handleSendTestNotification}
        isSending={isSending}
        notificationTypes={notificationTypes}
      />

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Type Details</DialogTitle>
            <DialogDescription>
              {selectedNotificationType && `Details for ${getNotificationTypeDisplayName(selectedNotificationType.type)}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedNotificationType && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="font-medium col-span-1">Type:</div>
                <div className="col-span-3">{selectedNotificationType.type}</div>
                
                <div className="font-medium col-span-1">Method:</div>
                <div className="col-span-3">
                  <Badge variant={getMethodBadgeVariant(selectedNotificationType.method)} className="flex w-fit items-center gap-1">
                    {getMethodIcon(selectedNotificationType.method)}
                    {selectedNotificationType.method}
                  </Badge>
                </div>
                
                <div className="font-medium col-span-1">Description:</div>
                <div className="col-span-3">
                  {getNotificationTypeDisplayName(selectedNotificationType.type)} sent via {selectedNotificationType.method}.
                </div>
              </div>
            
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}