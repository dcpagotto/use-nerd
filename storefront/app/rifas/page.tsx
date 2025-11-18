'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Portuguese route alias for /raffles
 * Redirects to the English route
 */
export default function RifasPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/raffles');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-4xl">⏳</div>
        <p className="text-gray-cyber-300">Redirecionando para rifas...</p>
      </div>
    </div>
  );
}
