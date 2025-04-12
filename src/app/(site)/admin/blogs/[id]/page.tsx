// app/admin/blogs/[id]/page.tsx
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Eye, MessageSquare, Share2, ThumbsUp, User, Bell } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "View Blog - SnapFood Admin",
    description: "View blog post details and analytics.",
};

// Mock function to fetch blog data
async function getBlog(id: string) {
    // This would normally be an API call
    return {
        id: id,
        title: "10 Best Foods to Try in Spring",
        title_en: "10 Best Foods to Try in Spring",
        content: "<p>Spring is a wonderful time to explore fresh, seasonal ingredients. As the weather warms up and nature comes alive, so does the produce available at your local markets. Here are our top 10 picks for the best foods to enjoy during spring.</p><h3>1. Asparagus</h3><p>These tender green spears are at their peak in spring. They're delicious roasted, grilled, or added to pasta dishes.</p><h3>2. Strawberries</h3><p>Spring strawberries are sweeter and more flavorful than those available year-round. Enjoy them fresh, in salads, or as a dessert topping.</p><h3>3. Rhubarb</h3><p>Often used in pies and desserts, rhubarb's tart flavor pairs beautifully with sweeter fruits.</p><h3>4. Peas</h3><p>Fresh spring peas are nothing like their frozen counterparts. They're sweet, tender, and perfect for soups, risottos, and salads.</p><h3>5. Radishes</h3><p>These crisp, peppery vegetables add a delightful crunch to salads and make excellent crudités.</p>",
        content_en: "<p>Spring is a wonderful time to explore fresh, seasonal ingredients. As the weather warms up and nature comes alive, so does the produce available at your local markets. Here are our top 10 picks for the best foods to enjoy during spring.</p><h3>1. Asparagus</h3><p>These tender green spears are at their peak in spring. They're delicious roasted, grilled, or added to pasta dishes.</p><h3>2. Strawberries</h3><p>Spring strawberries are sweeter and more flavorful than those available year-round. Enjoy them fresh, in salads, or as a dessert topping.</p><h3>3. Rhubarb</h3><p>Often used in pies and desserts, rhubarb's tart flavor pairs beautifully with sweeter fruits.</p><h3>4. Peas</h3><p>Fresh spring peas are nothing like their frozen counterparts. They're sweet, tender, and perfect for soups, risottos, and salads.</p><h3>5. Radishes</h3><p>These crisp, peppery vegetables add a delightful crunch to salads and make excellent crudités.</p>",
        author: "John Doe",
        image_cover: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
        active: true,
        created_at: "2024-03-15T08:30:00",
        read_count: 2543,
        notifications_sent: 1200,
        notifications_read_count: 987,
        categories: ["Food", "Health"],
        show_quiz: "0",
        send_notification: "1",
        notification_title: "New Spring Foods Blog",
        notification_title_en: "New Spring Foods Blog",
    };
}

export default async function BlogViewPage({ params }: { params: { id: string } }) {
    const blog = await getBlog(params.id);
    
    return (
        <div className="px-3 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blogs">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Blog Details</h1>
                </div>
                <div className="flex gap-2">
                    <Link href={`/admin/blogs/${params.id}/edit`}>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                    <Button>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                    </Button>
                </div>
            </div>
            
            {/* Blog Header */}
            <div className="relative">
                <div className="w-full h-64 overflow-hidden rounded-lg">
                    <img 
                        src={blog.image_cover} 
                        alt={blog.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">{blog.title}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant={blog.active ? "default" : "secondary"}>
                                    {blog.active ? "Active" : "Inactive"}
                                </Badge>
                                {blog.categories.map((category, i) => (
                                    <Badge key={i} variant="outline">
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    {/* Blog Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                            <CardDescription>
                                Published content for this blog post
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
                        </CardContent>
                    </Card>
                    
                    {/* English Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Content (English)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content_en }} />
                        </CardContent>
                    </Card>
                </div>
                
                <div className="space-y-6">
                    {/* Blog Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Blog Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Author</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>{blog.author}</span>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Published Date</h3>
                                <div className="mt-1">
                                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Show Quiz</h3>
                                <div className="mt-1">
                                    {blog.show_quiz === "1" ? "Yes" : "No"}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Analytics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-lg p-3">
                                    <div className="text-sm text-muted-foreground">Read Count</div>
                                    <div className="text-2xl font-bold mt-1 flex items-center">
                                        <Eye className="h-5 w-5 text-primary mr-2" />
                                        {blog.read_count.toLocaleString()}
                                    </div>
                                </div>
                                
                                <div className="border rounded-lg p-3">
                                    <div className="text-sm text-muted-foreground">Notifications</div>
                                    <div className="text-2xl font-bold mt-1 flex items-center">
                                        <MessageSquare className="h-5 w-5 text-primary mr-2" />
                                        {blog.notifications_sent.toLocaleString()}
                                    </div>
                                </div>
                                
                                <div className="border rounded-lg p-3">
                                    <div className="text-sm text-muted-foreground">Notif. Opened</div>
                                    <div className="text-2xl font-bold mt-1 flex items-center">
                                        <ThumbsUp className="h-5 w-5 text-primary mr-2" />
                                        {blog.notifications_read_count.toLocaleString()}
                                    </div>
                                </div>
                                
                                <div className="border rounded-lg p-3">
                                    <div className="text-sm text-muted-foreground">Open Rate</div>
                                    <div className="text-2xl font-bold mt-1 flex items-center">
                                        <Share2 className="h-5 w-5 text-primary mr-2" />
                                        {Math.round((blog.notifications_read_count / blog.notifications_sent) * 100)}%
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Notification Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Send Notification</h3>
                                <div className="mt-1">
                                    {blog.send_notification === "1" ? "Yes" : "No"}
                                </div>
                            </div>
                            
                            {blog.send_notification === "1" && (
                                <>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Notification Title</h3>
                                        <div className="mt-1 flex items-center">
                                            <Bell className="h-4 w-4 text-muted-foreground mr-2" />
                                            {blog.notification_title}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Notification Title (English)</h3>
                                        <div className="mt-1 flex items-center">
                                            <Bell className="h-4 w-4 text-muted-foreground mr-2" />
                                            {blog.notification_title_en}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <div className="h-10"></div>
        </div>
    );
}