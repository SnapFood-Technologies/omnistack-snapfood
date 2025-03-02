// components/restaurants/RestaurantsList.tsx
"use client";

import { useState } from "react";
import { useRestaurants } from "@/hooks/useRestaurants";
import { SyncModal } from "@/components/admin/restaurants/SyncModal";
import { format } from "date-fns";
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
  Store,
  RefreshCw,
  Search,
  Database,
  MapPin,
  Phone,
  FolderSyncIcon,
  Eye
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import Link from "next/link";

export function RestaurantsContent() {
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  
  const {
    restaurants,
    isLoading,
    page,
    pageSize,
    totalItems,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    fetchRestaurants,
  } = useRestaurants();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  const handleSyncSuccess = () => {
    // Refresh the list after sync
    fetchRestaurants();
  };

  const pageSizeOptions = [
    { value: "10", label: "10 per page" },
    { value: "20", label: "20 per page" },
    { value: "50", label: "50 per page" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Restaurants</h1>
          <p className="text-muted-foreground">
            Manage your restaurant data from Snapfood
          </p>
        </div>
        <Button onClick={() => setIsSyncModalOpen(true)}>
          <FolderSyncIcon className="mr-2 h-4 w-4" />
          Sync with Snapfood
        </Button>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>
            Find restaurants by name, location, or other details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              placeholder="Search restaurants..."
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

      {/* Restaurant Table */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurant List</CardTitle>
          <CardDescription>
            {totalItems} restaurants found in your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Snapfood ID</TableHead>
                <TableHead>Last Synced</TableHead>
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
              ) : restaurants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">No restaurants found</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsSyncModalOpen(true)}
                    >
                      <FolderSyncIcon className="mr-2 h-4 w-4" />
                      Sync restaurants from Snapfood
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                restaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <Store className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{restaurant.name}</div>
                          {restaurant.description && (
                            <div className="text-xs text-muted-foreground truncate max-w-md">
                              {restaurant.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {restaurant.address || "No address"}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {restaurant.phone || "No phone"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={restaurant.status === "ACTIVE" ? "default" : "secondary"}>
                          {restaurant.status}
                        </Badge>
                        
                        {restaurant.isOpen !== undefined && (
                          <Badge variant={restaurant.isOpen ? "outline" : "destructive"} className="ml-1">
                            {restaurant.isOpen ? "Open" : "Closed"}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {restaurant.externalSnapfoodId ? (
                        <div className="flex items-center">
                          <Database className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {restaurant.externalSnapfoodId}
                        </div>
                      ) : (
                        <Badge variant="outline">Not synced</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {restaurant.lastSyncedAt ? (
                        <div className="text-sm">
                          {format(new Date(restaurant.lastSyncedAt), "PPpp")}
                        </div>
                      ) : (
                        <Badge variant="outline">Never</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/restaurants/${restaurant.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {restaurants.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
              {Math.min(page * pageSize, totalItems)} of {totalItems} restaurants
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
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, i, arr) => (
                      <>
                        {i > 0 && arr[i-1] !== p - 1 && (
                          <PaginationItem key={`ellipsis-${p}`}>
                            <PaginationLink disabled>...</PaginationLink>
                          </PaginationItem>
                        )}
                        <PaginationItem key={p}>
                          <PaginationLink
                            isActive={page === p}
                            onClick={() => handlePageChange(p)}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
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
        onSuccess={handleSyncSuccess}
      />

      <div className="h-10"></div>
    </div>
  );
}