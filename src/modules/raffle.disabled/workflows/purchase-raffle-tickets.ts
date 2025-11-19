import {
  createWorkflow,
  WorkflowResponse,
  transform,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  PurchaseRaffleTicketsWorkflowInput,
  PurchaseRaffleTicketsWorkflowOutput,
  CreateRaffleTicketDTO,
  TicketStatus,
} from "../types";

/**
 * generateTicketNumbersStep
 * Gera números sequenciais para os tickets
 */
const generateTicketNumbersStep = createStep(
  "generate-ticket-numbers",
  async (input: {
    raffle_id: string;
    quantity: number;
  }) => {
    // TODO: Buscar próximo número disponível do RaffleTicketService
    // const nextNumber = await raffleTicketService.getNextTicketNumber(input.raffle_id);

    const startNumber = 1; // Mock - será buscado do service
    const ticketNumbers = Array.from(
      { length: input.quantity },
      (_, i) => startNumber + i
    );

    return new StepResponse(ticketNumbers, { ticketNumbers });
  },
  async (ticketNumbers) => {
    // Rollback: liberar números se necessário
    // TODO: Implementar lógica de rollback
  }
);

/**
 * generateTicketCodesStep
 * Gera códigos únicos para os tickets
 */
const generateTicketCodesStep = createStep(
  "generate-ticket-codes",
  async (input: {
    raffle_id: string;
    ticket_numbers: number[];
  }) => {
    // TODO: Usar RaffleTicketService.generateTicketCode
    const year = new Date().getFullYear();
    const raffleShortId = input.raffle_id.slice(-4).toUpperCase();

    const ticketCodes = input.ticket_numbers.map((num) => {
      const paddedNumber = String(num).padStart(4, "0");
      return `RF${year}-${raffleShortId}-${paddedNumber}`;
    });

    return new StepResponse(ticketCodes, { ticketCodes });
  }
);

/**
 * createTicketsStep
 * Cria os registros de tickets no banco
 */
const createTicketsStep = createStep(
  "create-tickets",
  async (input: {
    tickets: CreateRaffleTicketDTO[];
  }) => {
    // TODO: Usar RaffleTicketService.createTickets
    // const createdTickets = await raffleTicketService.createTickets(input.tickets);

    // Mock - retornar tickets criados
    const createdTickets = input.tickets.map((t) => ({
      id: `ticket_${Date.now()}_${Math.random()}`,
      ...t,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    return new StepResponse(createdTickets, {
      ticket_ids: createdTickets.map((t) => t.id),
    });
  },
  async (compensationData) => {
    // Rollback: deletar tickets criados
    // TODO: Implementar rollback
    console.log("Rolling back tickets:", compensationData.ticket_ids);
  }
);

/**
 * emitTicketsPurchasedEventStep
 * Dispara evento de compra de tickets
 */
const emitTicketsPurchasedEventStep = createStep(
  "emit-tickets-purchased-event",
  async (input: {
    raffle_id: string;
    ticket_ids: string[];
    customer_id: string;
    quantity: number;
  }) => {
    // TODO: Usar eventBusService
    console.log("Event: raffle.tickets_purchased", input);
    return new StepResponse({ success: true });
  }
);

/**
 * purchaseRaffleTicketsWorkflow
 *
 * Workflow completo de compra de tickets:
 * 1. Valida se cliente pode comprar (limites)
 * 2. Gera números sequenciais
 * 3. Gera códigos únicos
 * 4. Cria tickets no banco
 * 5. Dispara eventos
 * 6. Agenda mint de NFTs (assíncrono)
 */
export const purchaseRaffleTicketsWorkflow = createWorkflow(
  "purchase-raffle-tickets",
  function (input: PurchaseRaffleTicketsWorkflowInput) {
    // Step 1: Validações
    const validated = transform({ input }, ({ input }) => {
      if (input.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      if (input.quantity > 100) {
        throw new Error("Cannot purchase more than 100 tickets at once");
      }

      // TODO: Buscar rifa e validar status
      // TODO: Validar se cliente pode comprar (max_tickets_per_customer)
      // TODO: Validar se há tickets disponíveis

      return input;
    });

    // Step 2: Gerar números dos tickets
    const ticketNumbers = generateTicketNumbersStep({
      raffle_id: validated.raffle_id,
      quantity: validated.quantity,
    });

    // Step 3: Gerar códigos únicos
    const ticketCodes = generateTicketCodesStep({
      raffle_id: validated.raffle_id,
      ticket_numbers: ticketNumbers,
    });

    // Step 4: Preparar dados dos tickets
    const ticketsData = transform(
      { validated, ticketNumbers, ticketCodes },
      ({ validated, ticketNumbers, ticketCodes }) => {
        return ticketNumbers.map((number, index): CreateRaffleTicketDTO => ({
          raffle_id: validated.raffle_id,
          ticket_number: number,
          ticket_code: ticketCodes[index],
          customer_id: validated.customer_id,
          order_id: validated.order_id,
          line_item_id: validated.line_item_id,
          price_paid: validated.price_paid,
          status: TicketStatus.RESERVED,
        }));
      }
    );

    // Step 5: Criar tickets
    const createdTickets = createTicketsStep({ tickets: ticketsData });

    // Step 6: Disparar evento
    emitTicketsPurchasedEventStep({
      raffle_id: validated.raffle_id,
      ticket_ids: createdTickets.map((t: any) => t.id),
      customer_id: validated.customer_id,
      quantity: validated.quantity,
    });

    // Step 7: TODO - Agendar mint de NFTs (job assíncrono)
    // scheduleNFTMintJobStep({ ticket_ids: createdTickets.map(t => t.id) });

    return new WorkflowResponse({
      tickets: createdTickets,
    } as PurchaseRaffleTicketsWorkflowOutput);
  }
);
