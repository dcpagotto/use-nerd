import { CpfCnpjValidation, CepValidation } from "../types";

/**
 * Valida e formata CPF ou CNPJ brasileiro
 */
export function validateCpfCnpj(value: string): CpfCnpjValidation {
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return {
      isValid: validateCPF(cleaned),
      type: "CPF",
      formatted: formatCPF(cleaned),
    };
  } else if (cleaned.length === 14) {
    return {
      isValid: validateCNPJ(cleaned),
      type: "CNPJ",
      formatted: formatCNPJ(cleaned),
    };
  }

  return {
    isValid: false,
    type: "unknown",
    formatted: value,
  };
}

/**
 * Valida CPF usando algoritmo oficial
 */
function validateCPF(cpf: string): boolean {
  if (cpf.length !== 11) return false;

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Validar primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  // Validar segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
}

/**
 * Valida CNPJ usando algoritmo oficial
 */
function validateCNPJ(cnpj: string): boolean {
  if (cnpj.length !== 14) return false;

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Validar primeiro dígito verificador
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(cnpj.charAt(12))) return false;

  // Validar segundo dígito verificador
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(cnpj.charAt(13))) return false;

  return true;
}

/**
 * Formata CPF: 123.456.789-01
 */
function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Formata CNPJ: 12.345.678/0001-90
 */
function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

/**
 * Valida e formata CEP brasileiro
 */
export function validateCep(cep: string): CepValidation {
  const cleaned = cep.replace(/\D/g, "");

  if (cleaned.length !== 8) {
    return {
      isValid: false,
      formatted: cep,
    };
  }

  return {
    isValid: true,
    formatted: formatCEP(cleaned),
  };
}

/**
 * Formata CEP: 12345-678
 */
function formatCEP(cep: string): string {
  return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
}

/**
 * Valida se string é um email válido
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se string é um telefone brasileiro válido
 */
export function validateBrazilianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  // Aceita: (11) 98765-4321 ou (11) 3456-7890
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Formata telefone brasileiro: (11) 98765-4321
 */
export function formatBrazilianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return phone;
}
