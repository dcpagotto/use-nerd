import { model } from "@medusajs/framework/utils";
import { RaffleStatus, ProductType } from "../types";

/**
 * Raffle Model - Representa uma rifa
 */
const Raffle = model.define("raffle", {
  id: model.id().primaryKey(),

  // Informações básicas
  title: model.text(),
  description: model.text().nullable(),
  prize_description: model.text(),

  // Configuração
  total_tickets: model.number(),
  ticket_price: model.number(), // Em centavos
  max_tickets_per_customer: model.number().default(0), // 0 = sem limite

  // Datas
  start_date: model.dateTime(),
  end_date: model.dateTime(),
  draw_date: model.dateTime(),

  // Status
  status: model.enum(RaffleStatus).default(RaffleStatus.DRAFT),

  // Blockchain
  contract_address: model.text().nullable(),
  transaction_hash: model.text().nullable(),
  chainlink_request_id: model.text().nullable(),

  // Vencedor
  winner_ticket_number: model.number().nullable(),
  winner_customer_id: model.text().nullable(),
  winner_wallet_address: model.text().nullable(),
  winner_drawn_at: model.dateTime().nullable(),

  // Metadata
  image_url: model.text().nullable(),
  terms_and_conditions: model.text().nullable(),
  metadata: model.json().nullable(),

  // Product Type and Specifications (Phase 4)
  product_type: model.enum(ProductType).default(ProductType.OTHER),
  product_specifications: model.json().nullable(), // Store ProductSpecifications as JSON
  supplier_name: model.text().nullable(),
  supplier_contact: model.text().nullable(),
  delivery_type: model.text().nullable(), // "pickup" | "shipping" | "digital" | "transfer"
  delivery_estimate_days: model.number().nullable(),

  // Relações
  product_id: model.text().nullable(),
})
  .cascades({
    delete: ["tickets", "draws"],
  })
  .indexes([
    {
      on: ["status"],
      name: "IDX_raffle_status",
    },
    {
      on: ["product_id"],
      name: "IDX_raffle_product",
    },
    {
      on: ["start_date", "end_date"],
      name: "IDX_raffle_dates",
    },
    {
      on: ["product_type"],
      name: "IDX_raffle_product_type",
    },
  ]);

export default Raffle;
