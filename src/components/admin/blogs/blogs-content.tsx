// components/admin/blogs/blogs-content.tsx
"use client";

import { useState } from "react";
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
} from "@/components/ui/card";
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
  FileText,
  RefreshCw,
  Search,
  Edit,
  Eye,
  Plus,
  Filter,
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import Link from "next/link";
import { CreateBlogModal } from "./create-blog-modal";

// Mock data for blogs
const mockBlogs = [
  {
    id: 1,
    title: "10 Best Foods to Try in Spring",
    title_en: "10 Best Foods to Try in Spring",
    author: "John Doe",
    read_count: 2543,
    notifications_sent: 1200,
    notifications_read_count: 987,
    active: 1,
    created_at: "2024-03-15T08:30:00",
    categories: ["Food", "Health"],
  },
  {
    id: 2,
    title: "How to Order Food Online Safely",
    title_en: "How to Order Food Online Safely",
    author: "Sarah Johnson",
    read_count: 1875,
    notifications_sent: 950,
    notifications_read_count: 730,
    active: 1,
    created_at: "2024-03-10T10:15:00",
    categories: ["Safety", "Tips"],
  },
  {
    id: 3,
    title: "Summer Food Trends to Watch",
    title_en: "Summer Food Trends to Watch",
    author: "Michael Smith",
    read_count: 3240,
    notifications_sent: 1800,
    notifications_read_count: 1450,
    active: 0,
    created_at: "2024-03-05T14:45:00",
    categories: ["Trends", "Seasonal"],
  },
  {
    id: 4,
    title: "Restaurant Etiquette Guide",
    title_en: "Restaurant Etiquette Guide",
    author: "Emily Wilson",
    read_count: 1290,
    notifications_sent: 850,
    notifications_read_count: 620,
    active: 1,
    created_at: "2024-02-28T16:20:00",
    categories: ["Etiquette", "Dining"],
  },
  {
    id: 5,
    title: "Healthy Eating on a Budget",
    title_en: "Healthy Eating on a Budget",
    author: "David Brown",
    read_count: 2100,
    notifications_sent: 1100,
    notifications_read_count: 890,
    active: 1,
    created_at: "2024-02-20T09:10:00",
    categories: ["Health", "Budget"],
  },
];

export function BlogsContent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Use mock data for now
  const blogs = mockBlogs;
  const totalItems = blogs.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    console.log("Searching for:", searchInput);
  };

  const handleCreateSuccess = () => {
    // Refresh the list after creation
    console.log("Blog created successfully");
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
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
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
        </CardContent>
      </Card>

      {/* Blog Table */}
      <Card>
        <CardHeader>
            <div>
        <h2 className="text-xl font-semibold tracking-tight">Blog List</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                {totalItems} blogs found in your database
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
                      <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
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
                          {blog.categories.map((category, i) => (
                            <Badge key={i} variant="outline" className="mr-1">
                              {category}
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {blogs.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
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
        </CardContent>
      </Card>

      {/* Create Blog Modal */}
      <CreateBlogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <div className="h-10"></div>
    </div>
  );
}