'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '@/store/cart-store';
import Image from 'next/image';
import Link from 'next/link';

/**
 * CartDrawer Component
 *
 * A sliding drawer from the right side that displays cart items.
 * Features smooth animations, item management, and checkout actions.
 *
 * Features:
 * - Slide-in animation with Framer Motion
 * - Display cart items with thumbnails
 * - Update quantities
 * - Remove items
 * - Show subtotal
 * - Backdrop overlay
 * - Mobile responsive
 *
 * @example
 * <CartDrawer />
 */

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotalItems,
  } = useCartStore();

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  // Format price in BRL
  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceInCents / 100);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[101] h-full w-full max-w-md bg-cyber-dark-100 shadow-cyber-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="border-b border-neon-purple/30 p-6">
                <div className="flex items-center justify-between">
                  <h2
                    id="cart-drawer-title"
                    className="neon-text-purple font-display text-2xl font-bold"
                  >
                    Carrinho
                    {totalItems > 0 && (
                      <span className="ml-2 text-lg text-gray-cyber-400">
                        ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={closeCart}
                    className="rounded-cyber p-2 text-gray-cyber-300 transition-colors hover:bg-neon-purple/10 hover:text-neon-purple focus-cyber"
                    aria-label="Fechar carrinho"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Cart items */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-neon-purple/10 p-6">
                      <svg
                        className="h-16 w-16 text-neon-purple"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-white">
                      Seu carrinho está vazio
                    </h3>
                    <p className="mb-6 text-sm text-gray-cyber-400">
                      Adicione produtos para começar suas compras
                    </p>
                    <button
                      onClick={closeCart}
                      className="btn-neon-filled-purple"
                    >
                      Continuar Comprando
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => {
                      const itemKey = item.variant_id
                        ? `${item.id}-${item.variant_id}`
                        : item.id;

                      return (
                        <motion.div
                          key={itemKey}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 100 }}
                          className="card-cyber flex gap-4 p-4"
                        >
                          {/* Product image */}
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-cyber bg-cyber-dark">
                            {item.thumbnail ? (
                              <Image
                                src={item.thumbnail}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <svg
                                  className="h-10 w-10 text-gray-cyber-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Product info */}
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <h3 className="font-semibold text-white line-clamp-1">
                                {item.title}
                              </h3>
                              {item.variant_title && (
                                <p className="text-xs text-gray-cyber-400">
                                  {item.variant_title}
                                </p>
                              )}
                              <p className="neon-text-purple mt-1 text-sm font-bold">
                                {formatPrice(item.price)}
                              </p>
                            </div>

                            {/* Quantity controls */}
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      item.quantity - 1,
                                      item.variant_id
                                    )
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded-cyber border border-neon-purple/30 text-white transition-colors hover:bg-neon-purple/10 hover:border-neon-purple disabled:opacity-50"
                                  aria-label="Diminuir quantidade"
                                >
                                  <svg
                                    className="h-3 w-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M20 12H4"
                                    />
                                  </svg>
                                </button>

                                <span className="w-8 text-center font-mono text-sm font-semibold text-white">
                                  {item.quantity}
                                </span>

                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      item.quantity + 1,
                                      item.variant_id
                                    )
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded-cyber border border-neon-purple/30 text-white transition-colors hover:bg-neon-purple/10 hover:border-neon-purple"
                                  aria-label="Aumentar quantidade"
                                >
                                  <svg
                                    className="h-3 w-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                </button>
                              </div>

                              {/* Remove button */}
                              <button
                                onClick={() => removeItem(item.id, item.variant_id)}
                                className="text-gray-cyber-400 transition-colors hover:text-neon-red"
                                aria-label="Remover item"
                              >
                                <svg
                                  className="h-5 w-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer with total and actions */}
              {items.length > 0 && (
                <div className="border-t border-neon-purple/30 bg-cyber-dark-200 p-6">
                  {/* Subtotal */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-cyber-300">
                      Subtotal:
                    </span>
                    <span className="neon-text-purple font-display text-2xl font-bold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <p className="mb-4 text-center text-xs text-gray-cyber-400">
                    Frete e impostos calculados no checkout
                  </p>

                  {/* Action buttons */}
                  <div className="space-y-2">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="btn-neon-filled-purple block w-full text-center"
                    >
                      Finalizar Compra
                    </Link>
                    <button
                      onClick={closeCart}
                      className="btn-neon-purple w-full"
                    >
                      Continuar Comprando
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
