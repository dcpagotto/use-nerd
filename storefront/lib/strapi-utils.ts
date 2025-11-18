/**
 * Strapi CMS Utility Functions
 * Helper functions for working with Strapi data
 */

import type { StrapiMedia } from './types/strapi';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// ============================================
// Media URL Resolution
// ============================================

/**
 * Resolve Strapi media URL to absolute URL
 * @param url - Media URL from Strapi
 * @returns Absolute URL or null if no URL provided
 */
export function getStrapiMediaUrl(url?: string): string | null {
  if (!url) return null;

  // If already absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Ensure URL starts with /
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

  return `${STRAPI_URL}${normalizedUrl}`;
}

/**
 * Get Strapi media object URL
 * @param media - Strapi media object
 * @param format - Optional format (thumbnail, small, medium, large)
 * @returns Absolute URL or null
 */
export function getStrapiMediaObjectUrl(
  media?: { data: StrapiMedia | null } | null,
  format?: 'thumbnail' | 'small' | 'medium' | 'large'
): string | null {
  if (!media?.data?.attributes) return null;

  const { attributes } = media.data;

  // Try to get specific format
  if (format && attributes.formats?.[format]?.url) {
    return getStrapiMediaUrl(attributes.formats[format].url);
  }

  // Fallback to original URL
  return getStrapiMediaUrl(attributes.url);
}

/**
 * Get Strapi media alt text
 * @param media - Strapi media object
 * @param fallback - Fallback text if no alt text available
 * @returns Alt text or fallback
 */
export function getStrapiMediaAlt(
  media?: { data: StrapiMedia | null } | null,
  fallback: string = ''
): string {
  if (!media?.data?.attributes) return fallback;

  return (
    media.data.attributes.alternativeText ||
    media.data.attributes.caption ||
    media.data.attributes.name ||
    fallback
  );
}

// ============================================
// Date Formatting
// ============================================

/**
 * Format Strapi date to Brazilian format (DD/MM/YYYY)
 * @param date - ISO date string
 * @returns Formatted date string
 */
export function formatStrapiDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Format Strapi date to Brazilian datetime format (DD/MM/YYYY HH:MM)
 * @param date - ISO date string
 * @returns Formatted datetime string
 */
export function formatStrapiDateTime(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Format Strapi date to relative time (e.g., "2 dias atrás")
 * @param date - ISO date string
 * @returns Relative time string
 */
export function formatStrapiRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  const intervals = {
    ano: 31536000,
    mês: 2592000,
    semana: 604800,
    dia: 86400,
    hora: 3600,
    minuto: 60,
    segundo: 1,
  };

  for (const [name, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${name}${interval > 1 ? (name === 'mês' ? 'es' : 's') : ''} atrás`;
    }
  }

  return 'agora';
}

// ============================================
// Rich Text Processing
// ============================================

/**
 * Extract plain text from Strapi rich text (Markdown)
 * @param content - Markdown content
 * @param maxLength - Maximum length of excerpt
 * @returns Plain text excerpt
 */
export function getStrapiExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // Convert links to text
    .replace(/[#*_~`]/g, '') // Remove markdown characters
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  // Truncate to maxLength
  if (plainText.length <= maxLength) return plainText;

  return plainText.substring(0, maxLength).trim() + '...';
}

/**
 * Convert Strapi markdown to HTML (basic conversion)
 * For more advanced conversion, use a library like `marked` or `remark`
 * @param markdown - Markdown content
 * @returns Basic HTML
 */
export function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
}

// ============================================
// Validation Helpers
// ============================================

/**
 * Check if a banner is currently active based on dates
 * @param startDate - Start date (ISO string or null)
 * @param endDate - End date (ISO string or null)
 * @returns True if currently active
 */
export function isBannerActive(startDate?: string | null, endDate?: string | null): boolean {
  const now = new Date();

  if (startDate) {
    const start = new Date(startDate);
    if (now < start) return false;
  }

  if (endDate) {
    const end = new Date(endDate);
    if (now > end) return false;
  }

  return true;
}

/**
 * Check if maintenance mode is enabled
 * @param maintenanceMode - Maintenance mode flag
 * @param bypassToken - Optional bypass token from query params
 * @returns True if site is in maintenance mode
 */
export function isMaintenanceMode(
  maintenanceMode: boolean,
  bypassToken?: string
): boolean {
  // Allow bypass with secret token
  const BYPASS_TOKEN = process.env.NEXT_PUBLIC_MAINTENANCE_BYPASS_TOKEN;
  if (BYPASS_TOKEN && bypassToken === BYPASS_TOKEN) {
    return false;
  }

  return maintenanceMode;
}

// ============================================
// SEO Helpers
// ============================================

/**
 * Build Open Graph metadata from Strapi content
 * @param params - Metadata parameters
 * @returns Open Graph object
 */
export function buildOpenGraph(params: {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}) {
  const { title, description, image, url, type = 'website' } = params;

  return {
    title,
    description,
    type,
    url,
    ...(image && {
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    }),
  };
}

/**
 * Generate JSON-LD structured data for blog posts
 * @param post - Blog post data
 * @returns JSON-LD object
 */
export function generateBlogPostJsonLd(post: {
  title: string;
  excerpt?: string;
  author?: string;
  publishedAt: string;
  updatedAt: string;
  coverImage?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author || 'USE Nerd',
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    ...(post.coverImage && {
      image: post.coverImage,
    }),
    url: post.url,
  };
}

// ============================================
// Color Helpers
// ============================================

/**
 * Get Tailwind color class from label color
 * @param color - Label color from Strapi
 * @returns Tailwind CSS class
 */
export function getLabelColorClass(
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink'
): string {
  const colorMap = {
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    yellow: 'bg-yellow-500 text-black',
    purple: 'bg-purple-500 text-white',
    pink: 'bg-pink-500 text-white',
  };

  return colorMap[color || 'blue'];
}

// ============================================
// Utility Exports
// ============================================

export const strapiUtils = {
  media: {
    getUrl: getStrapiMediaUrl,
    getObjectUrl: getStrapiMediaObjectUrl,
    getAlt: getStrapiMediaAlt,
  },
  date: {
    format: formatStrapiDate,
    formatDateTime: formatStrapiDateTime,
    formatRelative: formatStrapiRelativeTime,
  },
  content: {
    getExcerpt: getStrapiExcerpt,
    markdownToHtml,
  },
  validation: {
    isBannerActive,
    isMaintenanceMode,
  },
  seo: {
    buildOpenGraph,
    generateBlogPostJsonLd,
  },
  colors: {
    getLabelColorClass,
  },
};

export default strapiUtils;
