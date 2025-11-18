/**
 * Homepage - Integrated with Strapi CMS
 * Fetches banners and hero section from Strapi
 */

import Link from 'next/link';
import Image from 'next/image';
import { getHeroSection, getBanners } from '@/lib/strapi-client';
import { getStrapiMediaObjectUrl, getStrapiMediaAlt } from '@/lib/strapi-utils';

async function fetchHomepageData() {
  try {
    const [heroRes, bannersRes] = await Promise.all([
      getHeroSection('pt-BR', 60),
      getBanners('homepage', true, 'pt-BR', 60),
    ]);

    return {
      hero: heroRes?.data,
      banners: bannersRes?.data || [],
      error: null,
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      hero: null,
      banners: [],
      error: error instanceof Error ? error.message : 'Failed to fetch homepage data',
    };
  }
}

export default async function HomePage() {
  const { hero, banners } = await fetchHomepageData();

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section - Cyberpunk Theme with Strapi Data */}
      <section className="relative h-[600px] overflow-hidden bg-gradient-to-b from-purple-900/20 via-black to-black">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

        {/* Scan-line Animation */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-scan-line" />

        {/* Background Image from Strapi (if available) */}
        {hero?.attributes?.backgroundImage && (
          <Image
            src={getStrapiMediaObjectUrl(
              hero.attributes.backgroundImage,
              'medium'
            ) || ''}
            alt="Hero Background"
            fill
            className="object-cover opacity-20"
            priority
          />
        )}

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="max-w-4xl">
            {/* Title with Neon Glow */}
            <h1 className="text-6xl md:text-7xl font-black mb-6 uppercase tracking-wider">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 animate-pulse-slow">
                {hero?.attributes?.title || 'USE Nerd'}
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-300 font-light">
              {hero?.attributes?.subtitle || 'E-commerce com Rifas Blockchain Verificáveis'}
            </p>

            {/* CTA Button */}
            <Link
              href="/produtos"
              className="group inline-block relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative px-8 py-4 bg-black rounded-lg border border-purple-500 group-hover:border-pink-500 transition-all duration-300">
                <span className="text-lg font-bold uppercase tracking-wider text-purple-400 group-hover:text-pink-400 transition-colors">
                  {hero?.attributes?.ctaText || 'Explorar Produtos'}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Banners Section from Strapi */}
      {banners && banners.length > 0 && (
        <section className="py-12 bg-black">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => {
                const bannerImageUrl = getStrapiMediaObjectUrl(
                  banner.attributes?.image,
                  'medium'
                );
                const bannerAlt = getStrapiMediaAlt(
                  banner.attributes?.image,
                  banner.attributes?.title || 'Banner'
                );

                return (
                  <Link
                    key={banner.id}
                    href={banner.attributes?.link || '#'}
                    className="group relative overflow-hidden rounded-lg border-2 border-zinc-800 hover:border-purple-500 transition-all duration-300"
                  >
                    {bannerImageUrl ? (
                      <Image
                        src={bannerImageUrl}
                        alt={bannerAlt}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <p className="text-white text-center px-4">
                          {banner.attributes?.title || 'Banner'}
                        </p>
                      </div>
                    )}
                    {banner.attributes?.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                        <p className="p-4 text-white font-bold">
                          {banner.attributes.title}
                        </p>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400">
              Por que USE Nerd?
            </h2>
            <div className="h-1 w-32 mx-auto mt-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Feature 1 */}
            <div className="group relative bg-zinc-900 rounded-lg overflow-hidden border-2 border-zinc-800 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] p-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white group-hover:text-purple-400 transition-colors">E-commerce Completo</h3>
              <p className="text-gray-400">
                Loja online completa com produtos, carrinho e checkout integrado
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-zinc-900 rounded-lg overflow-hidden border-2 border-zinc-800 hover:border-pink-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] p-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-purple-600 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white group-hover:text-pink-400 transition-colors">Rifas Blockchain</h3>
              <p className="text-gray-400">
                Sorteios transparentes verificados na blockchain Polygon
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-zinc-900 rounded-lg overflow-hidden border-2 border-zinc-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] p-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Totalmente Seguro</h3>
              <p className="text-gray-400">
                Pagamentos seguros via PIX e Crypto com verificação blockchain
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black via-purple-900/10 to-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore nossos produtos ou participe das rifas blockchain com total transparência
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/produtos"
              className="group relative inline-block"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative px-8 py-4 bg-black rounded-lg border border-purple-500 group-hover:border-pink-500 transition-all duration-300">
                <span className="text-lg font-bold uppercase tracking-wider text-purple-400 group-hover:text-pink-400 transition-colors">
                  Ver Produtos
                </span>
              </div>
            </Link>

            <Link
              href="/rifas"
              className="group relative inline-block"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative px-8 py-4 bg-black rounded-lg border border-pink-500 group-hover:border-blue-500 transition-all duration-300">
                <span className="text-lg font-bold uppercase tracking-wider text-pink-400 group-hover:text-blue-400 transition-colors">
                  Ver Rifas
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// SEO Metadata
export async function generateMetadata() {
  return {
    title: 'USE Nerd - E-commerce com Rifas Blockchain',
    description: 'E-commerce completo com sistema de rifas verificado na blockchain Polygon. Transparência total nos sorteios.',
  };
}
