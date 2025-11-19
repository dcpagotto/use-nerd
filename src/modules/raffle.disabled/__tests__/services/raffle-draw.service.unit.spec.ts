/**
 * Raffle Module - RaffleDrawService Unit Tests
 * Testa lógica de sorteios com VRF (Chainlink)
 */

import { DrawStatus, CreateRaffleDrawDTO } from "../../types";

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

import RaffleDrawService from "../../services/raffle-draw";

describe("RaffleDrawService", () => {
  let service: RaffleDrawService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RaffleDrawService({} as any);
  });

  describe("createDraw", () => {
    const validDrawData: CreateRaffleDrawDTO = {
      raffle_id: "raffle_123",
      vrf_request_id: "vrf_abc123",
      vrf_transaction_hash: "0xabc123def456",
      executed_by: "admin_123",
    };

    it("should create draw with valid data", async () => {
      const mockDraw = {
        id: "draw_123",
        ...validDrawData,
        status: DrawStatus.PENDING,
      };
      mockCreate.mockResolvedValue(mockDraw);

      const result = await service.createDraw(validDrawData);

      expect(result).toEqual(mockDraw);
      expect(mockCreate).toHaveBeenCalledWith({
        ...validDrawData,
        status: DrawStatus.REQUESTED,
      });
    });

    it("should emit draw created event", async () => {
      const mockDraw = {
        id: "draw_123",
        ...validDrawData,
        status: DrawStatus.REQUESTED,
      };
      mockCreate.mockResolvedValue(mockDraw);

      await service.createDraw(validDrawData);

      expect(mockEventBusEmit).toHaveBeenCalledWith("raffle.draw_started", {
        draw_id: "draw_123",
        raffle_id: "raffle_123",
        vrf_request_id: "vrf_abc123",
      });
    });
  });

  describe("updateDrawStatus", () => {
    it("should update draw status to pending", async () => {
      mockUpdate.mockResolvedValue({
        id: "draw_123",
        status: DrawStatus.PENDING,
      });

      const result = await service.updateDrawStatus(
        "draw_123",
        DrawStatus.PENDING
      );

      expect(result.status).toBe(DrawStatus.PENDING);
      expect(mockUpdate).toHaveBeenCalledWith("draw_123", {
        status: DrawStatus.PENDING,
      });
    });

    it("should update draw status to completed", async () => {
      mockUpdate.mockResolvedValue({
        id: "draw_123",
        status: DrawStatus.COMPLETED,
      });

      const result = await service.updateDrawStatus(
        "draw_123",
        DrawStatus.COMPLETED
      );

      expect(result.status).toBe(DrawStatus.COMPLETED);
    });

    it("should update draw status to failed", async () => {
      mockUpdate.mockResolvedValue({
        id: "draw_123",
        status: DrawStatus.FAILED,
      });

      const result = await service.updateDrawStatus(
        "draw_123",
        DrawStatus.FAILED
      );

      expect(result.status).toBe(DrawStatus.FAILED);
    });
  });

  describe("completeDraw", () => {
    it("should complete draw with winner data", async () => {
      const mockDraw = {
        id: "draw_123",
        raffle_id: "raffle_123",
        status: DrawStatus.PENDING,
      };

      mockRetrieve.mockResolvedValue(mockDraw);
      mockUpdate.mockResolvedValue({
        ...mockDraw,
        status: DrawStatus.COMPLETED,
        winner_ticket_number: 42,
        random_number: "12345",
        completed_at: expect.any(Date),
      });

      const result = await service.completeDraw(
        "draw_123",
        42,
        "12345",
        "0xresult123"
      );

      expect(result.status).toBe(DrawStatus.COMPLETED);
      expect(result.winner_ticket_number).toBe(42);
      expect(mockEventBusEmit).toHaveBeenCalledWith("raffle.draw_completed", {
        draw_id: "draw_123",
        raffle_id: "raffle_123",
        winner_ticket_number: 42,
      });
    });

    it("should throw error if draw not pending", async () => {
      const mockDraw = {
        id: "draw_123",
        status: DrawStatus.COMPLETED,
      };

      mockRetrieve.mockResolvedValue(mockDraw);

      await expect(
        service.completeDraw("draw_123", 42, "12345", "0xresult123")
      ).rejects.toThrow("Draw must be in pending status to complete");
    });
  });

  describe("failDraw", () => {
    it("should mark draw as failed with error message", async () => {
      const mockDraw = {
        id: "draw_123",
        raffle_id: "raffle_123",
        status: DrawStatus.PENDING,
      };

      mockRetrieve.mockResolvedValue(mockDraw);
      mockUpdate.mockResolvedValue({
        ...mockDraw,
        status: DrawStatus.FAILED,
        error_message: "VRF callback failed",
      });

      const result = await service.failDraw("draw_123", "VRF callback failed");

      expect(result.status).toBe(DrawStatus.FAILED);
      expect(result.error_message).toBe("VRF callback failed");
    });
  });

  describe("getDrawByRaffle", () => {
    it("should retrieve draw by raffle_id", async () => {
      const mockDraw = {
        id: "draw_123",
        raffle_id: "raffle_123",
        status: DrawStatus.COMPLETED,
      };
      mockList.mockResolvedValue([mockDraw]);

      const result = await service.getDrawByRaffle("raffle_123");

      expect(result).toEqual(mockDraw);
      expect(mockList).toHaveBeenCalledWith(
        { raffle_id: "raffle_123" },
        { order: { created_at: "DESC" }, take: 1 }
      );
    });

    it("should return null if no draw found", async () => {
      mockList.mockResolvedValue([]);

      const result = await service.getDrawByRaffle("raffle_123");

      expect(result).toBeNull();
    });
  });

  describe("getDrawByVrfRequestId", () => {
    it("should retrieve draw by VRF request ID", async () => {
      const mockDraw = {
        id: "draw_123",
        vrf_request_id: "vrf_abc123",
      };
      mockList.mockResolvedValue([mockDraw]);

      const result = await service.getDrawByVrfRequestId("vrf_abc123");

      expect(result).toEqual(mockDraw);
      expect(mockList).toHaveBeenCalledWith(
        { vrf_request_id: "vrf_abc123" },
        { take: 1 }
      );
    });

    it("should return null if not found", async () => {
      mockList.mockResolvedValue([]);

      const result = await service.getDrawByVrfRequestId("vrf_abc123");

      expect(result).toBeNull();
    });
  });

  describe("listDraws", () => {
    it("should list draws with filters", async () => {
      const mockDraws = [
        { id: "draw_1", status: DrawStatus.COMPLETED },
        { id: "draw_2", status: DrawStatus.COMPLETED },
      ];
      mockList.mockResolvedValue(mockDraws);

      const filters = { status: DrawStatus.COMPLETED };
      const result = await service.listDraws(filters);

      expect(result).toEqual(mockDraws);
      expect(mockList).toHaveBeenCalledWith(filters, {});
    });

    it("should list draws without filters", async () => {
      const mockDraws = [{ id: "draw_1" }];
      mockList.mockResolvedValue(mockDraws);

      const result = await service.listDraws();

      expect(result).toEqual(mockDraws);
      expect(mockList).toHaveBeenCalledWith({}, {});
    });
  });

  describe("getDraw", () => {
    it("should retrieve draw by id", async () => {
      const mockDraw = { id: "draw_123", raffle_id: "raffle_123" };
      mockRetrieve.mockResolvedValue(mockDraw);

      const result = await service.getDraw("draw_123");

      expect(result).toEqual(mockDraw);
      expect(mockRetrieve).toHaveBeenCalledWith("draw_123");
    });
  });

  describe("hasRaffleBeenDrawn", () => {
    it("should return true if raffle has completed draw", async () => {
      mockList.mockResolvedValue([
        { id: "draw_123", status: DrawStatus.COMPLETED },
      ]);

      const result = await service.hasRaffleBeenDrawn("raffle_123");

      expect(result).toBe(true);
    });

    it("should return false if no completed draw", async () => {
      mockList.mockResolvedValue([]);

      const result = await service.hasRaffleBeenDrawn("raffle_123");

      expect(result).toBe(false);
    });

    it("should return false if only pending draws exist", async () => {
      mockList.mockResolvedValue([
        { id: "draw_123", status: DrawStatus.PENDING },
      ]);

      const result = await service.hasRaffleBeenDrawn("raffle_123");

      expect(result).toBe(false);
    });
  });
});
