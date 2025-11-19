import { MedusaService } from "@medusajs/framework/utils";
import { NFe } from "../models";
import {
  CreateNFeDTO,
  UpdateNFeDTO,
  NFeFilters,
  NFeStatus,
  NFeProviderRequest,
  NFeProviderResponse,
} from "../types";

/**
 * NFeService - Gerencia Notas Fiscais Eletrônicas
 */
class NFeService extends MedusaService({ NFe }) {
  /**
   * Gera uma NFe
   */
  async generateNFe(data: CreateNFeDTO): Promise<typeof NFe> {
    const logger = this.container_.resolve("logger");

    try {
      logger.info(`[Brazil] Generating NFe for order: ${data.order_id}`);

      // Validar dados
      this.validateNFeData(data);

      // Criar NFe no banco (status: PENDING)
      const nfe = await this.create({
        order_id: data.order_id,
        customer_cpf_cnpj: data.customer_cpf_cnpj,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_address: data.customer_address,
        items: data.items,
        total_amount: data.total_amount,
        shipping_amount: data.shipping_amount,
        status: NFeStatus.PENDING,
        metadata: data.metadata || {},
      });

      // TODO: Integrar com provedor de NFe (eNotas, Focus NFe, etc.)
      // const axios = require("axios");
      // const nfeApiUrl = process.env.NFE_API_URL;
      // const nfeApiToken = process.env.NFE_API_TOKEN;
      //
      // const nfeRequest: NFeProviderRequest = {
      //   tipo: "NF-e",
      //   enviarPorEmail: true,
      //   cliente: {
      //     tipoPessoa: data.customer_cpf_cnpj.length === 11 ? "F" : "J",
      //     nome: data.customer_name,
      //     email: data.customer_email,
      //     cpfCnpj: data.customer_cpf_cnpj,
      //     endereco: {
      //       logradouro: data.customer_address.street,
      //       numero: data.customer_address.number,
      //       complemento: data.customer_address.complement,
      //       bairro: data.customer_address.district,
      //       cidade: data.customer_address.city,
      //       uf: data.customer_address.state,
      //       cep: data.customer_address.postal_code.replace(/\D/g, ""),
      //     },
      //   },
      //   produtos: data.items.map((item) => ({
      //     codigo: item.product_code,
      //     descricao: item.description,
      //     ncm: item.ncm || "00000000",
      //     cfop: item.cfop || "5102",
      //     unidadeMedida: "UN",
      //     quantidade: item.quantity,
      //     valorUnitario: item.unit_price / 100, // Converter centavos para reais
      //   })),
      //   valorTotal: data.total_amount / 100,
      //   valorFrete: data.shipping_amount ? data.shipping_amount / 100 : 0,
      // };
      //
      // const response = await axios.post(
      //   `${nfeApiUrl}/v1/nfe`,
      //   nfeRequest,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${nfeApiToken}`,
      //       "Content-Type": "application/json",
      //       Accept: "application/json",
      //     },
      //   }
      // );
      //
      // const nfeResponse: NFeProviderResponse = response.data;
      //
      // // Atualizar NFe com dados da API
      // await this.update(nfe.id, {
      //   status:
      //     nfeResponse.status === "autorizada"
      //       ? NFeStatus.AUTHORIZED
      //       : NFeStatus.PROCESSING,
      //   nfe_number: nfeResponse.numero,
      //   access_key: nfeResponse.chaveAcesso,
      //   xml_url: nfeResponse.linkXml,
      //   pdf_url: nfeResponse.linkPdf,
      //   issued_at: nfeResponse.dataEmissao
      //     ? new Date(nfeResponse.dataEmissao)
      //     : new Date(),
      // });

      // MOCK: Simular resposta do provedor
      await this.update(nfe.id, {
        status: NFeStatus.PROCESSING,
      });

      logger.info(`[Brazil] NFe created (processing): ${nfe.id}`);

      // Emitir evento
      await this.eventBusModuleService_?.emit("brazil.nfe_created", {
        nfe_id: nfe.id,
        order_id: nfe.order_id,
      });

      // Simular autorização após 5 segundos (em produção seria webhook)
      // setTimeout(async () => {
      //   await this.authorizeNFe(nfe.id);
      // }, 5000);

      return await this.retrieve(nfe.id);
    } catch (error) {
      logger.error(`[Brazil] Error generating NFe: ${error.message}`);

      // Atualizar status para erro
      if (error.nfeId) {
        await this.update(error.nfeId, {
          status: NFeStatus.REJECTED,
          error_message: error.message,
        });
      }

      throw error;
    }
  }

  /**
   * Autoriza NFe (chamado após processamento bem-sucedido)
   */
  async authorizeNFe(id: string): Promise<typeof NFe> {
    const logger = this.container_.resolve("logger");

    const nfe = await this.retrieve(id);

    if (nfe.status !== NFeStatus.PROCESSING) {
      logger.warn(`[Brazil] Cannot authorize NFe ${id}: status is ${nfe.status}`);
      return nfe;
    }

    // MOCK: Simular dados da NFe autorizada
    const mockNFeNumber = `${Math.floor(Math.random() * 900000 + 100000)}`;
    const mockAccessKey = Array.from({ length: 44 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");

    const updated = await this.update(id, {
      status: NFeStatus.AUTHORIZED,
      nfe_number: mockNFeNumber,
      access_key: mockAccessKey,
      xml_url: `https://example.com/nfe/${mockAccessKey}.xml`,
      pdf_url: `https://example.com/nfe/${mockAccessKey}.pdf`,
      issued_at: new Date(),
    });

    logger.info(`[Brazil] NFe authorized: ${id}`);

    // Emitir evento
    await this.eventBusModuleService_?.emit("brazil.nfe_authorized", {
      nfe_id: updated.id,
      order_id: updated.order_id,
      nfe_number: updated.nfe_number,
      access_key: updated.access_key,
    });

    return updated;
  }

  /**
   * Verifica status da NFe no provedor
   */
  async checkStatus(id: string): Promise<{
    status: NFeStatus;
    nfe_number?: string;
    access_key?: string;
  }> {
    const logger = this.container_.resolve("logger");

    try {
      const nfe = await this.retrieve(id);

      // TODO: Consultar status no provedor
      // const axios = require("axios");
      // const response = await axios.get(
      //   `${process.env.NFE_API_URL}/v1/nfe/${nfe.id}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${process.env.NFE_API_TOKEN}`,
      //       Accept: "application/json",
      //     },
      //   }
      // );
      //
      // const nfeResponse: NFeProviderResponse = response.data;
      //
      // const statusMap = {
      //   processando: NFeStatus.PROCESSING,
      //   autorizada: NFeStatus.AUTHORIZED,
      //   rejeitada: NFeStatus.REJECTED,
      //   cancelada: NFeStatus.CANCELLED,
      // };
      //
      // return {
      //   status: statusMap[nfeResponse.status] || NFeStatus.PENDING,
      //   nfe_number: nfeResponse.numero,
      //   access_key: nfeResponse.chaveAcesso,
      // };

      // MOCK: Retornar status atual
      logger.info(`[Brazil] Checking NFe status: ${id}`);
      return {
        status: nfe.status,
        nfe_number: nfe.nfe_number || undefined,
        access_key: nfe.access_key || undefined,
      };
    } catch (error) {
      logger.error(`[Brazil] Error checking NFe status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cancela uma NFe
   */
  async cancelNFe(id: string, reason: string): Promise<typeof NFe> {
    const logger = this.container_.resolve("logger");

    try {
      const nfe = await this.retrieve(id);

      if (nfe.status !== NFeStatus.AUTHORIZED) {
        throw new Error("Only authorized NFe can be cancelled");
      }

      // TODO: Cancelar no provedor
      // const axios = require("axios");
      // await axios.post(
      //   `${process.env.NFE_API_URL}/v1/nfe/${nfe.id}/cancelar`,
      //   { motivo: reason },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${process.env.NFE_API_TOKEN}`,
      //       "Content-Type": "application/json",
      //       Accept: "application/json",
      //     },
      //   }
      // );

      const updated = await this.update(id, {
        status: NFeStatus.CANCELLED,
        error_message: `Cancelada: ${reason}`,
      });

      logger.info(`[Brazil] NFe cancelled: ${id}`);

      return updated;
    } catch (error) {
      logger.error(`[Brazil] Error cancelling NFe: ${error.message}`);
      throw error;
    }
  }

  /**
   * Baixa PDF da NFe
   */
  async downloadPDF(id: string): Promise<string> {
    const nfe = await this.retrieve(id);

    if (!nfe.pdf_url) {
      throw new Error("PDF not available yet");
    }

    return nfe.pdf_url;
  }

  /**
   * Baixa XML da NFe
   */
  async downloadXML(id: string): Promise<string> {
    const nfe = await this.retrieve(id);

    if (!nfe.xml_url) {
      throw new Error("XML not available yet");
    }

    return nfe.xml_url;
  }

  /**
   * Atualiza NFe
   */
  async updateNFe(id: string, data: UpdateNFeDTO): Promise<typeof NFe> {
    return await this.update(id, data);
  }

  /**
   * Busca NFe por ID
   */
  async getNFe(id: string): Promise<typeof NFe> {
    return await this.retrieve(id);
  }

  /**
   * Busca NFe por order_id
   */
  async getNFeByOrder(orderId: string): Promise<typeof NFe | null> {
    const nfes = await this.list({ order_id: orderId }, { take: 1 });
    return nfes[0] || null;
  }

  /**
   * Lista NFes com filtros
   */
  async listNFes(
    filters: NFeFilters = {},
    config: { skip?: number; take?: number; order?: any } = {}
  ): Promise<typeof NFe[]> {
    return await this.list(filters, config);
  }

  /**
   * Valida dados da NFe
   */
  private validateNFeData(data: CreateNFeDTO): void {
    // Validar CPF/CNPJ
    const cpfCnpj = data.customer_cpf_cnpj.replace(/\D/g, "");
    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
      throw new Error("Invalid CPF/CNPJ");
    }

    // Validar CEP
    const cep = data.customer_address.postal_code.replace(/\D/g, "");
    if (cep.length !== 8) {
      throw new Error("Invalid CEP");
    }

    // Validar itens
    if (!data.items || data.items.length === 0) {
      throw new Error("NFe must have at least one item");
    }

    // Validar total
    if (data.total_amount <= 0) {
      throw new Error("Total amount must be greater than 0");
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.customer_email)) {
      throw new Error("Invalid email");
    }
  }
}

export default NFeService;
