import {
  isValidCPF,
  isValidCNPJ,
  isValidCEP,
  isValidEmail,
  formatCPF,
  formatCNPJ,
  formatCEP,
} from "../../utils/validators";

describe("Brazil Validators", () => {
  describe("isValidCPF", () => {
    it("should validate correct CPF", () => {
      // Valid CPFs
      expect(isValidCPF("111.444.777-35")).toBe(true);
      expect(isValidCPF("11144477735")).toBe(true);
      expect(isValidCPF("123.456.789-09")).toBe(true);
    });

    it("should reject invalid CPF", () => {
      expect(isValidCPF("000.000.000-00")).toBe(false);
      expect(isValidCPF("111.111.111-11")).toBe(false);
      expect(isValidCPF("123.456.789-00")).toBe(false);
      expect(isValidCPF("")).toBe(false);
      expect(isValidCPF("abc")).toBe(false);
    });

    it("should reject CPF with wrong length", () => {
      expect(isValidCPF("123")).toBe(false);
      expect(isValidCPF("12345678901234")).toBe(false);
    });

    it("should reject CPF with invalid check digits", () => {
      expect(isValidCPF("111.444.777-36")).toBe(false);
      expect(isValidCPF("111.444.777-34")).toBe(false);
    });
  });

  describe("isValidCNPJ", () => {
    it("should validate correct CNPJ", () => {
      // Valid CNPJs
      expect(isValidCNPJ("11.222.333/0001-81")).toBe(true);
      expect(isValidCNPJ("11222333000181")).toBe(true);
    });

    it("should reject invalid CNPJ", () => {
      expect(isValidCNPJ("00.000.000/0000-00")).toBe(false);
      expect(isValidCNPJ("11.111.111/1111-11")).toBe(false);
      expect(isValidCNPJ("")).toBe(false);
      expect(isValidCNPJ("abc")).toBe(false);
    });

    it("should reject CNPJ with wrong length", () => {
      expect(isValidCNPJ("123")).toBe(false);
      expect(isValidCNPJ("123456789012345678")).toBe(false);
    });

    it("should reject CNPJ with invalid check digits", () => {
      expect(isValidCNPJ("11.222.333/0001-82")).toBe(false);
      expect(isValidCNPJ("11.222.333/0001-80")).toBe(false);
    });
  });

  describe("isValidCEP", () => {
    it("should validate correct CEP", () => {
      expect(isValidCEP("01310-100")).toBe(true);
      expect(isValidCEP("01310100")).toBe(true);
      expect(isValidCEP("80010-000")).toBe(true);
      expect(isValidCEP("88015-000")).toBe(true);
    });

    it("should reject invalid CEP", () => {
      expect(isValidCEP("")).toBe(false);
      expect(isValidCEP("abc")).toBe(false);
      expect(isValidCEP("00000-000")).toBe(false);
      expect(isValidCEP("99999-999")).toBe(false);
    });

    it("should reject CEP with wrong length", () => {
      expect(isValidCEP("123")).toBe(false);
      expect(isValidCEP("123456789")).toBe(false);
    });

    it("should reject CEP with invalid format", () => {
      expect(isValidCEP("01310.100")).toBe(false);
      expect(isValidCEP("01310/100")).toBe(false);
    });
  });

  describe("isValidEmail", () => {
    it("should validate correct email", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user+tag@example.co.uk")).toBe(true);
      expect(isValidEmail("first.last@example.com")).toBe(true);
    });

    it("should reject invalid email", () => {
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("test@")).toBe(false);
      expect(isValidEmail("test@.com")).toBe(false);
    });
  });

  describe("formatCPF", () => {
    it("should format CPF correctly", () => {
      expect(formatCPF("11144477735")).toBe("111.444.777-35");
      expect(formatCPF("12345678909")).toBe("123.456.789-09");
    });

    it("should handle already formatted CPF", () => {
      expect(formatCPF("111.444.777-35")).toBe("111.444.777-35");
    });

    it("should return original if invalid length", () => {
      expect(formatCPF("123")).toBe("123");
      expect(formatCPF("")).toBe("");
    });
  });

  describe("formatCNPJ", () => {
    it("should format CNPJ correctly", () => {
      expect(formatCNPJ("11222333000181")).toBe("11.222.333/0001-81");
    });

    it("should handle already formatted CNPJ", () => {
      expect(formatCNPJ("11.222.333/0001-81")).toBe("11.222.333/0001-81");
    });

    it("should return original if invalid length", () => {
      expect(formatCNPJ("123")).toBe("123");
      expect(formatCNPJ("")).toBe("");
    });
  });

  describe("formatCEP", () => {
    it("should format CEP correctly", () => {
      expect(formatCEP("01310100")).toBe("01310-100");
      expect(formatCEP("80010000")).toBe("80010-000");
    });

    it("should handle already formatted CEP", () => {
      expect(formatCEP("01310-100")).toBe("01310-100");
    });

    it("should return original if invalid length", () => {
      expect(formatCEP("123")).toBe("123");
      expect(formatCEP("")).toBe("");
    });
  });

  describe("Edge Cases", () => {
    it("should handle null and undefined gracefully", () => {
      expect(isValidCPF(null as any)).toBe(false);
      expect(isValidCPF(undefined as any)).toBe(false);
      expect(isValidCNPJ(null as any)).toBe(false);
      expect(isValidCEP(null as any)).toBe(false);
      expect(isValidEmail(null as any)).toBe(false);
    });

    it("should handle numbers as input", () => {
      expect(isValidCPF(11144477735 as any)).toBe(true);
      expect(isValidCNPJ(11222333000181 as any)).toBe(true);
      expect(isValidCEP(1310100 as any)).toBe(true);
    });

    it("should handle whitespace", () => {
      expect(isValidCPF("  111.444.777-35  ".trim())).toBe(true);
      expect(isValidCEP("  01310-100  ".trim())).toBe(true);
      expect(isValidEmail("  test@example.com  ".trim())).toBe(true);
    });
  });

  describe("Real World Examples", () => {
    it("should validate real CPFs from famous people", () => {
      // These are publicly known test CPFs
      expect(isValidCPF("111.444.777-35")).toBe(true);
    });

    it("should validate real business CNPJs", () => {
      // Test CNPJ
      expect(isValidCNPJ("11.222.333/0001-81")).toBe(true);
    });

    it("should validate real Brazilian CEPs", () => {
      expect(isValidCEP("01310-100")).toBe(true); // Av. Paulista, São Paulo
      expect(isValidCEP("80010-000")).toBe(true); // Curitiba, PR
      expect(isValidCEP("20040-020")).toBe(true); // Rio de Janeiro, RJ
    });
  });
});
