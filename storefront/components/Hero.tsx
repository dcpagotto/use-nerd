/**
 * Hero Component
 * Displays hero section from Strapi CMS
 */

import Link from 'next/link';
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/lib/strapi-utils';

interface HeroProps {
  hero: {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    ctaButtonText?: string;
    ctaButtonLink?: string;
  };
}

export default function Hero({ hero }: HeroProps) {
  const imageUrl = getStrapiMediaUrl(hero.backgroundImage);

  return (
    <section className="relative h-[600px] w-full overflow-hidden scan-line-container">
      {/* Background Image */}
      {imageUrl && (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={hero.title}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Cyberpunk overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/70 via-cyber-dark/50 to-cyber-dark" />
        </div>
      )}

      {/* Grid overlay pattern */}
      <div className="absolute inset-0 bg-grid-cyber bg-grid-md opacity-20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-display font-black uppercase leading-tight tracking-wider md:text-6xl lg:text-7xl text-gradient-neon animate-pulse-slow">
            {hero.title}
          </h1>

          {hero.subtitle && (
            <p className="mb-8 text-xl md:text-2xl lg:text-3xl text-gray-cyber-100 font-light">
              {hero.subtitle}
            </p>
          )}

          {hero.ctaButtonText && hero.ctaButtonLink && (
            <Link
              href={hero.ctaButtonLink}
              className="group relative inline-block"
            >
              {/* Button glow effect */}
              <div className="absolute -inset-1 bg-gradient-cyber rounded-cyber-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative px-8 py-4 bg-cyber-dark rounded-cyber-lg border-2 border-neon-purple group-hover:border-neon-pink transition-all duration-300">
                <span className="text-lg font-bold uppercase tracking-wider text-gradient-cyber group-hover:text-gradient-neon transition-all">
                  {hero.ctaButtonText}
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyber-dark to-transparent" />

      {/* Decorative neon border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-cyber shadow-neon-purple" />
    </section>
  );
}
