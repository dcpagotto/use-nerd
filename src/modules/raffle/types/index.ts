/**
 * Raffle Module - Type Definitions
 * Tipos compartilhados entre todos os componentes do módulo
 */

// ============================================
// Enums
// ============================================

export enum RaffleStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  SOLD_OUT = "sold_out",
  DRAWING = "drawing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TicketStatus {
  RESERVED = "reserved",
  PAID = "paid",
  MINTED = "minted",
  WINNER = "winner",
}

export enum DrawStatus {
  REQUESTED = "requested",
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

// ============================================
// DTOs - Data Transfer Objects
// ============================================

export interface CreateRaffleDTO {
  title: string;
  description?: string;
  prize_description: string;
  total_tickets: number;
  ticket_price: number;
  max_tickets_per_customer?: number;
  start_date: Date;
  end_date: Date;
  draw_date: Date;
  status?: RaffleStatus;
  image_url?: string;
  terms_and_conditions?: string;
  product_id?: string;
  metadata?: Record<string, any>;
}

export interface UpdateRaffleDTO {
  title?: string;
  description?: string;
  prize_description?: string;
  ticket_price?: number;
  max_tickets_per_customer?: number;
  start_date?: Date;
  end_date?: Date;
  draw_date?: Date;
  image_url?: string;
  terms_and_conditions?: string;
  metadata?: Record<string, any>;
}

export interface CreateRaffleTicketDTO {
  raffle_id: string;
  ticket_number: number;
  ticket_code: string;
  customer_id: string;
  order_id: string;
  line_item_id: string;
  price_paid: number;
  status?: TicketStatus;
}

export interface CreateRaffleDrawDTO {
  raffle_id: string;
  vrf_request_id: string;
  vrf_transaction_hash: string;
  executed_by: string;
  metadata?: Record<string, any>;
}

// ============================================
// Filters
// ============================================

export interface RaffleFilters {
  id?: string | string[];
  status?: RaffleStatus | RaffleStatus[];
  product_id?: string | string[];
  start_date?: {
    gte?: Date;
    lte?: Date;
  };
  end_date?: {
    gte?: Date;
    lte?: Date;
  };
}

export interface RaffleTicketFilters {
  id?: string | string[];
  raffle_id?: string | string[];
  customer_id?: string | string[];
  order_id?: string | string[];
  ticket_number?: number | number[];
  status?: TicketStatus | TicketStatus[];
  is_winner?: boolean;
}

export interface RaffleDrawFilters {
  id?: string | string[];
  raffle_id?: string | string[];
  status?: DrawStatus | DrawStatus[];
}

// ============================================
// Response Types
// ============================================

export interface RaffleStats {
  total_tickets: number;
  tickets_sold: number;
  tickets_available: number;
  total_revenue: number;
  unique_customers: number;
  average_tickets_per_customer: number;
  sales_by_day?: Array<{
    date: string;
    tickets: number;
    revenue: number;
  }>;
}

export interface RaffleDashboard {
  raffle: any; // Raffle model
  stats: RaffleStats;
  recent_tickets: any[]; // RaffleTicket models
  top_customers?: Array<{
    customer_id: string;
    name: string;
    tickets: number;
    total_spent: number;
  }>;
}

// ============================================
// Workflow Input/Output Types
// ============================================

export interface CreateRaffleWorkflowInput {
  raffle: CreateRaffleDTO;
  auto_publish?: boolean;
}

export interface CreateRaffleWorkflowOutput {
  raffle: any;
}

export interface PublishRaffleWorkflowInput {
  raffle_id: string;
}

export interface PublishRaffleWorkflowOutput {
  raffle: any;
  contract_address: string;
  transaction_hash: string;
}

export interface PurchaseRaffleTicketsWorkflowInput {
  raffle_id: string;
  customer_id: string;
  order_id: string;
  line_item_id: string;
  quantity: number;
  price_paid: number;
}

export interface PurchaseRaffleTicketsWorkflowOutput {
  tickets: any[];
}

export interface ExecuteRaffleDrawWorkflowInput {
  raffle_id: string;
  executed_by: string;
}

export interface ExecuteRaffleDrawWorkflowOutput {
  draw: any;
  winner_ticket: any;
}

// ============================================
// Event Types
// ============================================

export interface RaffleCreatedEvent {
  raffle_id: string;
  status: RaffleStatus;
}

export interface RafflePublishedEvent {
  raffle_id: string;
  contract_address: string;
  transaction_hash: string;
}

export interface RaffleTicketsPurchasedEvent {
  raffle_id: string;
  ticket_ids: string[];
  customer_id: string;
  quantity: number;
}

export interface RaffleTicketsMintedEvent {
  raffle_id: string;
  ticket_ids: string[];
  nft_token_ids: string[];
}

export interface RaffleDrawStartedEvent {
  raffle_id: string;
  draw_id: string;
  vrf_request_id: string;
}

export interface RaffleDrawCompletedEvent {
  raffle_id: string;
  draw_id: string;
  winner_ticket_id: string;
}

export interface RaffleWinnerAnnouncedEvent {
  raffle_id: string;
  winner_ticket_id: string;
  winner_customer_id: string;
  winner_ticket_number: number;
}

export interface RaffleCancelledEvent {
  raffle_id: string;
  refund_count: number;
}

// ============================================
// Blockchain Types
// ============================================

export interface BlockchainRaffleData {
  raffleId: string;
  totalTickets: number;
  ticketsSold: number;
  ticketPrice: string; // Wei format
  isActive: boolean;
  contractAddress: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface ChainlinkVRFRequest {
  requestId: string;
  raffleId: string;
  transactionHash: string;
  gasLimit: number;
}

export interface ChainlinkVRFResponse {
  requestId: string;
  randomWords: string[];
  transactionHash: string;
}
