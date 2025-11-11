/**
 * Jest Setup for Unit Tests
 * Mocks Medusa framework utilities for unit testing
 */

// Mock do model.define do Medusa
const mockDefine = jest.fn((name, schema) => {
  // Retorna um mock simples do model
  return {
    name,
    schema,
    // Mock methods que podem ser necessários
    cascades: jest.fn(),
    indexes: jest.fn(),
  };
});

// Mock do @medusajs/framework/utils
jest.mock("@medusajs/framework/utils", () => {
  const actual = jest.requireActual("@medusajs/framework/utils");
  return {
    ...actual,
    model: {
      define: mockDefine,
      id: () => ({
        primaryKey: () => ({ primaryKey: true }),
      }),
      text: () => ({ type: "text" }),
      number: () => ({ type: "number" }),
      bigNumber: () => ({ type: "bigNumber" }),
      boolean: () => ({ type: "boolean" }),
      dateTime: () => ({
        type: "dateTime",
        nullable: () => ({ nullable: true }),
      }),
      json: () => ({
        type: "json",
        nullable: () => ({ nullable: true }),
      }),
      enum: (values) => ({
        type: "enum",
        values,
        default: (val) => ({ default: val }),
      }),
      hasMany: (relation) => ({
        type: "hasMany",
        relation,
      }),
      belongsTo: (relation) => ({
        type: "belongsTo",
        relation,
        nullable: () => ({ nullable: true }),
      }),
    },
    MedusaService: () => {
      return class MockMedusaService {
        constructor(deps) {
          this.__container__ = deps;
        }
        create = jest.fn();
        update = jest.fn();
        retrieve = jest.fn();
        list = jest.fn();
        delete = jest.fn();
        softDelete = jest.fn();
        eventBusModuleService_ = { emit: jest.fn() };
      };
    },
  };
});

// Clear metadata storage
const { MetadataStorage } = require("@medusajs/framework/mikro-orm/core");
MetadataStorage.clear();

console.log("✓ Jest unit test setup loaded - Medusa models mocked");
