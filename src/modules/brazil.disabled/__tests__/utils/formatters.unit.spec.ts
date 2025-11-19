/**
 * Brazil Module - Formatters Unit Tests
 * Testa formatação de dados brasileiros
 */

describe("Brazilian Formatters", () => {
  describe("formatCurrency", () => {
    const formatCurrency = (cents: number): string => {
      const reais = cents / 100;
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(reais);
    };

    it("should format cents to BRL currency", () => {
      expect(formatCurrency(1000)).toContain("10");
      expect(formatCurrency(1000)).toContain("00");
    });

    it("should format zero", () => {
      expect(formatCurrency(0)).toContain("0");
    });

    it("should format large amounts", () => {
      const result = formatCurrency(123456789);
      expect(result).toContain("1.234.567");
    });

    it("should handle decimal cents", () => {
      const result = formatCurrency(1050);
      expect(result).toContain("10");
      expect(result).toContain("50");
    });
  });

  describe("parseCurrency", () => {
    const parseCurrency = (formatted: string): number => {
      const cleaned = formatted
        .replace(/[R$\s]/g, "")
        .replace(".", "")
        .replace(",", ".");
      return Math.round(parseFloat(cleaned) * 100);
    };

    it("should parse BRL to cents", () => {
      expect(parseCurrency("R$ 10,00")).toBe(1000);
    });

    it("should parse without R$ symbol", () => {
      expect(parseCurrency("10,00")).toBe(1000);
    });

    it("should parse large amounts", () => {
      expect(parseCurrency("R$ 1.234,56")).toBe(123456);
    });

    it("should handle zero", () => {
      expect(parseCurrency("R$ 0,00")).toBe(0);
    });
  });

  describe("formatPostalCode", () => {
    const formatPostalCode = (cep: string): string => {
      const cleaned = cep.replace(/\D/g, "");
      if (cleaned.length !== 8) return cep;
      return cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
    };

    it("should format CEP with hyphen", () => {
      expect(formatPostalCode("01310100")).toBe("01310-100");
    });

    it("should handle already formatted CEP", () => {
      expect(formatPostalCode("01310-100")).toBe("01310-100");
    });

    it("should not format invalid CEP", () => {
      expect(formatPostalCode("123")).toBe("123");
    });

    it("should remove extra characters", () => {
      expect(formatPostalCode("01.310-100")).toBe("01310-100");
    });
  });

  describe("sanitizeCpfCnpj", () => {
    const sanitizeCpfCnpj = (value: string): string => {
      return value.replace(/\D/g, "");
    };

    it("should remove formatting from CPF", () => {
      expect(sanitizeCpfCnpj("123.456.789-09")).toBe("12345678909");
    });

    it("should remove formatting from CNPJ", () => {
      expect(sanitizeCpfCnpj("11.222.333/0001-81")).toBe("11222333000181");
    });

    it("should handle already clean value", () => {
      expect(sanitizeCpfCnpj("12345678909")).toBe("12345678909");
    });

    it("should handle empty string", () => {
      expect(sanitizeCpfCnpj("")).toBe("");
    });
  });

  describe("truncateString", () => {
    const truncateString = (str: string, maxLength: number): string => {
      if (str.length <= maxLength) return str;
      return str.substring(0, maxLength - 3) + "...";
    };

    it("should truncate long strings", () => {
      expect(truncateString("Hello World", 8)).toBe("Hello...");
    });

    it("should not truncate short strings", () => {
      expect(truncateString("Hello", 10)).toBe("Hello");
    });

    it("should handle exact length", () => {
      expect(truncateString("Hello", 5)).toBe("Hello");
    });

    it("should handle empty string", () => {
      expect(truncateString("", 10)).toBe("");
    });
  });

  describe("maskCpf", () => {
    const maskCpf = (cpf: string): string => {
      const cleaned = cpf.replace(/\D/g, "");
      if (cleaned.length !== 11) return cpf;
      return `***.***.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
    };

    it("should mask CPF showing only last 5 digits", () => {
      expect(maskCpf("12345678909")).toBe("***.***.789-09");
    });

    it("should handle formatted CPF", () => {
      const result = maskCpf("123.456.789-09");
      expect(result).toContain("***");
      expect(result).toContain("09");
    });

    it("should not mask invalid CPF", () => {
      expect(maskCpf("123")).toBe("123");
    });
  });

  describe("formatDateTime", () => {
    const formatDateTime = (date: Date): string => {
      return new Intl.DateTimeFormat("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(date);
    };

    it("should format date to pt-BR", () => {
      const date = new Date("2025-01-15T10:30:00");
      const result = formatDateTime(date);
      expect(result).toContain("2025");
      expect(result).toContain("01");
      expect(result).toContain("15");
    });

    it("should include time", () => {
      const date = new Date("2025-01-15T10:30:45");
      const result = formatDateTime(date);
      expect(result).toContain("10");
      expect(result).toContain("30");
    });
  });

  describe("generateTransactionId", () => {
    const generateTransactionId = (prefix: string = "TXN"): string => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
      return `${prefix}-${timestamp}-${random}`;
    };

    it("should generate unique transaction ID", () => {
      const id1 = generateTransactionId("PIX");
      const id2 = generateTransactionId("PIX");

      expect(id1).toMatch(/^PIX-\d+-\d{4}$/);
      expect(id2).toMatch(/^PIX-\d+-\d{4}$/);
      expect(id1).not.toBe(id2);
    });

    it("should use custom prefix", () => {
      const id = generateTransactionId("ORDER");
      expect(id).toMatch(/^ORDER-/);
    });

    it("should use default prefix", () => {
      const id = generateTransactionId();
      expect(id).toMatch(/^TXN-/);
    });
  });

  describe("calculateAge", () => {
    const calculateAge = (birthDate: Date): number => {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    };

    it("should calculate correct age", () => {
      const birthDate = new Date("1990-01-01");
      const age = calculateAge(birthDate);
      expect(age).toBeGreaterThanOrEqual(34);
      expect(age).toBeLessThanOrEqual(35);
    });

    it("should handle birthdays not yet occurred this year", () => {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setFullYear(nextMonth.getFullYear() - 20);

      const age = calculateAge(nextMonth);
      expect(age).toBe(19);
    });

    it("should handle birthday today", () => {
      const today = new Date();
      const birthDate = new Date(today);
      birthDate.setFullYear(birthDate.getFullYear() - 25);

      const age = calculateAge(birthDate);
      expect(age).toBe(25);
    });
  });

  describe("isBusinessDay", () => {
    const isBusinessDay = (date: Date): boolean => {
      const day = date.getDay();
      return day !== 0 && day !== 6;
    };

    it("should return true for weekdays", () => {
      // Monday
      expect(isBusinessDay(new Date("2025-01-13"))).toBe(true);
      // Wednesday
      expect(isBusinessDay(new Date("2025-01-15"))).toBe(true);
      // Friday
      expect(isBusinessDay(new Date("2025-01-17"))).toBe(true);
    });

    it("should return false for weekends", () => {
      // Saturday
      expect(isBusinessDay(new Date("2025-01-11"))).toBe(false);
      // Sunday
      expect(isBusinessDay(new Date("2025-01-12"))).toBe(false);
    });
  });

  describe("addBusinessDays", () => {
    const addBusinessDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      let daysAdded = 0;

      while (daysAdded < days) {
        result.setDate(result.getDate() + 1);
        const dayOfWeek = result.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          daysAdded++;
        }
      }

      return result;
    };

    it("should add business days skipping weekends", () => {
      // Start on Friday
      const friday = new Date("2025-01-17");
      // Add 1 business day should be Monday
      const result = addBusinessDays(friday, 1);

      expect(result.getDay()).toBe(1); // Monday
    });

    it("should handle multiple business days", () => {
      const monday = new Date("2025-01-13");
      const result = addBusinessDays(monday, 5);

      expect(result.getDay()).toBe(1); // Next Monday
    });

    it("should handle zero days", () => {
      const date = new Date("2025-01-15");
      const result = addBusinessDays(date, 0);

      expect(result.toDateString()).toBe(date.toDateString());
    });
  });
});
