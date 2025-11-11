/**
 * Global TypeScript types for USE Nerd storefront
 */

// Medusa types (extend as needed)
export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  thumbnail: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  options: ProductOption[];
  tags: ProductTag[];
  collection_id: string | null;
  type: ProductType | null;
  weight: number | null;
  length: number | null;
  height: number | null;
  width: number | null;
  hs_code: string | null;
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  url: string;
  metadata: Record<string, any> | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  product_id: string;
  sku: string | null;
  barcode: string | null;
  ean: string | null;
  upc: string | null;
  inventory_quantity: number;
  allow_backorder: boolean;
  manage_inventory: boolean;
  hs_code: string | null;
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  weight: number | null;
  length: number | null;
  height: number | null;
  width: number | null;
  options: ProductOptionValue[];
  prices: MoneyAmount[];
  metadata: Record<string, any> | null;
}

export interface ProductOption {
  id: string;
  title: string;
  values: ProductOptionValue[];
}

export interface ProductOptionValue {
  id: string;
  value: string;
  option_id: string;
}

export interface ProductTag {
  id: string;
  value: string;
}

export interface ProductType {
  id: string;
  value: string;
}

export interface MoneyAmount {
  id: string;
  currency_code: string;
  amount: number;
  min_quantity: number | null;
  max_quantity: number | null;
  price_list_id: string | null;
}

export interface Cart {
  id: string;
  email: string | null;
  billing_address_id: string | null;
  shipping_address_id: string | null;
  region_id: string;
  customer_id: string | null;
  payment_id: string | null;
  type: string;
  completed_at: string | null;
  payment_authorized_at: string | null;
  idempotency_key: string | null;
  context: Record<string, any> | null;
  metadata: Record<string, any> | null;
  sales_channel_id: string | null;
  created_at: string;
  updated_at: string;
  items: LineItem[];
  region: Region;
  discounts: Discount[];
  gift_cards: GiftCard[];
  shipping_methods: ShippingMethod[];
  payment_sessions: PaymentSession[];
  shipping_total: number;
  discount_total: number;
  tax_total: number;
  refunded_total: number;
  total: number;
  subtotal: number;
  refundable_amount: number;
  gift_card_total: number;
  gift_card_tax_total: number;
}

export interface LineItem {
  id: string;
  cart_id: string;
  order_id: string | null;
  swap_id: string | null;
  claim_order_id: string | null;
  title: string;
  description: string | null;
  thumbnail: string | null;
  is_return: boolean;
  is_giftcard: boolean;
  should_merge: boolean;
  allow_discounts: boolean;
  has_shipping: boolean;
  unit_price: number;
  variant_id: string | null;
  quantity: number;
  fulfilled_quantity: number | null;
  returned_quantity: number | null;
  shipped_quantity: number | null;
  metadata: Record<string, any> | null;
  variant: ProductVariant | null;
  total: number;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  gift_card_total: number;
  original_total: number;
  original_tax_total: number;
}

export interface Region {
  id: string;
  name: string;
  currency_code: string;
  tax_rate: number;
  tax_code: string | null;
  countries: Country[];
  payment_providers: PaymentProvider[];
  fulfillment_providers: FulfillmentProvider[];
  metadata: Record<string, any> | null;
}

export interface Country {
  id: string;
  iso_2: string;
  iso_3: string;
  num_code: string;
  name: string;
  display_name: string;
  region_id: string;
}

export interface PaymentProvider {
  id: string;
  is_installed: boolean;
}

export interface FulfillmentProvider {
  id: string;
  is_installed: boolean;
}

export interface Discount {
  id: string;
  code: string;
  is_dynamic: boolean;
  is_disabled: boolean;
  rule: DiscountRule;
  regions: Region[];
}

export interface DiscountRule {
  id: string;
  description: string | null;
  type: 'fixed' | 'percentage' | 'free_shipping';
  value: number;
  allocation: 'total' | 'item';
}

export interface GiftCard {
  id: string;
  code: string;
  value: number;
  balance: number;
  region_id: string;
  is_disabled: boolean;
  ends_at: string | null;
  metadata: Record<string, any> | null;
}

export interface ShippingMethod {
  id: string;
  shipping_option_id: string;
  order_id: string | null;
  cart_id: string | null;
  swap_id: string | null;
  return_id: string | null;
  claim_order_id: string | null;
  price: number;
  data: Record<string, any>;
  shipping_option: ShippingOption;
}

export interface ShippingOption {
  id: string;
  name: string;
  region_id: string;
  profile_id: string;
  provider_id: string;
  price_type: 'flat_rate' | 'calculated';
  amount: number | null;
  is_return: boolean;
  admin_only: boolean;
  metadata: Record<string, any> | null;
}

export interface PaymentSession {
  id: string;
  cart_id: string;
  provider_id: string;
  is_selected: boolean;
  status: string;
  data: Record<string, any>;
  idempotency_key: string | null;
  amount: number;
}

// Raffle Module Types
export interface Raffle {
  id: string;
  title: string;
  description: string;
  image: string | null;
  start_date: string;
  end_date: string;
  draw_date: string;
  ticket_price: number;
  total_tickets: number;
  sold_tickets: number;
  max_tickets_per_user: number | null;
  status: 'draft' | 'active' | 'closed' | 'drawn' | 'cancelled';
  prize_description: string;
  product_id: string | null;
  blockchain_hash: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface RaffleTicket {
  id: string;
  raffle_id: string;
  customer_id: string;
  ticket_number: number;
  purchase_date: string;
  transaction_hash: string | null;
  is_winner: boolean;
  metadata: Record<string, any> | null;
}

export interface RaffleDraw {
  id: string;
  raffle_id: string;
  drawn_at: string;
  winning_ticket_id: string;
  blockchain_hash: string;
  metadata: Record<string, any> | null;
}

// Blockchain Types
export interface BlockchainTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface WalletConnection {
  address: string;
  chainId: number;
  connected: boolean;
}

// Brazilian Market Types
export interface BrazilianAddress {
  id: string;
  customer_id: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string | null;
  city: string;
  province: string; // UF (Estado)
  postal_code: string; // CEP
  country_code: 'BR';
  phone: string;
  metadata: {
    neighborhood?: string; // Bairro
    complement?: string;
  } | null;
}

export interface PixPayment {
  id: string;
  order_id: string;
  amount: number;
  pix_code: string; // Código Pix copia e cola
  qr_code_base64: string; // QR Code em base64
  expiration: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  created_at: string;
}

export interface MercadoPagoPayment {
  id: string;
  order_id: string;
  payment_id: string;
  status: string;
  status_detail: string;
  external_reference: string;
  preference_id: string;
  created_at: string;
}

export interface NFe {
  id: string;
  order_id: string;
  nfe_number: string;
  nfe_key: string;
  xml_url: string;
  pdf_url: string;
  status: 'pending' | 'issued' | 'cancelled';
  issued_at: string | null;
  metadata: Record<string, any> | null;
}

// Customer Types
export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  has_account: boolean;
  metadata: {
    cpf?: string;
    cnpj?: string;
  } | null;
  created_at: string;
  updated_at: string;
}

// Form Types
export interface CheckoutFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  cpf: string;
  address_1: string;
  address_2?: string;
  city: string;
  province: string;
  postal_code: string;
  neighborhood: string;
  complement?: string;
}

export interface RaffleTicketPurchaseData {
  raffle_id: string;
  quantity: number;
  customer_email: string;
  customer_name: string;
  customer_cpf: string;
}
