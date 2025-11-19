/**
 * Product Specifications Validation
 * Validates product specifications based on product type
 */

import {
  ProductType,
  ProductSpecifications,
  ComputerSpecs,
  CarSpecs,
  MotorcycleSpecs,
  ElectronicsSpecs,
  ApplianceSpecs,
  CashSpecs,
  TravelSpecs,
} from "../types";

/**
 * Validation errors
 */
export class ProductValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public productType: ProductType
  ) {
    super(message);
    this.name = "ProductValidationError";
  }
}

/**
 * Validates computer specifications
 */
function validateComputerSpecs(specs: any): specs is ComputerSpecs {
  if (!specs.brand || typeof specs.brand !== "string") {
    throw new ProductValidationError(
      "Brand is required for computer",
      "brand",
      ProductType.COMPUTER
    );
  }

  if (!specs.model || typeof specs.model !== "string") {
    throw new ProductValidationError(
      "Model is required for computer",
      "model",
      ProductType.COMPUTER
    );
  }

  if (!specs.processor || typeof specs.processor !== "string") {
    throw new ProductValidationError(
      "Processor is required for computer",
      "processor",
      ProductType.COMPUTER
    );
  }

  if (!specs.ram || typeof specs.ram !== "string") {
    throw new ProductValidationError(
      "RAM is required for computer",
      "ram",
      ProductType.COMPUTER
    );
  }

  if (!specs.storage || typeof specs.storage !== "string") {
    throw new ProductValidationError(
      "Storage is required for computer",
      "storage",
      ProductType.COMPUTER
    );
  }

  if (!specs.condition || !["new", "refurbished", "used"].includes(specs.condition)) {
    throw new ProductValidationError(
      "Condition must be 'new', 'refurbished', or 'used'",
      "condition",
      ProductType.COMPUTER
    );
  }

  return true;
}

/**
 * Validates car specifications
 */
function validateCarSpecs(specs: any): specs is CarSpecs {
  if (!specs.brand || typeof specs.brand !== "string") {
    throw new ProductValidationError(
      "Brand is required for car",
      "brand",
      ProductType.CAR
    );
  }

  if (!specs.model || typeof specs.model !== "string") {
    throw new ProductValidationError(
      "Model is required for car",
      "model",
      ProductType.CAR
    );
  }

  if (!specs.year || typeof specs.year !== "number" || specs.year < 1900) {
    throw new ProductValidationError(
      "Valid year is required for car",
      "year",
      ProductType.CAR
    );
  }

  if (!specs.color || typeof specs.color !== "string") {
    throw new ProductValidationError(
      "Color is required for car",
      "color",
      ProductType.CAR
    );
  }

  if (typeof specs.mileage !== "number" || specs.mileage < 0) {
    throw new ProductValidationError(
      "Mileage must be a non-negative number",
      "mileage",
      ProductType.CAR
    );
  }

  const validFuelTypes = ["gasoline", "ethanol", "flex", "diesel", "electric", "hybrid"];
  if (!specs.fuel_type || !validFuelTypes.includes(specs.fuel_type)) {
    throw new ProductValidationError(
      `Fuel type must be one of: ${validFuelTypes.join(", ")}`,
      "fuel_type",
      ProductType.CAR
    );
  }

  const validTransmissions = ["manual", "automatic", "cvt"];
  if (!specs.transmission || !validTransmissions.includes(specs.transmission)) {
    throw new ProductValidationError(
      `Transmission must be one of: ${validTransmissions.join(", ")}`,
      "transmission",
      ProductType.CAR
    );
  }

  if (!specs.condition || !["new", "used"].includes(specs.condition)) {
    throw new ProductValidationError(
      "Condition must be 'new' or 'used'",
      "condition",
      ProductType.CAR
    );
  }

  return true;
}

/**
 * Validates motorcycle specifications
 */
function validateMotorcycleSpecs(specs: any): specs is MotorcycleSpecs {
  if (!specs.brand || typeof specs.brand !== "string") {
    throw new ProductValidationError(
      "Brand is required for motorcycle",
      "brand",
      ProductType.MOTORCYCLE
    );
  }

  if (!specs.model || typeof specs.model !== "string") {
    throw new ProductValidationError(
      "Model is required for motorcycle",
      "model",
      ProductType.MOTORCYCLE
    );
  }

  if (!specs.year || typeof specs.year !== "number" || specs.year < 1900) {
    throw new ProductValidationError(
      "Valid year is required for motorcycle",
      "year",
      ProductType.MOTORCYCLE
    );
  }

  if (!specs.engine_displacement || typeof specs.engine_displacement !== "string") {
    throw new ProductValidationError(
      "Engine displacement is required for motorcycle",
      "engine_displacement",
      ProductType.MOTORCYCLE
    );
  }

  if (!specs.condition || !["new", "used"].includes(specs.condition)) {
    throw new ProductValidationError(
      "Condition must be 'new' or 'used'",
      "condition",
      ProductType.MOTORCYCLE
    );
  }

  return true;
}

/**
 * Validates electronics specifications
 */
function validateElectronicsSpecs(specs: any): specs is ElectronicsSpecs {
  const validCategories = ["smartphone", "tablet", "tv", "console", "camera", "audio", "other"];

  if (!specs.category || !validCategories.includes(specs.category)) {
    throw new ProductValidationError(
      `Category must be one of: ${validCategories.join(", ")}`,
      "category",
      ProductType.ELECTRONICS
    );
  }

  if (!specs.brand || typeof specs.brand !== "string") {
    throw new ProductValidationError(
      "Brand is required for electronics",
      "brand",
      ProductType.ELECTRONICS
    );
  }

  if (!specs.model || typeof specs.model !== "string") {
    throw new ProductValidationError(
      "Model is required for electronics",
      "model",
      ProductType.ELECTRONICS
    );
  }

  if (!specs.condition || !["new", "refurbished", "used"].includes(specs.condition)) {
    throw new ProductValidationError(
      "Condition must be 'new', 'refurbished', or 'used'",
      "condition",
      ProductType.ELECTRONICS
    );
  }

  return true;
}

/**
 * Validates appliance specifications
 */
function validateApplianceSpecs(specs: any): specs is ApplianceSpecs {
  const validCategories = [
    "refrigerator",
    "washer",
    "dryer",
    "oven",
    "microwave",
    "dishwasher",
    "other",
  ];

  if (!specs.category || !validCategories.includes(specs.category)) {
    throw new ProductValidationError(
      `Category must be one of: ${validCategories.join(", ")}`,
      "category",
      ProductType.APPLIANCE
    );
  }

  if (!specs.brand || typeof specs.brand !== "string") {
    throw new ProductValidationError(
      "Brand is required for appliance",
      "brand",
      ProductType.APPLIANCE
    );
  }

  if (!specs.model || typeof specs.model !== "string") {
    throw new ProductValidationError(
      "Model is required for appliance",
      "model",
      ProductType.APPLIANCE
    );
  }

  if (!specs.condition || !["new", "used"].includes(specs.condition)) {
    throw new ProductValidationError(
      "Condition must be 'new' or 'used'",
      "condition",
      ProductType.APPLIANCE
    );
  }

  return true;
}

/**
 * Validates cash prize specifications
 */
function validateCashSpecs(specs: any): specs is CashSpecs {
  if (typeof specs.amount !== "number" || specs.amount <= 0) {
    throw new ProductValidationError(
      "Amount must be a positive number",
      "amount",
      ProductType.CASH
    );
  }

  const validCurrencies = ["BRL", "USD", "EUR"];
  if (!specs.currency || !validCurrencies.includes(specs.currency)) {
    throw new ProductValidationError(
      `Currency must be one of: ${validCurrencies.join(", ")}`,
      "currency",
      ProductType.CASH
    );
  }

  const validPaymentMethods = ["pix", "bank_transfer", "check"];
  if (!specs.payment_method || !validPaymentMethods.includes(specs.payment_method)) {
    throw new ProductValidationError(
      `Payment method must be one of: ${validPaymentMethods.join(", ")}`,
      "payment_method",
      ProductType.CASH
    );
  }

  return true;
}

/**
 * Validates travel package specifications
 */
function validateTravelSpecs(specs: any): specs is TravelSpecs {
  if (!specs.destination || typeof specs.destination !== "string") {
    throw new ProductValidationError(
      "Destination is required for travel package",
      "destination",
      ProductType.TRAVEL
    );
  }

  if (typeof specs.duration_days !== "number" || specs.duration_days <= 0) {
    throw new ProductValidationError(
      "Duration in days must be a positive number",
      "duration_days",
      ProductType.TRAVEL
    );
  }

  if (typeof specs.participants !== "number" || specs.participants <= 0) {
    throw new ProductValidationError(
      "Number of participants must be a positive number",
      "participants",
      ProductType.TRAVEL
    );
  }

  return true;
}

/**
 * Main validation function
 * Validates product specifications based on product type
 */
export function validateProductSpecifications(
  productType: ProductType,
  specifications: ProductSpecifications
): boolean {
  if (!specifications) {
    throw new ProductValidationError(
      "Product specifications are required",
      "specifications",
      productType
    );
  }

  switch (productType) {
    case ProductType.COMPUTER:
      return validateComputerSpecs(specifications);

    case ProductType.CAR:
      return validateCarSpecs(specifications);

    case ProductType.MOTORCYCLE:
      return validateMotorcycleSpecs(specifications);

    case ProductType.ELECTRONICS:
      return validateElectronicsSpecs(specifications);

    case ProductType.APPLIANCE:
      return validateApplianceSpecs(specifications);

    case ProductType.CASH:
      return validateCashSpecs(specifications);

    case ProductType.TRAVEL:
      return validateTravelSpecs(specifications);

    case ProductType.OTHER:
      // For OTHER type, we don't enforce strict validation
      // but we still check that specifications is an object
      if (typeof specifications !== "object") {
        throw new ProductValidationError(
          "Specifications must be an object",
          "specifications",
          ProductType.OTHER
        );
      }
      return true;

    default:
      throw new ProductValidationError(
        `Unknown product type: ${productType}`,
        "product_type",
        productType
      );
  }
}

/**
 * Helper function to get required fields for a product type
 */
export function getRequiredFieldsForProductType(productType: ProductType): string[] {
  switch (productType) {
    case ProductType.COMPUTER:
      return ["brand", "model", "processor", "ram", "storage", "condition"];

    case ProductType.CAR:
      return [
        "brand",
        "model",
        "year",
        "color",
        "mileage",
        "fuel_type",
        "transmission",
        "condition",
      ];

    case ProductType.MOTORCYCLE:
      return ["brand", "model", "year", "color", "mileage", "engine_displacement", "condition"];

    case ProductType.ELECTRONICS:
      return ["category", "brand", "model", "condition"];

    case ProductType.APPLIANCE:
      return ["category", "brand", "model", "condition"];

    case ProductType.CASH:
      return ["amount", "currency", "payment_method"];

    case ProductType.TRAVEL:
      return ["destination", "duration_days", "participants"];

    case ProductType.OTHER:
      return [];

    default:
      return [];
  }
}
