/**
 * Medusa Backend - Enhanced TypeScript Type Definitions
 * Extended types for raffle module and custom features
 */

// ============================================
// Raffle Module Types (from backend)
// ============================================

export enum RaffleStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SOLD_OUT = 'sold_out',
  DRAWING = 'drawing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TicketStatus {
  RESERVED = 'reserved',
  PAID = 'paid',
  MINTED = 'minted',
  WINNER = 'winner',
}

export enum DrawStatus {
  REQUESTED = 'requested',
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ProductType {
  COMPUTER = 'computer',
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  ELECTRONICS = 'electronics',
  APPLIANCE = 'appliance',
  CASH = 'cash',
  TRAVEL = 'travel',
  OTHER = 'other',
}

// ============================================
// Product Specifications
// ============================================

export interface ComputerSpecs {
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  gpu?: string;
  screen_size?: string;
  operating_system?: string;
  warranty_months?: number;
  condition: 'new' | 'refurbished' | 'used';
}

export interface CarSpecs {
  brand: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  fuel_type: 'gasoline' | 'ethanol' | 'flex' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic' | 'cvt';
  doors: number;
  engine: string;
  features?: string[];
  license_plate?: string;
  chassis_number?: string;
  condition: 'new' | 'used';
}

export interface MotorcycleSpecs {
  brand: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  engine_displacement: string;
  fuel_type: 'gasoline' | 'ethanol' | 'flex';
  features?: string[];
  license_plate?: string;
  condition: 'new' | 'used';
}

export interface ElectronicsSpecs {
  category: 'smartphone' | 'tablet' | 'tv' | 'console' | 'camera' | 'audio' | 'other';
  brand: string;
  model: string;
  specifications?: Record<string, any>;
  warranty_months?: number;
  condition: 'new' | 'refurbished' | 'used';
}

export interface ApplianceSpecs {
  category: 'refrigerator' | 'washer' | 'dryer' | 'oven' | 'microwave' | 'dishwasher' | 'other';
  brand: string;
  model: string;
  capacity?: string;
  energy_rating?: string;
  warranty_months?: number;
  condition: 'new' | 'used';
}

export interface CashSpecs {
  amount: number;
  currency: 'BRL' | 'USD' | 'EUR';
  payment_method: 'pix' | 'bank_transfer' | 'check';
  transfer_details?: string;
}

export interface TravelSpecs {
  destination: string;
  duration_days: number;
  accommodation?: string;
  includes?: string[];
  participants: number;
  valid_until?: string;
  restrictions?: string;
}

export type ProductSpecifications =
  | ComputerSpecs
  | CarSpecs
  | MotorcycleSpecs
  | ElectronicsSpecs
  | ApplianceSpecs
  | CashSpecs
  | TravelSpecs
  | Record<string, any>;

// ============================================
// Raffle Models
// ============================================

export interface Raffle {
  id: string;
  title: string;
  description?: string;
  prize_description: string;
  total_tickets: number;
  ticket_price: number;
  max_tickets_per_customer: number;
  start_date: string;
  end_date: string;
  draw_date: string;
  status: RaffleStatus;
  contract_address?: string;
  transaction_hash?: string;
  chainlink_request_id?: string;
  winner_ticket_number?: number;
  winner_customer_id?: string;
  winner_wallet_address?: string;
  winner_drawn_at?: string;
  image_url?: string;
  terms_and_conditions?: string;
  metadata?: Record<string, any>;
  product_type: ProductType;
  product_specifications?: ProductSpecifications;
  supplier_name?: string;
  supplier_contact?: string;
  delivery_type?: 'pickup' | 'shipping' | 'digital' | 'transfer';
  delivery_estimate_days?: number;
  product_id?: string;
  created_at: string;
  updated_at: string;
}

export interface RaffleTicket {
  id: string;
  raffle_id: string;
  ticket_number: number;
  ticket_code: string;
  customer_id: string;
  order_id: string;
  line_item_id: string;
  nft_token_id?: string;
  nft_transaction_hash?: string;
  nft_metadata_uri?: string;
  status: TicketStatus;
  is_winner: boolean;
  paid_at?: string;
  price_paid: number;
  created_at: string;
  updated_at: string;
}

export interface RaffleDraw {
  id: string;
  raffle_id: string;
  vrf_request_id: string;
  vrf_random_words?: string[];
  vrf_transaction_hash: string;
  winner_ticket_number?: number;
  winner_ticket_id?: string;
  winner_customer_id?: string;
  status: DrawStatus;
  drawn_at: string;
  executed_by: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================
// Raffle Statistics
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

// ============================================
// API Response Types
// ============================================

export interface RaffleListResponse {
  raffles: Raffle[];
  count: number;
  offset: number;
  limit: number;
}

export interface RaffleResponse {
  raffle: Raffle;
}

export interface RaffleTicketListResponse {
  tickets: RaffleTicket[];
  count: number;
}

export interface RaffleTicketResponse {
  ticket: RaffleTicket;
}

export interface RaffleDrawResponse {
  draw: RaffleDraw;
}

export interface RaffleStatsResponse {
  stats: RaffleStats;
}

// ============================================
// Winner Information
// ============================================

export interface WinnerInfo {
  raffle_id: string;
  raffle_title: string;
  prize_description: string;
  winner_name?: string;
  winner_ticket_number: number;
  winner_drawn_at: string;
  transaction_hash?: string;
  image_url?: string;
  product_type: ProductType;
}

export interface WinnerListResponse {
  winners: WinnerInfo[];
  count: number;
}

// ============================================
// Blockchain Verification
// ============================================

export interface BlockchainVerification {
  raffle_id: string;
  contract_address: string;
  transaction_hash: string;
  block_number?: number;
  block_timestamp?: number;
  is_verified: boolean;
  verification_url: string;
}

export interface BlockchainVerificationResponse {
  verification: BlockchainVerification;
}

// ============================================
// API Error Types
// ============================================

export interface MedusaError {
  code: string;
  message: string;
  type: string;
}

export interface MedusaErrorResponse {
  error: MedusaError;
}

// ============================================
// Query Parameters
// ============================================

export interface RaffleFilters {
  status?: RaffleStatus | RaffleStatus[];
  product_type?: ProductType | ProductType[];
  product_id?: string;
  active?: boolean;
}

export interface RaffleQueryParams {
  filters?: RaffleFilters;
  limit?: number;
  offset?: number;
  sort?: string;
}

export interface TicketQueryParams {
  raffle_id?: string;
  customer_id?: string;
  order_id?: string;
  status?: TicketStatus | TicketStatus[];
  is_winner?: boolean;
  limit?: number;
  offset?: number;
}
