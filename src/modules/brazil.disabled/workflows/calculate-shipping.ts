import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { BRAZIL_MODULE } from "../index";
import type MelhorEnvioService from "../services/melhor-envio";
import {
  CalculateShippingWorkflowInput,
  CalculateShippingWorkflowOutput,
} from "../types";

/**
 * Step: Calcular frete
 */
const calculateShippingStep = createStep(
  "calculate-shipping-step",
  async (
    input: CalculateShippingWorkflowInput,
    { container }
  ) => {
    const melhorEnvioService: MelhorEnvioService = container.resolve(
      `${BRAZIL_MODULE}.melhor-envio`
    );

    const result = await melhorEnvioService.calculateShipping({
      from_postal_code: input.from_postal_code,
      to_postal_code: input.to_postal_code,
      packages: input.packages,
    });

    return new StepResponse(result);
  }
);

/**
 * Workflow: Calcular frete
 *
 * Este workflow:
 * 1. Valida CEPs de origem e destino
 * 2. Consulta Melhor Envio API
 * 3. Retorna cotações de múltiplas transportadoras
 */
export const calculateShippingWorkflow = createWorkflow(
  "calculate-shipping-workflow",
  (
    input: CalculateShippingWorkflowInput
  ): WorkflowResponse<CalculateShippingWorkflowOutput> => {
    const result = calculateShippingStep(input);

    return new WorkflowResponse(result);
  }
);
