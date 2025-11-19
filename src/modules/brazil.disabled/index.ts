import { Module } from "@medusajs/framework/utils";
import PixPaymentService from "./services/pix-payment";
import MelhorEnvioService from "./services/melhor-envio";
import NFeService from "./services/nfe";

export const BRAZIL_MODULE = "brazil";

export default Module(BRAZIL_MODULE, {
  service: PixPaymentService,
  services: [
    PixPaymentService,
    MelhorEnvioService,
    NFeService,
  ],
});

// Re-export types
export * from "./types";
