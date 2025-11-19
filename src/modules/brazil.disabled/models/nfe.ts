import { model } from "@medusajs/framework/utils";
import { NFeStatus } from "../types";

/**
 * NFe Model - Representa uma Nota Fiscal Eletrônica
 */
const NFe = model.define("nfe", {
  id: model.id().primaryKey(),

  // Referência ao pedido
  order_id: model.text(),

  // Dados da NFe
  nfe_number: model.text().nullable(), // Número da nota
  access_key: model.text().nullable(), // Chave de acesso (44 dígitos)

  // URLs
  xml_url: model.text().nullable(),
  pdf_url: model.text().nullable(),

  // Status
  status: model.enum(NFeStatus).default(NFeStatus.PENDING),

  // Data de emissão
  issued_at: model.dateTime().nullable(),

  // Erro (caso rejeição)
  error_message: model.text().nullable(),

  // Dados do cliente
  customer_cpf_cnpj: model.text(),
  customer_name: model.text(),
  customer_email: model.text(),

  // Endereço do cliente
  customer_address: model.json(), // BrazilianAddress

  // Itens da NFe
  items: model.json(), // Array de NFeItem

  // Valores
  total_amount: model.number(), // Em centavos
  shipping_amount: model.number().nullable(), // Em centavos

  // Metadata (dados do provider)
  metadata: model.json().nullable(),
})
  .indexes([
    {
      on: ["order_id"],
      name: "IDX_nfe_order",
    },
    {
      on: ["nfe_number"],
      name: "IDX_nfe_number",
    },
    {
      on: ["access_key"],
      name: "IDX_nfe_access_key",
    },
    {
      on: ["status"],
      name: "IDX_nfe_status",
    },
    {
      on: ["customer_cpf_cnpj"],
      name: "IDX_nfe_customer",
    },
  ]);

export default NFe;
