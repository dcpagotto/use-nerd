/**
 * Unified Data Fetcher
 * Combines Strapi CMS content with Medusa commerce data
 */

import { getFeaturedProducts as getStrapiFeatureProducts } from './strapi-client';
import { getNerdPremiado } from './strapi-client';
import { productsApi } from './medusa-api';
import {
  getActiveRaffles,
  getCompletedRaffles,
  getRaffleById,
  getRaffleWinner,
  verifyRaffleOnBlockchain,
  getBlockchainExplorerUrl,
} from './medusa-enhanced';
import type { FeaturedProduct } from './types/strapi';
import type { Raffle, WinnerInfo } from './types/medusa';

// ============================================
// Featured Products (Strapi + Medusa)
// ============================================

export interface EnrichedFeaturedProduct {
  // Medusa product data
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  handle: string;
  thumbnail?: string;
  variants: any[];
  // Strapi featured product metadata
  customLabel?: string;
  labelColor?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink';
  customBadge?: string;
  order: number;
}

/**
 * Fetch featured products: IDs from Strapi + product data from Medusa
 * @param locale - Locale for Strapi content
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getFeaturedProducts(
  locale: string = 'pt-BR',
  revalidate: number = 60
): Promise<EnrichedFeaturedProduct[]> {
  try {
    // 1. Fetch featured product IDs from Strapi
    const strapiProducts = await getStrapiFeatureProducts(true, locale, revalidate);

    if (!strapiProducts.data || strapiProducts.data.length === 0) {
      return [];
    }

    // 2. Fetch actual product data from Medusa for each ID
    const productPromises = strapiProducts.data.map(async (fp: FeaturedProduct) => {
      try {
        const response = await productsApi.retrieve(fp.attributes.productId);
        return {
          product: response.product,
          metadata: fp.attributes,
        };
      } catch (error) {
        console.error(`Failed to fetch product ${fp.attributes.productId}:`, error);
        return null;
      }
    });

    const products = await Promise.all(productPromises);

    // 3. Merge Strapi metadata with Medusa data
    return products
      .filter((p) => p !== null)
      .map((p) => ({
        // Medusa product data
        id: p!.product.id,
        title: p!.product.title,
        subtitle: p!.product.subtitle,
        description: p!.product.description,
        handle: p!.product.handle,
        thumbnail: p!.product.thumbnail,
        variants: p!.product.variants,
        // Strapi metadata
        customLabel: p!.metadata.customLabel,
        labelColor: p!.metadata.labelColor,
        customBadge: p!.metadata.customBadge,
        order: p!.metadata.order,
      }))
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

// ============================================
// Nerd Premiado Page (Strapi + Medusa)
// ============================================

export interface EnrichedWinnerAnnouncement {
  // Strapi winner data
  id: number;
  name: string;
  raffleId: string;
  raffleTitle: string;
  prizeDescription: string;
  winDate: string;
  photo?: string;
  testimonial?: string;
  city?: string;
  state?: string;
  // Blockchain verification data
  verificationStatus: 'verified' | 'pending' | 'not_verified';
  blockchainLink?: string;
  transactionHash?: string;
  contractAddress?: string;
}

export interface NerdPremiadoPageData {
  // Strapi static content
  content: {
    title: string;
    subtitle?: string;
    description: string;
    heroImage?: string;
  };
  // Live Medusa data
  activeRaffles: Raffle[];
  completedRaffles: Raffle[];
  enrichedWinners: EnrichedWinnerAnnouncement[];
}

/**
 * Fetch Nerd Premiado page with enriched winner data
 * @param locale - Locale for Strapi content
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getNerdPremiadoPageData(
  locale: string = 'pt-BR',
  revalidate: number = 60
): Promise<NerdPremiadoPageData> {
  try {
    // 1. Fetch static content from Strapi
    const strapiContent = await getNerdPremiado(locale, revalidate);

    // 2. Fetch live raffle data from Medusa
    const [activeRafflesRes, completedRafflesRes] = await Promise.all([
      getActiveRaffles(5, revalidate),
      getCompletedRaffles(10, revalidate),
    ]);

    // 3. Enrich winner announcements with blockchain verification
    const enrichedWinners = await Promise.all(
      (strapiContent.data.attributes.winnerAnnouncements || []).map(
        async (winner): Promise<EnrichedWinnerAnnouncement> => {
          try {
            // Try to get raffle data and verification
            const [raffleRes, verificationRes] = await Promise.all([
              getRaffleById(winner.raffleId, revalidate).catch(() => null),
              verifyRaffleOnBlockchain(winner.raffleId, revalidate).catch(() => null),
            ]);

            const raffle = raffleRes?.raffle;
            const verification = verificationRes?.verification;

            return {
              id: winner.id,
              name: winner.name,
              raffleId: winner.raffleId,
              raffleTitle: winner.raffleTitle,
              prizeDescription: winner.prizeDescription,
              winDate: winner.winDate,
              photo: winner.photo?.data?.attributes.url,
              testimonial: winner.testimonial,
              city: winner.city,
              state: winner.state,
              verificationStatus: verification?.is_verified
                ? 'verified'
                : raffle?.transaction_hash
                  ? 'pending'
                  : 'not_verified',
              blockchainLink:
                raffle?.transaction_hash || verification?.transaction_hash
                  ? getBlockchainExplorerUrl(
                      raffle?.transaction_hash || verification?.transaction_hash || ''
                    )
                  : undefined,
              transactionHash: raffle?.transaction_hash || verification?.transaction_hash,
              contractAddress: raffle?.contract_address || verification?.contract_address,
            };
          } catch (error) {
            console.error(`Error enriching winner ${winner.raffleId}:`, error);
            // Return basic data without enrichment
            return {
              id: winner.id,
              name: winner.name,
              raffleId: winner.raffleId,
              raffleTitle: winner.raffleTitle,
              prizeDescription: winner.prizeDescription,
              winDate: winner.winDate,
              photo: winner.photo?.data?.attributes.url,
              testimonial: winner.testimonial,
              city: winner.city,
              state: winner.state,
              verificationStatus: 'not_verified',
            };
          }
        }
      )
    );

    return {
      content: {
        title: strapiContent.data.attributes.title,
        subtitle: strapiContent.data.attributes.subtitle,
        description: strapiContent.data.attributes.description,
        heroImage: strapiContent.data.attributes.heroImage?.data?.attributes.url,
      },
      activeRaffles: activeRafflesRes.raffles || [],
      completedRaffles: completedRafflesRes.raffles || [],
      enrichedWinners,
    };
  } catch (error) {
    console.error('Error fetching Nerd Premiado page data:', error);
    throw error;
  }
}

// ============================================
// Homepage Data (Combined)
// ============================================

export interface HomepageData {
  hero?: {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    ctaButtonText?: string;
    ctaButtonLink?: string;
  };
  banners: Array<{
    id: number;
    title: string;
    subtitle?: string;
    image?: string;
    link?: string;
    buttonText?: string;
    position: string;
  }>;
  featuredProducts: EnrichedFeaturedProduct[];
  activeRaffles: Raffle[];
  recentWinners: WinnerInfo[];
}

/**
 * Fetch all homepage data in one call
 * @param locale - Locale for Strapi content
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getHomepageData(
  locale: string = 'pt-BR',
  revalidate: number = 60
): Promise<HomepageData> {
  try {
    const [
      heroRes,
      bannersRes,
      featuredProducts,
      activeRafflesRes,
      recentWinnersRes,
    ] = await Promise.all([
      // Strapi content
      import('./strapi-client')
        .then((m) => m.getHeroSection(locale, revalidate))
        .catch(() => null),
      import('./strapi-client')
        .then((m) => m.getBanners('homepage', true, locale, revalidate))
        .catch(() => ({ data: [] })),
      // Combined data
      getFeaturedProducts(locale, revalidate),
      // Medusa data
      getActiveRaffles(6, revalidate),
      import('./medusa-enhanced')
        .then((m) => m.getRaffleWinners(5, revalidate))
        .catch(() => ({ winners: [], count: 0 })),
    ]);

    return {
      hero: heroRes?.data
        ? {
            title: heroRes.data.attributes.title,
            subtitle: heroRes.data.attributes.subtitle,
            backgroundImage: heroRes.data.attributes.backgroundImage?.data?.attributes.url,
            ctaButtonText: heroRes.data.attributes.ctaButtonText,
            ctaButtonLink: heroRes.data.attributes.ctaButtonLink,
          }
        : undefined,
      banners:
        bannersRes.data?.map((b) => ({
          id: b.id,
          title: b.attributes.title,
          subtitle: b.attributes.subtitle,
          image: b.attributes.image?.data?.attributes.url,
          link: b.attributes.link,
          buttonText: b.attributes.buttonText,
          position: b.attributes.position,
        })) || [],
      featuredProducts,
      activeRaffles: activeRafflesRes.raffles || [],
      recentWinners: recentWinnersRes.winners || [],
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    throw error;
  }
}

// ============================================
// Raffle Detail Page (Medusa + Blockchain)
// ============================================

export interface RaffleDetailData {
  raffle: Raffle;
  stats: {
    total_tickets: number;
    tickets_sold: number;
    tickets_available: number;
    percentage_sold: number;
  };
  winner?: WinnerInfo | null;
  blockchain?: {
    is_verified: boolean;
    explorer_url?: string;
    contract_url?: string;
  };
}

/**
 * Fetch complete raffle detail data
 * @param raffleId - Raffle ID
 * @param revalidate - Next.js ISR revalidation time in seconds
 */
export async function getRaffleDetailData(
  raffleId: string,
  revalidate: number = 30
): Promise<RaffleDetailData> {
  try {
    const [raffleRes, statsRes, winner, verification] = await Promise.all([
      getRaffleById(raffleId, revalidate),
      import('./medusa-enhanced')
        .then((m) => m.getRaffleStats(raffleId, revalidate))
        .catch(() => null),
      getRaffleWinner(raffleId, revalidate).catch(() => null),
      verifyRaffleOnBlockchain(raffleId, revalidate).catch(() => null),
    ]);

    const raffle = raffleRes.raffle;
    const stats = statsRes?.stats;

    return {
      raffle,
      stats: stats || {
        total_tickets: raffle.total_tickets,
        tickets_sold: 0,
        tickets_available: raffle.total_tickets,
        percentage_sold: 0,
      },
      winner,
      blockchain: verification
        ? {
            is_verified: verification.verification.is_verified,
            explorer_url: verification.verification.verification_url,
            contract_url: verification.verification.contract_address
              ? getBlockchainExplorerUrl(verification.verification.contract_address)
              : undefined,
          }
        : undefined,
    };
  } catch (error) {
    console.error(`Error fetching raffle detail data for ${raffleId}:`, error);
    throw error;
  }
}

// ============================================
// Export Unified Data Fetcher
// ============================================

export const dataFetcher = {
  homepage: getHomepageData,
  featuredProducts: getFeaturedProducts,
  nerdPremiado: getNerdPremiadoPageData,
  raffleDetail: getRaffleDetailData,
};

export default dataFetcher;
