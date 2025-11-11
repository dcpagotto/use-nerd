/**
 * Brazil Module - Validators Unit Tests
 * Testa validação de CPF, CNPJ, CEP
 */

import {
  validateCpfCnpj,
  validateCep,
  validateEmail,
  validateBrazilianPhone,
  formatBrazilianPhone,
} from "../../utils/validators";

describe("Brazil Validators", () => {
  describe("validateCpfCnpj", () => {
    describe("CPF Validation", () => {
      it("should validate valid CPF", () => {
        // CPF válido: 123.456.789-09
        const result = validateCpfCnpj("12345678909");
        expect(result.isValid).toBe(true);
        expect(result.type).toBe("CPF");
        expect(result.formatted).toBe("123.456.789-09");
      });

      it("should validate CPF with formatting", () => {
        const result = validateCpfCnpj("123.456.789-09");
        expect(result.isValid).toBe(true);
        expect(result.type).toBe("CPF");
      });

      it("should reject invalid CPF", () => {
        const result = validateCpfCnpj("12345678900");
        expect(result.isValid).toBe(false);
        expect(result.type).toBe("CPF");
      });

      it("should reject CPF with all same digits", () => {
        const result = validateCpfCnpj("11111111111");
        expect(result.isValid).toBe(false);
      });

      it("should reject CPF with wrong check digit", () => {
        const result = validateCpfCnpj("12345678901");
        expect(result.isValid).toBe(false);
      });
    });

    describe("CNPJ Validation", () => {
      it("should validate valid CNPJ", () => {
        // CNPJ válido: 11.222.333/0001-81
        const result = validateCpfCnpj("11222333000181");
        expect(result.isValid).toBe(true);
        expect(result.type).toBe("CNPJ");
        expect(result.formatted).toBe("11.222.333/0001-81");
      });

      it("should validate CNPJ with formatting", () => {
        const result = validateCpfCnpj("11.222.333/0001-81");
        expect(result.isValid).toBe(true);
        expect(result.type).toBe("CNPJ");
      });

      it("should reject invalid CNPJ", () => {
        const result = validateCpfCnpj("11222333000180");
        expect(result.isValid).toBe(false);
        expect(result.type).toBe("CNPJ");
      });

      it("should reject CNPJ with all same digits", () => {
        const result = validateCpfCnpj("11111111111111");
        expect(result.isValid).toBe(false);
      });

      it("should reject CNPJ with wrong check digit", () => {
        const result = validateCpfCnpj("11222333000199");
        expect(result.isValid).toBe(false);
      });
    });

    describe("Invalid Input", () => {
      it("should reject empty string", () => {
        const result = validateCpfCnpj("");
        expect(result.isValid).toBe(false);
        expect(result.type).toBe("unknown");
      });

      it("should reject invalid length", () => {
        const result = validateCpfCnpj("123456");
        expect(result.isValid).toBe(false);
        expect(result.type).toBe("unknown");
      });

      it("should handle special characters", () => {
        const result = validateCpfCnpj("123.456.789-09");
        expect(result.isValid).toBe(true);
        expect(result.type).toBe("CPF");
      });
    });
  });

  describe("validateCep", () => {
    it("should validate valid CEP", () => {
      const result = validateCep("12345678");
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe("12345-678");
    });

    it("should validate CEP with formatting", () => {
      const result = validateCep("12345-678");
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe("12345-678");
    });

    it("should reject invalid CEP length", () => {
      const result = validateCep("123456");
      expect(result.isValid).toBe(false);
    });

    it("should reject empty CEP", () => {
      const result = validateCep("");
      expect(result.isValid).toBe(false);
    });

    it("should handle CEP with spaces", () => {
      const result = validateCep("12 345 678");
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe("12345-678");
    });
  });

  describe("validateEmail", () => {
    it("should validate valid email", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name+tag@example.co.uk")).toBe(true);
    });

    it("should reject invalid email", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("test@example")).toBe(false);
    });

    it("should reject empty email", () => {
      expect(validateEmail("")).toBe(false);
    });
  });

  describe("validateBrazilianPhone", () => {
    it("should validate mobile phone with 11 digits", () => {
      expect(validateBrazilianPhone("11987654321")).toBe(true);
      expect(validateBrazilianPhone("(11) 98765-4321")).toBe(true);
    });

    it("should validate landline with 10 digits", () => {
      expect(validateBrazilianPhone("1134567890")).toBe(true);
      expect(validateBrazilianPhone("(11) 3456-7890")).toBe(true);
    });

    it("should reject invalid phone", () => {
      expect(validateBrazilianPhone("123456")).toBe(false);
      expect(validateBrazilianPhone("123456789012")).toBe(false);
    });

    it("should reject empty phone", () => {
      expect(validateBrazilianPhone("")).toBe(false);
    });
  });

  describe("formatBrazilianPhone", () => {
    it("should format mobile phone", () => {
      expect(formatBrazilianPhone("11987654321")).toBe("(11) 98765-4321");
    });

    it("should format landline", () => {
      expect(formatBrazilianPhone("1134567890")).toBe("(11) 3456-7890");
    });

    it("should return original if invalid", () => {
      expect(formatBrazilianPhone("123")).toBe("123");
    });

    it("should handle already formatted phone", () => {
      const formatted = formatBrazilianPhone("(11) 98765-4321");
      expect(formatted).toBe("(11) 98765-4321");
    });
  });
});
