import { MedusaService } from "@medusajs/framework/utils";
import { Raffle } from "../models";
import {
  CreateRaffleDTO,
  UpdateRaffleDTO,
  RaffleFilters,
  RaffleStatus,
} from "../types";
import { validateProductSpecifications, ProductValidationError } from "../utils/product-validation";

/**
 * RaffleService - Gerencia rifas
 */
class RaffleService extends MedusaService({ Raffle }) {
  /**
   * Cria uma nova rifa
   */
  async createRaffle(data: CreateRaffleDTO): Promise<typeof Raffle> {
    // Validações
    this.validateRaffleData(data);

    // Criar rifa
    const raffle = await this.create(data);

    // Emitir evento
    await this.eventBusModuleService_?.emit("raffle.created", {
      raffle_id: raffle.id,
      status: raffle.status,
    });

    return raffle;
  }

  /**
   * Atualiza uma rifa
   */
  async updateRaffle(
    id: string,
    data: UpdateRaffleDTO
  ): Promise<typeof Raffle> {
    // Buscar rifa
    const raffle = await this.retrieve(id);

    // Validar se pode atualizar
    if (raffle.status !== RaffleStatus.DRAFT) {
      // Só permite atualizar alguns campos após publicação
      const allowedFields = [
        "description",
        "image_url",
        "terms_and_conditions",
        "metadata",
      ];
      const providedFields = Object.keys(data);
      const invalidFields = providedFields.filter(
        (f) => !allowedFields.includes(f)
      );

      if (invalidFields.length > 0) {
        throw new Error(
          `Cannot update fields [${invalidFields.join(
            ", "
          )}] after raffle is published`
        );
      }
    }

    // Atualizar
    const updated = await this.update(id, data);

    return updated;
  }

  /**
   * Lista rifas com filtros
   */
  async listRaffles(
    filters: RaffleFilters = {},
    config: { skip?: number; take?: number; order?: any } = {}
  ): Promise<typeof Raffle[]> {
    return await this.list(filters, config);
  }

  /**
   * Lista rifas ativas (para store)
   */
  async listActiveRaffles(config: {
    skip?: number;
    take?: number;
  } = {}): Promise<typeof Raffle[]> {
    const now = new Date();

    return await this.list(
      {
        status: [RaffleStatus.ACTIVE, RaffleStatus.SOLD_OUT],
        start_date: { lte: now },
        end_date: { gte: now },
      },
      {
        ...config,
        order: { created_at: "DESC" },
      }
    );
  }

  /**
   * Busca uma rifa
   */
  async getRaffle(id: string): Promise<typeof Raffle> {
    return await this.retrieve(id);
  }

  /**
   * Publica uma rifa (draft → active)
   */
  async publishRaffle(
    id: string,
    contractAddress: string,
    transactionHash: string
  ): Promise<typeof Raffle> {
    const raffle = await this.retrieve(id);

    if (raffle.status !== RaffleStatus.DRAFT) {
      throw new Error("Only draft raffles can be published");
    }

    const updated = await this.update(id, {
      status: RaffleStatus.ACTIVE,
      contract_address: contractAddress,
      transaction_hash: transactionHash,
    });

    // Emitir evento
    await this.eventBusModuleService_?.emit("raffle.published", {
      raffle_id: updated.id,
      contract_address: contractAddress,
      transaction_hash: transactionHash,
    });

    return updated;
  }

  /**
   * Marca rifa como sold out
   */
  async markAsSoldOut(id: string): Promise<typeof Raffle> {
    const updated = await this.update(id, {
      status: RaffleStatus.SOLD_OUT,
    });

    return updated;
  }

  /**
   * Inicia processo de sorteio
   */
  async startDraw(id: string): Promise<typeof Raffle> {
    const raffle = await this.retrieve(id);

    // Validações
    if (
      raffle.status !== RaffleStatus.ACTIVE &&
      raffle.status !== RaffleStatus.SOLD_OUT
    ) {
      throw new Error("Raffle must be active or sold out to draw");
    }

    // TODO: Verificar se tem pelo menos 1 ticket vendido
    // const ticketCount = await this.raffleTicketService_.countByRaffle(id);
    // if (ticketCount === 0) {
    //   throw new Error("Cannot draw raffle with no tickets sold");
    // }

    const updated = await this.update(id, {
      status: RaffleStatus.DRAWING,
    });

    return updated;
  }

  /**
   * Completa o sorteio com vencedor
   */
  async completeDraw(
    id: string,
    winnerData: {
      winner_ticket_number: number;
      winner_customer_id: string;
      winner_wallet_address?: string;
    }
  ): Promise<typeof Raffle> {
    const updated = await this.update(id, {
      status: RaffleStatus.COMPLETED,
      winner_ticket_number: winnerData.winner_ticket_number,
      winner_customer_id: winnerData.winner_customer_id,
      winner_wallet_address: winnerData.winner_wallet_address,
      winner_drawn_at: new Date(),
    });

    // Emitir evento
    await this.eventBusModuleService_?.emit("raffle.winner_announced", {
      raffle_id: updated.id,
      winner_ticket_number: winnerData.winner_ticket_number,
      winner_customer_id: winnerData.winner_customer_id,
    });

    return updated;
  }

  /**
   * Cancela uma rifa
   */
  async cancelRaffle(id: string): Promise<typeof Raffle> {
    const raffle = await this.retrieve(id);

    // Validar se pode cancelar
    if (
      raffle.status === RaffleStatus.COMPLETED ||
      raffle.status === RaffleStatus.CANCELLED
    ) {
      throw new Error("Cannot cancel completed or already cancelled raffle");
    }

    const updated = await this.update(id, {
      status: RaffleStatus.CANCELLED,
    });

    // Emitir evento
    await this.eventBusModuleService_?.emit("raffle.cancelled", {
      raffle_id: updated.id,
    });

    return updated;
  }

  /**
   * Obtém estatísticas de uma rifa
   */
  async getRaffleStats(id: string): Promise<any> {
    // TODO: Implementar agregações
    // Será implementado junto com RaffleTicketService
    return {
      total_tickets: 0,
      tickets_sold: 0,
      tickets_available: 0,
      total_revenue: 0,
      unique_customers: 0,
    };
  }

  /**
   * Valida dados da rifa
   */
  private validateRaffleData(data: CreateRaffleDTO): void {
    // Total de tickets
    if (data.total_tickets <= 0 || data.total_tickets > 100000) {
      throw new Error("Total tickets must be between 1 and 100,000");
    }

    // Preço do ticket
    if (data.ticket_price <= 0) {
      throw new Error("Ticket price must be greater than 0");
    }

    // Datas
    if (data.end_date <= data.start_date) {
      throw new Error("End date must be after start date");
    }

    if (data.draw_date < data.end_date) {
      throw new Error("Draw date must be on or after end date");
    }

    // Max tickets per customer
    if (
      data.max_tickets_per_customer &&
      data.max_tickets_per_customer > data.total_tickets
    ) {
      throw new Error(
        "Max tickets per customer cannot exceed total tickets"
      );
    }

    // Product Type and Specifications Validation (Phase 4)
    if (!data.product_type) {
      throw new Error("Product type is required");
    }

    if (!data.product_specifications) {
      throw new Error("Product specifications are required");
    }

    try {
      validateProductSpecifications(
        data.product_type,
        data.product_specifications
      );
    } catch (error) {
      if (error instanceof ProductValidationError) {
        throw new Error(
          `Invalid product specifications for ${error.productType}: ${error.message}`
        );
      }
      throw error;
    }
  }
}

export default RaffleService;
