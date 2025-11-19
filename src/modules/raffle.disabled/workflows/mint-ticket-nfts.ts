import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk";

/**
 * uploadMetadataToIPFSStep
 * Faz upload do metadata do ticket para IPFS
 */
const uploadMetadataToIPFSStep = createStep(
  "upload-metadata-to-ipfs",
  async (input: {
    ticket_id: string;
    ticket_number: number;
    raffle_title: string;
    customer_id: string;
  }) => {
    // TODO: Integrar com Pinata ou outro provider IPFS
    // const metadata = {
    //   name: `USE Nerd Raffle Ticket #${input.ticket_number}`,
    //   description: `Ticket para ${input.raffle_title}`,
    //   image: "https://...",
    //   attributes: [...]
    // };
    //
    // const result = await pinata.pinJSONToIPFS(metadata);
    // const metadataURI = `ipfs://${result.IpfsHash}`;

    // Mock - simular upload IPFS
    const mockIPFSHash = `Qm${Math.random().toString(36).substring(2, 48)}`;
    const metadataURI = `ipfs://${mockIPFSHash}`;

    console.log("Metadata uploaded to IPFS:", metadataURI);

    return new StepResponse(
      { metadata_uri: metadataURI },
      { ipfs_hash: mockIPFSHash }
    );
  }
);

/**
 * mintNFTStep
 * Faz mint do NFT na blockchain
 */
const mintNFTStep = createStep(
  "mint-nft",
  async (input: {
    ticket_id: string;
    ticket_number: number;
    customer_wallet: string;
    metadata_uri: string;
  }) => {
    // TODO: Integrar com smart contract TicketNFT
    // const tx = await ticketNFTContract.mint(
    //   input.customer_wallet,
    //   input.ticket_number,
    //   input.metadata_uri
    // );
    // await tx.wait();

    // Mock - simular mint
    const mockMint = {
      nft_token_id: String(input.ticket_number),
      transaction_hash: `0x${Math.random().toString(16).substring(2)}`,
      block_number: Math.floor(Math.random() * 1000000),
    };

    console.log("NFT minted:", mockMint);

    return new StepResponse(mockMint, {
      nft_token_id: mockMint.nft_token_id,
      transaction_hash: mockMint.transaction_hash,
    });
  },
  async (compensationData) => {
    // Rollback: burn NFT se necessário
    console.log("Rolling back NFT mint:", compensationData.nft_token_id);
    // TODO: Implementar rollback (burn ou transfer)
  }
);

/**
 * updateTicketWithNFTDataStep
 * Atualiza ticket com dados do NFT
 */
const updateTicketWithNFTDataStep = createStep(
  "update-ticket-with-nft-data",
  async (input: {
    ticket_id: string;
    nft_token_id: string;
    nft_transaction_hash: string;
    nft_metadata_uri: string;
  }) => {
    // TODO: Usar RaffleTicketService.updateNFTData
    console.log("Updating ticket with NFT data:", input);

    return new StepResponse({ success: true });
  }
);

/**
 * emitTicketsMintedEventStep
 * Dispara evento de tickets mintados
 */
const emitTicketsMintedEventStep = createStep(
  "emit-tickets-minted-event",
  async (input: {
    raffle_id: string;
    ticket_ids: string[];
    nft_token_ids: string[];
  }) => {
    // TODO: Usar eventBusService
    console.log("Event: raffle.tickets_minted", input);
    return new StepResponse({ success: true });
  }
);

/**
 * mintTicketNFTsWorkflow
 *
 * Workflow de mint de NFTs para tickets:
 * 1. Para cada ticket pago não mintado:
 *    a. Cria metadata JSON
 *    b. Faz upload para IPFS
 *    c. Faz mint do NFT
 *    d. Atualiza ticket com dados do NFT
 * 2. Dispara eventos
 *
 * NOTA: Este workflow é executado de forma assíncrona
 * após o pagamento ser confirmado
 */
export const mintTicketNFTsWorkflow = createWorkflow(
  "mint-ticket-nfts",
  function (input: {
    raffle_id: string;
    raffle_title: string;
    ticket_ids: string[];
  }) {
    // TODO: Buscar tickets do banco
    // const tickets = await raffleTicketService.list({ id: input.ticket_ids });

    // Mock - simular tickets
    const tickets = input.ticket_ids.map((id, index) => ({
      id,
      ticket_number: index + 1,
      customer_id: `cus_${Math.random()}`,
      customer_wallet: `0x${Math.random().toString(16).substring(2, 42)}`,
    }));

    // Para cada ticket (sequencial para evitar race conditions)
    const mintedTickets = [];

    // TODO: Implementar loop ou parallel step
    // Por enquanto, processar apenas o primeiro para demonstração
    if (tickets.length > 0) {
      const ticket = tickets[0];

      // Step 1: Upload metadata para IPFS
      const metadata = uploadMetadataToIPFSStep({
        ticket_id: ticket.id,
        ticket_number: ticket.ticket_number,
        raffle_title: input.raffle_title,
        customer_id: ticket.customer_id,
      });

      // Step 2: Mint NFT
      const nftData = mintNFTStep({
        ticket_id: ticket.id,
        ticket_number: ticket.ticket_number,
        customer_wallet: ticket.customer_wallet,
        metadata_uri: metadata.metadata_uri,
      });

      // Step 3: Atualizar ticket
      updateTicketWithNFTDataStep({
        ticket_id: ticket.id,
        nft_token_id: nftData.nft_token_id,
        nft_transaction_hash: nftData.transaction_hash,
        nft_metadata_uri: metadata.metadata_uri,
      });

      mintedTickets.push({
        ticket_id: ticket.id,
        nft_token_id: nftData.nft_token_id,
      });
    }

    // Step 4: Disparar evento
    emitTicketsMintedEventStep({
      raffle_id: input.raffle_id,
      ticket_ids: input.ticket_ids,
      nft_token_ids: mintedTickets.map((t) => t.nft_token_id),
    });

    return new WorkflowResponse({
      minted_count: mintedTickets.length,
      minted_tickets: mintedTickets,
    });
  }
);
