// types/snapfood-blog.ts
export interface Blog {
    id: number;
    title: string;
    content: string;
    title_en: string;
    content_en: string;
    author: string;
    image_cover: string | null;
    active: number;
    read_count: number;
    notifications_sent: number;
    notifications_read_count: number;
    show_quiz: string;
    created_at: string;
    updated_at: string;
    slug?: string;
    hash_id?: string;
    categories: BlogCategory[]; // Changed from string[] to BlogCategory[]
    blog_categories?: BlogCategory[]; // Made optional as it might not always be present  
    send_notification?: string;
    notification_title?: string;
    notification_title_en?: string;
  }
  
  export interface BlogCategory {
    id: number;
    title: string;
    title_en?: string;
    sq_title?: string;
  }
  
  export interface BlogParams {
    page?: number;
    per_page?: number;
    category_id?: number;
    title?: string;
    active?: boolean;
  }
  
  export interface BlogsResponse {
    success: boolean;
    blogs: {
      current_page: number;
      data: Blog[];
      from: number | null;
      last_page: number;
      path: string;
      per_page: number;
      to: number | null;
      total: number;
    };
  }
  
  export interface BlogResponse {
    success: boolean;
    blog: Blog;
  }
  
  export interface BlogCategoriesResponse {
    success: boolean;
    categories: BlogCategory[];
  }
  


  
  export interface CreateBlogData {
    title: string;
    content: string;
    title_en: string;
    content_en: string;
    author: string;
    active?: boolean | number | undefined;
    show_quiz?: string;
    blog_categories: number[];
    send_notification?: string;
    notification_title?: string;
    notification_title_en?: string;
    image_cover?: File;
  }
  
  export interface UpdateBlogData extends Partial<CreateBlogData> {
    id: number;
  }
  
  export interface BlogCreateResponse {
    success: boolean;
    message: string;
    blog: Blog;
    notifications_sent: number;
    quiz_generated: boolean;
  }
  
  export interface BlogUpdateResponse {
    success: boolean;
    message: string;
    blog: Blog;
    notifications_sent?: number;
  }
  
  export interface SendNotificationData {
    notification_title: string;
    notification_title_en: string;
    target_user_id?: number;
  }
  
  export interface NotificationResponse {
    success: boolean;
    message: string;
    notifications_sent: number;
    total_devices: number;
    failed_notifications: Array<{
      user_id: number;
      error: string;
    }>;
  }
  
  export interface NotificationReadResponse {
    success: boolean;
    message: string;
    notifications_read_count: number;
  }
  
  export interface ToggleStatusResponse {
    success: boolean;
    message: string;
    active: boolean;
  }
  
  export interface DeleteBlogResponse {
    success: boolean;
    message: string;
  }

  export interface BlogImageUploadResponse {
    success: boolean;
    url: string;
  }