/**
 * Raffle Module - RaffleTicketService Unit Tests
 * Testa lógica de compra e gestão de tickets de rifa
 */

import { TicketStatus, CreateRaffleTicketDTO } from "../../types";

// Mock do MedusaService
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockRetrieve = jest.fn();
const mockList = jest.fn();

jest.mock("@medusajs/framework/utils", () => ({
  MedusaService: () => {
    return class {
      create = mockCreate;
      update = mockUpdate;
      retrieve = mockRetrieve;
      list = mockList;
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

import RaffleTicketService from "../../services/raffle-ticket";

describe("RaffleTicketService", () => {
  let service: RaffleTicketService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RaffleTicketService({} as any);
  });

  describe("createTicket", () => {
    it("should create single ticket", async () => {
      const ticketData: CreateRaffleTicketDTO = {
        raffle_id: "raffle_123",
        customer_id: "customer_123",
        order_id: "order_123",
        line_item_id: "line_123",
        ticket_number: 1,
        ticket_code: "RF2025-123A-0001",
        price_paid: 1000,
      };

      const mockTicket = {
        id: "ticket_123",
        ...ticketData,
        status: TicketStatus.RESERVED,
      };

      mockCreate.mockResolvedValue(mockTicket);

      const result = await service.createTicket(ticketData);

      expect(result).toEqual(mockTicket);
      expect(mockCreate).toHaveBeenCalledWith(ticketData);
    });
  });

  describe("createTickets", () => {
    it("should create multiple tickets", async () => {
      const ticketsData: CreateRaffleTicketDTO[] = [
        {
          raffle_id: "raffle_123",
          customer_id: "customer_123",
          order_id: "order_123",
          line_item_id: "line_123",
          ticket_number: 1,
          ticket_code: "RF2025-123A-0001",
          price_paid: 1000,
        },
        {
          raffle_id: "raffle_123",
          customer_id: "customer_123",
          order_id: "order_123",
          line_item_id: "line_123",
          ticket_number: 2,
          ticket_code: "RF2025-123A-0002",
          price_paid: 1000,
        },
      ];

      mockCreate.mockImplementation((data) => ({
        id: `ticket_${data.ticket_number}`,
        ...data,
      }));

      const result = await service.createTickets(ticketsData);

      expect(result).toHaveLength(2);
      expect(mockCreate).toHaveBeenCalledTimes(2);
    });
  });

  describe("getCustomerTickets", () => {
    it("should retrieve tickets by customer_id", async () => {
      const mockTickets = [
        { id: "ticket_1", customer_id: "customer_123" },
        { id: "ticket_2", customer_id: "customer_123" },
      ];
      mockList.mockResolvedValue(mockTickets);

      const result = await service.getCustomerTickets("customer_123");

      expect(result).toEqual(mockTickets);
      expect(mockList).toHaveBeenCalledWith(
        { customer_id: "customer_123" },
        expect.objectContaining({ order: { created_at: "DESC" } })
      );
    });
  });

  describe("getRaffleTickets", () => {
    it("should retrieve tickets by raffle_id", async () => {
      const mockTickets = [
        { id: "ticket_1", raffle_id: "raffle_123", ticket_number: 1 },
        { id: "ticket_2", raffle_id: "raffle_123", ticket_number: 2 },
      ];
      mockList.mockResolvedValue(mockTickets);

      const result = await service.getRaffleTickets("raffle_123");

      expect(result).toEqual(mockTickets);
      expect(mockList).toHaveBeenCalledWith(
        { raffle_id: "raffle_123" },
        expect.objectContaining({ order: { ticket_number: "ASC" } })
      );
    });
  });

  describe("countRaffleTickets", () => {
    it("should count tickets for raffle", async () => {
      const mockTickets = [
        { id: "ticket_1" },
        { id: "ticket_2" },
        { id: "ticket_3" },
      ];
      mockList.mockResolvedValue(mockTickets);

      const result = await service.countRaffleTickets("raffle_123");

      expect(result).toBe(3);
      expect(mockList).toHaveBeenCalledWith({ raffle_id: "raffle_123" });
    });

    it("should return 0 if no tickets", async () => {
      mockList.mockResolvedValue([]);

      const result = await service.countRaffleTickets("raffle_123");

      expect(result).toBe(0);
    });
  });

  describe("countCustomerTicketsInRaffle", () => {
    it("should count customer tickets in specific raffle", async () => {
      const mockTickets = [{ id: "ticket_1" }, { id: "ticket_2" }];
      mockList.mockResolvedValue(mockTickets);

      const result = await service.countCustomerTicketsInRaffle(
        "customer_123",
        "raffle_123"
      );

      expect(result).toBe(2);
      expect(mockList).toHaveBeenCalledWith({
        customer_id: "customer_123",
        raffle_id: "raffle_123",
      });
    });
  });

  describe("getNextTicketNumber", () => {
    it("should return 1 for first ticket", async () => {
      mockList.mockResolvedValue([]);

      const result = await service.getNextTicketNumber("raffle_123");

      expect(result).toBe(1);
    });

    it("should return next number after last ticket", async () => {
      mockList.mockResolvedValue([{ ticket_number: 42 }]);

      const result = await service.getNextTicketNumber("raffle_123");

      expect(result).toBe(43);
    });
  });

  describe("generateTicketCode", () => {
    it("should generate valid ticket code", async () => {
      const result = await service.generateTicketCode("raffle_abcd1234", 1);

      expect(result).toMatch(/^RF\d{4}-[A-Z0-9]{4}-\d{4}$/);
      expect(result).toContain("RF2025");
      expect(result).toContain("0001");
    });

    it("should pad ticket number with zeros", async () => {
      const result = await service.generateTicketCode("raffle_abcd1234", 5);

      expect(result).toContain("0005");
    });

    it("should handle large ticket numbers", async () => {
      const result = await service.generateTicketCode("raffle_abcd1234", 9999);

      expect(result).toContain("9999");
    });
  });

  describe("updateTicketStatus", () => {
    it("should update ticket status", async () => {
      mockUpdate.mockResolvedValue({
        id: "ticket_123",
        status: TicketStatus.PAID,
      });

      const result = await service.updateTicketStatus(
        "ticket_123",
        TicketStatus.PAID
      );

      expect(result.status).toBe(TicketStatus.PAID);
      expect(mockUpdate).toHaveBeenCalledWith("ticket_123", {
        status: TicketStatus.PAID,
      });
    });
  });

  describe("markAsPaid", () => {
    it("should mark ticket as paid with timestamp", async () => {
      const mockTicket = {
        id: "ticket_123",
        status: TicketStatus.PAID,
        paid_at: expect.any(Date),
      };

      mockUpdate.mockResolvedValue(mockTicket);

      const result = await service.markAsPaid("ticket_123");

      expect(result.status).toBe(TicketStatus.PAID);
      expect(mockUpdate).toHaveBeenCalledWith("ticket_123", {
        status: TicketStatus.PAID,
        paid_at: expect.any(Date),
      });
    });
  });

  describe("updateNFTData", () => {
    it("should update ticket with NFT data", async () => {
      const nftData = {
        nft_token_id: "42",
        nft_transaction_hash: "0xabc123",
        nft_metadata_uri: "ipfs://abc123",
      };

      mockUpdate.mockResolvedValue({
        id: "ticket_123",
        status: TicketStatus.MINTED,
        ...nftData,
      });

      const result = await service.updateNFTData("ticket_123", nftData);

      expect(result.status).toBe(TicketStatus.MINTED);
      expect(result.nft_token_id).toBe("42");
      expect(mockUpdate).toHaveBeenCalledWith("ticket_123", {
        ...nftData,
        status: TicketStatus.MINTED,
      });
    });
  });

  describe("markAsWinner", () => {
    it("should mark ticket as winner", async () => {
      mockUpdate.mockResolvedValue({
        id: "ticket_123",
        status: TicketStatus.WINNER,
        is_winner: true,
      });

      const result = await service.markAsWinner("ticket_123");

      expect(result.status).toBe(TicketStatus.WINNER);
      expect(result.is_winner).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith("ticket_123", {
        status: TicketStatus.WINNER,
        is_winner: true,
      });
    });
  });

  describe("getWinnerTicket", () => {
    it("should find winner ticket for raffle", async () => {
      const mockTicket = {
        id: "ticket_123",
        raffle_id: "raffle_123",
        is_winner: true,
      };
      mockList.mockResolvedValue([mockTicket]);

      const result = await service.getWinnerTicket("raffle_123");

      expect(result).toEqual(mockTicket);
      expect(mockList).toHaveBeenCalledWith({
        raffle_id: "raffle_123",
        is_winner: true,
      });
    });

    it("should return null if no winner", async () => {
      mockList.mockResolvedValue([]);

      const result = await service.getWinnerTicket("raffle_123");

      expect(result).toBeNull();
    });
  });

  describe("getTicketByNumber", () => {
    it("should find ticket by raffle and number", async () => {
      const mockTicket = {
        id: "ticket_123",
        raffle_id: "raffle_123",
        ticket_number: 42,
      };
      mockList.mockResolvedValue([mockTicket]);

      const result = await service.getTicketByNumber("raffle_123", 42);

      expect(result).toEqual(mockTicket);
      expect(mockList).toHaveBeenCalledWith({
        raffle_id: "raffle_123",
        ticket_number: 42,
      });
    });

    it("should return null if ticket not found", async () => {
      mockList.mockResolvedValue([]);

      const result = await service.getTicketByNumber("raffle_123", 42);

      expect(result).toBeNull();
    });
  });

  describe("canCustomerPurchaseTickets", () => {
    it("should allow purchase if no limit", async () => {
      const result = await service.canCustomerPurchaseTickets(
        "customer_123",
        "raffle_123",
        5,
        0
      );

      expect(result.canPurchase).toBe(true);
    });

    it("should allow purchase within limit", async () => {
      mockList.mockResolvedValue([{ id: "ticket_1" }]);

      const result = await service.canCustomerPurchaseTickets(
        "customer_123",
        "raffle_123",
        4,
        5
      );

      expect(result.canPurchase).toBe(true);
    });

    it("should reject purchase exceeding limit", async () => {
      mockList.mockResolvedValue([{ id: "ticket_1" }, { id: "ticket_2" }]);

      const result = await service.canCustomerPurchaseTickets(
        "customer_123",
        "raffle_123",
        4,
        5
      );

      expect(result.canPurchase).toBe(false);
      expect(result.reason).toContain("already has 2 tickets");
    });

    it("should handle exact limit", async () => {
      mockList.mockResolvedValue([{ id: "ticket_1" }]);

      const result = await service.canCustomerPurchaseTickets(
        "customer_123",
        "raffle_123",
        4,
        5
      );

      expect(result.canPurchase).toBe(true);
    });
  });

  describe("getRecentTickets", () => {
    it("should return recent tickets anonymized", async () => {
      const mockTickets = [
        {
          id: "ticket_1",
          raffle_id: "raffle_123",
          ticket_number: 1,
          customer_id: "customer_abc123",
          created_at: new Date("2025-01-01"),
        },
        {
          id: "ticket_2",
          raffle_id: "raffle_123",
          ticket_number: 2,
          customer_id: "customer_def456",
          created_at: new Date("2025-01-02"),
        },
      ];
      mockList.mockResolvedValue(mockTickets);

      const result = await service.getRecentTickets("raffle_123", 10);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("ticket_number");
      expect(result[0]).toHaveProperty("customer_name");
      expect(result[0]).toHaveProperty("created_at");
      expect(result[0].customer_name).toMatch(/^Cliente [a-zA-Z0-9]{4}$/);
    });

    it("should use default limit of 10", async () => {
      mockList.mockResolvedValue([]);

      await service.getRecentTickets("raffle_123");

      expect(mockList).toHaveBeenCalledWith(
        { raffle_id: "raffle_123" },
        expect.objectContaining({ take: 10 })
      );
    });
  });

  describe("listTickets", () => {
    it("should list tickets with filters", async () => {
      const mockTickets = [{ id: "ticket_1" }, { id: "ticket_2" }];
      mockList.mockResolvedValue(mockTickets);

      const filters = { raffle_id: "raffle_123", status: TicketStatus.PAID };
      const result = await service.listTickets(filters);

      expect(result).toEqual(mockTickets);
      expect(mockList).toHaveBeenCalledWith(filters, {});
    });

    it("should list tickets without filters", async () => {
      const mockTickets = [{ id: "ticket_1" }];
      mockList.mockResolvedValue(mockTickets);

      const result = await service.listTickets();

      expect(result).toEqual(mockTickets);
      expect(mockList).toHaveBeenCalledWith({}, {});
    });
  });
});
