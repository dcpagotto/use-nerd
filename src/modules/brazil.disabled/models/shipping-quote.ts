import { model } from "@medusajs/framework/utils";
import { ShippingQuoteStatus, ShippingCompany } from "../types";

/**
 * ShippingQuote Model - Representa uma cotação/envio via Melhor Envio
 */
const ShippingQuote = model.define("shipping_quote", {
  id: model.id().primaryKey(),

  // Referência ao pedido
  order_id: model.text(),

  // Transportadora
  shipping_company: model.enum(ShippingCompany),
  service_name: model.text(), // Ex: "PAC", "SEDEX", "Express"

  // Prazo de entrega
  delivery_min: model.number(), // Dias mínimos
  delivery_max: model.number(), // Dias máximos

  // Preço
  price: model.number(), // Em centavos

  // Rastreamento
  tracking_code: model.text().nullable(),

  // Status
  status: model.enum(ShippingQuoteStatus).default(ShippingQuoteStatus.QUOTED),

  // Datas
  shipped_at: model.dateTime().nullable(),
  delivered_at: model.dateTime().nullable(),

  // Dimensões do pacote
  dimensions: model.json().nullable(), // { height, width, length, weight }

  // Metadata (dados do Melhor Envio)
  metadata: model.json().nullable(),
})
  .indexes([
    {
      on: ["order_id"],
      name: "IDX_shipping_quote_order",
    },
    {
      on: ["tracking_code"],
      name: "IDX_shipping_quote_tracking",
    },
    {
      on: ["status"],
      name: "IDX_shipping_quote_status",
    },
    {
      on: ["shipping_company"],
      name: "IDX_shipping_quote_company",
    },
  ]);

export default ShippingQuote;
