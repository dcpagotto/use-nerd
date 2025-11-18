'use client';

import Link from 'next/link';

export default function SobrePage() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="neon-text-purple mb-4 font-display text-display-2">
              Sobre a USE Nerd
            </h1>
            <p className="text-lg text-gray-cyber-300">
              A plataforma de e-commerce com rifas blockchain mais inovadora do Brasil
            </p>
          </div>

          {/* Mission */}
          <section className="card-cyber-glow mb-8 p-8">
            <h2 className="neon-text-blue mb-4 text-2xl font-semibold">
              Nossa Missão
            </h2>
            <p className="text-gray-cyber-300">
              Democratizar o acesso a produtos premium através de um sistema de rifas
              transparente e verificável por blockchain. Combinamos a conveniência do
              e-commerce moderno com a emoção e a justiça das rifas descentralizadas,
              proporcionando uma experiência única no mercado brasileiro.
            </p>
          </section>

          {/* How it Works */}
          <section className="card-cyber-glow mb-8 p-8">
            <h2 className="neon-text-blue mb-6 text-2xl font-semibold">
              Como Funciona
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-cyber shadow-neon-purple-sm">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Compre Produtos Normalmente
                  </h3>
                  <p className="text-gray-cyber-300">
                    Navegue por nossa loja e compre produtos como em qualquer e-commerce.
                    Aceitamos PIX, cartão de crédito e Mercado Pago.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-cyber shadow-neon-purple-sm">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Participe de Rifas Blockchain
                  </h3>
                  <p className="text-gray-cyber-300">
                    Adquira tickets para rifas de produtos premium. Cada rifa é registrada
                    na blockchain Polygon, garantindo total transparência.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-cyber shadow-neon-purple-sm">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Sorteio Verificável
                  </h3>
                  <p className="text-gray-cyber-300">
                    Os sorteios utilizam Chainlink VRF (Verifiable Random Function) para
                    garantir aleatoriedade comprovável e impossível de manipular.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-cyber shadow-neon-purple-sm">
                  <span className="text-xl font-bold text-white">4</span>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Receba seu Prêmio
                  </h3>
                  <p className="text-gray-cyber-300">
                    Vencedores são notificados automaticamente e recebem seus prêmios com
                    frete grátis em todo o Brasil através da Melhor Envio.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology */}
          <section className="card-cyber-glow mb-8 p-8">
            <h2 className="neon-text-blue mb-6 text-2xl font-semibold">
              Tecnologia
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-cyber border border-neon-purple/30 bg-neon-purple/5 p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="text-3xl">⛓️</div>
                  <h3 className="text-lg font-semibold text-white">Blockchain</h3>
                </div>
                <p className="text-sm text-gray-cyber-300">
                  Rede Polygon (Matic) para registros imutáveis e verificáveis de todas as
                  rifas e sorteios realizados.
                </p>
              </div>

              <div className="rounded-cyber border border-neon-blue/30 bg-neon-blue/5 p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="text-3xl">🎲</div>
                  <h3 className="text-lg font-semibold text-white">Chainlink VRF</h3>
                </div>
                <p className="text-sm text-gray-cyber-300">
                  Gerador de números aleatórios verificável e descentralizado, garantindo
                  sorteios justos e auditáveis.
                </p>
              </div>

              <div className="rounded-cyber border border-neon-pink/30 bg-neon-pink/5 p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="text-3xl">💳</div>
                  <h3 className="text-lg font-semibold text-white">PIX & Mercado Pago</h3>
                </div>
                <p className="text-sm text-gray-cyber-300">
                  Integração com métodos de pagamento brasileiros para transações rápidas,
                  seguras e convenientes.
                </p>
              </div>

              <div className="rounded-cyber border border-yellow-500/30 bg-yellow-500/5 p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="text-3xl">📦</div>
                  <h3 className="text-lg font-semibold text-white">Melhor Envio</h3>
                </div>
                <p className="text-sm text-gray-cyber-300">
                  Sistema automatizado de cotação e envio com as melhores transportadoras
                  do Brasil.
                </p>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="card-cyber-glow mb-8 p-8">
            <h2 className="neon-text-blue mb-6 text-2xl font-semibold">
              Nossos Valores
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-3 text-4xl">🔒</div>
                <h3 className="mb-2 font-semibold text-white">Transparência</h3>
                <p className="text-sm text-gray-cyber-300">
                  Todos os sorteios são verificáveis na blockchain
                </p>
              </div>

              <div className="text-center">
                <div className="mb-3 text-4xl">⚡</div>
                <h3 className="mb-2 font-semibold text-white">Velocidade</h3>
                <p className="text-sm text-gray-cyber-300">
                  Pagamentos instantâneos via PIX e processamento rápido
                </p>
              </div>

              <div className="text-center">
                <div className="mb-3 text-4xl">🎯</div>
                <h3 className="mb-2 font-semibold text-white">Justiça</h3>
                <p className="text-sm text-gray-cyber-300">
                  Sistema de sorteio 100% aleatório e impossível de manipular
                </p>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="card-cyber-glow mb-8 p-8">
            <h2 className="neon-text-blue mb-6 text-center text-2xl font-semibold">
              Números da Plataforma
            </h2>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="neon-text-purple mb-2 text-4xl font-bold">1000+</div>
                <p className="text-sm text-gray-cyber-300">Rifas Realizadas</p>
              </div>

              <div className="text-center">
                <div className="neon-text-blue mb-2 text-4xl font-bold">5000+</div>
                <p className="text-sm text-gray-cyber-300">Usuários Ativos</p>
              </div>

              <div className="text-center">
                <div className="neon-text-pink mb-2 text-4xl font-bold">100%</div>
                <p className="text-sm text-gray-cyber-300">Verificável</p>
              </div>

              <div className="text-center">
                <div className="neon-text-purple mb-2 text-4xl font-bold">24/7</div>
                <p className="text-sm text-gray-cyber-300">Suporte Online</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="card-cyber-glow p-12 text-center">
            <h2 className="neon-text-purple mb-4 text-3xl font-bold">
              Pronto para Começar?
            </h2>
            <p className="mb-8 text-gray-cyber-300">
              Explore nossos produtos e participe de rifas verificadas por blockchain
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/produtos" className="btn-neon-filled-purple text-lg">
                Explorar Produtos
              </Link>
              <Link href="/raffles" className="btn-neon-blue text-lg">
                Ver Rifas Ativas
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
