import { MedusaService } from "@medusajs/framework/utils";
import { RaffleDraw } from "../models";
import { CreateRaffleDrawDTO, RaffleDrawFilters, DrawStatus } from "../types";

/**
 * RaffleDrawService - Gerencia sorteios de rifas
 */
class RaffleDrawService extends MedusaService({ RaffleDraw }) {
  /**
   * Cria um novo sorteio
   */
  async createDraw(data: CreateRaffleDrawDTO): Promise<typeof RaffleDraw> {
    const draw = await this.create({
      ...data,
      status: DrawStatus.REQUESTED,
    });

    // Emitir evento
    await this.eventBusModuleService_?.emit("raffle.draw_started", {
      raffle_id: draw.raffle_id,
      draw_id: draw.id,
      vrf_request_id: draw.vrf_request_id,
    });

    return draw;
  }

  /**
   * Lista sorteios com filtros
   */
  async listDraws(
    filters: RaffleDrawFilters = {},
    config: { skip?: number; take?: number; order?: any } = {}
  ): Promise<typeof RaffleDraw[]> {
    return await this.list(filters, config);
  }

  /**
   * Busca sorteios de uma rifa
   */
  async getRaffleDraws(raffleId: string): Promise<typeof RaffleDraw[]> {
    return await this.list(
      { raffle_id: raffleId },
      { order: { created_at: "DESC" } }
    );
  }

  /**
   * Busca sorteio por VRF request ID
   */
  async getDrawByVRFRequest(
    vrfRequestId: string
  ): Promise<typeof RaffleDraw | null> {
    const draws = await this.list({ vrf_request_id: vrfRequestId });
    return draws.length > 0 ? draws[0] : null;
  }

  /**
   * Atualiza status do sorteio para pending
   */
  async markAsPending(id: string): Promise<typeof RaffleDraw> {
    return await this.update(id, {
      status: DrawStatus.PENDING,
    });
  }

  /**
   * Completa sorteio com resultado do Chainlink VRF
   */
  async completeDraw(
    id: string,
    vrfRandomWords: string[],
    winnerData: {
      winner_ticket_number: number;
      winner_ticket_id: string;
      winner_customer_id: string;
    }
  ): Promise<typeof RaffleDraw> {
    const updated = await this.update(id, {
      status: DrawStatus.COMPLETED,
      vrf_random_words: vrfRandomWords,
      winner_ticket_number: winnerData.winner_ticket_number,
      winner_ticket_id: winnerData.winner_ticket_id,
      winner_customer_id: winnerData.winner_customer_id,
    });

    // Emitir evento
    await this.eventBusModuleService_?.emit("raffle.draw_completed", {
      raffle_id: updated.raffle_id,
      draw_id: updated.id,
      winner_ticket_id: winnerData.winner_ticket_id,
    });

    return updated;
  }

  /**
   * Marca sorteio como falho
   */
  async markAsFailed(id: string, reason?: string): Promise<typeof RaffleDraw> {
    return await this.update(id, {
      status: DrawStatus.FAILED,
      metadata: { error_reason: reason },
    });
  }

  /**
   * Calcula número vencedor a partir do randomness
   */
  calculateWinnerNumber(randomWords: string[], totalTickets: number): number {
    // Pega o primeiro random word
    const randomValue = BigInt(randomWords[0]);

    // Calcula winner = (randomValue % totalTickets) + 1
    const winnerNumber = Number(randomValue % BigInt(totalTickets)) + 1;

    return winnerNumber;
  }

  /**
   * Verifica se rifa já tem sorteio pendente ou completo
   */
  async hasActiveDraw(raffleId: string): Promise<boolean> {
    const draws = await this.list({
      raffle_id: raffleId,
      status: [DrawStatus.REQUESTED, DrawStatus.PENDING, DrawStatus.COMPLETED],
    });

    return draws.length > 0;
  }

  /**
   * Obtém último sorteio de uma rifa
   */
  async getLatestDraw(raffleId: string): Promise<typeof RaffleDraw | null> {
    const draws = await this.list(
      { raffle_id: raffleId },
      {
        order: { created_at: "DESC" },
        take: 1,
      }
    );

    return draws.length > 0 ? draws[0] : null;
  }
}

export default RaffleDrawService;
