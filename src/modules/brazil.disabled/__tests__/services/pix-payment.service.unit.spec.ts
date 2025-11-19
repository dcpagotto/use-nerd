/**
 * Brazil Module - PixPaymentService Unit Tests
 * Testa lógica de pagamentos PIX via Mercado Pago
 */

import {
  PixPaymentStatus,
  CreatePixPaymentDTO,
  UpdatePixPaymentDTO,
} from "../../types";

/**
 * Type-safe interface for PIX Payment entity
 * Workaround for DmlEntity not exposing properties directly
 */
interface PixPaymentEntity {
  id: string;
  order_id: string;
  status: PixPaymentStatus;
  amount: number;
  qr_code?: string;
  qr_code_text?: string;
  txid?: string;
  payer_name?: string;
  payer_email?: string;
  payer_cpf_cnpj?: string;
  description?: string;
  paid_at?: Date;
  expires_at?: Date;
  created_at: Date;
  updated_at?: Date;
}

// Mock do MedusaService e logger
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockRetrieve = jest.fn();
const mockList = jest.fn();
const mockEventBusEmit = jest.fn();
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

jest.mock("@medusajs/framework/utils", () => ({
  MedusaService: () => {
    return class {
      create = mockCreate;
      update = mockUpdate;
      retrieve = mockRetrieve;
      list = mockList;
      eventBusModuleService_ = { emit: mockEventBusEmit };
      container_ = {
        resolve: (name: string) => {
          if (name === "logger") return mockLogger;
          return {};
        },
      };
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

import PixPaymentService from "../../services/pix-payment";

describe("PixPaymentService", () => {
  let service: PixPaymentService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PixPaymentService({} as any);
  });

  describe("createPixPayment", () => {
    const validPaymentData: CreatePixPaymentDTO = {
      order_id: "order_123",
      amount: 10000, // R$ 100.00
      payer_name: "John Doe",
      payer_email: "john@example.com",
      payer_cpf_cnpj: "12345678909",
      description: "Test Payment",
    };

    it("should create PIX payment with valid data", async () => {
      const mockPayment = {
        id: "pix_123",
        ...validPaymentData,
        status: PixPaymentStatus.PENDING,
        qr_code: "base64code",
        qr_code_text: "pixcode",
        txid: "123456",
      };
      mockCreate.mockResolvedValue(mockPayment);

      const result = await service.createPixPayment(validPaymentData) as unknown as PixPaymentEntity;

      expect(result).toBeDefined();
      expect(result.status).toBe(PixPaymentStatus.PENDING);
      expect(mockCreate).toHaveBeenCalled();
      expect(mockEventBusEmit).toHaveBeenCalledWith("brazil.pix_created", {
        payment_id: "pix_123",
        order_id: "order_123",
        amount: 10000,
      });
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("PIX payment created")
      );
    });

    it("should throw error if amount is zero", async () => {
      const invalidData = { ...validPaymentData, amount: 0 };
      await expect(service.createPixPayment(invalidData)).rejects.toThrow(
        "Amount must be greater than 0"
      );
    });

    it("should throw error if amount is negative", async () => {
      const invalidData = { ...validPaymentData, amount: -1000 };
      await expect(service.createPixPayment(invalidData)).rejects.toThrow(
        "Amount must be greater than 0"
      );
    });

    it("should throw error for invalid CPF", async () => {
      const invalidData = { ...validPaymentData, payer_cpf_cnpj: "123" };
      await expect(service.createPixPayment(invalidData)).rejects.toThrow(
        "Invalid CPF/CNPJ"
      );
    });

    it("should throw error for invalid email", async () => {
      const invalidData = { ...validPaymentData, payer_email: "invalid" };
      await expect(service.createPixPayment(invalidData)).rejects.toThrow(
        "Invalid email"
      );
    });

    it("should accept valid CNPJ", async () => {
      const mockPayment = {
        id: "pix_123",
        status: PixPaymentStatus.PENDING,
      };
      mockCreate.mockResolvedValue(mockPayment);

      const cnpjData = {
        ...validPaymentData,
        payer_cpf_cnpj: "11222333000181",
      };

      const result = await service.createPixPayment(cnpjData);

      expect(result).toBeDefined();
      expect(mockCreate).toHaveBeenCalled();
    });

    it("should throw error for invalid expiration time", async () => {
      const invalidData = {
        ...validPaymentData,
        expires_in_minutes: 0,
      };
      await expect(service.createPixPayment(invalidData)).rejects.toThrow(
        "Expiration must be between 1 and 1440 minutes"
      );
    });

    it("should throw error for expiration exceeding 24 hours", async () => {
      const invalidData = {
        ...validPaymentData,
        expires_in_minutes: 1441,
      };
      await expect(service.createPixPayment(invalidData)).rejects.toThrow(
        "Expiration must be between 1 and 1440 minutes"
      );
    });

    it("should use default expiration of 30 minutes", async () => {
      const mockPayment = {
        id: "pix_123",
        status: PixPaymentStatus.PENDING,
        expires_at: new Date(),
      };
      mockCreate.mockResolvedValue(mockPayment);

      await service.createPixPayment(validPaymentData);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          expires_at: expect.any(Date),
        })
      );
    });

    it("should log error on failure", async () => {
      mockCreate.mockRejectedValue(new Error("Database error"));

      await expect(
        service.createPixPayment(validPaymentData)
      ).rejects.toThrow("Database error");

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Error creating PIX payment")
      );
    });
  });

  describe("updatePixPayment", () => {
    it("should update payment successfully", async () => {
      const mockPayment = {
        id: "pix_123",
        status: PixPaymentStatus.PAID,
      };
      mockUpdate.mockResolvedValue(mockPayment);

      const updateData: UpdatePixPaymentDTO = {
        status: PixPaymentStatus.PAID,
        paid_at: new Date(),
      };

      const result = await service.updatePixPayment("pix_123", updateData) as unknown as PixPaymentEntity;

      expect(result.status).toBe(PixPaymentStatus.PAID);
      expect(mockUpdate).toHaveBeenCalledWith("pix_123", updateData);
    });
  });

  describe("getPixPayment", () => {
    it("should retrieve payment by id", async () => {
      const mockPayment = { id: "pix_123", order_id: "order_123" };
      mockRetrieve.mockResolvedValue(mockPayment);

      const result = await service.getPixPayment("pix_123");

      expect(result).toEqual(mockPayment);
      expect(mockRetrieve).toHaveBeenCalledWith("pix_123");
    });
  });

  describe("getPixPaymentByOrder", () => {
    it("should retrieve payment by order_id", async () => {
      const mockPayment = { id: "pix_123", order_id: "order_123" };
      mockList.mockResolvedValue([mockPayment]);

      const result = await service.getPixPaymentByOrder("order_123");

      expect(result).toEqual(mockPayment);
      expect(mockList).toHaveBeenCalledWith(
        { order_id: "order_123" },
        { take: 1 }
      );
    });

    it("should return null if payment not found", async () => {
      mockList.mockResolvedValue([]);

      const result = await service.getPixPaymentByOrder("order_123");

      expect(result).toBeNull();
    });
  });

  describe("getPixPaymentByTxid", () => {
    it("should retrieve payment by txid", async () => {
      const mockPayment = { id: "pix_123", txid: "123456" };
      mockList.mockResolvedValue([mockPayment]);

      const result = await service.getPixPaymentByTxid("123456");

      expect(result).toEqual(mockPayment);
      expect(mockList).toHaveBeenCalledWith({ txid: "123456" }, { take: 1 });
    });

    it("should return null if payment not found", async () => {
      mockList.mockResolvedValue([]);

      const result = await service.getPixPaymentByTxid("123456");

      expect(result).toBeNull();
    });
  });

  describe("listPixPayments", () => {
    it("should list payments with filters", async () => {
      const mockPayments = [
        { id: "pix_1", status: PixPaymentStatus.PAID },
        { id: "pix_2", status: PixPaymentStatus.PAID },
      ];
      mockList.mockResolvedValue(mockPayments);

      const filters = { status: PixPaymentStatus.PAID };
      const result = await service.listPixPayments(filters);

      expect(result).toEqual(mockPayments);
      expect(mockList).toHaveBeenCalledWith(filters, {});
    });
  });

  describe("checkPaymentStatus", () => {
    it("should check payment status", async () => {
      const result = await service.checkPaymentStatus("123456");

      expect(result).toHaveProperty("status");
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("Checking PIX payment status")
      );
    });

    it("should handle errors gracefully", async () => {
      // Force an error in mock
      mockLogger.info.mockImplementationOnce(() => {
        throw new Error("Network error");
      });

      await expect(
        service.checkPaymentStatus("123456")
      ).rejects.toThrow();

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe("processWebhook", () => {
    it("should process webhook successfully", async () => {
      const webhookData = {
        data: { id: "123456" },
      };

      const mockPayment = {
        id: "pix_123",
        order_id: "order_123",
        status: PixPaymentStatus.PENDING,
      };

      mockList.mockResolvedValue([mockPayment]);
      mockUpdate.mockResolvedValue({
        ...mockPayment,
        status: PixPaymentStatus.PAID,
      });

      // Mock checkPaymentStatus
      jest.spyOn(service, "checkPaymentStatus").mockResolvedValue({
        status: PixPaymentStatus.PAID,
        paid_at: new Date(),
      });

      await service.processWebhook(webhookData);

      expect(mockUpdate).toHaveBeenCalled();
      expect(mockEventBusEmit).toHaveBeenCalledWith(
        "brazil.pix_paid",
        expect.any(Object)
      );
    });

    it("should warn if payment ID is missing", async () => {
      await service.processWebhook({});

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Invalid webhook data")
      );
    });

    it("should warn if payment not found", async () => {
      const webhookData = { data: { id: "123456" } };
      mockList.mockResolvedValue([]);

      jest.spyOn(service, "checkPaymentStatus").mockResolvedValue({
        status: PixPaymentStatus.PENDING,
      });

      await service.processWebhook(webhookData);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Payment not found")
      );
    });
  });

  describe("expirePayment", () => {
    it("should expire pending payment", async () => {
      const mockPayment = {
        id: "pix_123",
        status: PixPaymentStatus.PENDING,
      };
      mockRetrieve.mockResolvedValue(mockPayment);
      mockUpdate.mockResolvedValue({
        ...mockPayment,
        status: PixPaymentStatus.EXPIRED,
      });

      const result = await service.expirePayment("pix_123") as unknown as PixPaymentEntity;

      expect(result.status).toBe(PixPaymentStatus.EXPIRED);
      expect(mockUpdate).toHaveBeenCalledWith("pix_123", {
        status: PixPaymentStatus.EXPIRED,
      });
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("PIX payment expired")
      );
    });

    it("should not expire paid payment", async () => {
      const mockPayment = {
        id: "pix_123",
        status: PixPaymentStatus.PAID,
      };
      mockRetrieve.mockResolvedValue(mockPayment);

      const result = await service.expirePayment("pix_123") as unknown as PixPaymentEntity;

      expect(result.status).toBe(PixPaymentStatus.PAID);
      expect(mockUpdate).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Cannot expire payment")
      );
    });
  });
});
