'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

/**
 * ClientLayout Component
 *
 * Wrapper component that includes all client-side components.
 * This component should be imported in your root layout.tsx
 *
 * Includes:
 * - Header (navigation, cart, wallet)
 * - Footer (links, social, copyright)
 * - CartDrawer (shopping cart sidebar)
 * - Toast notifications
 *
 * @example
 * // In app/layout.tsx
 * import ClientLayout from '@/components/ClientLayout';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="pt-BR">
 *       <body>
 *         <ClientLayout>{children}</ClientLayout>
 *       </body>
 *     </html>
 *   );
 * }
 */

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Header />

      <main className="relative min-h-screen">
        {children}
      </main>

      <Footer />

      <CartDrawer />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0F0F14',
            color: '#F9FAFB',
            border: '1px solid rgba(176, 38, 255, 0.3)',
            borderRadius: '0.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 1px rgba(176, 38, 255, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#F9FAFB',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#F9FAFB',
            },
          },
        }}
      />
    </>
  );
}
