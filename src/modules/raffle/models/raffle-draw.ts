import { model } from "@medusajs/framework/utils";
import { DrawStatus } from "../types";

/**
 * RaffleDraw Model - Representa um sorteio de rifa
 */
const RaffleDraw = model.define("raffle_draw", {
  id: model.id().primaryKey(),

  // Relação com rifa
  raffle_id: model.text(),

  // Chainlink VRF
  vrf_request_id: model.text(),
  vrf_random_words: model.json().nullable(), // Array de números aleatórios
  vrf_transaction_hash: model.text(),

  // Resultado
  winner_ticket_number: model.number().nullable(),
  winner_ticket_id: model.text().nullable(),
  winner_customer_id: model.text().nullable(),

  // Status
  status: model.enum(DrawStatus).default(DrawStatus.REQUESTED),

  // Metadata
  drawn_at: model.dateTime().default("now"),
  executed_by: model.text(), // User ID do admin
  metadata: model.json().nullable(),

  // Timestamps
  created_at: model.dateTime().default("now"),
  updated_at: model.dateTime().default("now"),
})
  .indexes([
    {
      on: ["raffle_id"],
      name: "IDX_draw_raffle",
    },
    {
      on: ["vrf_request_id"],
      unique: true,
      name: "IDX_draw_vrf_request",
    },
    {
      on: ["status"],
      name: "IDX_draw_status",
    },
  ]);

export default RaffleDraw;
