'use client';

import useCartStore from '@/store/cart-store';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const { addItem, getTotalItems } = useCartStore();

  // Produtos de exemplo para demonstração
  const exampleProducts = [
    {
      id: 'product-1',
      title: 'Camiseta Cyberpunk Neon',
      price: 7999, // R$ 79,99 em centavos
      thumbnail: '',
      description: 'Camiseta premium com estampa neon cyberpunk',
    },
    {
      id: 'product-2',
      title: 'Moletom Tech Glow',
      price: 15999, // R$ 159,99
      thumbnail: '',
      description: 'Moletom com detalhes luminosos',
    },
    {
      id: 'product-3',
      title: 'Boné Matrix Style',
      price: 5999, // R$ 59,99
      thumbnail: '',
      description: 'Boné estilo Matrix com bordado exclusivo',
    },
  ];

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceInCents / 100);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cyber-dark-200 via-cyber-dark-100 to-cyber-dark-200 py-20 lg:py-32">
        {/* Background grid effect */}
        <div className="absolute inset-0 bg-grid-cyber bg-grid-md opacity-20" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="neon-text-purple font-display text-display-2 lg:text-display-1 mb-6 animate-fade-in">
              USE Nerd
            </h1>
            <p className="text-gradient-cyber mb-4 text-2xl font-bold lg:text-3xl">
              E-commerce com Rifas Blockchain
            </p>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-cyber-300">
              Plataforma de e-commerce com sistema de rifas transparentes verificadas por blockchain
              na rede Polygon. Compre, participe e ganhe com total segurança.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="btn-neon-filled-purple text-lg">
                Explorar Produtos
              </button>
              <button className="btn-neon-blue text-lg">
                Ver Rifas Ativas
              </button>
            </div>
          </div>
        </div>

        {/* Decorative glow effect */}
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-purple/20 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="neon-text-purple mb-12 text-center font-display text-heading-1">
            Por que escolher USE Nerd?
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="card-cyber-glow group p-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-cyber bg-gradient-cyber shadow-neon-purple-sm transition-shadow group-hover:shadow-neon-purple">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">E-commerce Completo</h3>
              <p className="text-gray-cyber-300">
                Loja online completa com produtos exclusivos, checkout seguro e entrega nacional.
              </p>
            </div>

            <div className="card-cyber-glow group p-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-cyber bg-gradient-cyber-reverse shadow-neon-blue-sm transition-shadow group-hover:shadow-neon-blue">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Rifas Blockchain</h3>
              <p className="text-gray-cyber-300">
                Sistema de rifas transparente e verificável na blockchain Polygon. 100% auditável.
              </p>
            </div>

            <div className="card-cyber-glow group p-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-cyber bg-gradient-neon shadow-neon-pink transition-shadow group-hover:shadow-neon-pink">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Pagamentos BR</h3>
              <p className="text-gray-cyber-300">
                PIX instantâneo, Mercado Pago e emissão automática de NFe. Pagamento facilitado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Products Section */}
      <section className="bg-cyber-dark-100 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="neon-text-purple mb-4 font-display text-heading-1">
              Produtos em Destaque
            </h2>
            <p className="text-gray-cyber-300">
              Exemplos de produtos - clique para adicionar ao carrinho e testar o sistema
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exampleProducts.map((product) => (
              <div key={product.id} className="card-cyber-glow group p-6">
                {/* Product image placeholder */}
                <div className="mb-4 flex aspect-square items-center justify-center rounded-cyber bg-gradient-to-br from-neon-purple/20 to-neon-blue/20">
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

                {/* Product info */}
                <h3 className="mb-2 text-xl font-semibold text-white">{product.title}</h3>
                <p className="mb-4 text-sm text-gray-cyber-300">{product.description}</p>

                <div className="mb-4 flex items-baseline gap-2">
                  <span className="neon-text-purple text-2xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn-neon-filled-purple w-full"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            ))}
          </div>

          {/* Cart info */}
          <div className="mt-10 text-center">
            <p className="text-gray-cyber-400">
              Itens no carrinho: <span className="neon-text-purple font-bold">{getTotalItems()}</span>
            </p>
            <p className="mt-2 text-sm text-gray-cyber-500">
              Clique no ícone do carrinho no header para ver os itens
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-cyber opacity-10" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-cyber-glow mx-auto max-w-3xl p-12 text-center">
            <h2 className="neon-text-purple mb-4 font-display text-heading-1">
              Pronto para começar?
            </h2>
            <p className="mb-8 text-lg text-gray-cyber-300">
              Conecte sua carteira Web3 e participe das rifas verificadas por blockchain
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button className="btn-neon-filled-purple text-lg">
                Conectar Carteira
              </button>
              <button className="btn-neon-blue text-lg">
                Saiba Mais
              </button>
            </div>

            {/* Tech stack badge */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <span className="rounded-cyber border border-neon-purple/30 bg-neon-purple/5 px-4 py-2 text-sm font-semibold text-neon-purple">
                Next.js 14
              </span>
              <span className="rounded-cyber border border-neon-blue/30 bg-neon-blue/5 px-4 py-2 text-sm font-semibold text-neon-blue">
                Polygon
              </span>
              <span className="rounded-cyber border border-neon-pink/30 bg-neon-pink/5 px-4 py-2 text-sm font-semibold text-neon-pink">
                Medusa v2
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
