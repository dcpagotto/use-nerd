import React from 'react';
import Link from 'next/link';

/**
 * Footer Component
 *
 * Site footer with cyberpunk theme design.
 * Includes links, company info, social media, and copyright.
 *
 * Features:
 * - Three column layout (desktop)
 * - Responsive stacking (mobile)
 * - Social media icons
 * - Copyright information
 * - Blockchain/Polygon badge
 * - Server Component (static)
 *
 * @example
 * <Footer />
 */

const footerLinks = {
  loja: [
    { href: '/produtos', label: 'Todos os Produtos' },
    { href: '/rifas', label: 'Rifas Ativas' },
    { href: '/categorias', label: 'Categorias' },
    { href: '/promocoes', label: 'Promoções' },
  ],
  suporte: [
    { href: '/faq', label: 'Perguntas Frequentes' },
    { href: '/contato', label: 'Contato' },
    { href: '/como-funciona', label: 'Como Funciona' },
    { href: '/rastreamento', label: 'Rastrear Pedido' },
  ],
  legal: [
    { href: '/termos', label: 'Termos de Uso' },
    { href: '/privacidade', label: 'Política de Privacidade' },
    { href: '/trocas', label: 'Trocas e Devoluções' },
    { href: '/regulamento-rifas', label: 'Regulamento de Rifas' },
  ],
};

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/usenerd',
    icon: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    ),
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/usenerd',
    icon: (
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    ),
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/usenerd',
    icon: (
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/usenerd',
    icon: (
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neon-purple/20 bg-cyber-dark-100">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand section */}
          <div className="space-y-4">
            <Link href="/" className="group inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-cyber bg-gradient-cyber shadow-neon-purple-sm transition-shadow group-hover:shadow-neon-purple">
                <span className="font-display text-xl font-bold text-white">U</span>
              </div>
              <span className="neon-text-purple font-display text-xl font-bold">
                USE Nerd
              </span>
            </Link>

            <p className="text-sm text-gray-cyber-300">
              E-commerce com rifas verificadas por blockchain na rede Polygon.
              Transparência e confiança em cada sorteio.
            </p>

            {/* Blockchain badge */}
            <div className="inline-flex items-center gap-2 rounded-cyber border border-neon-blue/30 bg-neon-blue/5 px-3 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-neon-blue shadow-neon-blue-sm" />
              <span className="text-xs font-semibold text-neon-blue">
                Powered by Polygon
              </span>
            </div>
          </div>

          {/* Loja links */}
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-white">Loja</h3>
            <ul className="space-y-2">
              {footerLinks.loja.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-cyber-300 transition-colors hover:text-neon-purple"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte links */}
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-white">Suporte</h3>
            <ul className="space-y-2">
              {footerLinks.suporte.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-cyber-300 transition-colors hover:text-neon-purple"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-cyber-300 transition-colors hover:text-neon-purple"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social media links */}
        <div className="mt-12 border-t border-neon-purple/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-cyber border border-neon-purple/30 p-2.5 text-gray-cyber-300 transition-all hover:border-neon-purple hover:bg-neon-purple/10 hover:text-neon-purple hover:shadow-neon-purple-sm"
                  aria-label={`Seguir no ${social.name}`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-center text-sm text-gray-cyber-400">
              &copy; {currentYear} USE Nerd. Todos os direitos reservados.
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> | </span>
              <span className="neon-text-purple font-mono text-xs">
                Made with blockchain magic
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
