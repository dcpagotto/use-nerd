import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
