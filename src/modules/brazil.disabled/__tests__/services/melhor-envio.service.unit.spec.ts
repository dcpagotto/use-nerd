/**
 * Brazil Module - MelhorEnvioService Unit Tests
 * Testa integração com API de frete Melhor Envio
 */

import { ShippingCompany } from "../../types";

// Mock axios
const mockAxiosGet = jest.fn();
const mockAxiosPost = jest.fn();
jest.mock("axios", () => ({
  default: {
    create: jest.fn(() => ({
      get: mockAxiosGet,
      post: mockAxiosPost,
    })),
  },
}));

// Mock logger
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const mockContainer = {
  resolve: (name: string) => {
    if (name === "logger") return mockLogger;
    return {};
  },
};

jest.mock("@medusajs/framework/utils", () => ({
  MedusaService: () => {
    return class {
      container_ = mockContainer;
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

import MelhorEnvioService from "../../services/melhor-envio";

describe("MelhorEnvioService", () => {
  let service: MelhorEnvioService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MelhorEnvioService({} as any);
  });

  describe("calculateShipping", () => {
    const shippingRequest = {
      from_postal_code: "01310-100",
      to_postal_code: "04101-300",
      packages: [
        {
          height: 10,
          width: 10,
          length: 10,
          weight: 1,
        },
      ],
    };

    it("should calculate shipping rates", async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            name: "PAC",
            price: "15.00",
            discount: "0.00",
            currency: "BRL",
            delivery_time: 7,
            delivery_range: { min: 5, max: 7 },
            company: {
              id: 1,
              name: "Correios",
              picture: "url",
            },
          },
          {
            id: 2,
            name: "SEDEX",
            price: "25.00",
            discount: "0.00",
            currency: "BRL",
            delivery_time: 3,
            delivery_range: { min: 2, max: 3 },
            company: {
              id: 1,
              name: "Correios",
              picture: "url",
            },
          },
        ],
      };

      mockAxiosPost.mockResolvedValue(mockResponse);

      const result = await service.calculateShipping(shippingRequest);

      expect(result.quotes).toHaveLength(2);
      expect(result.quotes[0].service_name).toBe("PAC");
      expect(result.quotes[0].price).toBe(1500); // Converted to cents
      expect(result.quotes[0].delivery_min).toBe(5);
      expect(result.quotes[0].delivery_max).toBe(7);
    });

    it("should throw error for invalid postal code", async () => {
      const invalidRequest = {
        ...shippingRequest,
        from_postal_code: "invalid",
      };

      await expect(
        service.calculateShipping(invalidRequest)
      ).rejects.toThrow("Invalid CEP format");
    });

    it("should throw error for invalid package dimensions", async () => {
      const invalidRequest = {
        ...shippingRequest,
        packages: [
          {
            height: 0,
            width: 10,
            length: 10,
            weight: 1,
          },
        ],
      };

      await expect(
        service.calculateShipping(invalidRequest)
      ).rejects.toThrow("Package dimensions must be positive");
    });

    it("should throw error for invalid weight", async () => {
      const invalidRequest = {
        ...shippingRequest,
        packages: [
          {
            height: 10,
            width: 10,
            length: 10,
            weight: 0,
          },
        ],
      };

      await expect(
        service.calculateShipping(invalidRequest)
      ).rejects.toThrow("Package weight must be positive");
    });

    it("should handle API errors gracefully", async () => {
      mockAxiosPost.mockRejectedValue(new Error("API Error"));

      await expect(
        service.calculateShipping(shippingRequest)
      ).rejects.toThrow();

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Error calculating shipping")
      );
    });

    it("should filter out invalid quotes", async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            name: "PAC",
            price: "15.00",
            error: "Service unavailable",
          },
          {
            id: 2,
            name: "SEDEX",
            price: "25.00",
            delivery_range: { min: 2, max: 3 },
            company: { id: 1, name: "Correios" },
          },
        ],
      };

      mockAxiosPost.mockResolvedValue(mockResponse);

      const result = await service.calculateShipping(shippingRequest);

      expect(result.quotes).toHaveLength(1);
      expect(result.quotes[0].service_name).toBe("SEDEX");
    });
  });

  describe("validateCep", () => {
    it("should validate correct CEP format", () => {
      const result = service["validateCep"]("01310-100");
      expect(result).toBe(true);
    });

    it("should validate CEP without hyphen", () => {
      const result = service["validateCep"]("01310100");
      expect(result).toBe(true);
    });

    it("should reject invalid CEP", () => {
      const result = service["validateCep"]("123");
      expect(result).toBe(false);
    });

    it("should reject empty CEP", () => {
      const result = service["validateCep"]("");
      expect(result).toBe(false);
    });
  });

  describe("validatePackageDimensions", () => {
    it("should validate correct dimensions", () => {
      const pkg = {
        height: 10,
        width: 10,
        length: 10,
        weight: 1,
      };

      expect(() =>
        service["validatePackageDimensions"](pkg)
      ).not.toThrow();
    });

    it("should throw for zero height", () => {
      const pkg = {
        height: 0,
        width: 10,
        length: 10,
        weight: 1,
      };

      expect(() =>
        service["validatePackageDimensions"](pkg)
      ).toThrow("Package dimensions must be positive");
    });

    it("should throw for zero weight", () => {
      const pkg = {
        height: 10,
        width: 10,
        length: 10,
        weight: 0,
      };

      expect(() =>
        service["validatePackageDimensions"](pkg)
      ).toThrow("Package weight must be positive");
    });

    it("should throw for negative dimensions", () => {
      const pkg = {
        height: -10,
        width: 10,
        length: 10,
        weight: 1,
      };

      expect(() =>
        service["validatePackageDimensions"](pkg)
      ).toThrow("Package dimensions must be positive");
    });
  });

  describe("mapCompanyName", () => {
    it("should map Correios", () => {
      const result = service["mapCompanyName"]("Correios");
      expect(result).toBe(ShippingCompany.CORREIOS);
    });

    it("should map Jadlog", () => {
      const result = service["mapCompanyName"]("Jadlog");
      expect(result).toBe(ShippingCompany.JADLOG);
    });

    it("should map Azul Cargo", () => {
      const result = service["mapCompanyName"]("Azul Cargo Express");
      expect(result).toBe(ShippingCompany.AZUL_CARGO);
    });

    it("should map Loggi", () => {
      const result = service["mapCompanyName"]("Loggi");
      expect(result).toBe(ShippingCompany.LOGGI);
    });

    it("should default to Correios for unknown", () => {
      const result = service["mapCompanyName"]("Unknown Company");
      expect(result).toBe(ShippingCompany.CORREIOS);
    });
  });

  describe("convertPriceToCents", () => {
    it("should convert decimal price to cents", () => {
      const result = service["convertPriceToCents"]("15.50");
      expect(result).toBe(1550);
    });

    it("should handle integer price", () => {
      const result = service["convertPriceToCents"]("10");
      expect(result).toBe(1000);
    });

    it("should handle zero", () => {
      const result = service["convertPriceToCents"]("0");
      expect(result).toBe(0);
    });

    it("should handle large numbers", () => {
      const result = service["convertPriceToCents"]("999.99");
      expect(result).toBe(99999);
    });
  });
});
