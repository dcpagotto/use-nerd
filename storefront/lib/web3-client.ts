import { ethers } from 'ethers';

/**
 * Web3 Client Configuration for Polygon Network
 *
 * This client handles blockchain interactions for raffle verification
 * and smart contract operations on Polygon (Matic) network.
 */

const POLYGON_RPC_URL = process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com';
const POLYGON_CHAIN_ID = process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID || '137'; // Polygon Mainnet

// Network configurations
export const NETWORKS = {
  polygon: {
    chainId: '0x89', // 137 in hex
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: [POLYGON_RPC_URL],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  mumbai: {
    chainId: '0x13881', // 80001 in hex
    chainName: 'Polygon Mumbai Testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
  },
};

/**
 * Get read-only provider for blockchain queries
 */
export function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(POLYGON_RPC_URL);
}

/**
 * Get browser provider (MetaMask, WalletConnect, etc.)
 */
export async function getBrowserProvider(): Promise<ethers.BrowserProvider | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    console.warn('No Web3 provider found. Please install MetaMask.');
    return null;
  }

  return new ethers.BrowserProvider(window.ethereum);
}

/**
 * Connect to user's wallet
 */
export async function connectWallet(): Promise<string | null> {
  try {
    const provider = await getBrowserProvider();
    if (!provider) {
      throw new Error('No Web3 provider available');
    }

    // Request account access
    const accounts = await provider.send('eth_requestAccounts', []);

    // Check if we're on the correct network
    const network = await provider.getNetwork();
    if (network.chainId !== BigInt(POLYGON_CHAIN_ID)) {
      await switchToPolygon();
    }

    return accounts[0] || null;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

/**
 * Switch to Polygon network
 */
export async function switchToPolygon(): Promise<void> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No Web3 provider available');
  }

  const networkConfig = NETWORKS.polygon;

  try {
    // Try to switch to Polygon network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkConfig.chainId }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
      } catch (addError) {
        console.error('Error adding Polygon network:', addError);
        throw addError;
      }
    } else {
      console.error('Error switching to Polygon network:', switchError);
      throw switchError;
    }
  }
}

/**
 * Get contract instance
 */
export async function getContract(
  address: string,
  abi: any[],
  signer?: ethers.Signer
): Promise<ethers.Contract> {
  const provider = signer ? await getBrowserProvider() : getProvider();

  if (!provider) {
    throw new Error('No provider available');
  }

  if (signer) {
    return new ethers.Contract(address, abi, signer);
  }

  return new ethers.Contract(address, abi, provider);
}

/**
 * Verify raffle on blockchain
 */
export async function verifyRaffleOnChain(raffleId: string, contractAddress: string, abi: any[]) {
  try {
    const provider = getProvider();
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Call contract method to verify raffle
    // This will be implemented once the smart contract is deployed
    const raffleData = await contract.getRaffle(raffleId);

    return {
      verified: true,
      data: raffleData,
    };
  } catch (error) {
    console.error('Error verifying raffle on chain:', error);
    throw error;
  }
}

/**
 * Format address for display (0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Format MATIC amount for display
 */
export function formatMatic(amount: bigint): string {
  return ethers.formatEther(amount);
}

/**
 * Parse MATIC amount to wei
 */
export function parseMatic(amount: string): bigint {
  return ethers.parseEther(amount);
}

/**
 * Get transaction receipt
 */
export async function getTransactionReceipt(txHash: string) {
  try {
    const provider = getProvider();
    const receipt = await provider.getTransactionReceipt(txHash);
    return receipt;
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
    throw error;
  }
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(txHash: string, confirmations: number = 1) {
  try {
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash, confirmations);
    return receipt;
  } catch (error) {
    console.error('Error waiting for transaction:', error);
    throw error;
  }
}

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default {
  getProvider,
  getBrowserProvider,
  connectWallet,
  switchToPolygon,
  getContract,
  verifyRaffleOnChain,
  formatAddress,
  formatMatic,
  parseMatic,
  getTransactionReceipt,
  waitForTransaction,
};
