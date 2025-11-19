import { model } from "@medusajs/framework/utils";
import { PixPaymentStatus } from "../types";

/**
 * PixPayment Model - Representa um pagamento PIX via Mercado Pago
 */
const PixPayment = model.define("pix_payment", {
  id: model.id().primaryKey(),

  // Referência ao pedido
  order_id: model.text(),

  // Valor
  amount: model.number(), // Em centavos (ex: 10000 = R$ 100,00)

  // Dados PIX
  qr_code: model.text(), // QR Code em base64
  qr_code_text: model.text(), // Copia e Cola
  txid: model.text().unique(), // ID da transação PIX (Mercado Pago payment ID)

  // Status
  status: model.enum(PixPaymentStatus).default(PixPaymentStatus.PENDING),

  // Datas
  expires_at: model.dateTime(),
  paid_at: model.dateTime().nullable(),

  // Dados do pagador
  payer_name: model.text().nullable(),
  payer_email: model.text().nullable(),
  payer_cpf_cnpj: model.text().nullable(),

  // Metadata
  metadata: model.json().nullable(),
})
  .indexes([
    {
      on: ["order_id"],
      name: "IDX_pix_payment_order",
    },
    {
      on: ["txid"],
      name: "IDX_pix_payment_txid",
    },
    {
      on: ["status"],
      name: "IDX_pix_payment_status",
    },
    {
      on: ["expires_at"],
      name: "IDX_pix_payment_expires",
    },
  ]);

export default PixPayment;
