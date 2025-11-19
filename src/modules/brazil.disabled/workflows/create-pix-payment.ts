import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { BRAZIL_MODULE } from "../index";
import type PixPaymentService from "../services/pix-payment";
import {
  CreatePixPaymentWorkflowInput,
  CreatePixPaymentWorkflowOutput,
} from "../types";

/**
 * Step: Criar pagamento PIX
 */
const createPixPaymentStep = createStep(
  "create-pix-payment-step",
  async (
    input: CreatePixPaymentWorkflowInput,
    { container }
  ) => {
    const pixPaymentService: PixPaymentService = container.resolve(
      `${BRAZIL_MODULE}.pix-payment`
    );

    const payment = await pixPaymentService.createPixPayment({
      order_id: input.order_id,
      amount: input.amount,
      payer_name: input.payer_name,
      payer_email: input.payer_email,
      payer_cpf_cnpj: input.payer_cpf_cnpj,
      description: input.description,
      expires_in_minutes: input.expires_in_minutes,
    });

    return new StepResponse(
      {
        payment,
        qr_code: payment.qr_code,
        qr_code_text: payment.qr_code_text,
      },
      {
        payment_id: payment.id,
      }
    );
  },
  async (compensateInput, { container }) => {
    // Compensação: cancelar pagamento PIX criado
    if (compensateInput?.payment_id) {
      const pixPaymentService: PixPaymentService = container.resolve(
        `${BRAZIL_MODULE}.pix-payment`
      );

      await pixPaymentService.updatePixPayment(compensateInput.payment_id, {
        status: "cancelled",
      });
    }
  }
);

/**
 * Workflow: Criar pagamento PIX
 *
 * Este workflow:
 * 1. Valida dados do pedido
 * 2. Cria pagamento PIX no Mercado Pago
 * 3. Salva no banco de dados
 * 4. Retorna QR Code para pagamento
 */
export const createPixPaymentWorkflow = createWorkflow(
  "create-pix-payment-workflow",
  (
    input: CreatePixPaymentWorkflowInput
  ): WorkflowResponse<CreatePixPaymentWorkflowOutput> => {
    const result = createPixPaymentStep(input);

    return new WorkflowResponse(result);
  }
);
