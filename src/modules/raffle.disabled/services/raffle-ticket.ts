import { MedusaService } from "@medusajs/framework/utils";
import { RaffleTicket } from "../models";
import {
  CreateRaffleTicketDTO,
  RaffleTicketFilters,
  TicketStatus,
} from "../types";

/**
 * RaffleTicketService - Gerencia tickets de rifas
 */
class RaffleTicketService extends MedusaService({ RaffleTicket }) {
  /**
   * Cria um novo ticket
   */
  async createTicket(data: CreateRaffleTicketDTO): Promise<typeof RaffleTicket> {
    const ticket = await this.create(data);
    return ticket;
  }

  /**
   * Cria múltiplos tickets (compra em lote)
   */
  async createTickets(
    tickets: CreateRaffleTicketDTO[]
  ): Promise<typeof RaffleTicket[]> {
    const created = await Promise.all(
      tickets.map((t) => this.create(t))
    );
    return created;
  }

  /**
   * Lista tickets com filtros
   */
  async listTickets(
    filters: RaffleTicketFilters = {},
    config: { skip?: number; take?: number; order?: any } = {}
  ): Promise<typeof RaffleTicket[]> {
    return await this.list(filters, config);
  }

  /**
   * Busca tickets de um cliente
   */
  async getCustomerTickets(
    customerId: string,
    config: { skip?: number; take?: number } = {}
  ): Promise<typeof RaffleTicket[]> {
    return await this.list(
      { customer_id: customerId },
      { ...config, order: { created_at: "DESC" } }
    );
  }

  /**
   * Busca tickets de uma rifa
   */
  async getRaffleTickets(
    raffleId: string,
    config: { skip?: number; take?: number } = {}
  ): Promise<typeof RaffleTicket[]> {
    return await this.list(
      { raffle_id: raffleId },
      { ...config, order: { ticket_number: "ASC" } }
    );
  }

  /**
   * Conta tickets de uma rifa
   */
  async countRaffleTickets(raffleId: string): Promise<number> {
    const tickets = await this.list({ raffle_id: raffleId });
    return tickets.length;
  }

  /**
   * Conta tickets de um cliente em uma rifa
   */
  async countCustomerTicketsInRaffle(
    customerId: string,
    raffleId: string
  ): Promise<number> {
    const tickets = await this.list({
      customer_id: customerId,
      raffle_id: raffleId,
    });
    return tickets.length;
  }

  /**
   * Gera próximo número de ticket disponível
   */
  async getNextTicketNumber(raffleId: string): Promise<number> {
    const tickets = await this.list(
      { raffle_id: raffleId },
      { order: { ticket_number: "DESC" }, take: 1 }
    );

    if (tickets.length === 0) {
      return 1;
    }

    return tickets[0].ticket_number + 1;
  }

  /**
   * Gera código único para ticket
   */
  async generateTicketCode(raffleId: string, ticketNumber: number): Promise<string> {
    const year = new Date().getFullYear();
    const raffleShortId = raffleId.slice(-4).toUpperCase();
    const paddedNumber = String(ticketNumber).padStart(4, "0");
    return `RF${year}-${raffleShortId}-${paddedNumber}`;
  }

  /**
   * Atualiza status do ticket
   */
  async updateTicketStatus(
    id: string,
    status: TicketStatus
  ): Promise<typeof RaffleTicket> {
    return await this.update(id, { status });
  }

  /**
   * Marca ticket como pago
   */
  async markAsPaid(id: string): Promise<typeof RaffleTicket> {
    return await this.update(id, {
      status: TicketStatus.PAID,
      paid_at: new Date(),
    });
  }

  /**
   * Atualiza dados do NFT
   */
  async updateNFTData(
    id: string,
    nftData: {
      nft_token_id: string;
      nft_transaction_hash: string;
      nft_metadata_uri?: string;
    }
  ): Promise<typeof RaffleTicket> {
    return await this.update(id, {
      ...nftData,
      status: TicketStatus.MINTED,
    });
  }

  /**
   * Marca ticket como vencedor
   */
  async markAsWinner(id: string): Promise<typeof RaffleTicket> {
    return await this.update(id, {
      is_winner: true,
      status: TicketStatus.WINNER,
    });
  }

  /**
   * Busca ticket vencedor de uma rifa
   */
  async getWinnerTicket(raffleId: string): Promise<typeof RaffleTicket | null> {
    const tickets = await this.list({
      raffle_id: raffleId,
      is_winner: true,
    });

    return tickets.length > 0 ? tickets[0] : null;
  }

  /**
   * Busca ticket por número
   */
  async getTicketByNumber(
    raffleId: string,
    ticketNumber: number
  ): Promise<typeof RaffleTicket | null> {
    const tickets = await this.list({
      raffle_id: raffleId,
      ticket_number: ticketNumber,
    });

    return tickets.length > 0 ? tickets[0] : null;
  }

  /**
   * Valida se cliente pode comprar mais tickets
   */
  async canCustomerPurchaseTickets(
    customerId: string,
    raffleId: string,
    quantity: number,
    maxTicketsPerCustomer: number
  ): Promise<{ canPurchase: boolean; reason?: string }> {
    if (maxTicketsPerCustomer === 0) {
      return { canPurchase: true };
    }

    const currentTickets = await this.countCustomerTicketsInRaffle(
      customerId,
      raffleId
    );
    const newTotal = currentTickets + quantity;

    if (newTotal > maxTicketsPerCustomer) {
      return {
        canPurchase: false,
        reason: `Customer already has ${currentTickets} tickets. Max allowed: ${maxTicketsPerCustomer}`,
      };
    }

    return { canPurchase: true };
  }

  /**
   * Obtém tickets recentes de uma rifa (para display público)
   */
  async getRecentTickets(
    raffleId: string,
    limit: number = 10
  ): Promise<Array<{
    ticket_number: number;
    customer_name: string;
    created_at: Date;
  }>> {
    const tickets = await this.list(
      { raffle_id: raffleId },
      {
        order: { created_at: "DESC" },
        take: limit,
      }
    );

    // TODO: Buscar dados do cliente do Medusa
    // Por enquanto retorna anonimizado
    return tickets.map((t) => ({
      ticket_number: t.ticket_number,
      customer_name: `Cliente ${t.customer_id.slice(-4)}`,
      created_at: t.created_at,
    }));
  }
}

export default RaffleTicketService;
