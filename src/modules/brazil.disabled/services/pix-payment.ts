import { MedusaService } from "@medusajs/framework/utils";
import { PixPayment } from "../models";
import {
  CreatePixPaymentDTO,
  UpdatePixPaymentDTO,
  PixPaymentFilters,
  PixPaymentStatus,
  MercadoPagoPixRequest,
  MercadoPagoPixResponse,
} from "../types";

/**
 * PixPaymentService - Gerencia pagamentos PIX via Mercado Pago
 */
class PixPaymentService extends MedusaService({ PixPayment }) {
  /**
   * Cria um pagamento PIX
   */
  async createPixPayment(
    data: CreatePixPaymentDTO
  ): Promise<typeof PixPayment> {
    const logger = this.container_.resolve("logger");

    try {
      // Validar dados
      this.validatePixPaymentData(data);

      // TODO: Integrar com Mercado Pago SDK
      // const mercadopago = require("mercadopago");
      // mercadopago.configure({
      //   access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
      // });

      // Calcular expiração (padrão: 30 minutos)
      const expiresInMinutes = data.expires_in_minutes || 30;
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

      // TODO: Criar pagamento no Mercado Pago
      const pixRequest: MercadoPagoPixRequest = {
        transaction_amount: data.amount / 100, // Converter centavos para reais
        description: data.description || `Pedido ${data.order_id}`,
        payment_method_id: "pix",
        payer: {
          email: data.payer_email,
          first_name: data.payer_name.split(" ")[0],
          last_name: data.payer_name.split(" ").slice(1).join(" "),
          identification: {
            type: data.payer_cpf_cnpj.length === 11 ? "CPF" : "CNPJ",
            number: data.payer_cpf_cnpj,
          },
        },
        external_reference: data.order_id,
        // notification_url: `${process.env.BACKEND_URL}/webhooks/brazil/pix`,
      };

      // TODO: Fazer request real
      // const pixResponse = await mercadopago.payment.create(pixRequest);
      // const qrCode = pixResponse.body.point_of_interaction.transaction_data.qr_code_base64;
      // const qrCodeText = pixResponse.body.point_of_interaction.transaction_data.qr_code;
      // const txid = pixResponse.body.id.toString();

      // MOCK: Simular resposta do Mercado Pago
      const mockPixResponse: MercadoPagoPixResponse = {
        id: Math.floor(Math.random() * 1000000000),
        status: "pending",
        status_detail: "pending_waiting_payment",
        transaction_amount: data.amount / 100,
        date_created: new Date().toISOString(),
        point_of_interaction: {
          transaction_data: {
            qr_code:
              "00020126580014br.gov.bcb.pix0136a629532e-7693-4846-852d-1bbff6b2e6fc520400005303986540510.005802BR5913Filipe Rocha6008BRASILIA62070503***63041D3D",
            qr_code_base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            ticket_url: "https://www.mercadopago.com.br/payments/123456789/ticket?caller_id=123456",
          },
        },
        external_reference: data.order_id,
      };

      const qrCode = mockPixResponse.point_of_interaction.transaction_data.qr_code_base64;
      const qrCodeText = mockPixResponse.point_of_interaction.transaction_data.qr_code;
      const txid = mockPixResponse.id.toString();

      // Criar no banco
      const payment = await this.create({
        order_id: data.order_id,
        amount: data.amount,
        qr_code: qrCode,
        qr_code_text: qrCodeText,
        txid,
        status: PixPaymentStatus.PENDING,
        expires_at: expiresAt,
        payer_name: data.payer_name,
        payer_email: data.payer_email,
        payer_cpf_cnpj: data.payer_cpf_cnpj,
        metadata: data.metadata || {},
      });

      logger.info(`[Brazil] PIX payment created: ${payment.id}`);

      // Emitir evento
      await this.eventBusModuleService_?.emit("brazil.pix_created", {
        payment_id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
      });

      return payment;
    } catch (error) {
      logger.error(`[Brazil] Error creating PIX payment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Atualiza um pagamento PIX
   */
  async updatePixPayment(
    id: string,
    data: UpdatePixPaymentDTO
  ): Promise<typeof PixPayment> {
    const updated = await this.update(id, data);
    return updated;
  }

  /**
   * Busca pagamento por ID
   */
  async getPixPayment(id: string): Promise<typeof PixPayment> {
    return await this.retrieve(id);
  }

  /**
   * Busca pagamento por order_id
   */
  async getPixPaymentByOrder(orderId: string): Promise<typeof PixPayment | null> {
    const payments = await this.list({ order_id: orderId }, { take: 1 });
    return payments[0] || null;
  }

  /**
   * Busca pagamento por txid (Mercado Pago payment ID)
   */
  async getPixPaymentByTxid(txid: string): Promise<typeof PixPayment | null> {
    const payments = await this.list({ txid }, { take: 1 });
    return payments[0] || null;
  }

  /**
   * Lista pagamentos com filtros
   */
  async listPixPayments(
    filters: PixPaymentFilters = {},
    config: { skip?: number; take?: number; order?: any } = {}
  ): Promise<typeof PixPayment[]> {
    return await this.list(filters, config);
  }

  /**
   * Verifica status de pagamento no Mercado Pago
   */
  async checkPaymentStatus(txid: string): Promise<{
    status: PixPaymentStatus;
    paid_at?: Date;
  }> {
    const logger = this.container_.resolve("logger");

    try {
      // TODO: Consultar Mercado Pago
      // const mercadopago = require("mercadopago");
      // mercadopago.configure({
      //   access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
      // });
      //
      // const response = await mercadopago.payment.get(parseInt(txid));
      // const mpStatus = response.body.status;
      //
      // const statusMap = {
      //   approved: PixPaymentStatus.PAID,
      //   pending: PixPaymentStatus.PENDING,
      //   rejected: PixPaymentStatus.CANCELLED,
      //   cancelled: PixPaymentStatus.CANCELLED,
      //   refunded: PixPaymentStatus.CANCELLED,
      // };
      //
      // return {
      //   status: statusMap[mpStatus] || PixPaymentStatus.PENDING,
      //   paid_at: response.body.date_approved
      //     ? new Date(response.body.date_approved)
      //     : undefined,
      // };

      // MOCK: Simular resposta
      logger.info(`[Brazil] Checking PIX payment status: ${txid}`);
      return {
        status: PixPaymentStatus.PENDING,
      };
    } catch (error) {
      logger.error(`[Brazil] Error checking payment status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Processa webhook do Mercado Pago
   */
  async processWebhook(webhookData: any): Promise<void> {
    const logger = this.container_.resolve("logger");

    try {
      // Extrair payment ID do webhook
      const paymentId = webhookData.data?.id;

      if (!paymentId) {
        logger.warn("[Brazil] Invalid webhook data: missing payment ID");
        return;
      }

      // Buscar status atualizado
      const statusData = await this.checkPaymentStatus(paymentId);

      // Buscar pagamento no banco
      const payment = await this.getPixPaymentByTxid(paymentId);

      if (!payment) {
        logger.warn(`[Brazil] Payment not found for txid: ${paymentId}`);
        return;
      }

      // Atualizar status
      await this.updatePixPayment(payment.id, {
        status: statusData.status,
        paid_at: statusData.paid_at,
      });

      // Se pago, emitir evento
      if (statusData.status === PixPaymentStatus.PAID) {
        await this.eventBusModuleService_?.emit("brazil.pix_paid", {
          payment_id: payment.id,
          order_id: payment.order_id,
          paid_at: statusData.paid_at || new Date(),
        });

        logger.info(`[Brazil] PIX payment paid: ${payment.id}`);
      }
    } catch (error) {
      logger.error(`[Brazil] Error processing webhook: ${error.message}`);
      throw error;
    }
  }

  /**
   * Expira pagamento PIX
   */
  async expirePayment(id: string): Promise<typeof PixPayment> {
    const logger = this.container_.resolve("logger");

    const payment = await this.retrieve(id);

    if (payment.status !== PixPaymentStatus.PENDING) {
      logger.warn(`[Brazil] Cannot expire payment ${id}: status is ${payment.status}`);
      return payment;
    }

    const updated = await this.update(id, {
      status: PixPaymentStatus.EXPIRED,
    });

    logger.info(`[Brazil] PIX payment expired: ${id}`);

    return updated;
  }

  /**
   * Valida dados de pagamento PIX
   */
  private validatePixPaymentData(data: CreatePixPaymentDTO): void {
    // Validar amount
    if (data.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    // Validar CPF/CNPJ
    const cpfCnpj = data.payer_cpf_cnpj.replace(/\D/g, "");
    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
      throw new Error("Invalid CPF/CNPJ");
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.payer_email)) {
      throw new Error("Invalid email");
    }

    // Validar expires_in_minutes
    if (data.expires_in_minutes && (data.expires_in_minutes < 1 || data.expires_in_minutes > 1440)) {
      throw new Error("Expiration must be between 1 and 1440 minutes (24 hours)");
    }
  }
}

export default PixPaymentService;
