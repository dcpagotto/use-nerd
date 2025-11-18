/**
 * Strapi CMS API Client
 * Type-safe client for consuming Strapi content
 */

import qs from 'qs';
import type {
  StrapiResponse,
  StrapiQueryParams,
  HeroSection,
  Banner,
  Page,
  NerdPremiado,
  FeaturedProduct,
  SiteSettings,
  BlogPost,
  StrapiErrorResponse,
} from './types/strapi';

// ============================================
// Configuration
// ============================================

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
const DEFAULT_LOCALE = 'pt-BR';

// ============================================
// Error Handling
// ============================================

export class StrapiAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'StrapiAPIError';
  }
}

// ============================================
// Generic Fetch Function
// ============================================

async function strapiFetch<T>(
  endpoint: string,
  params?: StrapiQueryParams,
  options?: RequestInit
): Promise<T> {
  // Build query string
  const queryString = params ? qs.stringify(params, { encodeValuesOnly: true }) : '';
  const url = `${STRAPI_URL}/api${endpoint}${queryString ? `?${queryString}` : ''}`;

  // Build headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  // Add API token if available
  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData: StrapiErrorResponse = await response.json().catch(() => ({
        data: null,
        error: {
          status: response.status,
          name: 'HTTPError',
          message: response.statusText,
        },
      }));

      throw new StrapiAPIError(
        errorData.error.message || 'Strapi API Error',
        errorData.error.status || response.status,
        errorData.error.details
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof StrapiAPIError) {
      throw error;
    }

    // Network or parsing error
    throw new StrapiAPIError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500
    );
  }
}

// ============================================
// Hero Section API
// ============================================

/**
 * Get the active hero section
 * @param locale - Locale (default: pt-BR)
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getHeroSection(
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 60
): Promise<StrapiResponse<HeroSection>> {
  return strapiFetch<StrapiResponse<HeroSection>>(
    '/hero-section',
    {
      populate: ['backgroundImage'],
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

// ============================================
// Banners API
// ============================================

/**
 * Get banners with optional filtering
 * @param position - Filter by position (homepage, sidebar, etc.)
 * @param isActive - Filter by active status
 * @param locale - Locale (default: pt-BR)
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getBanners(
  position?: string,
  isActive: boolean = true,
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 60
): Promise<StrapiResponse<Banner[]>> {
  const filters: any = {};

  if (position) {
    filters.position = { $eq: position };
  }

  if (isActive !== undefined) {
    filters.isActive = { $eq: isActive };
  }

  return strapiFetch<StrapiResponse<Banner[]>>(
    '/banners',
    {
      populate: ['image'],
      filters,
      sort: ['order:asc'],
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

/**
 * Get a single banner by ID
 */
export async function getBanner(
  id: number,
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 60
): Promise<StrapiResponse<Banner>> {
  return strapiFetch<StrapiResponse<Banner>>(
    `/banners/${id}`,
    {
      populate: ['image'],
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

// ============================================
// Pages API
// ============================================

/**
 * Get all pages
 * @param showInMenu - Filter by menu visibility
 * @param locale - Locale (default: pt-BR)
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getPages(
  showInMenu?: boolean,
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 300
): Promise<StrapiResponse<Page[]>> {
  const filters: any = {};

  if (showInMenu !== undefined) {
    filters.showInMenu = { $eq: showInMenu };
  }

  return strapiFetch<StrapiResponse<Page[]>>(
    '/pages',
    {
      populate: ['coverImage'],
      filters,
      sort: ['menuOrder:asc'],
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

/**
 * Get a single page by slug
 * @param slug - Page slug
 * @param locale - Locale (default: pt-BR)
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getPageBySlug(
  slug: string,
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 300
): Promise<StrapiResponse<Page[]>> {
  return strapiFetch<StrapiResponse<Page[]>>(
    '/pages',
    {
      populate: ['coverImage'],
      filters: {
        slug: { $eq: slug },
      },
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

/**
 * Get all pages (for generateStaticParams)
 * @param locale - Locale (default: pt-BR)
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getAllPages(
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 300
): Promise<StrapiResponse<Page[]>> {
  return strapiFetch<StrapiResponse<Page[]>>(
    '/pages',
    {
      populate: ['coverImage'],
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

/**
 * Get a single page by ID
 */
export async function getPage(
  id: number,
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 300
): Promise<StrapiResponse<Page>> {
  return strapiFetch<StrapiResponse<Page>>(
    `/pages/${id}`,
    {
      populate: ['coverImage'],
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

// ============================================
// Nerd Premiado API
// ============================================

/**
 * Get Nerd Premiado page content
 * @param locale - Locale (default: pt-BR)
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getNerdPremiado(
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 60
): Promise<StrapiResponse<NerdPremiado>> {
  return strapiFetch<StrapiResponse<NerdPremiado>>(
    '/nerd-premiado',
    {
      populate: {
        heroImage: true,
        winnerAnnouncements: {
          populate: ['photo'],
        },
      },
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

// ============================================
// Featured Products API
// ============================================

/**
 * Get featured products
 * @param isActive - Filter by active status
 * @param locale - Locale (default: pt-BR)
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getFeaturedProducts(
  isActive: boolean = true,
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 60
): Promise<StrapiResponse<FeaturedProduct[]>> {
  const now = new Date().toISOString();
  const filters: any = {
    isActive: { $eq: isActive },
  };

  // Filter by date range if active
  if (isActive) {
    filters.$or = [
      { startDate: { $null: true } },
      { startDate: { $lte: now } },
    ];
    filters.$and = [
      {
        $or: [{ endDate: { $null: true } }, { endDate: { $gte: now } }],
      },
    ];
  }

  return strapiFetch<StrapiResponse<FeaturedProduct[]>>(
    '/featured-products',
    {
      filters,
      sort: ['order:asc'],
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

/**
 * Get a single featured product by ID
 */
export async function getFeaturedProduct(
  id: number,
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 60
): Promise<StrapiResponse<FeaturedProduct>> {
  return strapiFetch<StrapiResponse<FeaturedProduct>>(
    `/featured-products/${id}`,
    {
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

// ============================================
// Site Settings API
// ============================================

/**
 * Get global site settings
 * @param locale - Locale (default: pt-BR)
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getSiteSettings(
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 300
): Promise<StrapiResponse<SiteSettings>> {
  return strapiFetch<StrapiResponse<SiteSettings>>(
    '/site-setting',
    {
      populate: {
        logo: true,
        favicon: true,
        socialLinks: true,
        contactInfo: true,
      },
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

// ============================================
// Blog Posts API
// ============================================

/**
 * Get blog posts with optional filtering
 * @param filters - Optional filters (category, featured, tags, search)
 * @param locale - Locale (default: pt-BR)
 * @param page - Page number for pagination
 * @param pageSize - Number of items per page
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getBlogPosts(
  filters?: {
    category?: string;
    featured?: boolean;
    tags?: string[];
    search?: string;
  },
  locale: string = DEFAULT_LOCALE,
  page: number = 1,
  pageSize: number = 10,
  revalidate: number = 60
): Promise<StrapiResponse<BlogPost[]>> {
  const strapiFilters: any = {};

  if (filters?.category) {
    strapiFilters.category = { $eq: filters.category };
  }

  if (filters?.featured !== undefined) {
    strapiFilters.featured = { $eq: filters.featured };
  }

  if (filters?.tags && filters.tags.length > 0) {
    strapiFilters.tags = { $in: filters.tags };
  }

  if (filters?.search) {
    strapiFilters.$or = [
      { title: { $containsi: filters.search } },
      { excerpt: { $containsi: filters.search } },
      { content: { $containsi: filters.search } },
    ];
  }

  return strapiFetch<StrapiResponse<BlogPost[]>>(
    '/blog-posts',
    {
      populate: ['coverImage'],
      filters: strapiFilters,
      sort: ['publishedAt:desc'],
      pagination: {
        page,
        pageSize,
      },
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

/**
 * Get a single blog post by slug
 * @param slug - Blog post slug
 * @param locale - Locale (default: pt-BR)
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getBlogPostBySlug(
  slug: string,
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 60
): Promise<StrapiResponse<BlogPost[]>> {
  return strapiFetch<StrapiResponse<BlogPost[]>>(
    '/blog-posts',
    {
      populate: ['coverImage'],
      filters: {
        slug: { $eq: slug },
      },
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

/**
 * Get a single blog post by ID
 */
export async function getBlogPost(
  id: number,
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 60
): Promise<StrapiResponse<BlogPost>> {
  return strapiFetch<StrapiResponse<BlogPost>>(
    `/blog-posts/${id}`,
    {
      populate: ['coverImage'],
      locale,
    },
    {
      next: { revalidate },
    }
  );
}

// ============================================
// Unified Strapi Client Export
// ============================================

export const strapiClient = {
  heroSection: {
    get: getHeroSection,
  },
  banners: {
    list: getBanners,
    get: getBanner,
  },
  pages: {
    list: getPages,
    getBySlug: getPageBySlug,
    get: getPage,
  },
  nerdPremiado: {
    get: getNerdPremiado,
  },
  featuredProducts: {
    list: getFeaturedProducts,
    get: getFeaturedProduct,
  },
  siteSettings: {
    get: getSiteSettings,
  },
  blogPosts: {
    list: getBlogPosts,
    getBySlug: getBlogPostBySlug,
    get: getBlogPost,
  },
};

export default strapiClient;
