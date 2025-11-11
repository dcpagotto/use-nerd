import type { Metadata } from 'next';
import { Orbitron, Rajdhani } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

// Orbitron - Display/Heading font (futuristic, cyberpunk)
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-orbitron',
  display: 'swap',
});

// Rajdhani - Body/UI font (clean, tech-inspired)
const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'USE Nerd - E-commerce com Rifas Blockchain',
  description:
    'Plataforma de e-commerce com sistema de rifas verificadas por blockchain na rede Polygon',
  keywords: ['e-commerce', 'rifas', 'blockchain', 'polygon', 'brasil'],
  authors: [{ name: 'USE Nerd Team' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://usenerd.com',
    title: 'USE Nerd - E-commerce com Rifas Blockchain',
    description: 'Plataforma de e-commerce com rifas verificadas por blockchain',
    siteName: 'USE Nerd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'USE Nerd - E-commerce com Rifas Blockchain',
    description: 'Plataforma de e-commerce com rifas verificadas por blockchain',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${orbitron.variable} ${rajdhani.variable} dark`}>
      <body className="font-cyber antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
