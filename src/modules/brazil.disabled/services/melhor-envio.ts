import { MedusaService } from "@medusajs/framework/utils";
import { ShippingQuote } from "../models";
import {
  CreateShippingQuoteDTO,
  UpdateShippingQuoteDTO,
  ShippingQuoteFilters,
  ShippingQuoteStatus,
  ShippingCalculateRequest,
  ShippingCalculateResponse,
  ShippingTrackingResponse,
  ShippingCompany,
  MelhorEnvioCalculateRequest,
  MelhorEnvioQuote,
} from "../types";

/**
 * MelhorEnvioService - Gerencia frete via Melhor Envio
 */
class MelhorEnvioService extends MedusaService({ ShippingQuote }) {
  /**
   * Calcula frete para múltiplas transportadoras
   */
  async calculateShipping(
    request: ShippingCalculateRequest
  ): Promise<ShippingCalculateResponse> {
    const logger = this.container_.resolve("logger");

    try {
      logger.info("[Brazil] Calculating shipping quotes");

      // Validar CEPs
      this.validatePostalCode(request.from_postal_code);
      this.validatePostalCode(request.to_postal_code);

      // TODO: Integrar com Melhor Envio API
      // const axios = require("axios");
      // const melhorEnvioUrl = process.env.MELHOR_ENVIO_SANDBOX === "true"
      //   ? "https://sandbox.melhorenvio.com.br/api/v2"
      //   : "https://melhorenvio.com.br/api/v2";
      //
      // const melhorEnvioRequest: MelhorEnvioCalculateRequest = {
      //   from: {
      //     postal_code: request.from_postal_code.replace(/\D/g, ""),
      //   },
      //   to: {
      //     postal_code: request.to_postal_code.replace(/\D/g, ""),
      //   },
      //   package: {
      //     height: request.packages[0].height,
      //     width: request.packages[0].width,
      //     length: request.packages[0].length,
      //     weight: request.packages[0].weight,
      //   },
      // };
      //
      // const response = await axios.post(
      //   `${melhorEnvioUrl}/me/shipment/calculate`,
      //   melhorEnvioRequest,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
      //       "Content-Type": "application/json",
      //       Accept: "application/json",
      //     },
      //   }
      // );
      //
      // const quotes: ShippingCalculateResponse["quotes"] = response.data.map(
      //   (quote: MelhorEnvioQuote) => ({
      //     company: this.mapCompanyName(quote.company.name),
      //     service_name: quote.name,
      //     price: Math.round(parseFloat(quote.price) * 100), // Converter para centavos
      //     delivery_min: quote.delivery_range.min,
      //     delivery_max: quote.delivery_range.max,
      //     company_id: quote.company.id.toString(),
      //     service_id: quote.id.toString(),
      //   })
      // );

      // MOCK: Simular cotações
      const mockQuotes: ShippingCalculateResponse["quotes"] = [
        {
          company: ShippingCompany.CORREIOS,
          service_name: "PAC",
          price: 2500, // R$ 25,00
          delivery_min: 8,
          delivery_max: 12,
          company_id: "1",
          service_id: "1",
        },
        {
          company: ShippingCompany.CORREIOS,
          service_name: "SEDEX",
          price: 4500, // R$ 45,00
          delivery_min: 3,
          delivery_max: 5,
          company_id: "1",
          service_id: "2",
        },
        {
          company: ShippingCompany.JADLOG,
          service_name: "JADLOG Express",
          price: 3800, // R$ 38,00
          delivery_min: 4,
          delivery_max: 7,
          company_id: "2",
          service_id: "3",
        },
      ];

      logger.info(`[Brazil] Found ${mockQuotes.length} shipping quotes`);

      return {
        quotes: mockQuotes,
      };
    } catch (error) {
      logger.error(`[Brazil] Error calculating shipping: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cria uma cotação de frete
   */
  async createShippingQuote(
    data: CreateShippingQuoteDTO
  ): Promise<typeof ShippingQuote> {
    const logger = this.container_.resolve("logger");

    const quote = await this.create(data);

    logger.info(`[Brazil] Shipping quote created: ${quote.id}`);

    return quote;
  }

  /**
   * Compra etiqueta de frete (após pedido confirmado)
   */
  async purchaseShipping(
    orderId: string,
    shippingOption: {
      company: ShippingCompany;
      service_name: string;
      price: number;
    }
  ): Promise<{ tracking_code: string }> {
    const logger = this.container_.resolve("logger");

    try {
      logger.info(`[Brazil] Purchasing shipping for order: ${orderId}`);

      // TODO: Buscar dados do pedido
      // const orderService = this.container_.resolve("orderService");
      // const order = await orderService.retrieve(orderId, {
      //   relations: ["customer", "shipping_address", "items"],
      // });

      // TODO: Integrar com Melhor Envio para comprar etiqueta
      // const axios = require("axios");
      // const melhorEnvioUrl = process.env.MELHOR_ENVIO_SANDBOX === "true"
      //   ? "https://sandbox.melhorenvio.com.br/api/v2"
      //   : "https://melhorenvio.com.br/api/v2";
      //
      // const shipmentRequest = {
      //   service: parseInt(shippingOption.service_id),
      //   from: { ... }, // Dados do remetente
      //   to: { ... },   // Dados do destinatário (order.shipping_address)
      //   products: order.items.map(item => ({
      //     name: item.title,
      //     quantity: item.quantity,
      //     unitary_value: item.unit_price / 100,
      //   })),
      //   volumes: [{ ... }], // Dimensões do pacote
      // };
      //
      // const response = await axios.post(
      //   `${melhorEnvioUrl}/me/cart`,
      //   shipmentRequest,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
      //       "Content-Type": "application/json",
      //       Accept: "application/json",
      //     },
      //   }
      // );
      //
      // const trackingCode = response.data.protocol;

      // MOCK: Gerar código de rastreamento
      const trackingCode = `BR${Math.random().toString(36).substr(2, 9).toUpperCase()}BR`;

      // Criar ou atualizar shipping quote
      const existingQuote = await this.getShippingQuoteByOrder(orderId);

      if (existingQuote) {
        await this.update(existingQuote.id, {
          status: ShippingQuoteStatus.PURCHASED,
          tracking_code: trackingCode,
          shipped_at: new Date(),
        });
      } else {
        await this.create({
          order_id: orderId,
          shipping_company: shippingOption.company,
          service_name: shippingOption.service_name,
          price: shippingOption.price,
          delivery_min: 0,
          delivery_max: 0,
          status: ShippingQuoteStatus.PURCHASED,
          tracking_code: trackingCode,
          shipped_at: new Date(),
        });
      }

      logger.info(`[Brazil] Shipping purchased with tracking: ${trackingCode}`);

      // Emitir evento
      await this.eventBusModuleService_?.emit("brazil.shipping_purchased", {
        order_id: orderId,
        tracking_code: trackingCode,
      });

      return { tracking_code: trackingCode };
    } catch (error) {
      logger.error(`[Brazil] Error purchasing shipping: ${error.message}`);
      throw error;
    }
  }

  /**
   * Rastreia envio
   */
  async trackShipment(trackingCode: string): Promise<ShippingTrackingResponse> {
    const logger = this.container_.resolve("logger");

    try {
      logger.info(`[Brazil] Tracking shipment: ${trackingCode}`);

      // TODO: Integrar com Melhor Envio tracking
      // const axios = require("axios");
      // const melhorEnvioUrl = process.env.MELHOR_ENVIO_SANDBOX === "true"
      //   ? "https://sandbox.melhorenvio.com.br/api/v2"
      //   : "https://melhorenvio.com.br/api/v2";
      //
      // const response = await axios.get(
      //   `${melhorEnvioUrl}/me/shipment/tracking/${trackingCode}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
      //       Accept: "application/json",
      //     },
      //   }
      // );
      //
      // return {
      //   tracking_code: trackingCode,
      //   status: this.mapTrackingStatus(response.data.status),
      //   events: response.data.tracking.map(event => ({
      //     date: event.date,
      //     description: event.description,
      //     location: event.location,
      //   })),
      //   estimated_delivery: response.data.estimated_delivery,
      // };

      // MOCK: Simular rastreamento
      return {
        tracking_code: trackingCode,
        status: ShippingQuoteStatus.IN_TRANSIT,
        events: [
          {
            date: new Date().toISOString(),
            description: "Pedido postado",
            location: "São Paulo - SP",
          },
          {
            date: new Date(Date.now() + 86400000).toISOString(),
            description: "Em trânsito",
            location: "Curitiba - PR",
          },
        ],
        estimated_delivery: new Date(Date.now() + 86400000 * 5).toISOString(),
      };
    } catch (error) {
      logger.error(`[Brazil] Error tracking shipment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Atualiza cotação/envio
   */
  async updateShippingQuote(
    id: string,
    data: UpdateShippingQuoteDTO
  ): Promise<typeof ShippingQuote> {
    return await this.update(id, data);
  }

  /**
   * Busca cotação por ID
   */
  async getShippingQuote(id: string): Promise<typeof ShippingQuote> {
    return await this.retrieve(id);
  }

  /**
   * Busca cotação por order_id
   */
  async getShippingQuoteByOrder(orderId: string): Promise<typeof ShippingQuote | null> {
    const quotes = await this.list({ order_id: orderId }, { take: 1 });
    return quotes[0] || null;
  }

  /**
   * Lista cotações com filtros
   */
  async listShippingQuotes(
    filters: ShippingQuoteFilters = {},
    config: { skip?: number; take?: number; order?: any } = {}
  ): Promise<typeof ShippingQuote[]> {
    return await this.list(filters, config);
  }

  /**
   * Obtém transportadoras disponíveis
   */
  async getAvailableCarriers(): Promise<Array<{
    id: string;
    name: string;
    services: Array<{
      id: string;
      name: string;
    }>;
  }>> {
    // TODO: Buscar da API do Melhor Envio
    // MOCK: Retornar lista estática
    return [
      {
        id: "1",
        name: "Correios",
        services: [
          { id: "1", name: "PAC" },
          { id: "2", name: "SEDEX" },
          { id: "3", name: "SEDEX 10" },
        ],
      },
      {
        id: "2",
        name: "Jadlog",
        services: [
          { id: "4", name: "Jadlog Express" },
          { id: "5", name: "Jadlog Package" },
        ],
      },
      {
        id: "3",
        name: "Loggi",
        services: [
          { id: "6", name: "Loggi Express" },
        ],
      },
    ];
  }

  /**
   * Valida CEP brasileiro
   */
  private validatePostalCode(cep: string): void {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      throw new Error(`Invalid CEP: ${cep}`);
    }
  }

  /**
   * Mapeia nome da transportadora para enum
   */
  private mapCompanyName(companyName: string): ShippingCompany {
    const map: Record<string, ShippingCompany> = {
      correios: ShippingCompany.CORREIOS,
      jadlog: ShippingCompany.JADLOG,
      "azul cargo": ShippingCompany.AZUL_CARGO,
      "latam cargo": ShippingCompany.LATAM_CARGO,
      loggi: ShippingCompany.LOGGI,
    };

    return map[companyName.toLowerCase()] || ShippingCompany.CORREIOS;
  }

  /**
   * Mapeia status de rastreamento
   */
  private mapTrackingStatus(status: string): ShippingQuoteStatus {
    const map: Record<string, ShippingQuoteStatus> = {
      posted: ShippingQuoteStatus.IN_TRANSIT,
      in_transit: ShippingQuoteStatus.IN_TRANSIT,
      delivered: ShippingQuoteStatus.DELIVERED,
      cancelled: ShippingQuoteStatus.CANCELLED,
    };

    return map[status.toLowerCase()] || ShippingQuoteStatus.IN_TRANSIT;
  }
}

export default MelhorEnvioService;
