/**
 * Raffle Module - RaffleService Unit Tests
 * Testa lógica de negócio do serviço de rifas
 */

import { RaffleStatus, CreateRaffleDTO, UpdateRaffleDTO } from "../../types";

// Mock do MedusaService
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockRetrieve = jest.fn();
const mockList = jest.fn();
const mockEventBusEmit = jest.fn();

jest.mock("@medusajs/framework/utils", () => ({
  MedusaService: () => {
    return class {
      create = mockCreate;
      update = mockUpdate;
      retrieve = mockRetrieve;
      list = mockList;
      eventBusModuleService_ = { emit: mockEventBusEmit };
    };
  },
  model: {
    define: jest.fn((name, schema) => ({
      name,
      schema,
      cascades: jest.fn(() => ({
        indexes: jest.fn(() => ({}))
      })),
      indexes: jest.fn(() => ({}))
    })),
    id: () => ({ primaryKey: () => ({}) }),
    text: () => ({
      nullable: () => ({}),
      unique: () => ({}),
      default: (val) => ({})
    }),
    number: () => ({
      nullable: () => ({}),
      default: (val) => ({})
    }),
    bigNumber: () => ({
      nullable: () => ({}),
      default: (val) => ({})
    }),
    boolean: () => ({
      nullable: () => ({}),
      default: (val) => ({})
    }),
    dateTime: () => ({
      nullable: () => ({}),
      default: (val) => ({})
    }),
    json: () => ({ nullable: () => ({}) }),
    enum: (values) => ({
      default: (val) => ({}),
      nullable: () => ({})
    }),
    hasMany: (relation) => ({}),
    belongsTo: (relation) => ({ nullable: () => ({}) }),
  },
}));

import RaffleService from "../../services/raffle";

describe("RaffleService", () => {
  let service: RaffleService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RaffleService({} as any);
  });

  describe("createRaffle", () => {
    const validRaffleData: CreateRaffleDTO = {
      title: "Test Raffle",
      prize_description: "Amazing Prize",
      total_tickets: 100,
      ticket_price: 1000, // R$ 10.00
      start_date: new Date("2025-01-01"),
      end_date: new Date("2025-01-31"),
      draw_date: new Date("2025-02-01"),
    };

    it("should create raffle with valid data", async () => {
      const mockRaffle = { id: "raffle_123", ...validRaffleData };
      mockCreate.mockResolvedValue(mockRaffle);

      const result = await service.createRaffle(validRaffleData);

      expect(result).toEqual(mockRaffle);
      expect(mockCreate).toHaveBeenCalledWith(validRaffleData);
      expect(mockEventBusEmit).toHaveBeenCalledWith("raffle.created", {
        raffle_id: "raffle_123",
        status: mockRaffle.status,
      });
    });

    it("should throw error if total_tickets is zero", async () => {
      const invalidData = { ...validRaffleData, total_tickets: 0 };
      await expect(service.createRaffle(invalidData)).rejects.toThrow(
        "Total tickets must be between 1 and 100,000"
      );
    });

    it("should throw error if total_tickets exceeds limit", async () => {
      const invalidData = { ...validRaffleData, total_tickets: 100001 };
      await expect(service.createRaffle(invalidData)).rejects.toThrow(
        "Total tickets must be between 1 and 100,000"
      );
    });

    it("should throw error if ticket_price is zero", async () => {
      const invalidData = { ...validRaffleData, ticket_price: 0 };
      await expect(service.createRaffle(invalidData)).rejects.toThrow(
        "Ticket price must be greater than 0"
      );
    });

    it("should throw error if end_date is before start_date", async () => {
      const invalidData = {
        ...validRaffleData,
        start_date: new Date("2025-01-31"),
        end_date: new Date("2025-01-01"),
      };
      await expect(service.createRaffle(invalidData)).rejects.toThrow(
        "End date must be after start date"
      );
    });

    it("should throw error if draw_date is before end_date", async () => {
      const invalidData = {
        ...validRaffleData,
        draw_date: new Date("2025-01-15"),
      };
      await expect(service.createRaffle(invalidData)).rejects.toThrow(
        "Draw date must be on or after end date"
      );
    });

    it("should throw error if max_tickets_per_customer exceeds total", async () => {
      const invalidData = {
        ...validRaffleData,
        max_tickets_per_customer: 150,
      };
      await expect(service.createRaffle(invalidData)).rejects.toThrow(
        "Max tickets per customer cannot exceed total tickets"
      );
    });
  });

  describe("updateRaffle", () => {
    it("should update draft raffle with any fields", async () => {
      const mockRaffle = {
        id: "raffle_123",
        status: RaffleStatus.DRAFT,
      };
      mockRetrieve.mockResolvedValue(mockRaffle);
      mockUpdate.mockResolvedValue({ ...mockRaffle, title: "Updated" });

      const updateData: UpdateRaffleDTO = {
        title: "Updated",
        ticket_price: 2000,
      };

      const result = await service.updateRaffle("raffle_123", updateData);

      expect(result.title).toBe("Updated");
      expect(mockUpdate).toHaveBeenCalledWith("raffle_123", updateData);
    });

    it("should only update allowed fields for published raffle", async () => {
      const mockRaffle = {
        id: "raffle_123",
        status: RaffleStatus.ACTIVE,
      };
      mockRetrieve.mockResolvedValue(mockRaffle);

      const updateData: UpdateRaffleDTO = {
        title: "Updated Title",
      };

      await expect(
        service.updateRaffle("raffle_123", updateData)
      ).rejects.toThrow("Cannot update fields [title] after raffle is published");
    });

    it("should allow updating description for active raffle", async () => {
      const mockRaffle = {
        id: "raffle_123",
        status: RaffleStatus.ACTIVE,
      };
      mockRetrieve.mockResolvedValue(mockRaffle);
      mockUpdate.mockResolvedValue({ ...mockRaffle, description: "New desc" });

      const result = await service.updateRaffle("raffle_123", {
        description: "New desc",
      });

      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe("listActiveRaffles", () => {
    it("should list only active raffles within date range", async () => {
      const mockRaffles = [
        { id: "raffle_1", status: RaffleStatus.ACTIVE },
        { id: "raffle_2", status: RaffleStatus.SOLD_OUT },
      ];
      mockList.mockResolvedValue(mockRaffles);

      const result = await service.listActiveRaffles();

      expect(result).toEqual(mockRaffles);
      expect(mockList).toHaveBeenCalledWith(
        expect.objectContaining({
          status: [RaffleStatus.ACTIVE, RaffleStatus.SOLD_OUT],
        }),
        expect.any(Object)
      );
    });
  });

  describe("publishRaffle", () => {
    it("should publish draft raffle", async () => {
      const mockRaffle = {
        id: "raffle_123",
        status: RaffleStatus.DRAFT,
      };
      mockRetrieve.mockResolvedValue(mockRaffle);
      mockUpdate.mockResolvedValue({
        ...mockRaffle,
        status: RaffleStatus.ACTIVE,
        contract_address: "0x123",
        transaction_hash: "0xabc",
      });

      const result = await service.publishRaffle(
        "raffle_123",
        "0x123",
        "0xabc"
      );

      expect(result.status).toBe(RaffleStatus.ACTIVE);
      expect(result.contract_address).toBe("0x123");
      expect(mockEventBusEmit).toHaveBeenCalledWith("raffle.published", {
        raffle_id: "raffle_123",
        contract_address: "0x123",
        transaction_hash: "0xabc",
      });
    });

    it("should throw error if raffle is not draft", async () => {
      const mockRaffle = {
        id: "raffle_123",
        status: RaffleStatus.ACTIVE,
      };
      mockRetrieve.mockResolvedValue(mockRaffle);

      await expect(
        service.publishRaffle("raffle_123", "0x123", "0xabc")
      ).rejects.toThrow("Only draft raffles can be published");
    });
  });

  describe("startDraw", () => {
    it("should start draw for active raffle", async () => {
      const mockRaffle = {
        id: "raffle_123",
        status: RaffleStatus.ACTIVE,
      };
      mockRetrieve.mockResolvedValue(mockRaffle);
      mockUpdate.mockResolvedValue({
        ...mockRaffle,
        status: RaffleStatus.DRAWING,
      });

      const result = await service.startDraw("raffle_123");

      expect(result.status).toBe(RaffleStatus.DRAWING);
    });

    it("should start draw for sold out raffle", async () => {
      const mockRaffle = {
        id: "raffle_123",
        status: RaffleStatus.SOLD_OUT,
      };
      mockRetrieve.mockResolvedValue(mockRaffle);
      mockUpdate.mockResolvedValue({
        ...mockRaffle,
        status: RaffleStatus.DRAWING,
      });

      const result = await service.startDraw("raffle_123");

      expect(result.status).toBe(RaffleStatus.DRAWING);
    });

    it("should throw error for draft raffle", async () => {
      const mockRaffle = {
        id: "raffle_123",
        status: RaffleStatus.DRAFT,
      };
      mockRetrieve.mockResolvedValue(mockRaffle);

      await expect(service.startDraw("raffle_123")).rejects.toThrow(
        "Raffle must be active or sold out to draw"
      );
    });
  });

  describe("completeDraw", () => {
    it("should complete draw with winner data", async () => {
      const winnerData = {
        winner_ticket_number: 42,
        winner_customer_id: "cus_123",
        winner_wallet_address: "0xabc",
      };

      mockUpdate.mockResolvedValue({
        id: "raffle_123",
        status: RaffleStatus.COMPLETED,
        ...winnerData,
        winner_drawn_at: expect.any(Date),
      });

      const result = await service.completeDraw("raffle_123", winnerData);

      expect(result.status).toBe(RaffleStatus.COMPLETED);
      expect(result.winner_ticket_number).toBe(42);
      expect(mockEventBusEmit).toHaveBeenCalledWith("raffle.winner_announced", {
        raffle_id: "raffle_123",
        winner_ticket_number: 42,
        winner_customer_id: "cus_123",
      });
    });
  });

  describe("cancelRaffle", () => {
    it("should cancel active raffle", async () => {
      const mockRaffle = {
        id: "raffle_123",
        status: RaffleStatus.ACTIVE,
      };
      mockRetrieve.mockResolvedValue(mockRaffle);
      mockUpdate.mockResolvedValue({
        ...mockRaffle,
        status: RaffleStatus.CANCELLED,
      });

      const result = await service.cancelRaffle("raffle_123");

      expect(result.status).toBe(RaffleStatus.CANCELLED);
      expect(mockEventBusEmit).toHaveBeenCalledWith("raffle.cancelled", {
        raffle_id: "raffle_123",
      });
    });

    it("should throw error if raffle is completed", async () => {
      const mockRaffle = {
        id: "raffle_123",
        status: RaffleStatus.COMPLETED,
      };
      mockRetrieve.mockResolvedValue(mockRaffle);

      await expect(service.cancelRaffle("raffle_123")).rejects.toThrow(
        "Cannot cancel completed or already cancelled raffle"
      );
    });

    it("should throw error if raffle is already cancelled", async () => {
      const mockRaffle = {
        id: "raffle_123",
        status: RaffleStatus.CANCELLED,
      };
      mockRetrieve.mockResolvedValue(mockRaffle);

      await expect(service.cancelRaffle("raffle_123")).rejects.toThrow(
        "Cannot cancel completed or already cancelled raffle"
      );
    });
  });

  describe("markAsSoldOut", () => {
    it("should mark raffle as sold out", async () => {
      mockUpdate.mockResolvedValue({
        id: "raffle_123",
        status: RaffleStatus.SOLD_OUT,
      });

      const result = await service.markAsSoldOut("raffle_123");

      expect(result.status).toBe(RaffleStatus.SOLD_OUT);
      expect(mockUpdate).toHaveBeenCalledWith("raffle_123", {
        status: RaffleStatus.SOLD_OUT,
      });
    });
  });

  describe("getRaffle", () => {
    it("should retrieve raffle by id", async () => {
      const mockRaffle = { id: "raffle_123", title: "Test" };
      mockRetrieve.mockResolvedValue(mockRaffle);

      const result = await service.getRaffle("raffle_123");

      expect(result).toEqual(mockRaffle);
      expect(mockRetrieve).toHaveBeenCalledWith("raffle_123");
    });
  });

  describe("listRaffles", () => {
    it("should list raffles with filters", async () => {
      const mockRaffles = [
        { id: "raffle_1" },
        { id: "raffle_2" },
      ];
      mockList.mockResolvedValue(mockRaffles);

      const filters = { status: RaffleStatus.ACTIVE };
      const result = await service.listRaffles(filters);

      expect(result).toEqual(mockRaffles);
      expect(mockList).toHaveBeenCalledWith(filters, {});
    });

    it("should list raffles without filters", async () => {
      const mockRaffles = [{ id: "raffle_1" }];
      mockList.mockResolvedValue(mockRaffles);

      const result = await service.listRaffles();

      expect(result).toEqual(mockRaffles);
      expect(mockList).toHaveBeenCalledWith({}, {});
    });
  });
});
