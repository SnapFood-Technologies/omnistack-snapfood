// components/admin/snapfoodies/snapfoodies-content.tsx
"use client";

import { useState } from "react";
import { useSnapFoodUsers } from "@/hooks/useSnapFoodUsers";
import { SyncModal } from "@/components/admin/snapfoodies/SyncModal";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Users,
  RefreshCw,
  Search,
  Mail,
  Phone,
  FolderSyncIcon,
  Eye,
  BellRing,
  Smartphone,
  Calendar,
  ExternalLink,
  LogIn
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputSelect from "@/components/Common/InputSelect";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export function SnapFoodiesContent() {
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  
  const {
    users,
    isLoading,
    page,
    pageSize,
    totalItems,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    fetchUsers,
    syncUsers,
  } = useSnapFoodUsers();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  const handleSyncSuccess = () => {
    // Refresh the list after sync
    fetchUsers();
  };

  const openDevicesModal = (user) => {
    setSelectedUser(user);
    setIsDevicesModalOpen(true);
  };

  const openNotificationsModal = (user) => {
    setSelectedUser(user);
    setIsNotificationsModalOpen(true);
  };

  const pageSizeOptions = [
    { value: "10", label: "10 per page" },
    { value: "20", label: "20 per page" },
    { value: "50", label: "50 per page" },
  ];

  // Helper to determine if a user has legacy devices
  const hasLegacyDevices = (user) => {
    return user.metadata && user.metadata.legacy_devices;
  };

  const handleSyncUsers = async (batchPage = 1, batchSize = 200) => {
    // Ensure both parameters are passed to syncUsers
    console.log(`SnapFoodiesContent calling syncUsers with page ${batchPage} and size ${batchSize}`);
    return await syncUsers(batchPage, batchSize);
  };

  // Helper to determine if a user has notification settings
  const hasNotifications = (user) => {
    return user.notifications && (
      user.notifications.oneSignalId || 
      (user.notifications.deviceTokens && user.notifications.deviceTokens.length > 0)
    );
  };

  // Note: Sorting is handled by the backend API

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">SnapFoodies</h1>
          <p className="text-muted-foreground">
            Manage your SnapFoodie user accounts and profiles
          </p>
        </div>
        <Button onClick={() => setIsSyncModalOpen(true)}>
          <FolderSyncIcon className="mr-2 h-4 w-4" />
          Sync SnapFoodies
        </Button>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search SnapFoodies</CardTitle>
          <CardDescription>
            Find SnapFoodie accounts by name, email, or phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              placeholder="Search SnapFoodies..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>SnapFoodies List</CardTitle>
          <CardDescription>
            {totalItems} SnapFoodies found in your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notifications</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">No SnapFoodies found</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsSyncModalOpen(true)}
                    >
                      <FolderSyncIcon className="mr-2 h-4 w-4" />
                      Sync SnapFoodies
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-white uppercase">
                            {user.name ? user.name.substring(0, 1) : ""}
                            {user.surname && user.surname !== "-" ? user.surname.substring(0, 1) : ""}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.name} {user.surname !== "-" ? user.surname : ""}
                          </div>
                          {user.external_ids?.snapFoodId && (
                            <div className="text-xs text-muted-foreground">
                              SnapFood ID: {user.external_ids.snapFoodId}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {user.email || "No email"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {user.metadata?.created_at 
                          ? new Date(user.metadata.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) 
                          : user.createdAt 
                            ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) 
                            : "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {user.isActive && (
                          <Badge variant="outline">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={!hasNotifications(user) ? "text-muted-foreground" : ""}
                        onClick={() => openNotificationsModal(user)}
                      >
                        <BellRing className="h-4 w-4" />
                        <span className="sr-only">View notifications</span>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={!hasLegacyDevices(user) ? "text-muted-foreground" : ""}
                        onClick={() => openDevicesModal(user)}
                      >
                        <Smartphone className="h-4 w-4" />
                        <span className="sr-only">View devices</span>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/admin/users/${user._id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </Link>
                        {user.external_ids?.snapFoodId && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <LogIn className="h-4 w-4" />
                            <span className="sr-only">Login as user</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {users.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
              {Math.min(page * pageSize, totalItems)} of {totalItems} SnapFoodies
            </div>

            <div className="flex items-center gap-4">
              <InputSelect
                name="pageSize"
                label=""
                value={pageSize.toString()}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                options={pageSizeOptions}
              />

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      href="#"
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, i, arr) => (
                      <React.Fragment key={p}>
                        {i > 0 && arr[i-1] !== p - 1 && (
                          <PaginationItem>
                            <PaginationLink disabled>...</PaginationLink>
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            isActive={page === p}
                            onClick={() => handlePageChange(p)}
                            href="#"
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                      href="#"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Devices Modal */}
      <Dialog open={isDevicesModalOpen} onOpenChange={setIsDevicesModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Device Information</DialogTitle>
            <DialogDescription>
              {selectedUser && `Details for ${selectedUser.name} ${selectedUser.surname !== "-" ? selectedUser.surname : ""}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              {hasLegacyDevices(selectedUser) ? (
                <div>
                  <h3 className="text-lg font-medium mb-2">Legacy Devices</h3>
                  {(() => {
                    try {
                      const devices = JSON.parse(selectedUser.metadata.legacy_devices);
                      return (
                        <div className="space-y-4">
                          {devices.map((device, index) => (
                            <Card key={index}>
                              <CardContent className="pt-4">
                                <div className="grid grid-cols-2 gap-2">
                                  <div><span className="font-medium">Model:</span> {device.model || 'Unknown'}</div>
                                  <div><span className="font-medium">Platform:</span> {device.platform || 'Unknown'}</div>
                                  <div><span className="font-medium">Version:</span> {device.version || 'Unknown'}</div>
                                  <div><span className="font-medium">Created:</span> {device.created_at || 'Unknown'}</div>
                                  {device.token && (
                                    <div className="col-span-2 overflow-hidden text-ellipsis">
                                      <span className="font-medium">Token:</span> 
                                      <span className="text-xs break-all">{device.token}</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      );
                    } catch (e) {
                      return <p className="text-red-500">Error parsing device data</p>;
                    }
                  })()}
                </div>
              ) : (
                <p className="text-muted-foreground">No legacy device information available</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={isNotificationsModalOpen} onOpenChange={setIsNotificationsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              {selectedUser && `Notification preferences for ${selectedUser.name} ${selectedUser.surname !== "-" ? selectedUser.surname : ""}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              {hasNotifications(selectedUser) ? (
                <>
                  {selectedUser.notifications.oneSignalId && (
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">OneSignal ID</h3>
                      <p className="text-xs break-all bg-muted p-2 rounded">{selectedUser.notifications.oneSignalId}</p>
                    </div>
                  )}
                  
                  {selectedUser.notifications.deviceTokens && selectedUser.notifications.deviceTokens.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Device Tokens</h3>
                      {selectedUser.notifications.deviceTokens.map((token, index) => (
                        <p key={index} className="text-xs break-all bg-muted p-2 rounded">{token}</p>
                      ))}
                    </div>
                  )}
                  
                  {selectedUser.notifications.preferences && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Preferences</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Chat Notifications:</div>
                        <div>{selectedUser.notifications.preferences.chatNotifications ? "Enabled" : "Disabled"}</div>
                        <div>Marketing Notifications:</div>
                        <div>{selectedUser.notifications.preferences.marketingNotifications ? "Enabled" : "Disabled"}</div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">No notification settings configured</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Sync Modal */}
       <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSync={handleSyncUsers}
        onSuccess={handleSyncSuccess}
      />
    </div>
  );
}