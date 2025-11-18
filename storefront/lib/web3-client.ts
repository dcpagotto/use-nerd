import { ethers } from 'ethers';

/**
 * Web3 Client - READ-ONLY MODE (Phase 5)
 *
 * This client is used ONLY for blockchain audit and verification.
 * Users DO NOT connect their wallets. Crypto payments are handled
 * by payment gateways (Coinbase Commerce, BitPay, etc.).
 *
 * The blockchain is used for:
 * - Verifying raffle registrations on-chain
 * - Auditing raffle draws (Chainlink VRF)
 * - Viewing transaction history
 * - Public transparency and trust
 */

const POLYGON_RPC_URL =
  process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com';

/**
 * Network configuration for Polygon Mainnet
 */
export const POLYGON_NETWORK = {
  chainId: 137,
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrl: POLYGON_RPC_URL,
  blockExplorerUrl: 'https://polygonscan.com/',
};

/**
 * Get read-only provider for blockchain queries
 * This is the ONLY provider we use - NO wallet connection!
 */
export function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(POLYGON_RPC_URL);
}

/**
 * Get read-only contract instance for audit purposes
 */
export function getContract(
  address: string,
  abi: any[]
): ethers.Contract {
  const provider = getProvider();
  return new ethers.Contract(address, abi, provider);
}

/**
 * Verify raffle registration on blockchain
 * Used by the frontend to show "Verified on Blockchain" badge
 */
export async function verifyRaffleOnChain(
  raffleId: string,
  contractAddress: string,
  abi: any[]
) {
  try {
    const contract = getContract(contractAddress, abi);

    // Call contract method to get raffle data
    const raffleData = await contract.getRaffle(raffleId);

    return {
      verified: true,
      raffleId: raffleData.raffleId || raffleId,
      totalTickets: Number(raffleData.totalTickets),
      ticketsSold: Number(raffleData.ticketsSold),
      status: raffleData.status,
      drawTimestamp: raffleData.drawTimestamp
        ? new Date(Number(raffleData.drawTimestamp) * 1000)
        : null,
    };
  } catch (error) {
    console.error('Error verifying raffle on chain:', error);
    return {
      verified: false,
      error: 'Unable to verify raffle on blockchain',
    };
  }
}

/**
 * Get raffle draw details from blockchain
 * Shows Chainlink VRF request ID, random numbers, winner, etc.
 */
export async function getRaffleDrawDetails(
  raffleId: string,
  contractAddress: string,
  abi: any[]
) {
  try {
    const contract = getContract(contractAddress, abi);

    const drawData = await contract.getRaffleDraw(raffleId);

    return {
      raffleId: drawData.raffleId || raffleId,
      vrfRequestId: drawData.vrfRequestId,
      randomWord: drawData.randomWord ? drawData.randomWord.toString() : null,
      winnerTicketNumber: Number(drawData.winnerTicketNumber),
      winnerAddress: drawData.winnerAddress,
      timestamp: drawData.timestamp
        ? new Date(Number(drawData.timestamp) * 1000)
        : null,
      transactionHash: drawData.transactionHash,
    };
  } catch (error) {
    console.error('Error fetching draw details:', error);
    return null;
  }
}

/**
 * Get transaction receipt for audit trail
 */
export async function getTransactionReceipt(txHash: string) {
  try {
    const provider = getProvider();
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      return null;
    }

    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      blockHash: receipt.blockHash,
      from: receipt.from,
      to: receipt.to,
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status === 1 ? 'success' : 'failed',
      timestamp: null, // Will be fetched from block if needed
    };
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
    return null;
  }
}

/**
 * Get block details (for timestamp)
 */
export async function getBlock(blockNumber: number) {
  try {
    const provider = getProvider();
    const block = await provider.getBlock(blockNumber);

    if (!block) {
      return null;
    }

    return {
      number: block.number,
      hash: block.hash,
      timestamp: new Date(block.timestamp * 1000),
      transactions: block.transactions.length,
    };
  } catch (error) {
    console.error('Error fetching block:', error);
    return null;
  }
}

/**
 * Wait for transaction confirmation (useful for audit)
 */
export async function waitForTransaction(
  txHash: string,
  confirmations: number = 1
) {
  try {
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash, confirmations);
    return receipt;
  } catch (error) {
    console.error('Error waiting for transaction:', error);
    return null;
  }
}

/**
 * Get raffle tickets for a specific order (audit trail)
 */
export async function getRaffleTickets(
  orderId: string,
  contractAddress: string,
  abi: any[]
) {
  try {
    const contract = getContract(contractAddress, abi);

    const tickets = await contract.getTicketsByOrder(orderId);

    return tickets.map((ticket: any) => ({
      ticketNumber: Number(ticket.ticketNumber),
      orderId: ticket.orderId,
      customerId: ticket.customerId,
      timestamp: ticket.timestamp
        ? new Date(Number(ticket.timestamp) * 1000)
        : null,
      isWinner: ticket.isWinner || false,
    }));
  } catch (error) {
    console.error('Error fetching raffle tickets:', error);
    return [];
  }
}

/**
 * Format blockchain address for display (0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Format MATIC amount for display
 */
export function formatMatic(amount: bigint | string): string {
  return ethers.formatEther(amount);
}

/**
 * Parse MATIC amount to wei
 */
export function parseMatic(amount: string): bigint {
  return ethers.parseEther(amount);
}

/**
 * Generate PolygonScan URL for transaction
 */
export function getExplorerTxUrl(txHash: string): string {
  return `${POLYGON_NETWORK.blockExplorerUrl}tx/${txHash}`;
}

/**
 * Generate PolygonScan URL for address
 */
export function getExplorerAddressUrl(address: string): string {
  return `${POLYGON_NETWORK.blockExplorerUrl}address/${address}`;
}

/**
 * Generate PolygonScan URL for block
 */
export function getExplorerBlockUrl(blockNumber: number): string {
  return `${POLYGON_NETWORK.blockExplorerUrl}block/${blockNumber}`;
}

/**
 * Check if blockchain is accessible (health check)
 */
export async function isBlockchainAccessible(): Promise<boolean> {
  try {
    const provider = getProvider();
    const blockNumber = await provider.getBlockNumber();
    return blockNumber > 0;
  } catch (error) {
    console.error('Blockchain not accessible:', error);
    return false;
  }
}

// Default export with all functions
export default {
  // Provider
  getProvider,
  getContract,

  // Raffle verification
  verifyRaffleOnChain,
  getRaffleDrawDetails,
  getRaffleTickets,

  // Transaction audit
  getTransactionReceipt,
  getBlock,
  waitForTransaction,

  // Formatting helpers
  formatAddress,
  formatMatic,
  parseMatic,

  // Explorer URLs
  getExplorerTxUrl,
  getExplorerAddressUrl,
  getExplorerBlockUrl,

  // Health check
  isBlockchainAccessible,

  // Constants
  POLYGON_NETWORK,
};
