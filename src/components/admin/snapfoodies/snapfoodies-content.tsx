// components/admin/snapfood-users/snapfood-users-content.tsx
"use client";

import { useState } from "react";
import { useSnapFoodUsers } from "@/hooks/useSnapFoodUsers";
import { SyncModal } from "@/components/admin/snapfood-users/SyncModal";
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
  Wallet,
  Calendar,
  ExternalLink
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export function SnapFoodUsersContent() {
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  
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

  const pageSizeOptions = [
    { value: "10", label: "10 per page" },
    { value: "20", label: "20 per page" },
    { value: "50", label: "50 per page" },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">SnapFood Users</h1>
          <p className="text-muted-foreground">
            Manage your user data from SnapFood
          </p>
        </div>
        <Button onClick={() => setIsSyncModalOpen(true)}>
          <FolderSyncIcon className="mr-2 h-4 w-4" />
          Sync with SnapFood
        </Button>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>
            Find users by name, email, or phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              placeholder="Search users..."
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
          <CardTitle>SnapFood Users List</CardTitle>
          <CardDescription>
            {totalItems} users found in your database
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
                <TableHead>Wallet</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">No users found</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsSyncModalOpen(true)}
                    >
                      <FolderSyncIcon className="mr-2 h-4 w-4" />
                      Sync users from SnapFood
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
                            {user.surname ? user.surname.substring(0, 1) : ""}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.name} {user.surname}
                          </div>
                          {user.external_ids?.snapFoodId && (
                            <div className="text-xs text-muted-foreground">
                              ID: {user.external_ids.snapFoodId}
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
                        <div className="flex items-center">
                          <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {user.phone || "No phone"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {user.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) 
                          : "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {user.metadata?.get('verified_by_mobile') === 'true' && (
                        <Badge variant="outline" className="ml-1">
                          Verified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Wallet className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {user.points || "0"} points
                      </div>
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
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View in SnapFood</span>
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
              {Math.min(page * pageSize, totalItems)} of {totalItems} users
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

      {/* Sync Modal */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSync={syncUsers}
        onSuccess={handleSyncSuccess}
      />
    </div>
  );
}