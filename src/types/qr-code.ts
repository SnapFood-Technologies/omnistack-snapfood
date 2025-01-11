// types/qr-code.ts
export interface Menu {
    id: string
    name: string
  }
  
  export interface QRCodeData {
    design: string
    primaryColor: string
    backgroundColor: string
    size: string
    customText?: string
    hasLogo: boolean
    errorLevel: string
    type: 'TABLE' | 'TAKEOUT' | 'SPECIAL'
    tableNumber?: number
    menuId?: string
    customUrl?: string
    logo?: File | null
  }