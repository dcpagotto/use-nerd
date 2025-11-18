/**
 * Featured Products Component
 * Displays products from Strapi + Medusa
 */

import Link from 'next/link';
import Image from 'next/image';
import { getStrapiMediaUrl, getLabelColorClass } from '@/lib/strapi-utils';
import type { EnrichedFeaturedProduct } from '@/lib/data-fetcher';

interface FeaturedProductsProps {
  products: EnrichedFeaturedProduct[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: EnrichedFeaturedProduct }) {
  const thumbnailUrl = getStrapiMediaUrl(product.thumbnail);

  return (
    <Link
      href={`/produtos/${product.handle}`}
      className="group relative overflow-hidden rounded-cyber-lg bg-cyber-dark-100 border-2 border-neon-purple/20 shadow-cyber transition-all duration-300 hover:border-neon-purple hover:shadow-neon-purple hover:-translate-y-2 focus-cyber"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-cyber-dark-50">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-cyber-dark-50 text-gray-cyber-400">
            <span className="font-display text-4xl">?</span>
          </div>
        )}

        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Custom Label */}
        {product.customLabel && (
          <div
            className={`absolute left-3 top-3 z-10 rounded-cyber px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm ${getLabelColorClass(product.labelColor)}`}
          >
            {product.customLabel}
          </div>
        )}

        {/* Custom Badge */}
        {product.customBadge && (
          <div className="absolute right-3 top-3 z-10 rounded-cyber bg-neon-purple/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-neon-purple-sm backdrop-blur-sm">
            {product.customBadge}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-bold text-white line-clamp-2 group-hover:text-gradient-cyber transition-all">
          {product.title}
        </h3>

        {product.subtitle && (
          <p className="mb-3 text-sm text-gray-cyber-300 line-clamp-2">{product.subtitle}</p>
        )}

        {/* Price (from first variant) */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-auto">
            <PriceDisplay variant={product.variants[0]} />
          </div>
        )}
      </div>

      {/* Hover Effect - Neon Border */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-cyber transition-all duration-300 group-hover:h-2 shadow-neon-purple-sm" />

      {/* Corner accent glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-neon-purple/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
}

function PriceDisplay({ variant }: { variant: any }) {
  const price = variant.calculated_price?.calculated_amount || variant.price;
  const originalPrice = variant.calculated_price?.original_amount;

  // Format price in BRL
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount / 100); // Medusa stores prices in cents
  };

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-black text-gradient-cyber">{formatPrice(price)}</span>
      {originalPrice && originalPrice > price && (
        <span className="text-sm text-gray-cyber-500 line-through">{formatPrice(originalPrice)}</span>
      )}
    </div>
  );
}
