// types/snapfood-vendor.ts
export interface Vendor {
    externalSnapfoodId: number;
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
    isOpen?: boolean;
    prefix?: string;
    isActive: boolean;
    updatedAt: string;
    createdAt: string;
  }
  
  export interface VendorParams {
    page?: number;
    per_page?: number;
    limit?: number;
    search?: string;
  }
  
  export interface VendorListResponse {
    success: boolean;
    data: {
      vendors: Vendor[];
      pagination: {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;
      };
    };
  }
  
  export interface VendorSyncResponse {
    success: boolean;
    totalVendors: number;
    syncedVendors: number;
    createdVendors: number;
    updatedVendors: number;
    errors: { id: number; error: string }[];
  }