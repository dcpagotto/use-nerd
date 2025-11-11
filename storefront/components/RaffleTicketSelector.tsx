'use client';

import { useState } from 'react';
import { Raffle } from '@/types';
import { formatPrice } from '@/lib/utils';

/**
 * RaffleTicketSelector Component
 *
 * Interactive ticket quantity selector for raffle purchases.
 * Allows users to select quantity (1-10) and add to cart.
 * Includes validation and toast notifications.
 *
 * @param raffle - Raffle data
 * @param onAddToCart - Callback when tickets are added to cart
 */

interface RaffleTicketSelectorProps {
  raffle: Raffle;
  onAddToCart: (quantity: number) => void;
  disabled?: boolean;
}

export default function RaffleTicketSelector({
  raffle,
  onAddToCart,
  disabled = false,
}: RaffleTicketSelectorProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const minQuantity = 1;
  const maxQuantity = Math.min(
    10,
    raffle.total_tickets - raffle.sold_tickets,
    raffle.max_tickets_per_user || 10
  );

  const totalPrice = raffle.ticket_price * quantity;
  const availableTickets = raffle.total_tickets - raffle.sold_tickets;

  const handleDecrease = () => {
    if (quantity > minQuantity) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    if (isNaN(value) || value < minQuantity) {
      setQuantity(minQuantity);
    } else if (value > maxQuantity) {
      setQuantity(maxQuantity);
    } else {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (disabled || isAdding || availableTickets === 0) return;

    setIsAdding(true);

    try {
      await onAddToCart(quantity);
      // Reset quantity after successful add
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = availableTickets === 0;
  const cannotAdd = disabled || isAdding || isOutOfStock;

  return (
    <div className="bg-cyber-dark-50 rounded-cyber-lg border border-neon-purple/20 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-bold text-white">Comprar Tickets</h3>
        {isOutOfStock ? (
          <span className="px-3 py-1 bg-neon-red/20 text-neon-red text-sm font-bold rounded-full border border-neon-red/50">
            ESGOTADO
          </span>
        ) : (
          <span className="text-sm text-gray-cyber-400">
            {availableTickets.toLocaleString('pt-BR')} disponíveis
          </span>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-cyber-300">
          Quantidade
        </label>

        <div className="flex items-center gap-4">
          {/* Decrease button */}
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= minQuantity || cannotAdd}
            className="
              w-12 h-12 rounded-cyber
              bg-cyber-dark-100 border border-neon-purple/30
              text-white font-bold text-xl
              transition-all duration-200
              hover:bg-neon-purple/20 hover:border-neon-purple
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-95
            "
            aria-label="Diminuir quantidade"
          >
            -
          </button>

          {/* Quantity input */}
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleInputChange}
            min={minQuantity}
            max={maxQuantity}
            disabled={cannotAdd}
            className="
              flex-1 h-12 px-4 rounded-cyber
              bg-cyber-dark-100 border border-neon-purple/30
              text-white text-center text-xl font-bold
              focus:outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/20
              disabled:opacity-50 disabled:cursor-not-allowed
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            "
            aria-label="Quantidade de tickets"
          />

          {/* Increase button */}
          <button
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= maxQuantity || cannotAdd}
            className="
              w-12 h-12 rounded-cyber
              bg-cyber-dark-100 border border-neon-purple/30
              text-white font-bold text-xl
              transition-all duration-200
              hover:bg-neon-purple/20 hover:border-neon-purple
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-95
            "
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>

        {/* Max limit info */}
        {raffle.max_tickets_per_user && (
          <p className="text-xs text-gray-cyber-500">
            Máximo de {raffle.max_tickets_per_user} tickets por usuário
          </p>
        )}
      </div>

      {/* Price summary */}
      <div className="space-y-2 py-4 border-t border-neon-purple/20">
        <div className="flex justify-between text-sm text-gray-cyber-400">
          <span>Preço unitário</span>
          <span>{formatPrice(raffle.ticket_price)}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-cyber-400">
          <span>Quantidade</span>
          <span>{quantity}</span>
        </div>

        <div className="flex justify-between items-baseline pt-2 border-t border-neon-purple/10">
          <span className="text-white font-medium">Total</span>
          <span className="text-2xl font-bold text-neon-purple">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={cannotAdd}
        className="
          w-full py-4 px-6 rounded-cyber
          bg-gradient-cyber text-white font-bold text-lg
          transition-all duration-300
          hover:shadow-neon-purple hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          active:scale-95
          flex items-center justify-center gap-2
        "
        aria-label="Adicionar tickets ao carrinho"
      >
        {isAdding ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adicionando...
          </>
        ) : isOutOfStock ? (
          'Esgotado'
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Adicionar ao Carrinho
          </>
        )}
      </button>

      {/* Info message */}
      <div className="flex items-start gap-3 p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-cyber">
        <svg
          className="w-5 h-5 text-neon-blue flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-xs text-gray-cyber-300">
          Seus tickets serão adicionados ao carrinho. Complete o checkout para confirmar a compra e
          garantir seus números da sorte!
        </p>
      </div>
    </div>
  );
}
