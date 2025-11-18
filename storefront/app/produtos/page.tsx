'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { medusaApi } from '@/lib/medusa-api';
import useCartStore from '@/store/cart-store';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'react-hot-toast';

interface MedusaProduct {
  id: string;
  title: string;
  description?: string;
  handle?: string;
  thumbnail?: string;
  variants?: Array<{
    id: string;
    title: string;
    prices?: Array<{
      amount: number;
      currency_code: string;
    }>;
    inventory_quantity?: number;
  }>;
  collection?: {
    id: string;
    title: string;
  };
  tags?: Array<{
    id: string;
    value: string;
  }>;
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { addItem } = useCartStore();

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery]);

  async function loadProducts() {
    setLoading(true);
    setError(null);

    try {
      const params: any = { limit: 24 };

      if (searchQuery) {
        params.q = searchQuery;
      }

      const response = await medusaApi.products.list(params);

      if (response.products && response.products.length > 0) {
        setProducts(response.products);
      } else {
        // If no products from API, show demo products
        setProducts(getDemoProducts());
        setError('Usando produtos de demonstração. Adicione produtos no Medusa Admin.');
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Erro ao conectar com Medusa. Usando produtos de demonstração.');
      setProducts(getDemoProducts());
    } finally {
      setLoading(false);
    }
  }

  function getDemoProducts(): MedusaProduct[] {
    return [
      {
        id: 'demo-1',
        title: 'Camiseta Cyberpunk Neon',
        description: 'Camiseta premium com estampa neon cyberpunk exclusiva. Material 100% algodão com tecnologia dry-fit.',
        handle: 'camiseta-cyberpunk-neon',
        thumbnail: '',
        variants: [{
          id: 'variant-1',
          title: 'P / Preto',
          prices: [{ amount: 7999, currency_code: 'BRL' }],
          inventory_quantity: 50
        }]
      },
      {
        id: 'demo-2',
        title: 'Moletom Tech Glow',
        description: 'Moletom com detalhes luminosos e design futurista. Perfeito para o inverno.',
        handle: 'moletom-tech-glow',
        thumbnail: '',
        variants: [{
          id: 'variant-2',
          title: 'M / Preto',
          prices: [{ amount: 15999, currency_code: 'BRL' }],
          inventory_quantity: 30
        }]
      },
      {
        id: 'demo-3',
        title: 'Boné Matrix Style',
        description: 'Boné estilo Matrix com bordado exclusivo de alta qualidade. Ajustável.',
        handle: 'bone-matrix-style',
        thumbnail: '',
        variants: [{
          id: 'variant-3',
          title: 'Único / Preto',
          prices: [{ amount: 5999, currency_code: 'BRL' }],
          inventory_quantity: 100
        }]
      },
      {
        id: 'demo-4',
        title: 'Jaqueta Neon Rider',
        description: 'Jaqueta corta-vento com detalhes neon refletivos. Ideal para noites frias.',
        handle: 'jaqueta-neon-rider',
        thumbnail: '',
        variants: [{
          id: 'variant-4',
          title: 'G / Preto',
          prices: [{ amount: 29999, currency_code: 'BRL' }],
          inventory_quantity: 20
        }]
      },
      {
        id: 'demo-5',
        title: 'Tênis Cyber Runner',
        description: 'Tênis esportivo com LED integrado e design futurista. Sola antiderrapante.',
        handle: 'tenis-cyber-runner',
        thumbnail: '',
        variants: [{
          id: 'variant-5',
          title: '42 / Preto',
          prices: [{ amount: 45999, currency_code: 'BRL' }],
          inventory_quantity: 15
        }]
      },
      {
        id: 'demo-6',
        title: 'Mochila Tech Pro',
        description: 'Mochila com compartimento para notebook e porta USB. Impermeável.',
        handle: 'mochila-tech-pro',
        thumbnail: '',
        variants: [{
          id: 'variant-6',
          title: 'Único / Preto',
          prices: [{ amount: 18999, currency_code: 'BRL' }],
          inventory_quantity: 40
        }]
      },
      {
        id: 'demo-7',
        title: 'Relógio Digital Neon',
        description: 'Relógio digital com display LED neon. Resistente à água.',
        handle: 'relogio-digital-neon',
        thumbnail: '',
        variants: [{
          id: 'variant-7',
          title: 'Único / Preto',
          prices: [{ amount: 12999, currency_code: 'BRL' }],
          inventory_quantity: 60
        }]
      },
      {
        id: 'demo-8',
        title: 'Óculos Cyber Vision',
        description: 'Óculos de sol estilo cyberpunk com proteção UV 400.',
        handle: 'oculos-cyber-vision',
        thumbnail: '',
        variants: [{
          id: 'variant-8',
          title: 'Único / Preto',
          prices: [{ amount: 8999, currency_code: 'BRL' }],
          inventory_quantity: 80
        }]
      },
    ];
  }

  const handleAddToCart = (product: MedusaProduct) => {
    const variant = product.variants?.[0];
    if (!variant) {
      toast.error('Produto sem variantes disponíveis');
      return;
    }

    const price = variant.prices?.[0]?.amount || 0;

    addItem({
      id: product.id,
      title: product.title,
      price,
      thumbnail: product.thumbnail || '',
      variant_id: variant.id,
      variant_title: variant.title,
    });

    toast.success(`${product.title} adicionado ao carrinho!`);
  };

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

  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="neon-text-purple mb-4 font-display text-display-2">
            Produtos
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-cyber-300">
            Explore nossa coleção exclusiva de produtos com design cyberpunk e tecnologia de ponta
          </p>

          {error && (
            <div className="mx-auto mt-4 max-w-2xl rounded-cyber border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-500">
              <p className="font-semibold">ℹ️ Modo Demonstração</p>
              <p className="mt-1">{error}</p>
              <p className="mt-2 text-xs">
                💡 Acesse o Medusa Admin em{' '}
                <a
                  href="http://localhost:9000/app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-yellow-400"
                >
                  localhost:9000/app
                </a>
                {' '}para adicionar produtos reais
              </p>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-cyber border border-neon-purple/30 bg-cyber-dark-100 py-2.5 pl-10 pr-4 text-white placeholder-gray-cyber-400 focus:border-neon-purple focus:outline-none"
              />
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-cyber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Sort Dropdown */}
          <select className="rounded-cyber border border-neon-purple/30 bg-cyber-dark-100 px-4 py-2.5 text-white focus:border-neon-purple focus:outline-none">
            <option>Mais Relevantes</option>
            <option>Menor Preço</option>
            <option>Maior Preço</option>
            <option>Mais Vendidos</option>
            <option>Lançamentos</option>
          </select>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="card-cyber-glow p-12 text-center">
            <div className="mb-4 text-4xl">📦</div>
            <p className="text-gray-cyber-300">Nenhum produto encontrado.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                loadProducts();
              }}
              className="btn-neon-outline mt-4"
            >
              Limpar Busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const variant = product.variants?.[0];
              const price = variant?.prices?.[0]?.amount || 0;
              const hasPrice = price > 0;
              const inStock = (variant?.inventory_quantity || 0) > 0;
              const isAvailable = hasPrice && inStock;

              return (
                <div key={product.id} className="card-cyber-glow group flex flex-col p-4">
                  {/* Product Image */}
                  <Link
                    href={`/produtos/${product.handle || product.id}`}
                    className="relative mb-4 block"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-cyber bg-gradient-to-br from-neon-purple/20 to-neon-blue/20">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <svg
                            className="h-24 w-24 text-neon-purple/40"
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

                      {/* Status Badges */}
                      {!hasPrice ? (
                        <div className="absolute right-2 top-2 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black shadow-neon-yellow">
                          Sem Preço
                        </div>
                      ) : !inStock ? (
                        <div className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                          Esgotado
                        </div>
                      ) : null}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark-100/0 opacity-0 transition-all duration-300 group-hover:bg-cyber-dark-100/80 group-hover:opacity-100">
                        <span className="btn-neon-outline btn-sm">
                          Ver Detalhes
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col">
                    <Link href={`/produtos/${product.handle || product.id}`}>
                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white hover:text-neon-purple transition-colors">
                        {product.title}
                      </h3>
                    </Link>

                    {product.description && (
                      <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-cyber-300">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-auto">
                      <div className="mb-3 flex items-baseline justify-between">
                        <div>
                          {hasPrice ? (
                            <>
                              <span className="neon-text-purple text-2xl font-bold">
                                {formatPrice(price)}
                              </span>
                              <span className="ml-2 text-xs text-gray-cyber-400">à vista</span>
                            </>
                          ) : (
                            <span className="text-lg font-semibold text-yellow-500">
                              Consulte
                            </span>
                          )}
                        </div>
                        {variant && hasPrice && (
                          <span className="text-xs text-gray-cyber-400">
                            {variant.inventory_quantity > 0 ? `${variant.inventory_quantity} em estoque` : 'Sem estoque'}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!isAvailable}
                        className={`w-full btn-sm ${
                          isAvailable
                            ? 'btn-neon-filled-purple'
                            : 'cursor-not-allowed border border-gray-cyber-700 bg-gray-cyber-800/50 text-gray-cyber-400'
                        }`}
                      >
                        {!hasPrice ? '⚠️ Sem Preço' : !inStock ? '❌ Esgotado' : '🛒 Adicionar'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {products.length >= 24 && (
          <div className="mt-12 text-center">
            <button className="btn-neon-blue">
              Carregar Mais Produtos
            </button>
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-20">
          <div className="card-cyber-glow p-12 text-center">
            <h2 className="neon-text-purple mb-4 font-display text-heading-1">
              Não encontrou o que procura?
            </h2>
            <p className="mb-6 text-gray-cyber-300">
              Confira nossas rifas de produtos premium com preços incríveis
            </p>
            <Link href="/raffles" className="btn-neon-filled-purple">
              Ver Rifas Ativas
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
