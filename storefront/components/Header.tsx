'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '@/store/cart-store';
import WalletConnect from './WalletConnect';
import { cn } from '@/lib/utils';

/**
 * Header Component
 *
 * Main navigation header with cyberpunk theme.
 * Includes logo, navigation menu, cart icon, and wallet connection.
 *
 * Features:
 * - Responsive mobile menu (hamburger)
 * - Active link highlighting
 * - Cart badge with item count
 * - Sticky header with backdrop blur
 * - Smooth animations
 * - Wallet connection integration
 *
 * @example
 * <Header />
 */

const navigationLinks = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/rifas', label: 'Rifas' },
  { href: '/sobre', label: 'Sobre' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { getTotalItems, toggleCart } = useCartStore();
  const cartItemCount = getTotalItems();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-cyber-dark-100/90 backdrop-blur-md shadow-cyber border-b border-neon-purple/20'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="USE Nerd - Página inicial"
          >
            <div className="relative flex items-center">
              {/* Logo icon/badge */}
              <div className="flex h-10 w-10 items-center justify-center rounded-cyber bg-gradient-cyber shadow-neon-purple-sm transition-shadow group-hover:shadow-neon-purple">
                <span className="font-display text-xl font-bold text-white">U</span>
              </div>
            </div>
            {/* Logo text */}
            <div className="flex flex-col">
              <span className="neon-text-purple font-display text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                USE Nerd
              </span>
              <span className="hidden text-xs font-medium text-gray-cyber-400 sm:block">
                Blockchain Raffles
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative font-semibold transition-colors duration-200',
                  isActiveLink(link.href)
                    ? 'neon-text-purple'
                    : 'text-gray-cyber-100 hover:text-neon-purple'
                )}
              >
                {link.label}
                {isActiveLink(link.href) && (
                  <motion.div
                    layoutId="activeLink"
                    className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-cyber shadow-neon-purple-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Wallet Connect - Hidden on small mobile */}
            <div className="hidden sm:block">
              <WalletConnect />
            </div>

            {/* Cart button */}
            <button
              onClick={toggleCart}
              className="relative rounded-cyber border border-neon-purple/30 p-2.5 text-white transition-all hover:border-neon-purple hover:bg-neon-purple/10 hover:shadow-neon-purple-sm"
              aria-label={`Carrinho de compras (${cartItemCount} itens)`}
            >
              <svg
                className="h-6 w-6"
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

              {/* Cart badge */}
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-neon-pink text-xs font-bold text-white shadow-neon-pink"
                >
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </motion.span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-cyber border border-neon-purple/30 p-2 text-white transition-colors hover:border-neon-purple hover:bg-neon-purple/10 md:hidden"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-20 bg-black/60 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 right-0 top-20 bg-cyber-dark-100 border-b border-neon-purple/30 shadow-cyber-lg md:hidden"
            >
              <div className="container mx-auto px-4 py-6">
                {/* Navigation links */}
                <div className="mb-6 space-y-2">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'block rounded-cyber px-4 py-3 font-semibold transition-all',
                        isActiveLink(link.href)
                          ? 'bg-neon-purple/10 neon-text-purple border-l-4 border-neon-purple'
                          : 'text-gray-cyber-100 hover:bg-neon-purple/5 hover:text-neon-purple'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Wallet connect for mobile */}
                <div className="border-t border-neon-purple/20 pt-4">
                  <WalletConnect />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
