import { model } from "@medusajs/framework/utils";
import { TicketStatus } from "../types";

/**
 * RaffleTicket Model - Representa um ticket de rifa
 */
const RaffleTicket = model.define("raffle_ticket", {
  id: model.id().primaryKey(),

  // Relação com rifa
  raffle_id: model.text(),

  // Identificação
  ticket_number: model.number(),
  ticket_code: model.text().unique(),

  // Comprador
  customer_id: model.text(),
  order_id: model.text(),
  line_item_id: model.text(),

  // NFT
  nft_token_id: model.text().nullable(),
  nft_transaction_hash: model.text().nullable(),
  nft_metadata_uri: model.text().nullable(),

  // Status
  status: model.enum(TicketStatus).default(TicketStatus.RESERVED),
  is_winner: model.boolean().default(false),

  // Pagamento
  paid_at: model.dateTime().nullable(),
  price_paid: model.number(), // Em centavos

  // Timestamps
  created_at: model.dateTime().default("now"),
  updated_at: model.dateTime().default("now"),
  deleted_at: model.dateTime().nullable(),
})
  .indexes([
    {
      on: ["raffle_id"],
      name: "IDX_ticket_raffle",
    },
    {
      on: ["customer_id"],
      name: "IDX_ticket_customer",
    },
    {
      on: ["order_id"],
      name: "IDX_ticket_order",
    },
    {
      on: ["ticket_number", "raffle_id"],
      unique: true,
      name: "IDX_ticket_number_raffle",
    },
    {
      on: ["status"],
      name: "IDX_ticket_status",
    },
    {
      on: ["is_winner"],
      name: "IDX_ticket_winner",
    },
  ]);

export default RaffleTicket;
