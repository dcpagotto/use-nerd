'use client';

import React, { useState, useEffect } from 'react';
import { connectWallet, formatAddress, switchToPolygon } from '@/lib/web3-client';
import { InlineSpinner } from './LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * WalletConnect Component
 *
 * Handles Web3 wallet connection (MetaMask) for Polygon network.
 * Displays connection status, wallet address, and network indicator.
 *
 * Features:
 * - Connect/Disconnect MetaMask wallet
 * - Display truncated wallet address
 * - Network indicator (Polygon)
 * - Dropdown menu with account actions
 * - Auto-reconnect on page load
 *
 * @example
 * <WalletConnect />
 */

export default function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [networkName, setNetworkName] = useState<string>('Polygon');

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection();

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      toast.error('Carteira desconectada');
    } else {
      setAccount(accounts[0]);
      toast.success('Carteira alterada');
    }
    setIsDropdownOpen(false);
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const connectedAccount = await connectWallet();
      if (connectedAccount) {
        setAccount(connectedAccount);
        toast.success('Carteira conectada com sucesso!');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        toast.error('Conexão rejeitada pelo usuário');
      } else if (error.code === -32002) {
        toast.error('Solicitação de conexão já pendente. Verifique o MetaMask.');
      } else {
        toast.error('Erro ao conectar carteira. Instale o MetaMask.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    setIsDropdownOpen(false);
    toast.success('Carteira desconectada');
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast.success('Endereço copiado!');
      setIsDropdownOpen(false);
    }
  };

  const openInExplorer = () => {
    if (account) {
      window.open(`https://polygonscan.com/address/${account}`, '_blank');
      setIsDropdownOpen(false);
    }
  };

  // Not connected state
  if (!account) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="btn-neon-filled-purple flex items-center gap-2 text-sm font-semibold"
        aria-label="Conectar carteira Web3"
      >
        {isConnecting ? (
          <>
            <InlineSpinner variant="purple" />
            <span>Conectando...</span>
          </>
        ) : (
          <>
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M22.46 6c-.85-.3-1.76-.46-2.71-.46C16.97 5.54 14.5 8 14.5 11c0 .76.15 1.48.43 2.13L6.7 21.36c-.42.42-1.1.42-1.52 0L3 19.18c-.42-.42-.42-1.1 0-1.52l8.23-8.23C10.52 9.15 9.76 9 9 9c-3 0-5.46 2.47-5.46 5.46 0 .95.16 1.86.46 2.71L1.54 19.64c-.58.58-.58 1.52 0 2.1l2.12 2.12c.58.58 1.52.58 2.1 0l2.47-2.47c.85.3 1.76.46 2.71.46C13.97 21.85 16.43 19.39 16.43 16.39c0-.76-.15-1.48-.43-2.13l8.23-8.23c.42-.42.42-1.1 0-1.52l-2.12-2.12c-.42-.42-1.1-.42-1.52 0l-2.47 2.47z" />
            </svg>
            <span>Conectar Carteira</span>
          </>
        )}
      </button>
    );
  }

  // Connected state with dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="glass-cyber flex items-center gap-3 rounded-cyber px-4 py-2.5 transition-all hover:border-neon-purple hover:shadow-neon-purple-sm"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        {/* Network indicator */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-neon-green shadow-neon-green" />
          <span className="hidden text-xs font-medium text-gray-cyber-300 sm:inline">
            {networkName}
          </span>
        </div>

        {/* Wallet address */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-cyber" />
          <span className="neon-text-purple font-mono text-sm font-semibold">
            {formatAddress(account)}
          </span>
        </div>

        {/* Dropdown arrow */}
        <svg
          className={`h-4 w-4 text-gray-cyber-300 transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <div className="card-cyber absolute right-0 top-full z-50 mt-2 w-64 p-2 animate-slide-down">
            {/* Account info */}
            <div className="border-b border-neon-purple/20 px-3 py-3">
              <p className="mb-1 text-xs font-medium text-gray-cyber-400">Carteira Conectada</p>
              <p className="neon-text-purple font-mono text-sm font-semibold">
                {formatAddress(account)}
              </p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <button
                onClick={copyAddress}
                className="flex w-full items-center gap-3 rounded-cyber px-3 py-2 text-left text-sm font-medium text-gray-cyber-100 transition-colors hover:bg-neon-purple/10 hover:text-neon-purple"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copiar Endereço
              </button>

              <button
                onClick={openInExplorer}
                className="flex w-full items-center gap-3 rounded-cyber px-3 py-2 text-left text-sm font-medium text-gray-cyber-100 transition-colors hover:bg-neon-blue/10 hover:text-neon-blue"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Ver no PolygonScan
              </button>

              <hr className="my-1 border-neon-purple/10" />

              <button
                onClick={handleDisconnect}
                className="flex w-full items-center gap-3 rounded-cyber px-3 py-2 text-left text-sm font-medium text-neon-red transition-colors hover:bg-neon-red/10"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Desconectar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
