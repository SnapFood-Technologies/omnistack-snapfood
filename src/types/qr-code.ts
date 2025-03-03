// types/qr-code.ts
export interface Menu {
  id: string
  name: string
}

export type QRCodeType = 'PROFILE_WEB' | 'PROFILE_APP' | 'LANDING_PAGE' | 'CUSTOM_URL';
export type QRFlow = 'IN_APP_ONLY' | 'WITH_GOOGLE_REVIEW';


export interface QRCodeData {
  design: string
  primaryColor: string
  backgroundColor: string
  size: string
  customText?: string
  hasLogo: boolean
  errorLevel: string
  type: QRCodeType
  customUrl?: string
  menuId?: string
  logo?: File | null
  qrFlow?: QRFlow;
}

export interface QRConfigurationData {
  id?: string
  landingPageUrl?: string
  feeType: 'none' | 'fixed' | 'percentage'
  feeAmount?: number
  isActive: boolean
  restaurantId?: string
}