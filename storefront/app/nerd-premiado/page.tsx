/**
 * Nerd Premiado Page
 * Special page combining Strapi content with live Medusa raffle data and blockchain verification
 */

import Link from 'next/link';
import Image from 'next/image';
import { getNerdPremiadoPageData } from '@/lib/data-fetcher';
import RichTextRenderer from '@/components/RichTextRenderer';
import WinnerGallery from '@/components/WinnerGallery';
import ActiveRaffles from '@/components/ActiveRaffles';
import { getStrapiMediaUrl } from '@/lib/strapi-utils';

// ISR: Revalidate every 60 seconds for fresh raffle data
export const revalidate = 60;

export default async function NerdPremiadoPage() {
  const data = await getNerdPremiadoPageData('pt-BR', 60);

  const heroImageUrl = getStrapiMediaUrl(data.content.heroImage);

  return (
    <main className="min-h-screen bg-cyber-dark-200">
      {/* Hero Section */}
      {heroImageUrl ? (
        <section className="relative h-96 overflow-hidden">
          <Image
            src={heroImageUrl}
            alt={data.content.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="neon-text-purple text-center font-display text-heading-1 md:text-display-2">
              {data.content.title}
            </h1>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
        </section>
      ) : (
        <section className="relative overflow-hidden bg-gradient-to-b from-cyber-dark-200 via-cyber-dark-100 to-cyber-dark-200 py-20">
          <div className="absolute inset-0 bg-grid-cyber bg-grid-md opacity-20" />
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="neon-text-purple mb-4 font-display text-heading-1 md:text-display-2">
              {data.content.title}
            </h1>
            {data.content.subtitle && (
              <p className="text-gradient-cyber text-2xl font-bold">{data.content.subtitle}</p>
            )}
          </div>
        </section>
      )}

      {/* Introduction */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="card-cyber-glow mx-auto max-w-4xl p-8 md:p-12">
          <RichTextRenderer content={data.content.description} className="prose-invert" />
        </div>
      </section>

      {/* Active Raffles (Live from Medusa) */}
      {data.activeRaffles.length > 0 && (
        <section className="bg-cyber-dark-100 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="neon-text-purple mb-2 font-display text-heading-1">
                Rifas Ativas
              </h2>
              <p className="text-gray-cyber-300">
                Participe agora e concorra a prêmios incríveis
              </p>
            </div>

            <ActiveRaffles raffles={data.activeRaffles} />

            <div className="mt-12 text-center">
              <Link href="/rifas" className="btn-neon-filled-purple">
                Ver Todas as Rifas
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Winner Gallery (Strapi content + Medusa blockchain verification) */}
      {data.enrichedWinners.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <WinnerGallery winners={data.enrichedWinners} />
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="bg-cyber-dark-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="neon-text-purple mb-8 text-center font-display text-heading-1">
            Como Funciona
          </h2>

          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Step 1 */}
              <div className="card-cyber-glow p-6 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">Compre Bilhetes</h3>
                <p className="text-sm text-gray-cyber-300">
                  Escolha uma rifa ativa e compre quantos bilhetes quiser. Quanto mais bilhetes,
                  maiores as chances!
                </p>
              </div>

              {/* Step 2 */}
              <div className="card-cyber-glow p-6 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">Aguarde o Sorteio</h3>
                <p className="text-sm text-gray-cyber-300">
                  O sorteio é realizado automaticamente na blockchain Polygon, garantindo total
                  transparência.
                </p>
              </div>

              {/* Step 3 */}
              <div className="card-cyber-glow p-6 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">Receba o Prêmio</h3>
                <p className="text-sm text-gray-cyber-300">
                  Ganhadores são notificados imediatamente e podem verificar o resultado na
                  blockchain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules & Regulations */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-cyber-glow mx-auto max-w-4xl p-8 md:p-12">
            <h2 className="neon-text-purple mb-6 text-center font-display text-heading-1">
              Regras e Regulamentos
            </h2>

            <div className="space-y-4 text-gray-cyber-300">
              <div className="flex items-start gap-3">
                <svg
                  className="h-6 w-6 flex-shrink-0 text-neon-purple"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>Todas as rifas são verificadas e registradas na blockchain Polygon.</p>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="h-6 w-6 flex-shrink-0 text-neon-purple"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>
                  O sorteio é realizado automaticamente e de forma transparente através de smart
                  contracts.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="h-6 w-6 flex-shrink-0 text-neon-purple"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>Ganhadores são notificados por e-mail e podem verificar o resultado online.</p>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="h-6 w-6 flex-shrink-0 text-neon-purple"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>
                  Prêmios devem ser resgatados em até 30 dias após o anúncio do ganhador.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="h-6 w-6 flex-shrink-0 text-neon-purple"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>USE Nerd se reserva o direito de desqualificar participantes fraudulentos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-cyber opacity-10" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-cyber-glow mx-auto max-w-3xl p-12 text-center">
            <h2 className="neon-text-purple mb-4 font-display text-heading-1">
              Pronto para Ganhar?
            </h2>
            <p className="mb-8 text-lg text-gray-cyber-300">
              Participe das rifas verificadas por blockchain e concorra a prêmios incríveis!
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/rifas" className="btn-neon-filled-purple text-lg">
                Ver Rifas Ativas
              </Link>
              <Link href="/sobre" className="btn-neon-blue text-lg">
                Saiba Mais
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// SEO metadata
export async function generateMetadata() {
  try {
    const data = await getNerdPremiadoPageData('pt-BR', 60);

    return {
      title: `${data.content.title} | USE Nerd`,
      description:
        data.content.subtitle ||
        'Veja os ganhadores das rifas USE Nerd verificadas por blockchain',
      openGraph: {
        title: data.content.title,
        description:
          data.content.subtitle ||
          'Veja os ganhadores das rifas USE Nerd verificadas por blockchain',
        type: 'website',
        ...(data.content.heroImage && {
          images: [
            {
              url: getStrapiMediaUrl(data.content.heroImage) || '',
              width: 1200,
              height: 630,
              alt: data.content.title,
            },
          ],
        }),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Nerd Premiado | USE Nerd',
      description: 'Veja os ganhadores das rifas USE Nerd',
    };
  }
}
