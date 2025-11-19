import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { BRAZIL_MODULE } from "../index";
import type NFeService from "../services/nfe";
import {
  GenerateNFeWorkflowInput,
  GenerateNFeWorkflowOutput,
  CreateNFeDTO,
} from "../types";

/**
 * Step: Buscar dados do pedido
 */
const fetchOrderDataStep = createStep(
  "fetch-order-data-step",
  async (
    input: GenerateNFeWorkflowInput,
    { container }
  ) => {
    const logger = container.resolve("logger");

    // TODO: Buscar dados do pedido via orderService
    // const orderService = container.resolve("orderService");
    // const order = await orderService.retrieve(input.order_id, {
    //   relations: ["customer", "shipping_address", "items", "items.variant"],
    // });
    //
    // // Validar se pedido está completo
    // if (order.status !== "completed") {
    //   throw new Error("Order must be completed to generate NFe");
    // }
    //
    // // Preparar dados da NFe
    // const nfeData: CreateNFeDTO = {
    //   order_id: order.id,
    //   customer_cpf_cnpj: order.customer.metadata?.cpf_cnpj,
    //   customer_name: `${order.customer.first_name} ${order.customer.last_name}`,
    //   customer_email: order.customer.email,
    //   customer_address: {
    //     street: order.shipping_address.address_1,
    //     number: order.shipping_address.address_2 || "S/N",
    //     complement: order.shipping_address.complement,
    //     district: order.shipping_address.district,
    //     city: order.shipping_address.city,
    //     state: order.shipping_address.province,
    //     postal_code: order.shipping_address.postal_code,
    //   },
    //   items: order.items.map((item) => ({
    //     product_code: item.variant.sku || item.variant.id,
    //     description: item.title,
    //     quantity: item.quantity,
    //     unit_price: item.unit_price,
    //     total_price: item.unit_price * item.quantity,
    //     ncm: item.variant.metadata?.ncm,
    //     cfop: item.variant.metadata?.cfop,
    //   })),
    //   total_amount: order.total,
    //   shipping_amount: order.shipping_total,
    // };

    // MOCK: Simular dados do pedido
    logger.info(`[Brazil] Fetching order data for NFe: ${input.order_id}`);

    const mockNFeData: CreateNFeDTO = {
      order_id: input.order_id,
      customer_cpf_cnpj: "12345678901",
      customer_name: "Cliente Teste",
      customer_email: "cliente@example.com",
      customer_address: {
        street: "Rua Exemplo",
        number: "123",
        complement: "Apto 45",
        district: "Centro",
        city: "São Paulo",
        state: "SP",
        postal_code: "01310-100",
      },
      items: [
        {
          product_code: "PROD001",
          description: "Produto Teste",
          quantity: 1,
          unit_price: 10000, // R$ 100,00
          total_price: 10000,
          ncm: "00000000",
          cfop: "5102",
        },
      ],
      total_amount: 12500, // R$ 125,00
      shipping_amount: 2500, // R$ 25,00
    };

    return new StepResponse(mockNFeData);
  }
);

/**
 * Step: Gerar NFe
 */
const generateNFeStep = createStep(
  "generate-nfe-step",
  async (
    nfeData: CreateNFeDTO,
    { container }
  ) => {
    const nfeService: NFeService = container.resolve(
      `${BRAZIL_MODULE}.nfe`
    );

    const nfe = await nfeService.generateNFe(nfeData);

    return new StepResponse(
      {
        nfe,
        pdf_url: nfe.pdf_url || undefined,
        xml_url: nfe.xml_url || undefined,
      },
      {
        nfe_id: nfe.id,
      }
    );
  },
  async (compensateInput, { container }) => {
    // Compensação: cancelar NFe criada
    if (compensateInput?.nfe_id) {
      const nfeService: NFeService = container.resolve(
        `${BRAZIL_MODULE}.nfe`
      );

      try {
        await nfeService.cancelNFe(
          compensateInput.nfe_id,
          "Erro no processamento do pedido"
        );
      } catch (error) {
        // Log error mas não falha a compensação
        const logger = container.resolve("logger");
        logger.error(`[Brazil] Error compensating NFe: ${error.message}`);
      }
    }
  }
);

/**
 * Workflow: Gerar NFe
 *
 * Este workflow:
 * 1. Busca dados completos do pedido
 * 2. Valida dados fiscais do cliente
 * 3. Gera NFe no provedor (eNotas, Focus NFe)
 * 4. Envia NFe por email
 * 5. Retorna links para PDF e XML
 */
export const generateNFeWorkflow = createWorkflow(
  "generate-nfe-workflow",
  (
    input: GenerateNFeWorkflowInput
  ): WorkflowResponse<GenerateNFeWorkflowOutput> => {
    const orderData = fetchOrderDataStep(input);
    const result = generateNFeStep(orderData);

    return new WorkflowResponse(result);
  }
);
