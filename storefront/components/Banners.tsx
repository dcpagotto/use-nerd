/**
 * Banners Component
 * Displays promotional banners from Strapi CMS
 */

import Link from 'next/link';
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/lib/strapi-utils';

interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  buttonText?: string;
  position: string;
}

interface BannersProps {
  banners: Banner[];
  position?: string;
}

export default function Banners({ banners, position }: BannersProps) {
  // Filter banners by position if specified
  const filteredBanners = position
    ? banners.filter((b) => b.position === position)
    : banners;

  if (filteredBanners.length === 0) return null;

  return (
    <div className="space-y-6">
      {filteredBanners.map((banner) => (
        <BannerCard key={banner.id} banner={banner} />
      ))}
    </div>
  );
}

function BannerCard({ banner }: { banner: Banner }) {
  const imageUrl = getStrapiMediaUrl(banner.image);

  const BannerContent = (
    <div className="group relative overflow-hidden rounded-cyber-lg bg-gradient-cyber shadow-cyber-lg transition-all duration-300 hover:shadow-neon-purple border-2 border-neon-purple/20 hover:border-neon-purple">
      {/* Background Image */}
      {imageUrl && (
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={banner.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          {/* Cyberpunk overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-dark/80 via-cyber-dark/50 to-transparent" />

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-grid-cyber bg-grid-md opacity-10 pointer-events-none" />
        </div>
      )}

      {/* Banner Content */}
      <div className={`${imageUrl ? 'absolute inset-0' : 'relative aspect-[21/9]'} flex items-center`}>
        <div className="px-8 py-6 md:px-12 md:py-8">
          <h3 className="mb-3 text-3xl font-display font-black uppercase tracking-wider md:text-4xl lg:text-5xl text-gradient-neon">
            {banner.title}
          </h3>

          {banner.subtitle && (
            <p className="mb-6 text-lg md:text-xl lg:text-2xl text-gray-cyber-100 font-light">
              {banner.subtitle}
            </p>
          )}

          {banner.buttonText && (
            <span className="group/btn relative inline-block">
              {/* Button glow */}
              <span className="absolute -inset-1 bg-gradient-cyber rounded-cyber blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative inline-block rounded-cyber bg-cyber-dark border-2 border-neon-blue px-6 py-3 font-bold uppercase tracking-wider text-neon-blue transition-all duration-300 group-hover:border-neon-pink group-hover:text-neon-pink group-hover:scale-105">
                {banner.buttonText}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Decorative neon border */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-cyber shadow-neon-purple-sm" />

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-neon-pink/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );

  // If banner has a link, wrap in Link component
  if (banner.link) {
    return (
      <Link
        href={banner.link}
        className="block focus-cyber rounded-cyber-lg"
      >
        {BannerContent}
      </Link>
    );
  }

  // Otherwise, just render the banner
  return BannerContent;
}
