/**
 * ============================================
 * USE Nerd - Product Catalog Population Script
 * ============================================
 * FASE 3: Populate Medusa with Categories & Products
 * Date: 2025-11-17
 * Uses Medusa v2 Workflows for proper data creation
 * ============================================
 */

import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createStockLocationsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function populateUseNerdCatalog({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

  logger.info("🚀 Starting USE Nerd catalog population...")

  // ============================================
  // STEP 1: Get existing data
  // ============================================
  logger.info("📦 Step 1: Getting existing configuration...")

  const brasilSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Brasil - Loja Principal",
  }).then(channels => channels[0])

  if (!brasilSalesChannel) {
    throw new Error("Brasil sales channel not found!")
  }

  // Get stock location
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })

  let stockLocation = stockLocations.find((loc: any) =>
    loc.name.includes("Brasil") || loc.name.includes("São Paulo")
  )

  if (!stockLocation) {
    logger.info("Creating stock location...")
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "Armazém Brasil - São Paulo",
            address: {
              city: "São Paulo",
              country_code: "BR",
              address_1: "Rua Exemplo, 123",
              province: "SP",
              postal_code: "01310-100",
            },
          },
        ],
      },
    })
    stockLocation = stockLocationResult[0]
  }

  // Get shipping profile (optional - create if doesn't exist)
  let shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  })
  let shippingProfile = shippingProfiles[0]

  if (!shippingProfile) {
    logger.info("No default shipping profile found. Products will be created without shipping profile.")
    shippingProfile = null as any // Will be omitted from product creation
  }

  logger.info("✅ Found configuration:")
  logger.info(`   Sales Channel: ${brasilSalesChannel.id}`)
  logger.info(`   Stock Location: ${stockLocation.id}`)
  logger.info(`   Shipping Profile: ${shippingProfile?.id || 'N/A'}`)

  // ============================================
  // STEP 2: Create Product Categories (or get existing)
  // ============================================
  logger.info("\n📂 Step 2: Setting up product categories...")

  const productModuleService = container.resolve(Modules.PRODUCT)

  const categoriesToCreate = [
    {
      name: "Camisetas Geek",
      handle: "camisetas-geek",
      description: "Camisetas exclusivas com designs inspirados em games, filmes e séries",
      is_active: true,
    },
    {
      name: "Acessórios Tech",
      handle: "acessorios-tech",
      description: "Periféricos e acessórios para gamers e entusiastas de tecnologia",
      is_active: true,
    },
    {
      name: "Colecionáveis",
      handle: "colecionaveis",
      description: "Action figures, Funko Pops e itens de coleção para verdadeiros nerds",
      is_active: true,
    },
    {
      name: "Eletrônicos",
      handle: "eletronicos",
      description: "Gadgets, eletrônicos e dispositivos tech para o seu setup",
      is_active: true,
    },
  ]

  let categoryResult: any[] = []

  // Check for existing categories first
  for (const cat of categoriesToCreate) {
    const existing = await productModuleService.listProductCategories({
      handle: cat.handle,
    })
    if (existing.length > 0) {
      logger.info(`  ✓ Category already exists: ${cat.name}`)
      categoryResult.push(existing[0])
    }
  }

  // Create only new categories
  const existingHandles = categoryResult.map((c: any) => c.handle)
  const newCategories = categoriesToCreate.filter(c => !existingHandles.includes(c.handle))

  if (newCategories.length > 0) {
    const { result: newCats } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: { product_categories: newCategories },
    })
    categoryResult.push(...newCats)
    logger.info(`✅ Created ${newCats.length} new categories`)
  } else {
    logger.info(`✅ All categories already exist`)
  }

  logger.info(`✅ Total categories available: ${categoryResult.length}`)

  // Helper function to find category
  const getCategory = (name: string) =>
    categoryResult.find((cat) => cat.name === name)!.id

  // ============================================
  // STEP 3: Create T-Shirt Products with Variants
  // ============================================
  logger.info("\n👕 Step 3: Creating t-shirt products with variants...")

  await createProductsWorkflow(container).run({
    input: {
      products: [
        // Product 1: Code is Poetry
        {
          title: 'Camiseta "Code is Poetry"',
          subtitle: "Design minimalista para desenvolvedores",
          description: "Camiseta premium 100% algodão com design minimalista apresentando código em fonte monospace. Ideal para desenvolvedores e programadores que vivem e respiram código. Impressão de alta qualidade que não desbota. Confortável para o dia a dia no escritório ou home office. Disponível em várias cores e tamanhos.",
          handle: "camiseta-code-is-poetry",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Camisetas Geek")],
          options: [
            { title: "Tamanho", values: ["P", "M", "G", "GG"] },
            { title: "Cor", values: ["Preto", "Branco", "Azul Marinho"] },
          ],
          variants: [
            { title: "P - Preto", sku: "TSHIRT-CIP-P-BLK", options: { Tamanho: "P", Cor: "Preto" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "M - Preto", sku: "TSHIRT-CIP-M-BLK", options: { Tamanho: "M", Cor: "Preto" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "G - Preto", sku: "TSHIRT-CIP-G-BLK", options: { Tamanho: "G", Cor: "Preto" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "GG - Preto", sku: "TSHIRT-CIP-GG-BLK", options: { Tamanho: "GG", Cor: "Preto" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "P - Branco", sku: "TSHIRT-CIP-P-WHT", options: { Tamanho: "P", Cor: "Branco" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "M - Branco", sku: "TSHIRT-CIP-M-WHT", options: { Tamanho: "M", Cor: "Branco" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "G - Branco", sku: "TSHIRT-CIP-G-WHT", options: { Tamanho: "G", Cor: "Branco" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "GG - Branco", sku: "TSHIRT-CIP-GG-WHT", options: { Tamanho: "GG", Cor: "Branco" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "P - Azul Marinho", sku: "TSHIRT-CIP-P-NVY", options: { Tamanho: "P", Cor: "Azul Marinho" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "M - Azul Marinho", sku: "TSHIRT-CIP-M-NVY", options: { Tamanho: "M", Cor: "Azul Marinho" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "G - Azul Marinho", sku: "TSHIRT-CIP-G-NVY", options: { Tamanho: "G", Cor: "Azul Marinho" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "GG - Azul Marinho", sku: "TSHIRT-CIP-GG-NVY", options: { Tamanho: "GG", Cor: "Azul Marinho" }, prices: [{ amount: 8990, currency_code: "brl" }] },
          ],
          // sales_channels: removed - link manually later
        },

        // Product 2: Player One
        {
          title: 'Camiseta "Player One"',
          subtitle: "Para gamers de primeira geração",
          description: "Camiseta de alta qualidade para gamers raiz. Design retrô inspirado nos clássicos dos anos 80 e 90. Malha premium que proporciona conforto durante longas sessões de jogo. Estampa durável e cores vibrantes. Perfeita para LAN parties, eventos geek e uso casual. Mostre ao mundo que você é o Player One!",
          handle: "camiseta-player-one",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Camisetas Geek")],
          options: [
            { title: "Tamanho", values: ["P", "M", "G", "GG"] },
            { title: "Cor", values: ["Preto", "Vermelho", "Cinza"] },
          ],
          variants: [
            { title: "P - Preto", sku: "TSHIRT-PLR-P-BLK", options: { Tamanho: "P", Cor: "Preto" }, prices: [{ amount: 7990, currency_code: "brl" }] },
            { title: "M - Preto", sku: "TSHIRT-PLR-M-BLK", options: { Tamanho: "M", Cor: "Preto" }, prices: [{ amount: 7990, currency_code: "brl" }] },
            { title: "G - Preto", sku: "TSHIRT-PLR-G-BLK", options: { Tamanho: "G", Cor: "Preto" }, prices: [{ amount: 7990, currency_code: "brl" }] },
            { title: "GG - Preto", sku: "TSHIRT-PLR-GG-BLK", options: { Tamanho: "GG", Cor: "Preto" }, prices: [{ amount: 7990, currency_code: "brl" }] },
            { title: "P - Vermelho", sku: "TSHIRT-PLR-P-RED", options: { Tamanho: "P", Cor: "Vermelho" }, prices: [{ amount: 7990, currency_code: "brl" }] },
            { title: "M - Vermelho", sku: "TSHIRT-PLR-M-RED", options: { Tamanho: "M", Cor: "Vermelho" }, prices: [{ amount: 7990, currency_code: "brl" }] },
            { title: "G - Vermelho", sku: "TSHIRT-PLR-G-RED", options: { Tamanho: "G", Cor: "Vermelho" }, prices: [{ amount: 7990, currency_code: "brl" }] },
            { title: "GG - Vermelho", sku: "TSHIRT-PLR-GG-RED", options: { Tamanho: "GG", Cor: "Vermelho" }, prices: [{ amount: 7990, currency_code: "brl" }] },
            { title: "P - Cinza", sku: "TSHIRT-PLR-P-GRY", options: { Tamanho: "P", Cor: "Cinza" }, prices: [{ amount: 7990, currency_code: "brl" }] },
            { title: "M - Cinza", sku: "TSHIRT-PLR-M-GRY", options: { Tamanho: "M", Cor: "Cinza" }, prices: [{ amount: 7990, currency_code: "brl" }] },
            { title: "G - Cinza", sku: "TSHIRT-PLR-G-GRY", options: { Tamanho: "G", Cor: "Cinza" }, prices: [{ amount: 7990, currency_code: "brl" }] },
            { title: "GG - Cinza", sku: "TSHIRT-PLR-GG-GRY", options: { Tamanho: "GG", Cor: "Cinza" }, prices: [{ amount: 7990, currency_code: "brl" }] },
          ],
          // sales_channels: removed - link manually later
        },

        // Product 3: 404 Not Found
        {
          title: 'Camiseta "404 Not Found"',
          subtitle: "Humor nerd para desenvolvedores",
          description: "Camiseta com a mensagem de erro mais famosa da internet: 404 Not Found. Design criativo e divertido para desenvolvedores web com senso de humor. Material confortável e respirável, perfeito para o dia a dia. Impressão de qualidade superior que resiste a lavagens. Uma ótima forma de expressar sua paixão pela tecnologia com estilo.",
          handle: "camiseta-404-not-found",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Camisetas Geek")],
          options: [
            { title: "Tamanho", values: ["P", "M", "G", "GG"] },
            { title: "Cor", values: ["Preto", "Branco"] },
          ],
          variants: [
            { title: "P - Preto", sku: "TSHIRT-404-P-BLK", options: { Tamanho: "P", Cor: "Preto" }, prices: [{ amount: 8490, currency_code: "brl" }] },
            { title: "M - Preto", sku: "TSHIRT-404-M-BLK", options: { Tamanho: "M", Cor: "Preto" }, prices: [{ amount: 8490, currency_code: "brl" }] },
            { title: "G - Preto", sku: "TSHIRT-404-G-BLK", options: { Tamanho: "G", Cor: "Preto" }, prices: [{ amount: 8490, currency_code: "brl" }] },
            { title: "GG - Preto", sku: "TSHIRT-404-GG-BLK", options: { Tamanho: "GG", Cor: "Preto" }, prices: [{ amount: 8490, currency_code: "brl" }] },
            { title: "P - Branco", sku: "TSHIRT-404-P-WHT", options: { Tamanho: "P", Cor: "Branco" }, prices: [{ amount: 8490, currency_code: "brl" }] },
            { title: "M - Branco", sku: "TSHIRT-404-M-WHT", options: { Tamanho: "M", Cor: "Branco" }, prices: [{ amount: 8490, currency_code: "brl" }] },
            { title: "G - Branco", sku: "TSHIRT-404-G-WHT", options: { Tamanho: "G", Cor: "Branco" }, prices: [{ amount: 8490, currency_code: "brl" }] },
            { title: "GG - Branco", sku: "TSHIRT-404-GG-WHT", options: { Tamanho: "GG", Cor: "Branco" }, prices: [{ amount: 8490, currency_code: "brl" }] },
          ],
          // sales_channels: removed - link manually later
        },

        // Product 4: Ctrl+Alt+Del
        {
          title: 'Camiseta "Ctrl+Alt+Del"',
          subtitle: "Clássico dos tecladistas",
          description: "A combinação de teclas mais icônica do mundo da informática estampada em uma camiseta premium. Ideal para administradores de sistemas, técnicos de TI e entusiastas. 100% algodão de alta qualidade com acabamento impecável. Design minimalista e moderno. Conforto garantido para o dia inteiro. Mostre que você domina os atalhos!",
          handle: "camiseta-ctrl-alt-del",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Camisetas Geek")],
          options: [
            { title: "Tamanho", values: ["P", "M", "G", "GG"] },
            { title: "Cor", values: ["Preto", "Azul", "Branco"] },
          ],
          variants: [
            { title: "P - Preto", sku: "TSHIRT-CAD-P-BLK", options: { Tamanho: "P", Cor: "Preto" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "M - Preto", sku: "TSHIRT-CAD-M-BLK", options: { Tamanho: "M", Cor: "Preto" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "G - Preto", sku: "TSHIRT-CAD-G-BLK", options: { Tamanho: "G", Cor: "Preto" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "GG - Preto", sku: "TSHIRT-CAD-GG-BLK", options: { Tamanho: "GG", Cor: "Preto" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "P - Azul", sku: "TSHIRT-CAD-P-BLU", options: { Tamanho: "P", Cor: "Azul" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "M - Azul", sku: "TSHIRT-CAD-M-BLU", options: { Tamanho: "M", Cor: "Azul" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "G - Azul", sku: "TSHIRT-CAD-G-BLU", options: { Tamanho: "G", Cor: "Azul" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "GG - Azul", sku: "TSHIRT-CAD-GG-BLU", options: { Tamanho: "GG", Cor: "Azul" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "P - Branco", sku: "TSHIRT-CAD-P-WHT", options: { Tamanho: "P", Cor: "Branco" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "M - Branco", sku: "TSHIRT-CAD-M-WHT", options: { Tamanho: "M", Cor: "Branco" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "G - Branco", sku: "TSHIRT-CAD-G-WHT", options: { Tamanho: "G", Cor: "Branco" }, prices: [{ amount: 8990, currency_code: "brl" }] },
            { title: "GG - Branco", sku: "TSHIRT-CAD-GG-WHT", options: { Tamanho: "GG", Cor: "Branco" }, prices: [{ amount: 8990, currency_code: "brl" }] },
          ],
          // sales_channels: removed - link manually later
        },

        // Product 5: Binary Code
        {
          title: 'Camiseta "Binary Code"',
          subtitle: "Código binário estilizado",
          description: "Camiseta exclusiva com código binário estilizado em design cyberpunk futurista. Para quem pensa em 0s e 1s. Malha premium com tecnologia de impressão digital que garante cores vibrantes e duradouras. Corte moderno e confortável. Perfeita para eventos tech, hackathons ou uso casual. Edição limitada com design único.",
          handle: "camiseta-binary-code",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Camisetas Geek")],
          options: [
            { title: "Tamanho", values: ["P", "M", "G", "GG"] },
            { title: "Cor", values: ["Preto", "Verde Neon", "Roxo"] },
          ],
          variants: [
            { title: "P - Preto", sku: "TSHIRT-BIN-P-BLK", options: { Tamanho: "P", Cor: "Preto" }, prices: [{ amount: 9490, currency_code: "brl" }] },
            { title: "M - Preto", sku: "TSHIRT-BIN-M-BLK", options: { Tamanho: "M", Cor: "Preto" }, prices: [{ amount: 9490, currency_code: "brl" }] },
            { title: "G - Preto", sku: "TSHIRT-BIN-G-BLK", options: { Tamanho: "G", Cor: "Preto" }, prices: [{ amount: 9490, currency_code: "brl" }] },
            { title: "GG - Preto", sku: "TSHIRT-BIN-GG-BLK", options: { Tamanho: "GG", Cor: "Preto" }, prices: [{ amount: 9490, currency_code: "brl" }] },
            { title: "P - Verde Neon", sku: "TSHIRT-BIN-P-NGR", options: { Tamanho: "P", Cor: "Verde Neon" }, prices: [{ amount: 9490, currency_code: "brl" }] },
            { title: "M - Verde Neon", sku: "TSHIRT-BIN-M-NGR", options: { Tamanho: "M", Cor: "Verde Neon" }, prices: [{ amount: 9490, currency_code: "brl" }] },
            { title: "G - Verde Neon", sku: "TSHIRT-BIN-G-NGR", options: { Tamanho: "G", Cor: "Verde Neon" }, prices: [{ amount: 9490, currency_code: "brl" }] },
            { title: "GG - Verde Neon", sku: "TSHIRT-BIN-GG-NGR", options: { Tamanho: "GG", Cor: "Verde Neon" }, prices: [{ amount: 9490, currency_code: "brl" }] },
            { title: "P - Roxo", sku: "TSHIRT-BIN-P-PRP", options: { Tamanho: "P", Cor: "Roxo" }, prices: [{ amount: 9490, currency_code: "brl" }] },
            { title: "M - Roxo", sku: "TSHIRT-BIN-M-PRP", options: { Tamanho: "M", Cor: "Roxo" }, prices: [{ amount: 9490, currency_code: "brl" }] },
            { title: "G - Roxo", sku: "TSHIRT-BIN-G-PRP", options: { Tamanho: "G", Cor: "Roxo" }, prices: [{ amount: 9490, currency_code: "brl" }] },
            { title: "GG - Roxo", sku: "TSHIRT-BIN-GG-PRP", options: { Tamanho: "GG", Cor: "Roxo" }, prices: [{ amount: 9490, currency_code: "brl" }] },
          ],
          // sales_channels: removed - link manually later
        },
      ],
    },
  })

  logger.info("✅ Created 5 t-shirt products with variants (60 total variants)")

  // ============================================
  // STEP 4: Create Simple Products
  // ============================================
  logger.info("\n🛍️  Step 4: Creating simple products...")

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Mouse Gamer RGB",
          subtitle: "Precisão e estilo para gamers",
          description: "Mouse gamer de alta performance com iluminação RGB customizável. Sensor óptico de 12.000 DPI ajustável, 7 botões programáveis e design ergonômico. Cabo trançado resistente e pés deslizantes em teflon para máxima precisão. Software completo para personalização de macros e perfis. Compatível com Windows e Mac.",
          handle: "mouse-gamer-rgb",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Acessórios Tech")],
          variants: [{ title: "Default", sku: "MOUSE-RGB-001", prices: [{ amount: 15990, currency_code: "brl" }] }],
          // sales_channels: removed - link manually later
        },
        {
          title: "Teclado Mecânico",
          subtitle: "Switch blue para performance máxima",
          description: "Teclado mecânico profissional com switches blue clicky. Construção em alumínio premium, iluminação RGB por tecla, cabo USB-C destacável e keycaps PBT resistentes. Anti-ghosting completo e N-key rollover. Inclui descanso para pulso e ferramenta para troca de teclas. Layout ABNT2 brasileiro.",
          handle: "teclado-mecanico",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Acessórios Tech")],
          variants: [{ title: "Default", sku: "KEYB-MECH-001", prices: [{ amount: 34990, currency_code: "brl" }] }],
          // sales_channels: removed - link manually later
        },
        {
          title: "Headset Gamer",
          subtitle: "Som imersivo 7.1 surround",
          description: "Headset gamer premium com áudio surround 7.1 virtual. Drivers de 50mm para graves profundos, microfone removível com cancelamento de ruído e almofadas em memory foam para conforto prolongado. Controles de volume e mute no fone. Iluminação RGB sincronizável. Compatível com PC, PS4, PS5, Xbox e Switch.",
          handle: "headset-gamer",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Acessórios Tech")],
          variants: [{ title: "Default", sku: "HEAD-GAM-001", prices: [{ amount: 29990, currency_code: "brl" }] }],
          // sales_channels: removed - link manually later
        },
        {
          title: "Mousepad XXL",
          subtitle: "Superfície premium tamanho estendido",
          description: "Mousepad gamer extra grande (900x400mm) com superfície de tecido premium de alta densidade. Base antiderrapante em borracha natural, bordas costuradas para maior durabilidade e espessura de 3mm para conforto ideal. Design minimalista que combina com qualquer setup. Fácil de limpar e manter.",
          handle: "mousepad-xxl",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Acessórios Tech")],
          variants: [{ title: "Default", sku: "MPAD-XXL-001", prices: [{ amount: 7990, currency_code: "brl" }] }],
          // sales_channels: removed - link manually later
        },
        {
          title: "Action Figure Cyberpunk",
          subtitle: "Edição limitada colecionável",
          description: "Action figure de luxo com 30 pontos de articulação e acabamento premium. Inspirado no universo cyberpunk com detalhes meticulosos pintados à mão. Inclui 3 armas intercambiáveis, 2 pares de mãos extras e base de exposição iluminada por LED. Altura: 18cm. Caixa especial de colecionador com janela acrílica. Edição numerada limitada a 5000 unidades.",
          handle: "action-figure-cyberpunk",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Colecionáveis")],
          variants: [{ title: "Default", sku: "ACFG-CYB-001", prices: [{ amount: 24990, currency_code: "brl" }] }],
          // sales_channels: removed - link manually later
        },
        {
          title: "Funko Pop Gamer",
          subtitle: "Personagem icônico do mundo gamer",
          description: "Funko Pop oficial de personagem gamer clássico. Aproximadamente 9cm de altura, feito em vinil de alta qualidade com pintura detalhada. Vem em caixa com janela para exibição. Perfeito para colecionadores e fãs de cultura pop. Produto oficial licenciado com certificado de autenticidade. Excelente presente para gamers e nerds.",
          handle: "funko-pop-gamer",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Colecionáveis")],
          variants: [{ title: "Default", sku: "FUNK-GAM-001", prices: [{ amount: 12990, currency_code: "brl" }] }],
          // sales_channels: removed - link manually later
        },
        {
          title: 'Caneca "Coffee & Code"',
          subtitle: "Combustível oficial dos programadores",
          description: "Caneca de cerâmica premium com capacidade de 325ml. Estampa durável com a frase 'Coffee & Code' em design minimalista. Pode ir ao microondas e lava-louças. Interior branco e acabamento externo em cores vibrantes. Presente perfeito para desenvolvedores, programadores e entusiastas de tecnologia. Qualidade de impressão superior resistente ao uso diário.",
          handle: "caneca-coffee-and-code",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Colecionáveis")],
          variants: [{ title: "Default", sku: "CANE-COF-001", prices: [{ amount: 3990, currency_code: "brl" }] }],
          // sales_channels: removed - link manually later
        },
        {
          title: "Adesivos Pack Geek",
          subtitle: "30 adesivos premium",
          description: "Pack com 30 adesivos temáticos geek/nerd de alta qualidade. Designs exclusivos de games, programação, sci-fi e cultura pop. Material vinílico resistente à água e UV, perfeitos para notebooks, tablets, garrafas, skates e mais. Tamanhos variados de 5 a 10cm. Fácil aplicação e remoção sem deixar resíduos. Cores vibrantes e impressão de alta resolução.",
          handle: "adesivos-pack-geek",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Colecionáveis")],
          variants: [{ title: "Default", sku: "ADES-PCK-001", prices: [{ amount: 2490, currency_code: "brl" }] }],
          // sales_channels: removed - link manually later
        },
        {
          title: "LED Strip RGB",
          subtitle: "5 metros de iluminação inteligente",
          description: "Fita LED RGB de 5 metros com controle remoto e app para smartphone. 16 milhões de cores, múltiplos modos de animação e sincronização com música. Adesivo 3M de alta qualidade para fácil instalação. Fonte bivolt automática incluída. Controlador WiFi compatível com Alexa e Google Home. Perfeita para iluminar setup gamer, quarto, sala ou home theater. Baixo consumo de energia.",
          handle: "led-strip-rgb",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Eletrônicos")],
          variants: [{ title: "Default", sku: "LED-RGB-001", prices: [{ amount: 8990, currency_code: "brl" }] }],
          // sales_channels: removed - link manually later
        },
        {
          title: "Webcam Full HD",
          subtitle: "1080p 60fps para streaming",
          description: "Webcam Full HD profissional com resolução 1080p @ 60fps. Autofoco rápido e preciso, microfone stereo integrado com redução de ruído e lente de vidro premium com amplo campo de visão (90°). Clip universal ajustável para monitores e tripés. Plug and play USB 2.0, sem necessidade de drivers. Perfeita para streaming, videoconferências, aulas online e chamadas profissionais. Compatível com OBS, Zoom, Teams e mais.",
          handle: "webcam-full-hd",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [getCategory("Eletrônicos")],
          variants: [{ title: "Default", sku: "WEBC-FHD-001", prices: [{ amount: 39990, currency_code: "brl" }] }],
          // sales_channels: removed - link manually later
        },
      ],
    },
  })

  logger.info("✅ Created 10 simple products")

  // ============================================
  // STEP 5: Create Inventory Levels
  // ============================================
  logger.info("\n📦 Step 5: Creating inventory levels...")

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })

  const inventoryLevels = inventoryItems.map((item: any) => ({
    location_id: stockLocation.id,
    stocked_quantity: 100, // Default stock quantity
    inventory_item_id: item.id,
  }))

  await createInventoryLevelsWorkflow(container).run({
    input: { inventory_levels: inventoryLevels },
  })

  logger.info(`✅ Created ${inventoryLevels.length} inventory levels`)

  // ============================================
  // STEP 6: Summary
  // ============================================
  logger.info("\n" + "=".repeat(60))
  logger.info("🎉 CATALOG POPULATION COMPLETE!")
  logger.info("=".repeat(60))
  logger.info("\n📊 Summary:")
  logger.info("  ✅ Categories: 4")
  logger.info("  ✅ T-shirt products: 5 (60 variants)")
  logger.info("  ✅ Simple products: 10")
  logger.info("  ✅ Total products: 15")
  logger.info("  ✅ Total variants: 70")
  logger.info("  ✅ Inventory levels: " + inventoryLevels.length)
  logger.info("\n🏪 All products are linked to: Brasil - Loja Principal")
  logger.info("💰 All prices are in BRL (Brazilian Real)")
  logger.info("\n✨ Your USE Nerd catalog is ready to rock!")
}
