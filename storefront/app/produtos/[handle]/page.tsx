'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { medusaApi } from '@/lib/medusa-api';
import useCartStore from '@/store/cart-store';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'react-hot-toast';

interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  prices?: Array<{
    amount: number;
    currency_code: string;
  }>;
  options?: Array<{
    value: string;
    option_id: string;
  }>;
  inventory_quantity?: number;
}

interface Product {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  handle?: string;
  thumbnail?: string;
  images?: Array<{ id: string; url: string }>;
  variants?: ProductVariant[];
  options?: Array<{
    id: string;
    title: string;
    values: Array<{ id: string; value: string }>;
  }>;
  tags?: Array<{ id: string; value: string }>;
  collection?: { id: string; title: string };
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  material?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const handle = params?.handle as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { addItem } = useCartStore();

  useEffect(() => {
    if (handle) {
      loadProduct();
    }
  }, [handle]);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      // Find variant that matches selected options
      const matchingVariant = findMatchingVariant();
      setSelectedVariant(matchingVariant || product.variants[0]);
    }
  }, [selectedOptions, product]);

  async function loadProduct() {
    setLoading(true);
    setError(null);

    try {
      const response = await medusaApi.products.retrieve(handle);
      setProduct(response.product);

      // Initialize selected options with first variant
      if (response.product.variants && response.product.variants.length > 0) {
        const firstVariant = response.product.variants[0];
        setSelectedVariant(firstVariant);

        // Set default options from first variant
        if (firstVariant.options && response.product.options) {
          const initialOptions: Record<string, string> = {};
          firstVariant.options.forEach((option) => {
            initialOptions[option.option_id] = option.value;
          });
          setSelectedOptions(initialOptions);
        }
      }
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Produto não encontrado');
    } finally {
      setLoading(false);
    }
  }

  function findMatchingVariant(): ProductVariant | null {
    if (!product?.variants) return null;

    return product.variants.find((variant) => {
      if (!variant.options) return false;

      return variant.options.every((option) => {
        return selectedOptions[option.option_id] === option.value;
      });
    }) || null;
  }

  function handleOptionChange(optionId: string, value: string) {
    setSelectedOptions({
      ...selectedOptions,
      [optionId]: value,
    });
  }

  function handleAddToCart() {
    if (!product || !selectedVariant) {
      toast.error('Selecione uma variante do produto');
      return;
    }

    const price = selectedVariant.prices?.[0]?.amount || 0;
    const inStock = (selectedVariant.inventory_quantity || 0) > 0;

    if (!inStock) {
      toast.error('Produto indisponível no momento');
      return;
    }

    if (quantity < 1 || quantity > 10) {
      toast.error('Quantidade deve ser entre 1 e 10');
      return;
    }

    addItem({
      id: product.id,
      title: product.title,
      price,
      thumbnail: product.thumbnail || '',
      variant_id: selectedVariant.id,
      variant_title: selectedVariant.title,
      quantity,
    });

    toast.success(`${quantity}x ${product.title} adicionado ao carrinho!`);
  }

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceInCents / 100);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="card-cyber-glow max-w-md p-12 text-center">
          <div className="mb-4 text-6xl">😞</div>
          <h2 className="neon-text-purple mb-4 text-2xl font-bold">Produto não encontrado</h2>
          <p className="mb-6 text-gray-cyber-300">{error || 'O produto que você procura não existe.'}</p>
          <Link href="/produtos" className="btn-neon-filled-purple">
            Ver Todos os Produtos
          </Link>
        </div>
      </div>
    );
  }

  const price = selectedVariant?.prices?.[0]?.amount || 0;
  const hasPrice = price > 0;
  const inStock = (selectedVariant?.inventory_quantity || 0) > 0;
  const isAvailable = hasPrice && inStock;
  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[currentImageIndex]?.url || product.thumbnail;

  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-cyber-400">
          <Link href="/" className="hover:text-neon-purple transition-colors">
            Início
          </Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-neon-purple transition-colors">
            Produtos
          </Link>
          <span>/</span>
          <span className="text-white">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="card-cyber-glow overflow-hidden p-4">
              <div className="relative aspect-square overflow-hidden rounded-cyber bg-gradient-to-br from-neon-purple/20 to-neon-blue/20">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg
                      className="h-32 w-32 text-neon-purple/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-cyber border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-neon-purple shadow-neon-purple-sm'
                        : 'border-gray-cyber-700 hover:border-neon-purple/50'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.title} - ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="neon-text-purple mb-2 font-display text-4xl font-bold">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-lg text-gray-cyber-300">{product.subtitle}</p>
              )}

              <div className="mt-4 flex items-baseline gap-4">
                {hasPrice ? (
                  <>
                    <span className="neon-text-purple text-5xl font-bold">
                      {formatPrice(price)}
                    </span>
                    <span className="text-gray-cyber-400">à vista</span>
                  </>
                ) : (
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-bold text-yellow-500">
                      Preço não configurado
                    </span>
                    <span className="text-sm text-gray-cyber-400">
                      Entre em contato para mais informações
                    </span>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-3">
                {!hasPrice ? (
                  <div className="flex items-center gap-2 text-sm text-yellow-400">
                    <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-neon-yellow"></span>
                    <span>Aguardando configuração de preços</span>
                  </div>
                ) : inStock ? (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <span className="h-2 w-2 rounded-full bg-green-400 shadow-neon-green"></span>
                    <span>
                      {selectedVariant?.inventory_quantity || 0} unidades em estoque
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-400">
                    <span className="h-2 w-2 rounded-full bg-red-400"></span>
                    <span>Produto esgotado</span>
                  </div>
                )}
              </div>
            </div>

            {/* Options Selector */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-4 border-y border-gray-cyber-700 py-6">
                {product.options.map((option) => (
                  <div key={option.id}>
                    <label className="mb-3 block text-sm font-semibold text-white">
                      {option.title}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => {
                        const isSelected = selectedOptions[option.id] === value.value;
                        return (
                          <button
                            key={value.id}
                            onClick={() => handleOptionChange(option.id, value.value)}
                            className={`rounded-cyber border-2 px-4 py-2 font-semibold transition-all ${
                              isSelected
                                ? 'border-neon-purple bg-neon-purple/20 text-neon-purple shadow-neon-purple-sm'
                                : 'border-gray-cyber-700 text-gray-cyber-300 hover:border-neon-purple/50'
                            }`}
                          >
                            {value.value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-white">
                Quantidade
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-cyber border border-neon-purple/30 bg-cyber-dark-100">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-white hover:bg-neon-purple/10 transition-colors"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.min(10, Math.max(1, val)));
                    }}
                    className="w-16 bg-transparent py-3 text-center text-white focus:outline-none"
                    min="1"
                    max="10"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-4 py-3 text-white hover:bg-neon-purple/10 transition-colors"
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-cyber-400">Máximo: 10 unidades</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`w-full py-4 text-lg font-semibold transition-all ${
                  isAvailable
                    ? 'btn-neon-filled-purple'
                    : 'cursor-not-allowed border-2 border-gray-cyber-700 bg-gray-cyber-800/50 text-gray-cyber-400 hover:border-gray-cyber-600'
                }`}
              >
                {!hasPrice ? (
                  '⚠️ Sem Preço Configurado'
                ) : !inStock ? (
                  '❌ Produto Esgotado'
                ) : (
                  '🛒 Adicionar ao Carrinho'
                )}
              </button>

              {!hasPrice && (
                <div className="rounded-cyber border border-yellow-500/30 bg-yellow-500/10 p-3 text-center">
                  <p className="text-sm text-yellow-400">
                    📧 Entre em contato para mais informações sobre este produto
                  </p>
                </div>
              )}

              {selectedVariant?.sku && (
                <p className="text-center text-xs text-gray-cyber-500">
                  SKU: {selectedVariant.sku}
                </p>
              )}
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="card-cyber-glow p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">Descrição</h3>
                <p className="whitespace-pre-line text-gray-cyber-300">{product.description}</p>
              </div>
            )}

            {/* Product Specifications */}
            {(product.material || product.weight || product.length) && (
              <div className="card-cyber-glow p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">Especificações</h3>
                <dl className="space-y-2 text-sm">
                  {product.material && (
                    <div className="flex justify-between border-b border-gray-cyber-800 pb-2">
                      <dt className="text-gray-cyber-400">Material:</dt>
                      <dd className="text-white">{product.material}</dd>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between border-b border-gray-cyber-800 pb-2">
                      <dt className="text-gray-cyber-400">Peso:</dt>
                      <dd className="text-white">{product.weight}g</dd>
                    </div>
                  )}
                  {product.length && product.width && product.height && (
                    <div className="flex justify-between border-b border-gray-cyber-800 pb-2">
                      <dt className="text-gray-cyber-400">Dimensões:</dt>
                      <dd className="text-white">
                        {product.length} × {product.width} × {product.height} cm
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3 py-1 text-xs text-neon-purple"
                  >
                    #{tag.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section (placeholder) */}
        <section className="mt-20">
          <h2 className="neon-text-purple mb-8 text-center font-display text-3xl font-bold">
            Você também pode gostar
          </h2>
          <div className="card-cyber-glow p-12 text-center">
            <p className="text-gray-cyber-400">Produtos relacionados em breve...</p>
            <Link href="/produtos" className="btn-neon-outline mt-4 inline-block">
              Ver Todos os Produtos
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
