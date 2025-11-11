/**
 * Brazil Module - Type Definitions
 * Tipos para integrações brasileiras: PIX, Frete, NFe
 */

// ============================================
// Enums
// ============================================

export enum PixPaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

export enum ShippingQuoteStatus {
  QUOTED = "quoted",
  PURCHASED = "purchased",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum NFeStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  AUTHORIZED = "authorized",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export enum ShippingCompany {
  CORREIOS = "correios",
  JADLOG = "jadlog",
  AZUL_CARGO = "azul-cargo",
  LATAM_CARGO = "latam-cargo",
  LOGGI = "loggi",
}

// ============================================
// DTOs - Data Transfer Objects
// ============================================

export interface CreatePixPaymentDTO {
  order_id: string;
  amount: number; // Em centavos
  payer_name: string;
  payer_email: string;
  payer_cpf_cnpj: string;
  description?: string;
  expires_in_minutes?: number; // Padrão: 30 minutos
  metadata?: Record<string, any>;
}

export interface UpdatePixPaymentDTO {
  status?: PixPaymentStatus;
  paid_at?: Date;
  payer_cpf_cnpj?: string;
  metadata?: Record<string, any>;
}

export interface CreateShippingQuoteDTO {
  order_id: string;
  shipping_company: ShippingCompany;
  service_name: string;
  delivery_min: number; // Dias
  delivery_max: number; // Dias
  price: number; // Em centavos
  dimensions?: {
    height: number; // cm
    width: number; // cm
    length: number; // cm
    weight: number; // kg
  };
  metadata?: Record<string, any>;
}

export interface UpdateShippingQuoteDTO {
  status?: ShippingQuoteStatus;
  tracking_code?: string;
  shipped_at?: Date;
  delivered_at?: Date;
  metadata?: Record<string, any>;
}

export interface CreateNFeDTO {
  order_id: string;
  customer_cpf_cnpj: string;
  customer_name: string;
  customer_email: string;
  customer_address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    postal_code: string;
  };
  items: Array<{
    product_code: string;
    description: string;
    quantity: number;
    unit_price: number; // Em centavos
    total_price: number; // Em centavos
    ncm?: string; // Código NCM
    cfop?: string; // Código CFOP
  }>;
  total_amount: number; // Em centavos
  shipping_amount?: number; // Em centavos
  metadata?: Record<string, any>;
}

export interface UpdateNFeDTO {
  status?: NFeStatus;
  nfe_number?: string;
  access_key?: string;
  xml_url?: string;
  pdf_url?: string;
  issued_at?: Date;
  error_message?: string;
  metadata?: Record<string, any>;
}

// ============================================
// Filters
// ============================================

export interface PixPaymentFilters {
  id?: string | string[];
  order_id?: string | string[];
  status?: PixPaymentStatus | PixPaymentStatus[];
  txid?: string;
  payer_cpf_cnpj?: string;
}

export interface ShippingQuoteFilters {
  id?: string | string[];
  order_id?: string | string[];
  status?: ShippingQuoteStatus | ShippingQuoteStatus[];
  shipping_company?: ShippingCompany | ShippingCompany[];
  tracking_code?: string;
}

export interface NFeFilters {
  id?: string | string[];
  order_id?: string | string[];
  status?: NFeStatus | NFeStatus[];
  nfe_number?: string;
  access_key?: string;
  customer_cpf_cnpj?: string;
}

// ============================================
// Response Types
// ============================================

export interface PixPaymentResponse {
  payment_id: string;
  order_id: string;
  qr_code: string;
  qr_code_text: string;
  amount: number;
  expires_at: string;
}

export interface ShippingCalculateRequest {
  from_postal_code: string;
  to_postal_code: string;
  packages: Array<{
    height: number; // cm
    width: number; // cm
    length: number; // cm
    weight: number; // kg
    insurance_value?: number; // Em centavos
  }>;
}

export interface ShippingCalculateResponse {
  quotes: Array<{
    company: ShippingCompany;
    service_name: string;
    price: number; // Em centavos
    delivery_min: number; // Dias
    delivery_max: number; // Dias
    company_id?: string; // ID da transportadora na API
    service_id?: string; // ID do serviço na API
  }>;
}

export interface ShippingTrackingResponse {
  tracking_code: string;
  status: ShippingQuoteStatus;
  events: Array<{
    date: string;
    description: string;
    location?: string;
  }>;
  estimated_delivery?: string;
}

export interface NFeResponse {
  nfe_id: string;
  order_id: string;
  nfe_number?: string;
  access_key?: string;
  status: NFeStatus;
  pdf_url?: string;
  xml_url?: string;
  issued_at?: string;
  error_message?: string;
}

// ============================================
// Workflow Input/Output Types
// ============================================

export interface CreatePixPaymentWorkflowInput {
  order_id: string;
  amount: number;
  payer_name: string;
  payer_email: string;
  payer_cpf_cnpj: string;
  description?: string;
  expires_in_minutes?: number;
}

export interface CreatePixPaymentWorkflowOutput {
  payment: any; // PixPayment model
  qr_code: string;
  qr_code_text: string;
}

export interface CalculateShippingWorkflowInput {
  from_postal_code: string;
  to_postal_code: string;
  packages: Array<{
    height: number;
    width: number;
    length: number;
    weight: number;
    insurance_value?: number;
  }>;
}

export interface CalculateShippingWorkflowOutput {
  quotes: Array<{
    company: ShippingCompany;
    service_name: string;
    price: number;
    delivery_min: number;
    delivery_max: number;
  }>;
}

export interface GenerateNFeWorkflowInput {
  order_id: string;
}

export interface GenerateNFeWorkflowOutput {
  nfe: any; // NFe model
  pdf_url?: string;
  xml_url?: string;
}

// ============================================
// Event Types
// ============================================

export interface PixPaymentCreatedEvent {
  payment_id: string;
  order_id: string;
  amount: number;
}

export interface PixPaymentPaidEvent {
  payment_id: string;
  order_id: string;
  paid_at: Date;
}

export interface ShippingPurchasedEvent {
  shipping_id: string;
  order_id: string;
  tracking_code: string;
}

export interface NFeGeneratedEvent {
  nfe_id: string;
  order_id: string;
  nfe_number: string;
  access_key: string;
}

// ============================================
// External API Types (Mercado Pago PIX)
// ============================================

export interface MercadoPagoPixRequest {
  transaction_amount: number;
  description: string;
  payment_method_id: "pix";
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
    identification?: {
      type: "CPF" | "CNPJ";
      number: string;
    };
  };
  notification_url?: string;
  external_reference?: string;
}

export interface MercadoPagoPixResponse {
  id: number;
  status: string;
  status_detail: string;
  transaction_amount: number;
  date_created: string;
  date_approved?: string;
  point_of_interaction: {
    transaction_data: {
      qr_code: string;
      qr_code_base64: string;
      ticket_url: string;
    };
  };
  external_reference?: string;
}

export interface MercadoPagoWebhook {
  action: string;
  api_version: string;
  data: {
    id: string;
  };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: string;
  user_id: string;
}

// ============================================
// External API Types (Melhor Envio)
// ============================================

export interface MelhorEnvioCalculateRequest {
  from: {
    postal_code: string;
  };
  to: {
    postal_code: string;
  };
  package: {
    height: number;
    width: number;
    length: number;
    weight: number;
  };
  services?: string; // IDs separados por vírgula
}

export interface MelhorEnvioQuote {
  id: number;
  name: string;
  price: string;
  discount: string;
  currency: string;
  delivery_time: number;
  delivery_range: {
    min: number;
    max: number;
  };
  company: {
    id: number;
    name: string;
    picture: string;
  };
}

export interface MelhorEnvioShipmentRequest {
  service: number;
  from: {
    name: string;
    phone: string;
    email: string;
    document: string;
    address: string;
    complement?: string;
    number: string;
    district: string;
    city: string;
    state_abbr: string;
    postal_code: string;
  };
  to: {
    name: string;
    phone: string;
    email: string;
    document: string;
    address: string;
    complement?: string;
    number: string;
    district: string;
    city: string;
    state_abbr: string;
    postal_code: string;
  };
  products: Array<{
    name: string;
    quantity: number;
    unitary_value: number;
  }>;
  volumes: Array<{
    height: number;
    width: number;
    length: number;
    weight: number;
  }>;
}

// ============================================
// External API Types (NFe Provider)
// ============================================

export interface NFeProviderRequest {
  tipo: "NF-e" | "NFC-e";
  enviarPorEmail?: boolean;
  cliente: {
    tipoPessoa: "F" | "J"; // Física ou Jurídica
    nome: string;
    email: string;
    cpfCnpj: string;
    telefone?: string;
    endereco: {
      logradouro: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      uf: string;
      cep: string;
    };
  };
  produtos: Array<{
    codigo: string;
    descricao: string;
    ncm: string;
    cfop: string;
    unidadeMedida: string;
    quantidade: number;
    valorUnitario: number;
  }>;
  valorTotal: number;
  valorFrete?: number;
}

export interface NFeProviderResponse {
  status: string;
  numero?: string;
  serie?: string;
  chaveAcesso?: string;
  linkPdf?: string;
  linkXml?: string;
  dataEmissao?: string;
  mensagem?: string;
}

// ============================================
// Utility Types
// ============================================

export interface BrazilianAddress {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
}

export interface CpfCnpjValidation {
  isValid: boolean;
  type: "CPF" | "CNPJ" | "unknown";
  formatted: string;
}

export interface CepValidation {
  isValid: boolean;
  formatted: string; // XXXXX-XXX
}
