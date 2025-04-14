"use client";

import { useState, useEffect } from "react";
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
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BlogUploadBanner } from "./blog-upload-banner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  FileText,
  RefreshCw,
  Search,
  Edit,
  Eye,
  Plus,
  Bell,
  MoreVertical,
  Trash2,
  PowerOff,
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import Link from "next/link";
import { CreateBlogModal } from "./create-blog-modal";
import { SendNotificationModal } from "./send-notification-modal";
import { useSnapFoodBlogs } from "@/hooks/useSnapFoodBlogs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function BlogsContent() {
  const { 
    blogs, 
    totalItems, 
    totalPages, 
    isLoading, 
    fetchBlogs,
    toggleBlogStatus,
    deleteBlog
  } = useSnapFoodBlogs();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Notification state
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  
  // Delete confirmation
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);
  
  // Active blog action select (instead of dropdown)
  const [blogActionSelects, setBlogActionSelects] = useState<{[key: number]: string}>({});

  useEffect(() => {
    fetchBlogs({
      page,
      per_page: pageSize,
      title: searchInput || undefined,
      active: filterActive
    });
  }, [fetchBlogs, page, pageSize]);

  useEffect(() => {
    // Reset all action selects to empty when blogs change
    const newActionSelects: {[key: number]: string} = {};
    blogs.forEach(blog => {
      newActionSelects[blog.id] = "";
    });
    setBlogActionSelects(newActionSelects);
  }, [blogs]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchBlogs({
      page: 1,
      per_page: pageSize,
      title: searchInput || undefined,
      active: filterActive
    });
  };

  const handleFilterChange = (value: string) => {
    const active = value === "" ? undefined : value === "1";
    setFilterActive(active);
    setPage(1); // Reset to first page when filtering
    fetchBlogs({
      page: 1,
      per_page: pageSize,
      title: searchInput || undefined,
      active
    });
  };

  const handleCreateSuccess = () => {
    fetchBlogs({
      page,
      per_page: pageSize,
      title: searchInput || undefined,
      active: filterActive
    });
  };

  const handleOpenNotificationModal = (blogId: number) => {
    setSelectedBlogId(blogId);
    setIsNotificationModalOpen(true);
  };

  const handleToggleStatus = async (blogId: number) => {
    await toggleBlogStatus(blogId);
    fetchBlogs({
      page,
      per_page: pageSize,
      title: searchInput || undefined,
      active: filterActive
    });
  };

  const handleDeleteClick = (blogId: number) => {
    setBlogToDelete(blogId);
    setShowDeleteAlert(true);
  };

  const handleDeleteConfirm = async () => {
    if (blogToDelete) {
      await deleteBlog(blogToDelete);
      setShowDeleteAlert(false);
      fetchBlogs({
        page,
        per_page: pageSize,
        title: searchInput || undefined,
        active: filterActive
      });
    }
  };

  const handleActionSelectChange = (blogId: number, action: string) => {
    // Reset the select value
    setBlogActionSelects(prev => ({...prev, [blogId]: ""}));
    
    // Perform the selected action
    switch(action) {
      case "toggle":
        handleToggleStatus(blogId);
        break;
      case "delete":
        handleDeleteClick(blogId);
        break;
      default:
        break;
    }
  };

  const getActionOptions = (blog: any) => [
    { value: "", label: "Actions" },
    { value: "toggle", label: blog.active === 1 ? "Deactivate" : "Activate" },
    { value: "delete", label: "Delete" }
  ];

  const pageSizeOptions = [
    { value: "10", label: "10 per page" },
    { value: "20", label: "20 per page" },
    { value: "50", label: "50 per page" },
  ];

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "1", label: "Active Only" },
    { value: "0", label: "Inactive Only" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Blogs</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and content
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Blog
        </Button>
      </div>

      {/* Add the Blog Upload Banner here */}
      <BlogUploadBanner />

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Search</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Find blogs by title, author, or content
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
              <Input
                placeholder="Search blogs..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
            
            <div className="w-full md:w-48">
              <InputSelect
                name="status-filter"
                label=""
                options={statusOptions}
                onChange={(e) => handleFilterChange(e.target.value)}
                value={filterActive === undefined ? "" : filterActive ? "1" : "0"}
                placeholder="Filter by status"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Table */}
      <Card>
        <CardHeader>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Blog List</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {totalItems > 0 ? `${totalItems} blogs found` : "No blogs found"}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="table-container overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nr</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Read Count</TableHead>
                  <TableHead>Notif. Sent</TableHead>
                  <TableHead>Notif. Opened</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : blogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <p className="text-muted-foreground">No blogs found</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setIsCreateModalOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create your first blog post
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog, index) => (
                    <TableRow key={blog.id}>
                      <TableCell>{blog?.id ?? (page - 1) * pageSize + index + 1}</TableCell>
                      <TableCell>
                        {format(new Date(blog.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-md">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{blog.title}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{blog.author}</TableCell>
                      <TableCell>{blog.read_count.toLocaleString()}</TableCell>
                      <TableCell>{blog.notifications_sent.toLocaleString()}</TableCell>
                      <TableCell>{blog.notifications_read_count.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={blog.active === 1 ? "default" : "destructive"}>
                          {blog.active === 1 ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {blog.categories && blog.categories.map((category, i) => (
                            <Badge key={i} variant="neutral" className="mr-1">
                              {category.title}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/admin/blogs/${blog.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>
                          <Link href={`/admin/blogs/${blog.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleOpenNotificationModal(blog.id)}
                          >
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Send Notification</span>
                          </Button>
                          <div className="w-28">
                            <InputSelect
                              name={`action-${blog.id}`}
                              label=""
                              options={getActionOptions(blog)}
                              onChange={(e) => handleActionSelectChange(blog.id, e.target.value)}
                              value={blogActionSelects[blog.id] || ""}
                              placeholder="Actions"
                              className="w-full"
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {blogs.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, totalItems)} of {totalItems} blogs
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
          )}
        </CardContent>
      </Card>

      {/* Create Blog Modal */}
      <CreateBlogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Send Notification Modal */}
      {selectedBlogId && (
        <SendNotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
          blogId={selectedBlogId}
          onSuccess={() => {
            fetchBlogs({
              page,
              per_page: pageSize,
              title: searchInput || undefined,
              active: filterActive
            });
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-2">Deleting a blog is a sensitive operation that cannot be undone.</p>
              <p className="mb-2">Instead of deletion, you can simply deactivate the blog to hide it from users while preserving all data and analytics.</p>
              <p className="font-semibold">If you still want to proceed with deletion, all associated data including read counts and notification statistics will be permanently removed.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}  className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="h-10"></div>
    </div>
  )
}