/**
 * Quick Product Population Script
 * Uses existing categories and creates only products
 */

import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function quickPopulateProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

  logger.info("🚀 Quick Product Population - USE Nerd")

  //  Existing category IDs from database
  const categoryIds = {
    "Camisetas Geek": "pcat_01KA9HE9VB79SSZ2VB80ZFCCMY",
    "Acessórios Tech": "pcat_01KA9HE9VDQE07MSA9QR6VWWHY",
    "Colecionáveis": "pcat_01KA9HE9VE2QDRBA40ZVJZNAH6",
    "Eletrônicos": "pcat_01KA9HE9VF0AV087G1QRQ86K11",
  }

  // Get stock location
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })
  const stockLocation = stockLocations[0]

  // Get shipping profile
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  })
  const shippingProfile = shippingProfiles[0]

  logger.info(`Stock Location: ${stockLocation.id}`)
  logger.info(`Shipping Profile: ${shippingProfile?.id || 'N/A'}`)

  // Helper function
  const getCategory = (name: keyof typeof categoryIds) => categoryIds[name]

  // ============================================
  // Create T-Shirt Products with Variants
  // ============================================
  logger.info("\n👕 Creating t-shirt products...")

  await createProductsWorkflow(container).run({
    input: {
      products: [
        // Product 1: Code is Poetry
        {
          title: 'Camiseta "Code is Poetry"',
          subtitle: "Design minimalista para desenvolvedores",
          description: "Camiseta premium 100% algodão com design minimalista apresentando código em fonte monospace. Ideal para desenvolvedores e programadores que vivem e respiram código.",
          handle: "camiseta-code-is-poetry",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile?.id,
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
        },

        // Product 2: Player One
        {
          title: 'Camiseta "Player One"',
          subtitle: "Para gamers de primeira geração",
          description: "Camiseta de alta qualidade para gamers raiz. Design retrô inspirado nos clássicos dos anos 80 e 90.",
          handle: "camiseta-player-one",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile?.id,
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
        },

        // Product 3: 404 Not Found
        {
          title: 'Camiseta "404 Not Found"',
          subtitle: "Humor nerd para desenvolvedores",
          description: "Camiseta com a mensagem de erro mais famosa da internet. Design criativo e divertido.",
          handle: "camiseta-404-not-found",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile?.id,
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
        },

        // Product 4: Ctrl+Alt+Del
        {
          title: 'Camiseta "Ctrl+Alt+Del"',
          subtitle: "Clássico dos tecladistas",
          description: "A combinação de teclas mais icônica do mundo da informática estampada em uma camiseta premium.",
          handle: "camiseta-ctrl-alt-del",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile?.id,
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
        },

        // Product 5: Binary Code
        {
          title: 'Camiseta "Binary Code"',
          subtitle: "Código binário estilizado",
          description: "Camiseta exclusiva com código binário estilizado em design cyberpunk futurista.",
          handle: "camiseta-binary-code",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile?.id,
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
        },

        // Simple Products
        { title: "Mouse Gamer RGB", subtitle: "Precisão e estilo", description: "Mouse gamer de alta performance com iluminação RGB customizável.", handle: "mouse-gamer-rgb", status: ProductStatus.PUBLISHED, shipping_profile_id: shippingProfile?.id, category_ids: [getCategory("Acessórios Tech")], options: [{ title: "Tipo", values: ["Padrão"] }], variants: [{ title: "Padrão", sku: "MOUSE-RGB-001", options: { Tipo: "Padrão" }, prices: [{ amount: 15990, currency_code: "brl" }] }] },
        { title: "Teclado Mecânico", subtitle: "Switch blue", description: "Teclado mecânico profissional com switches blue clicky.", handle: "teclado-mecanico", status: ProductStatus.PUBLISHED, shipping_profile_id: shippingProfile?.id, category_ids: [getCategory("Acessórios Tech")], options: [{ title: "Tipo", values: ["Padrão"] }], variants: [{ title: "Padrão", sku: "KEYB-MECH-001", options: { Tipo: "Padrão" }, prices: [{ amount: 34990, currency_code: "brl" }] }] },
        { title: "Headset Gamer", subtitle: "Som 7.1 surround", description: "Headset gamer premium com áudio surround 7.1 virtual.", handle: "headset-gamer", status: ProductStatus.PUBLISHED, shipping_profile_id: shippingProfile?.id, category_ids: [getCategory("Acessórios Tech")], options: [{ title: "Tipo", values: ["Padrão"] }], variants: [{ title: "Padrão", sku: "HEAD-GAM-001", options: { Tipo: "Padrão" }, prices: [{ amount: 29990, currency_code: "brl" }] }] },
        { title: "Mousepad XXL", subtitle: "Superfície premium", description: "Mousepad gamer extra grande (900x400mm).", handle: "mousepad-xxl", status: ProductStatus.PUBLISHED, shipping_profile_id: shippingProfile?.id, category_ids: [getCategory("Acessórios Tech")], options: [{ title: "Tipo", values: ["Padrão"] }], variants: [{ title: "Padrão", sku: "MPAD-XXL-001", options: { Tipo: "Padrão" }, prices: [{ amount: 7990, currency_code: "brl" }] }] },
        { title: "Action Figure Cyberpunk", subtitle: "Edição limitada", description: "Action figure de luxo com 30 pontos de articulação.", handle: "action-figure-cyberpunk", status: ProductStatus.PUBLISHED, shipping_profile_id: shippingProfile?.id, category_ids: [getCategory("Colecionáveis")], options: [{ title: "Tipo", values: ["Padrão"] }], variants: [{ title: "Padrão", sku: "ACFG-CYB-001", options: { Tipo: "Padrão" }, prices: [{ amount: 24990, currency_code: "brl" }] }] },
        { title: "Funko Pop Gamer", subtitle: "Personagem icônico", description: "Funko Pop oficial de personagem gamer clássico.", handle: "funko-pop-gamer", status: ProductStatus.PUBLISHED, shipping_profile_id: shippingProfile?.id, category_ids: [getCategory("Colecionáveis")], options: [{ title: "Tipo", values: ["Padrão"] }], variants: [{ title: "Padrão", sku: "FUNK-GAM-001", options: { Tipo: "Padrão" }, prices: [{ amount: 12990, currency_code: "brl" }] }] },
        { title: 'Caneca "Coffee & Code"', subtitle: "Combustível dos programadores", description: "Caneca de cerâmica premium com capacidade de 325ml.", handle: "caneca-coffee-and-code", status: ProductStatus.PUBLISHED, shipping_profile_id: shippingProfile?.id, category_ids: [getCategory("Colecionáveis")], options: [{ title: "Tipo", values: ["Padrão"] }], variants: [{ title: "Padrão", sku: "CANE-COF-001", options: { Tipo: "Padrão" }, prices: [{ amount: 3990, currency_code: "brl" }] }] },
        { title: "Adesivos Pack Geek", subtitle: "30 adesivos premium", description: "Pack com 30 adesivos temáticos geek/nerd de alta qualidade.", handle: "adesivos-pack-geek", status: ProductStatus.PUBLISHED, shipping_profile_id: shippingProfile?.id, category_ids: [getCategory("Colecionáveis")], options: [{ title: "Tipo", values: ["Padrão"] }], variants: [{ title: "Padrão", sku: "ADES-PCK-001", options: { Tipo: "Padrão" }, prices: [{ amount: 2490, currency_code: "brl" }] }] },
        { title: "LED Strip RGB", subtitle: "5 metros de iluminação", description: "Fita LED RGB de 5 metros com controle remoto e app.", handle: "led-strip-rgb", status: ProductStatus.PUBLISHED, shipping_profile_id: shippingProfile?.id, category_ids: [getCategory("Eletrônicos")], options: [{ title: "Tipo", values: ["Padrão"] }], variants: [{ title: "Padrão", sku: "LED-RGB-001", options: { Tipo: "Padrão" }, prices: [{ amount: 8990, currency_code: "brl" }] }] },
        { title: "Webcam Full HD", subtitle: "1080p 60fps para streaming", description: "Webcam Full HD profissional com resolução 1080p @ 60fps.", handle: "webcam-full-hd", status: ProductStatus.PUBLISHED, shipping_profile_id: shippingProfile?.id, category_ids: [getCategory("Eletrônicos")], options: [{ title: "Tipo", values: ["Padrão"] }], variants: [{ title: "Padrão", sku: "WEBC-FHD-001", options: { Tipo: "Padrão" }, prices: [{ amount: 39990, currency_code: "brl" }] }] },
      ],
    },
  })

  logger.info("✅ Created 15 products (5 t-shirts + 10 simple)")

  // ============================================
  // Create Inventory Levels
  // ============================================
  logger.info("\n📦 Creating inventory levels...")

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })

  const inventoryLevels = inventoryItems.map((item: any) => ({
    location_id: stockLocation.id,
    stocked_quantity: 100,
    inventory_item_id: item.id,
  }))

  await createInventoryLevelsWorkflow(container).run({
    input: { inventory_levels: inventoryLevels },
  })

  logger.info(`✅ Created ${inventoryLevels.length} inventory levels`)

  // ============================================
  // Summary
  // ============================================
  logger.info("\n" + "=".repeat(60))
  logger.info("🎉 CATALOG POPULATION COMPLETE!")
  logger.info("=".repeat(60))
  logger.info("\n📊 Summary:")
  logger.info("  ✅ T-shirt products: 5 (60 variants)")
  logger.info("  ✅ Simple products: 10")
  logger.info("  ✅ Total products: 15")
  logger.info("  ✅ Total variants: 70")
  logger.info("  ✅ Inventory levels: " + inventoryLevels.length)
  logger.info("\n💰 All prices are in BRL (Brazilian Real)")
  logger.info("✨ Your USE Nerd catalog is ready!")
}
