// api/external/omnigateway/types/snapfood-vendor.ts
export interface Vendor {
    externalSnapfoodId: number | string;
    name: string;
    description: string;
    address: string;
    phone: string;
    slug: string;
    hash_id: string;
    latitude: string | number;
    longitude: string | number;
    open: boolean;
    prefix: string;
    isActive: boolean;
    updatedAt: string;
    createdAt: string;
  }
  
  export interface Pagination {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  }
  
  export interface VendorData {
    vendors: Vendor[];
    pagination: Pagination;
  }
  
  export interface VendorListResponse {
    success: boolean;
    data: VendorData | null;
    error?: string;
  }
  
  export interface VendorParams {
    page?: number;
    per_page?: number;
  }