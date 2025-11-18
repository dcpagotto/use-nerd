/**
 * Global 404 Not Found Page
 * Displayed when a page is not found
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cyber-dark-200 px-4">
      <div className="card-cyber-glow max-w-2xl p-12 text-center">
        <div className="mb-6 text-8xl">404</div>
        <h1 className="neon-text-purple mb-4 font-display text-heading-1">
          Página não encontrada
        </h1>
        <p className="mb-8 text-lg text-gray-cyber-300">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/" className="btn-neon-filled-purple">
            Voltar para Home
          </Link>
          <Link href="/produtos" className="btn-neon-blue">
            Ver Produtos
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex items-center justify-center gap-8">
          <Link
            href="/rifas"
            className="text-sm text-gray-cyber-400 transition-colors hover:text-neon-purple"
          >
            Rifas
          </Link>
          <span className="text-gray-cyber-600">•</span>
          <Link
            href="/blog"
            className="text-sm text-gray-cyber-400 transition-colors hover:text-neon-purple"
          >
            Blog
          </Link>
          <span className="text-gray-cyber-600">•</span>
          <Link
            href="/sobre"
            className="text-sm text-gray-cyber-400 transition-colors hover:text-neon-purple"
          >
            Sobre
          </Link>
        </div>
      </div>
    </div>
  );
}
