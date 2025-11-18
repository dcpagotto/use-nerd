/**
 * ============================================
 * USE Nerd - Product Catalog Population Script
 * ============================================
 * FASE 3: Populate Medusa with Categories & Products
 * Date: 2025-11-17
 * ============================================
 */

import { MedusaApp, Modules } from "@medusajs/framework/utils"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

interface ProductVariantData {
  title: string
  sku: string
  options: Record<string, string>
  inventory_quantity: number
  price: number
}

interface TShirtProduct {
  title: string
  subtitle: string
  description: string
  handle: string
  price: number
  sizes: string[]
  colors: string[]
  skuPrefix: string
}

async function populateCatalog() {
  const { container } = await MedusaApp({
    workerMode: "server",
  })

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  // Resolve services
  const productModuleService = container.resolve(Modules.PRODUCT)
  const pricingModuleService = container.resolve(Modules.PRICING)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION)
  const inventoryModuleService = container.resolve(Modules.INVENTORY)
  const regionModuleService = container.resolve(Modules.REGION)

  console.log("🚀 Starting USE Nerd catalog population...")

  try {
    // ============================================
    // STEP 1: Get or Create Stock Location
    // ============================================
    console.log("\n📦 Step 1: Setting up stock location...")

    let stockLocation = await stockLocationModuleService.listStockLocations({
      name: "Armazém Brasil - São Paulo"
    }).then(locations => locations[0])

    if (!stockLocation) {
      stockLocation = await stockLocationModuleService.createStockLocations({
        name: "Armazém Brasil - São Paulo"
      })
      console.log("✅ Created stock location:", stockLocation.id)
    } else {
      console.log("✅ Using existing stock location:", stockLocation.id)
    }

    // ============================================
    // STEP 2: Get Region Brasil
    // ============================================
    console.log("\n🌎 Step 2: Getting Brasil region...")

    const brasilRegion = await regionModuleService.listRegions({
      currency_code: "brl"
    }).then(regions => regions[0])

    if (!brasilRegion) {
      throw new Error("Brasil region not found! Please create it first.")
    }
    console.log("✅ Found Brasil region:", brasilRegion.id)

    // ============================================
    // STEP 3: Get Sales Channel
    // ============================================
    console.log("\n🏪 Step 3: Getting sales channel...")

    const salesChannel = await salesChannelModuleService.listSalesChannels({
      name: "Brasil - Loja Principal"
    }).then(channels => channels[0])

    if (!salesChannel) {
      throw new Error("Brasil sales channel not found!")
    }
    console.log("✅ Found sales channel:", salesChannel.id)

    // ============================================
    // STEP 4: Create Product Categories
    // ============================================
    console.log("\n📂 Step 4: Creating product categories...")

    const categories = [
      {
        name: "Camisetas Geek",
        handle: "camisetas-geek",
        description: "Camisetas exclusivas com designs inspirados em games, filmes e séries",
        is_active: true,
        is_internal: false,
        rank: 1
      },
      {
        name: "Acessórios Tech",
        handle: "acessorios-tech",
        description: "Periféricos e acessórios para gamers e entusiastas de tecnologia",
        is_active: true,
        is_internal: false,
        rank: 2
      },
      {
        name: "Colecionáveis",
        handle: "colecionaveis",
        description: "Action figures, Funko Pops e itens de coleção para verdadeiros nerds",
        is_active: true,
        is_internal: false,
        rank: 3
      },
      {
        name: "Eletrônicos",
        handle: "eletronicos",
        description: "Gadgets, eletrônicos e dispositivos tech para o seu setup",
        is_active: true,
        is_internal: false,
        rank: 4
      }
    ]

    const createdCategories: any[] = []
    for (const category of categories) {
      const existing = await productModuleService.listProductCategories({
        handle: category.handle
      }).then(cats => cats[0])

      if (existing) {
        console.log(`✅ Category already exists: ${category.name}`)
        createdCategories.push(existing)
      } else {
        const created = await productModuleService.createProductCategories(category)
        console.log(`✅ Created category: ${category.name} (${created.id})`)
        createdCategories.push(created)
      }
    }

    // ============================================
    // STEP 5: Create T-Shirt Products with Variants
    // ============================================
    console.log("\n👕 Step 5: Creating t-shirt products with variants...")

    const tshirts: TShirtProduct[] = [
      {
        title: 'Camiseta "Code is Poetry"',
        subtitle: "Design minimalista para desenvolvedores",
        description: "Camiseta premium 100% algodão com design minimalista apresentando código em fonte monospace. Ideal para desenvolvedores e programadores que vivem e respiram código. Impressão de alta qualidade que não desbota. Confortável para o dia a dia no escritório ou home office. Disponível em várias cores e tamanhos.",
        handle: "camiseta-code-is-poetry",
        price: 8990, // R$ 89,90 in cents
        sizes: ["P", "M", "G", "GG"],
        colors: ["Preto", "Branco", "Azul Marinho"],
        skuPrefix: "TSHIRT-CIP"
      },
      {
        title: 'Camiseta "Player One"',
        subtitle: "Para gamers de primeira geração",
        description: "Camiseta de alta qualidade para gamers raiz. Design retrô inspirado nos clássicos dos anos 80 e 90. Malha premium que proporciona conforto durante longas sessões de jogo. Estampa durável e cores vibrantes. Perfeita para LAN parties, eventos geek e uso casual. Mostre ao mundo que você é o Player One!",
        handle: "camiseta-player-one",
        price: 7990, // R$ 79,90
        sizes: ["P", "M", "G", "GG"],
        colors: ["Preto", "Vermelho", "Cinza"],
        skuPrefix: "TSHIRT-PLR"
      },
      {
        title: 'Camiseta "404 Not Found"',
        subtitle: "Humor nerd para desenvolvedores",
        description: "Camiseta com a mensagem de erro mais famosa da internet: 404 Not Found. Design criativo e divertido para desenvolvedores web com senso de humor. Material confortável e respirável, perfeito para o dia a dia. Impressão de qualidade superior que resiste a lavagens. Uma ótima forma de expressar sua paixão pela tecnologia com estilo.",
        handle: "camiseta-404-not-found",
        price: 8490, // R$ 84,90
        sizes: ["P", "M", "G", "GG"],
        colors: ["Preto", "Branco"],
        skuPrefix: "TSHIRT-404"
      },
      {
        title: 'Camiseta "Ctrl+Alt+Del"',
        subtitle: "Clássico dos tecladistas",
        description: "A combinação de teclas mais icônica do mundo da informática estampada em uma camiseta premium. Ideal para administradores de sistemas, técnicos de TI e entusiastas. 100% algodão de alta qualidade com acabamento impecável. Design minimalista e moderno. Conforto garantido para o dia inteiro. Mostre que você domina os atalhos!",
        handle: "camiseta-ctrl-alt-del",
        price: 8990, // R$ 89,90
        sizes: ["P", "M", "G", "GG"],
        colors: ["Preto", "Azul", "Branco"],
        skuPrefix: "TSHIRT-CAD"
      },
      {
        title: 'Camiseta "Binary Code"',
        subtitle: "Código binário estilizado",
        description: "Camiseta exclusiva com código binário estilizado em design cyberpunk futurista. Para quem pensa em 0s e 1s. Malha premium com tecnologia de impressão digital que garante cores vibrantes e duradouras. Corte moderno e confortável. Perfeita para eventos tech, hackathons ou uso casual. Edição limitada com design único desenvolvido por artistas nerds.",
        handle: "camiseta-binary-code",
        price: 9490, // R$ 94,90
        sizes: ["P", "M", "G", "GG"],
        colors: ["Preto", "Verde Neon", "Roxo"],
        skuPrefix: "TSHIRT-BIN"
      }
    ]

    const createdTShirts: any[] = []

    for (const tshirt of tshirts) {
      console.log(`\n  Creating: ${tshirt.title}...`)

      // Check if product already exists
      const existing = await productModuleService.listProducts({
        handle: tshirt.handle
      }).then(products => products[0])

      if (existing) {
        console.log(`  ⚠️  Product already exists: ${tshirt.title}`)
        createdTShirts.push(existing)
        continue
      }

      // Create product with options and variants
      const variants: ProductVariantData[] = []

      for (const size of tshirt.sizes) {
        for (const color of tshirt.colors) {
          const colorCode = getColorCode(color)
          const sizeCode = size.replace("GG", "XL")

          variants.push({
            title: `${size} - ${color}`,
            sku: `${tshirt.skuPrefix}-${sizeCode}-${colorCode}`,
            options: {
              Tamanho: size,
              Cor: color
            },
            inventory_quantity: 75,
            price: tshirt.price
          })
        }
      }

      const product = await productModuleService.createProducts({
        title: tshirt.title,
        subtitle: tshirt.subtitle,
        description: tshirt.description,
        handle: tshirt.handle,
        status: "published",
        options: [
          { title: "Tamanho", values: tshirt.sizes },
          { title: "Cor", values: tshirt.colors }
        ],
        variants: variants.map(v => ({
          title: v.title,
          sku: v.sku,
          manage_inventory: true,
          allow_backorder: false,
          options: v.options,
          material: "100% Algodão",
          weight: 200,
          origin_country: "BR"
        })),
        categories: [{ id: createdCategories[0].id }] // Camisetas Geek category
      })

      console.log(`  ✅ Created product: ${product.title} (${product.id})`)
      console.log(`     - Variants: ${variants.length}`)

      createdTShirts.push(product)

      // Create inventory items for each variant
      for (let i = 0; i < product.variants.length; i++) {
        const variant = product.variants[i]
        const variantData = variants[i]

        const inventoryItem = await inventoryModuleService.createInventoryItems({
          sku: variant.sku,
          origin_country: "BR",
          material: "100% Algodão",
          weight: 200
        })

        // Link variant to inventory item
        await remoteLink.create({
          productService: {
            variant_id: variant.id
          },
          inventoryService: {
            inventory_item_id: inventoryItem.id
          }
        })

        // Create inventory level
        await inventoryModuleService.createInventoryLevels({
          inventory_item_id: inventoryItem.id,
          location_id: stockLocation.id,
          stocked_quantity: variantData.inventory_quantity
        })

        // Create price for variant
        const priceSet = await pricingModuleService.createPriceSets({
          prices: [{
            amount: variantData.price,
            currency_code: "brl",
            rules: {}
          }]
        })

        // Link price set to variant
        await remoteLink.create({
          productService: {
            variant_id: variant.id
          },
          pricingService: {
            price_set_id: priceSet.id
          }
        })
      }

      console.log(`  ✅ Configured inventory and pricing for all variants`)
    }

    // ============================================
    // STEP 6: Create Simple Products (No Variants)
    // ============================================
    console.log("\n🛍️  Step 6: Creating simple products...")

    const simpleProducts = [
      {
        title: "Mouse Gamer RGB",
        subtitle: "Precisão e estilo para gamers",
        description: "Mouse gamer de alta performance com iluminação RGB customizável. Sensor óptico de 12.000 DPI ajustável, 7 botões programáveis e design ergonômico. Cabo trançado resistente e pés deslizantes em teflon para máxima precisão. Software completo para personalização de macros e perfis. Compatível com Windows e Mac.",
        handle: "mouse-gamer-rgb",
        sku: "MOUSE-RGB-001",
        price: 15990, // R$ 159,90
        category_index: 1, // Acessórios Tech
        inventory: 100
      },
      {
        title: "Teclado Mecânico",
        subtitle: "Switch blue para performance máxima",
        description: "Teclado mecânico profissional com switches blue clicky. Construção em alumínio premium, iluminação RGB por tecla, cabo USB-C destacável e keycaps PBT resistentes. Anti-ghosting completo e N-key rollover. Inclui descanso para pulso e ferramenta para troca de teclas. Layout ABNT2 brasileiro.",
        handle: "teclado-mecanico",
        sku: "KEYB-MECH-001",
        price: 34990, // R$ 349,90
        category_index: 1, // Acessórios Tech
        inventory: 50
      },
      {
        title: "Headset Gamer",
        subtitle: "Som imersivo 7.1 surround",
        description: "Headset gamer premium com áudio surround 7.1 virtual. Drivers de 50mm para graves profundos, microfone removível com cancelamento de ruído e almofadas em memory foam para conforto prolongado. Controles de volume e mute no fone. Iluminação RGB sincronizável. Compatível com PC, PS4, PS5, Xbox e Switch.",
        handle: "headset-gamer",
        sku: "HEAD-GAM-001",
        price: 29990, // R$ 299,90
        category_index: 1, // Acessórios Tech
        inventory: 75
      },
      {
        title: "Mousepad XXL",
        subtitle: "Superfície premium tamanho estendido",
        description: "Mousepad gamer extra grande (900x400mm) com superfície de tecido premium de alta densidade. Base antiderrapante em borracha natural, bordas costuradas para maior durabilidade e espessura de 3mm para conforto ideal. Design minimalista que combina com qualquer setup. Fácil de limpar e manter.",
        handle: "mousepad-xxl",
        sku: "MPAD-XXL-001",
        price: 7990, // R$ 79,90
        category_index: 1, // Acessórios Tech
        inventory: 150
      },
      {
        title: "Action Figure Cyberpunk",
        subtitle: "Edição limitada colecionável",
        description: "Action figure de luxo com 30 pontos de articulação e acabamento premium. Inspirado no universo cyberpunk com detalhes meticulosos pintados à mão. Inclui 3 armas intercambiáveis, 2 pares de mãos extras e base de exposição iluminada por LED. Altura: 18cm. Caixa especial de colecionador com janela acrílica. Edição numerada limitada a 5000 unidades.",
        handle: "action-figure-cyberpunk",
        sku: "ACFG-CYB-001",
        price: 24990, // R$ 249,90
        category_index: 2, // Colecionáveis
        inventory: 30
      },
      {
        title: "Funko Pop Gamer",
        subtitle: "Personagem icônico do mundo gamer",
        description: "Funko Pop oficial de personagem gamer clássico. Aproximadamente 9cm de altura, feito em vinil de alta qualidade com pintura detalhada. Vem em caixa com janela para exibição. Perfeito para colecionadores e fãs de cultura pop. Produto oficial licenciado com certificado de autenticidade. Excelente presente para gamers e nerds.",
        handle: "funko-pop-gamer",
        sku: "FUNK-GAM-001",
        price: 12990, // R$ 129,90
        category_index: 2, // Colecionáveis
        inventory: 80
      },
      {
        title: 'Caneca "Coffee & Code"',
        subtitle: "Combustível oficial dos programadores",
        description: "Caneca de cerâmica premium com capacidade de 325ml. Estampa durável com a frase 'Coffee & Code' em design minimalista. Pode ir ao microondas e lava-louças. Interior branco e acabamento externo em cores vibrantes. Presente perfeito para desenvolvedores, programadores e entusiastas de tecnologia. Qualidade de impressão superior resistente ao uso diário.",
        handle: "caneca-coffee-and-code",
        sku: "CANE-COF-001",
        price: 3990, // R$ 39,90
        category_index: 2, // Colecionáveis
        inventory: 200
      },
      {
        title: "Adesivos Pack Geek",
        subtitle: "30 adesivos premium",
        description: "Pack com 30 adesivos temáticos geek/nerd de alta qualidade. Designs exclusivos de games, programação, sci-fi e cultura pop. Material vinílico resistente à água e UV, perfeitos para notebooks, tablets, garrafas, skates e mais. Tamanhos variados de 5 a 10cm. Fácil aplicação e remoção sem deixar resíduos. Cores vibrantes e impressão de alta resolução.",
        handle: "adesivos-pack-geek",
        sku: "ADES-PCK-001",
        price: 2490, // R$ 24,90
        category_index: 2, // Colecionáveis
        inventory: 250
      },
      {
        title: "LED Strip RGB",
        subtitle: "5 metros de iluminação inteligente",
        description: "Fita LED RGB de 5 metros com controle remoto e app para smartphone. 16 milhões de cores, múltiplos modos de animação e sincronização com música. Adesivo 3M de alta qualidade para fácil instalação. Fonte bivolt automática incluída. Controlador WiFi compatível com Alexa e Google Home. Perfeita para iluminar setup gamer, quarto, sala ou home theater. Baixo consumo de energia.",
        handle: "led-strip-rgb",
        sku: "LED-RGB-001",
        price: 8990, // R$ 89,90
        category_index: 3, // Eletrônicos
        inventory: 120
      },
      {
        title: "Webcam Full HD",
        subtitle: "1080p 60fps para streaming",
        description: "Webcam Full HD profissional com resolução 1080p @ 60fps. Autofoco rápido e preciso, microfone stereo integrado com redução de ruído e lente de vidro premium com amplo campo de visão (90°). Clip universal ajustável para monitores e tripés. Plug and play USB 2.0, sem necessidade de drivers. Perfeita para streaming, videoconferências, aulas online e chamadas profissionais. Compatível com OBS, Zoom, Teams e mais.",
        handle: "webcam-full-hd",
        sku: "WEBC-FHD-001",
        price: 39990, // R$ 399,90
        category_index: 3, // Eletrônicos
        inventory: 60
      }
    ]

    const createdSimpleProducts: any[] = []

    for (const product of simpleProducts) {
      console.log(`\n  Creating: ${product.title}...`)

      // Check if product already exists
      const existing = await productModuleService.listProducts({
        handle: product.handle
      }).then(products => products[0])

      if (existing) {
        console.log(`  ⚠️  Product already exists: ${product.title}`)
        createdSimpleProducts.push(existing)
        continue
      }

      // Create product with single variant
      const createdProduct = await productModuleService.createProducts({
        title: product.title,
        subtitle: product.subtitle,
        description: product.description,
        handle: product.handle,
        status: "published",
        variants: [{
          title: "Default",
          sku: product.sku,
          manage_inventory: true,
          allow_backorder: false
        }],
        categories: [{ id: createdCategories[product.category_index].id }]
      })

      console.log(`  ✅ Created product: ${createdProduct.title} (${createdProduct.id})`)

      // Create inventory for the variant
      const variant = createdProduct.variants[0]

      const inventoryItem = await inventoryModuleService.createInventoryItems({
        sku: product.sku
      })

      // Link variant to inventory item
      await remoteLink.create({
        productService: {
          variant_id: variant.id
        },
        inventoryService: {
          inventory_item_id: inventoryItem.id
        }
      })

      // Create inventory level
      await inventoryModuleService.createInventoryLevels({
        inventory_item_id: inventoryItem.id,
        location_id: stockLocation.id,
        stocked_quantity: product.inventory
      })

      // Create price for variant
      const priceSet = await pricingModuleService.createPriceSets({
        prices: [{
          amount: product.price,
          currency_code: "brl",
          rules: {}
        }]
      })

      // Link price set to variant
      await remoteLink.create({
        productService: {
          variant_id: variant.id
        },
        pricingService: {
          price_set_id: priceSet.id
        }
      })

      console.log(`  ✅ Configured inventory and pricing`)

      createdSimpleProducts.push(createdProduct)
    }

    // ============================================
    // STEP 7: Summary and Verification
    // ============================================
    console.log("\n" + "=".repeat(50))
    console.log("📊 CATALOG POPULATION COMPLETE!")
    console.log("=".repeat(50))
    console.log(`\n✅ Categories created: ${createdCategories.length}`)
    console.log(`✅ T-shirt products created: ${createdTShirts.length}`)
    console.log(`✅ Simple products created: ${createdSimpleProducts.length}`)
    console.log(`✅ Total products: ${createdTShirts.length + createdSimpleProducts.length}`)

    // Calculate total variants
    let totalVariants = 0
    for (const product of createdTShirts) {
      totalVariants += product.variants?.length || 0
    }
    totalVariants += createdSimpleProducts.length // Each simple product has 1 variant
    console.log(`✅ Total variants: ${totalVariants}`)

    console.log("\n📦 Stock Location: " + stockLocation.id)
    console.log("🌎 Region: " + brasilRegion.id)
    console.log("🏪 Sales Channel: " + salesChannel.id)

    console.log("\n🎉 All done! Your catalog is ready to rock!")

  } catch (error) {
    console.error("\n❌ Error during catalog population:", error)
    throw error
  }
}

// Helper function to get color codes for SKUs
function getColorCode(color: string): string {
  const colorMap: Record<string, string> = {
    "Preto": "BLK",
    "Branco": "WHT",
    "Azul Marinho": "NVY",
    "Azul": "BLU",
    "Vermelho": "RED",
    "Cinza": "GRY",
    "Verde Neon": "NGR",
    "Roxo": "PRP"
  }
  return colorMap[color] || "XXX"
}

// Run the script
populateCatalog()
  .then(() => {
    console.log("\n✨ Script completed successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Script failed:", error)
    process.exit(1)
  })
