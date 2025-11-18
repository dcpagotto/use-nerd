/**
 * Global Error Boundary
 * Handles errors at the app level
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cyber-dark-200 px-4">
      <div className="card-cyber-glow max-w-2xl p-12 text-center">
        <div className="mb-6 text-6xl">⚠️</div>
        <h1 className="neon-text-purple mb-4 font-display text-heading-1">
          Algo deu errado!
        </h1>
        <p className="mb-8 text-gray-cyber-300">
          Desculpe, ocorreu um erro inesperado. Nossa equipe foi notificada.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 rounded-cyber bg-red-500/10 p-4 text-left">
            <p className="font-mono text-sm text-red-400">{error.message}</p>
            {error.digest && (
              <p className="mt-2 font-mono text-xs text-red-300">Digest: {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button onClick={reset} className="btn-neon-filled-purple">
            Tentar Novamente
          </button>
          <Link href="/" className="btn-neon-blue">
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  );
}
