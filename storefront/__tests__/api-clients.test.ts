/**
 * API Clients Test Suite
 * Tests for Strapi and Medusa API clients
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variables
process.env.NEXT_PUBLIC_STRAPI_URL = 'http://localhost:1337';
process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL = 'http://localhost:9000';

// ============================================
// Strapi Client Tests
// ============================================

describe('Strapi Client', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  describe('getHeroSection', () => {
    it('should fetch hero section successfully', async () => {
      const mockHeroData = {
        data: {
          id: 1,
          attributes: {
            title: 'Bem-vindo ao USE Nerd',
            subtitle: 'As melhores rifas tech do Brasil',
            isActive: true,
            backgroundImage: {
              data: {
                id: 1,
                attributes: {
                  url: '/uploads/hero.jpg',
                  name: 'hero.jpg',
                  width: 1920,
                  height: 1080,
                },
              },
            },
          },
        },
        meta: {},
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHeroData,
      });

      const { getHeroSection } = await import('../lib/strapi-client');
      const result = await getHeroSection();

      expect(result.data).toBeDefined();
      expect(result.data.attributes.title).toBe('Bem-vindo ao USE Nerd');
    });

    it('should handle errors gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          error: {
            status: 404,
            name: 'NotFoundError',
            message: 'Hero section not found',
          },
        }),
      });

      const { getHeroSection } = await import('../lib/strapi-client');

      await expect(getHeroSection()).rejects.toThrow('Hero section not found');
    });
  });

  describe('getBanners', () => {
    it('should fetch banners with filters', async () => {
      const mockBannersData = {
        data: [
          {
            id: 1,
            attributes: {
              title: 'Promoção de Black Friday',
              position: 'homepage',
              isActive: true,
              order: 1,
            },
          },
        ],
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 1,
            total: 1,
          },
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBannersData,
      });

      const { getBanners } = await import('../lib/strapi-client');
      const result = await getBanners('homepage', true);

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data[0].attributes.position).toBe('homepage');
    });
  });

  describe('getFeaturedProducts', () => {
    it('should fetch featured products successfully', async () => {
      const mockFeaturedProducts = {
        data: [
          {
            id: 1,
            attributes: {
              productId: 'prod_01XXXXX',
              customLabel: 'Mais vendido',
              labelColor: 'blue',
              order: 1,
              isActive: true,
            },
          },
        ],
        meta: {},
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFeaturedProducts,
      });

      const { getFeaturedProducts } = await import('../lib/strapi-client');
      const result = await getFeaturedProducts();

      expect(result.data).toBeDefined();
      expect(result.data.length).toBeGreaterThan(0);
    });
  });
});

// ============================================
// Medusa Enhanced Client Tests
// ============================================

describe('Medusa Enhanced Client', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  describe('getActiveRaffles', () => {
    it('should fetch active raffles successfully', async () => {
      const mockRafflesData = {
        raffles: [
          {
            id: 'raffle_01XXXXX',
            title: 'Notebook Gamer High-End',
            status: 'active',
            total_tickets: 1000,
            ticket_price: 5000,
            product_type: 'computer',
          },
        ],
        count: 1,
        offset: 0,
        limit: 10,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRafflesData,
      });

      const { getActiveRaffles } = await import('../lib/medusa-enhanced');
      const result = await getActiveRaffles();

      expect(result.raffles).toBeDefined();
      expect(Array.isArray(result.raffles)).toBe(true);
      expect(result.raffles[0].status).toBe('active');
    });

    it('should handle empty results', async () => {
      const mockEmptyData = {
        raffles: [],
        count: 0,
        offset: 0,
        limit: 10,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEmptyData,
      });

      const { getActiveRaffles } = await import('../lib/medusa-enhanced');
      const result = await getActiveRaffles();

      expect(result.raffles).toBeDefined();
      expect(result.raffles.length).toBe(0);
    });
  });

  describe('getRaffleById', () => {
    it('should fetch a single raffle by ID', async () => {
      const mockRaffleData = {
        raffle: {
          id: 'raffle_01XXXXX',
          title: 'iPhone 15 Pro Max',
          status: 'active',
          total_tickets: 500,
          ticket_price: 10000,
          product_type: 'electronics',
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRaffleData,
      });

      const { getRaffleById } = await import('../lib/medusa-enhanced');
      const result = await getRaffleById('raffle_01XXXXX');

      expect(result.raffle).toBeDefined();
      expect(result.raffle.id).toBe('raffle_01XXXXX');
    });

    it('should handle 404 errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          error: {
            code: 'not_found',
            message: 'Raffle not found',
            type: 'not_found',
          },
        }),
      });

      const { getRaffleById } = await import('../lib/medusa-enhanced');

      await expect(getRaffleById('invalid_id')).rejects.toThrow('Raffle not found');
    });
  });

  describe('getRaffleWinners', () => {
    it('should fetch recent winners', async () => {
      const mockWinnersData = {
        winners: [
          {
            raffle_id: 'raffle_01XXXXX',
            raffle_title: 'PS5 Bundle',
            prize_description: 'PlayStation 5 + 2 controles + 3 jogos',
            winner_ticket_number: 42,
            winner_drawn_at: '2024-01-15T10:30:00Z',
            product_type: 'electronics',
          },
        ],
        count: 1,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWinnersData,
      });

      const { getRaffleWinners } = await import('../lib/medusa-enhanced');
      const result = await getRaffleWinners(10);

      expect(result.winners).toBeDefined();
      expect(Array.isArray(result.winners)).toBe(true);
    });
  });

  describe('Blockchain helpers', () => {
    it('should generate correct Polygon explorer URL', async () => {
      const { getBlockchainExplorerUrl } = await import('../lib/medusa-enhanced');
      const txHash = '0x1234567890abcdef';
      const url = getBlockchainExplorerUrl(txHash, 'polygon');

      expect(url).toBe('https://polygonscan.com/tx/0x1234567890abcdef');
    });

    it('should generate correct Mumbai explorer URL', async () => {
      const { getBlockchainExplorerUrl } = await import('../lib/medusa-enhanced');
      const txHash = '0x1234567890abcdef';
      const url = getBlockchainExplorerUrl(txHash, 'mumbai');

      expect(url).toBe('https://mumbai.polygonscan.com/tx/0x1234567890abcdef');
    });
  });
});

// ============================================
// Strapi Utils Tests
// ============================================

describe('Strapi Utils', () => {
  describe('getStrapiMediaUrl', () => {
    it('should convert relative URLs to absolute', async () => {
      const { getStrapiMediaUrl } = await import('../lib/strapi-utils');
      const relativeUrl = '/uploads/image.jpg';
      const absoluteUrl = getStrapiMediaUrl(relativeUrl);

      expect(absoluteUrl).toBe('http://localhost:1337/uploads/image.jpg');
    });

    it('should return absolute URLs as is', async () => {
      const { getStrapiMediaUrl } = await import('../lib/strapi-utils');
      const externalUrl = 'https://cdn.example.com/image.jpg';
      const result = getStrapiMediaUrl(externalUrl);

      expect(result).toBe(externalUrl);
    });

    it('should return null for undefined URLs', async () => {
      const { getStrapiMediaUrl } = await import('../lib/strapi-utils');
      const result = getStrapiMediaUrl(undefined);

      expect(result).toBeNull();
    });
  });

  describe('formatStrapiDate', () => {
    it('should format ISO date to Brazilian format', async () => {
      const { formatStrapiDate } = await import('../lib/strapi-utils');
      const isoDate = '2024-01-15T10:30:00Z';
      const formatted = formatStrapiDate(isoDate);

      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe('getStrapiExcerpt', () => {
    it('should extract plain text from markdown', async () => {
      const { getStrapiExcerpt } = await import('../lib/strapi-utils');
      const markdown = '# Title\n\nThis is a **bold** paragraph with a [link](url).';
      const excerpt = getStrapiExcerpt(markdown, 50);

      expect(excerpt).not.toContain('#');
      expect(excerpt).not.toContain('**');
      expect(excerpt).not.toContain('[');
    });

    it('should truncate long text', async () => {
      const { getStrapiExcerpt } = await import('../lib/strapi-utils');
      const longText = 'A'.repeat(200);
      const excerpt = getStrapiExcerpt(longText, 100);

      expect(excerpt.length).toBeLessThanOrEqual(104); // 100 + '...'
      expect(excerpt).toContain('...');
    });
  });

  describe('isBannerActive', () => {
    it('should return true for active banner within date range', async () => {
      const { isBannerActive } = await import('../lib/strapi-utils');
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      const tomorrow = new Date(Date.now() + 86400000).toISOString();

      expect(isBannerActive(yesterday, tomorrow)).toBe(true);
    });

    it('should return false for banner outside date range', async () => {
      const { isBannerActive } = await import('../lib/strapi-utils');
      const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString();
      const yesterday = new Date(Date.now() - 86400000).toISOString();

      expect(isBannerActive(lastWeek, yesterday)).toBe(false);
    });
  });
});

// ============================================
// Data Fetcher Tests
// ============================================

describe('Data Fetcher', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  describe('getFeaturedProducts (combined)', () => {
    it('should combine Strapi and Medusa data', async () => {
      // Mock Strapi response
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: [
              {
                id: 1,
                attributes: {
                  productId: 'prod_123',
                  customLabel: 'Lançamento',
                  labelColor: 'blue',
                  order: 1,
                  isActive: true,
                },
              },
            ],
            meta: {},
          }),
        })
        // Mock Medusa response
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            product: {
              id: 'prod_123',
              title: 'Notebook Gamer',
              handle: 'notebook-gamer',
              variants: [],
            },
          }),
        });

      const { getFeaturedProducts } = await import('../lib/data-fetcher');
      const result = await getFeaturedProducts();

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('customLabel');
    });
  });
});
