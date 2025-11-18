/**
 * Strapi CMS - TypeScript Type Definitions
 * Complete typing for all 7 content types
 */

// ============================================
// Base Strapi Types
// ============================================

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface StrapiMedia {
  id: number;
  attributes: {
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: StrapiImageFormat;
      small?: StrapiImageFormat;
      medium?: StrapiImageFormat;
      large?: StrapiImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path?: string;
  size: number;
  width: number;
  height: number;
}

export interface StrapiLocalization {
  id: number;
  attributes: {
    locale: string;
    [key: string]: any;
  };
}

// ============================================
// Content Types - Attributes
// ============================================

/**
 * Hero Section - Main homepage banner
 */
export interface HeroSectionAttributes {
  title: string;
  subtitle?: string;
  backgroundImage: {
    data: StrapiMedia | null;
  };
  ctaButtonText?: string;
  ctaButtonLink?: string;
  isActive: boolean;
  locale: string;
  localizations?: {
    data: StrapiLocalization[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface HeroSection {
  id: number;
  attributes: HeroSectionAttributes;
}

/**
 * Banner - Promotional banners
 */
export interface BannerAttributes {
  title: string;
  subtitle?: string;
  image: {
    data: StrapiMedia | null;
  };
  link?: string;
  buttonText?: string;
  position: 'homepage' | 'sidebar' | 'category' | 'checkout' | 'other';
  order: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  locale: string;
  localizations?: {
    data: StrapiLocalization[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Banner {
  id: number;
  attributes: BannerAttributes;
}

/**
 * Page - Static pages (About, Terms, Privacy, etc.)
 */
export interface PageAttributes {
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  coverImage?: {
    data: StrapiMedia | null;
  };
  showInMenu: boolean;
  menuOrder: number;
  locale: string;
  localizations?: {
    data: StrapiLocalization[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Page {
  id: number;
  attributes: PageAttributes;
}

/**
 * Nerd Premiado - Winners page
 */
export interface WinnerAnnouncement {
  id: number;
  name: string;
  raffleId: string;
  raffleTitle: string;
  prizeDescription: string;
  winDate: string;
  photo?: {
    data: StrapiMedia | null;
  };
  testimonial?: string;
  city?: string;
  state?: string;
}

export interface NerdPremiadoAttributes {
  title: string;
  subtitle?: string;
  description: string;
  heroImage?: {
    data: StrapiMedia | null;
  };
  winnerAnnouncements: WinnerAnnouncement[];
  locale: string;
  localizations?: {
    data: StrapiLocalization[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface NerdPremiado {
  id: number;
  attributes: NerdPremiadoAttributes;
}

/**
 * Featured Product - Homepage featured products
 */
export interface FeaturedProductAttributes {
  productId: string; // Medusa product ID
  customLabel?: string; // Ex: "Lançamento", "Mais vendido"
  labelColor?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink';
  customBadge?: string;
  order: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  locale: string;
  localizations?: {
    data: StrapiLocalization[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface FeaturedProduct {
  id: number;
  attributes: FeaturedProductAttributes;
}

/**
 * Site Settings - Global site configuration
 */
export interface SocialLink {
  id: number;
  platform: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'whatsapp' | 'telegram';
  url: string;
  label?: string;
}

export interface ContactInfo {
  id: number;
  type: 'email' | 'phone' | 'whatsapp' | 'address';
  label: string;
  value: string;
}

export interface SiteSettingsAttributes {
  siteName: string;
  siteDescription: string;
  logo?: {
    data: StrapiMedia | null;
  };
  favicon?: {
    data: StrapiMedia | null;
  };
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  socialLinks?: SocialLink[];
  contactInfo?: ContactInfo[];
  footerText?: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  locale: string;
  localizations?: {
    data: StrapiLocalization[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface SiteSettings {
  id: number;
  attributes: SiteSettingsAttributes;
}

/**
 * Blog Post - News and updates
 */
export interface BlogPostAttributes {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: {
    data: StrapiMedia | null;
  };
  author?: string;
  category?: 'news' | 'tutorial' | 'announcement' | 'raffle' | 'winner' | 'other';
  tags?: string[];
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  locale: string;
  localizations?: {
    data: StrapiLocalization[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface BlogPost {
  id: number;
  attributes: BlogPostAttributes;
}

// ============================================
// Query Parameter Types
// ============================================

export interface StrapiPopulate {
  [key: string]: boolean | StrapiPopulate;
}

export interface StrapiFilters {
  [key: string]: any;
}

export interface StrapiSort {
  [key: string]: 'asc' | 'desc';
}

export interface StrapiPagination {
  page?: number;
  pageSize?: number;
  start?: number;
  limit?: number;
}

export interface StrapiQueryParams {
  populate?: string | string[] | StrapiPopulate;
  filters?: StrapiFilters;
  sort?: string | string[];
  pagination?: StrapiPagination;
  locale?: string;
  publicationState?: 'live' | 'preview';
}

// ============================================
// API Error Types
// ============================================

export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: any;
}

export interface StrapiErrorResponse {
  data: null;
  error: StrapiError;
}
