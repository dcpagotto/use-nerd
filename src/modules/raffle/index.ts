import { Module } from "@medusajs/framework/utils";
import RaffleService from "./services/raffle";
import RaffleTicketService from "./services/raffle-ticket";
import RaffleDrawService from "./services/raffle-draw";

export const RAFFLE_MODULE = "raffle";

export default Module(RAFFLE_MODULE, {
  service: RaffleService,
  services: [
    RaffleService,
    RaffleTicketService,
    RaffleDrawService,
  ],
});

// Re-export types
export * from "./types";
