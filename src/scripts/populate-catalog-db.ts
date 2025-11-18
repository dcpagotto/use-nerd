/**
 * ============================================
 * USE Nerd - Product Catalog Population Script (Direct DB)
 * ============================================
 * FASE 3: Populate Medusa with Categories & Products
 * Date: 2025-11-17
 * ============================================
 */

import { Client } from "pg"
import { ulid } from "ulid"

// Database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/use-nerd?sslmode=disable"
})

interface ProductVariantData {
  title: string
  sku: string
  size?: string
  color?: string
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

interface SimpleProduct {
  title: string
  subtitle: string
  description: string
  handle: string
  sku: string
  price: number
  category_index: number
  inventory: number
}

async function populateCatalog() {
  console.log("🚀 Starting USE Nerd catalog population...")

  try {
    await client.connect()
    console.log("✅ Connected to database")

    // ============================================
    // STEP 1: Get or Create Stock Location
    // ============================================
    console.log("\n📦 Step 1: Setting up stock location...")

    let stockLocationResult = await client.query(
      "SELECT id, name FROM public.stock_location WHERE name = $1",
      ["Armazém Brasil - São Paulo"]
    )

    let stockLocationId: string

    if (stockLocationResult.rows.length === 0) {
      const newId = `sloc_${ulid()}`
      await client.query(
        "INSERT INTO public.stock_location (id, name, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())",
        [newId, "Armazém Brasil - São Paulo"]
      )
      stockLocationId = newId
      console.log("✅ Created stock location:", stockLocationId)
    } else {
      stockLocationId = stockLocationResult.rows[0].id
      console.log("✅ Using existing stock location:", stockLocationId)
    }

    // ============================================
    // STEP 2: Get Region Brasil
    // ============================================
    console.log("\n🌎 Step 2: Getting Brasil region...")

    const regionResult = await client.query(
      "SELECT id, name, currency_code FROM public.region WHERE currency_code = $1",
      ["brl"]
    )

    if (regionResult.rows.length === 0) {
      throw new Error("Brasil region not found! Please create it first.")
    }

    const regionId = regionResult.rows[0].id
    console.log("✅ Found Brasil region:", regionId)

    // ============================================
    // STEP 3: Create Product Categories
    // ============================================
    console.log("\n📂 Step 3: Creating product categories...")

    const categories = [
      {
        name: "Camisetas Geek",
        handle: "camisetas-geek",
        description: "Camisetas exclusivas com designs inspirados em games, filmes e séries"
      },
      {
        name: "Acessórios Tech",
        handle: "acessorios-tech",
        description: "Periféricos e acessórios para gamers e entusiastas de tecnologia"
      },
      {
        name: "Colecionáveis",
        handle: "colecionaveis",
        description: "Action figures, Funko Pops e itens de coleção para verdadeiros nerds"
      },
      {
        name: "Eletrônicos",
        handle: "eletronicos",
        description: "Gadgets, eletrônicos e dispositivos tech para o seu setup"
      }
    ]

    const categoryIds: string[] = []

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]

      const existingCat = await client.query(
        "SELECT id FROM public.product_category WHERE handle = $1 AND deleted_at IS NULL",
        [category.handle]
      )

      if (existingCat.rows.length > 0) {
        console.log(`✅ Category already exists: ${category.name}`)
        categoryIds.push(existingCat.rows[0].id)
      } else {
        const categoryId = `pcat_${ulid()}`
        const mpath = categoryId // For root categories, mpath = id

        await client.query(
          `INSERT INTO public.product_category (id, name, handle, description, is_active, is_internal, rank, mpath, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
          [categoryId, category.name, category.handle, category.description, true, false, i + 1, mpath]
        )
        console.log(`✅ Created category: ${category.name} (${categoryId})`)
        categoryIds.push(categoryId)
      }
    }

    // ============================================
    // STEP 4: Create T-Shirt Products with Variants
    // ============================================
    console.log("\n👕 Step 4: Creating t-shirt products with variants...")

    const tshirts: TShirtProduct[] = [
      {
        title: 'Camiseta "Code is Poetry"',
        subtitle: "Design minimalista para desenvolvedores",
        description: "Camiseta premium 100% algodão com design minimalista apresentando código em fonte monospace. Ideal para desenvolvedores e programadores que vivem e respiram código. Impressão de alta qualidade que não desbota. Confortável para o dia a dia no escritório ou home office.",
        handle: "camiseta-code-is-poetry",
        price: 8990,
        sizes: ["P", "M", "G", "GG"],
        colors: ["Preto", "Branco", "Azul Marinho"],
        skuPrefix: "TSHIRT-CIP"
      },
      {
        title: 'Camiseta "Player One"',
        subtitle: "Para gamers de primeira geração",
        description: "Camiseta de alta qualidade para gamers raiz. Design retrô inspirado nos clássicos dos anos 80 e 90. Malha premium que proporciona conforto durante longas sessões de jogo. Estampa durável e cores vibrantes. Perfeita para LAN parties e eventos geek.",
        handle: "camiseta-player-one",
        price: 7990,
        sizes: ["P", "M", "G", "GG"],
        colors: ["Preto", "Vermelho", "Cinza"],
        skuPrefix: "TSHIRT-PLR"
      },
      {
        title: 'Camiseta "404 Not Found"',
        subtitle: "Humor nerd para desenvolvedores",
        description: "Camiseta com a mensagem de erro mais famosa da internet. Design criativo e divertido para desenvolvedores web com senso de humor. Material confortável e respirável, perfeito para o dia a dia. Impressão de qualidade superior.",
        handle: "camiseta-404-not-found",
        price: 8490,
        sizes: ["P", "M", "G", "GG"],
        colors: ["Preto", "Branco"],
        skuPrefix: "TSHIRT-404"
      },
      {
        title: 'Camiseta "Ctrl+Alt+Del"',
        subtitle: "Clássico dos tecladistas",
        description: "A combinação de teclas mais icônica do mundo da informática estampada em uma camiseta premium. Ideal para administradores de sistemas e técnicos de TI. 100% algodão de alta qualidade com acabamento impecável.",
        handle: "camiseta-ctrl-alt-del",
        price: 8990,
        sizes: ["P", "M", "G", "GG"],
        colors: ["Preto", "Azul", "Branco"],
        skuPrefix: "TSHIRT-CAD"
      },
      {
        title: 'Camiseta "Binary Code"',
        subtitle: "Código binário estilizado",
        description: "Camiseta exclusiva com código binário estilizado em design cyberpunk futurista. Para quem pensa em 0s e 1s. Malha premium com tecnologia de impressão digital que garante cores vibrantes e duradouras. Edição limitada.",
        handle: "camiseta-binary-code",
        price: 9490,
        sizes: ["P", "M", "G", "GG"],
        colors: ["Preto", "Verde Neon", "Roxo"],
        skuPrefix: "TSHIRT-BIN"
      }
    ]

    let tshirtCount = 0
    let variantCount = 0

    for (const tshirt of tshirts) {
      console.log(`\n  Creating: ${tshirt.title}...`)

      // Check if product exists
      const existingProd = await client.query(
        "SELECT id FROM public.product WHERE handle = $1 AND deleted_at IS NULL",
        [tshirt.handle]
      )

      if (existingProd.rows.length > 0) {
        console.log(`  ⚠️  Product already exists: ${tshirt.title}`)
        continue
      }

      const productId = `prod_${ulid()}`

      // Create product
      await client.query(
        `INSERT INTO public.product (id, title, subtitle, description, handle, is_giftcard, status, origin_country, material, weight, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
        [productId, tshirt.title, tshirt.subtitle, tshirt.description, tshirt.handle, false, "published", "BR", "100% Algodão", "200"]
      )

      // Link product to category
      await client.query(
        "INSERT INTO public.product_category_product (product_category_id, product_id) VALUES ($1, $2)",
        [categoryIds[0], productId]
      )

      // Create product options
      const sizeOptionId = `popt_${ulid()}`
      const colorOptionId = `popt_${ulid()}`

      await client.query(
        "INSERT INTO public.product_option (id, title, product_id, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())",
        [sizeOptionId, "Tamanho", productId]
      )

      await client.query(
        "INSERT INTO public.product_option (id, title, product_id, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())",
        [colorOptionId, "Cor", productId]
      )

      // Create option values
      const sizeValueIds: Record<string, string> = {}
      for (const size of tshirt.sizes) {
        const valueId = `poptv_${ulid()}`
        await client.query(
          "INSERT INTO public.product_option_value (id, value, option_id, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())",
          [valueId, size, sizeOptionId]
        )
        sizeValueIds[size] = valueId
      }

      const colorValueIds: Record<string, string> = {}
      for (const color of tshirt.colors) {
        const valueId = `poptv_${ulid()}`
        await client.query(
          "INSERT INTO public.product_option_value (id, value, option_id, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())",
          [valueId, color, colorOptionId]
        )
        colorValueIds[color] = valueId
      }

      // Create variants
      let rank = 0
      for (const size of tshirt.sizes) {
        for (const color of tshirt.colors) {
          const variantId = `variant_${ulid()}`
          const colorCode = getColorCode(color)
          const sizeCode = size.replace("GG", "XL")
          const sku = `${tshirt.skuPrefix}-${sizeCode}-${colorCode}`
          const title = `${size} - ${color}`

          await client.query(
            `INSERT INTO public.product_variant (id, title, sku, product_id, allow_backorder, manage_inventory, weight, origin_country, material, variant_rank, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
            [variantId, title, sku, productId, false, true, 200, "BR", "100% Algodão", rank++]
          )

          // Link variant to option values
          await client.query(
            "INSERT INTO public.product_variant_option (id, variant_id, option_value_id, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())",
            [`pvopt_${ulid()}`, variantId, sizeValueIds[size]]
          )

          await client.query(
            "INSERT INTO public.product_variant_option (id, variant_id, option_value_id, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())",
            [`pvopt_${ulid()}`, variantId, colorValueIds[color]]
          )

          // Create inventory item
          const inventoryItemId = `inv_${ulid()}`
          await client.query(
            "INSERT INTO public.inventory_item (id, sku, origin_country, material, weight, requires_shipping, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())",
            [inventoryItemId, sku, "BR", "100% Algodão", 200, true]
          )

          // Link variant to inventory item
          await client.query(
            "INSERT INTO public.product_variant_inventory_item (variant_id, inventory_item_id, created_at, updated_at, required_quantity) VALUES ($1, $2, NOW(), NOW(), $3)",
            [variantId, inventoryItemId, 1]
          )

          // Create inventory level
          await client.query(
            "INSERT INTO public.inventory_level (id, inventory_item_id, location_id, stocked_quantity, reserved_quantity, incoming_quantity, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())",
            [`ilvl_${ulid()}`, inventoryItemId, stockLocationId, 75, 0, 0]
          )

          // Create price set and price
          const priceSetId = `pset_${ulid()}`
          await client.query(
            "INSERT INTO public.price_set (id, created_at, updated_at) VALUES ($1, NOW(), NOW())",
            [priceSetId]
          )

          const priceId = `price_${ulid()}`
          await client.query(
            "INSERT INTO public.price (id, currency_code, amount, price_set_id, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())",
            [priceId, "brl", tshirt.price, priceSetId]
          )

          // Link price set to variant
          await client.query(
            "INSERT INTO public.price_set_variant_link (variant_id, price_set_id) VALUES ($1, $2)",
            [variantId, priceSetId]
          )

          variantCount++
        }
      }

      console.log(`  ✅ Created: ${tshirt.title} (${tshirt.sizes.length * tshirt.colors.length} variants)`)
      tshirtCount++
    }

    // ============================================
    // STEP 5: Create Simple Products
    // ============================================
    console.log("\n🛍️  Step 5: Creating simple products...")

    const simpleProducts: SimpleProduct[] = [
      {
        title: "Mouse Gamer RGB",
        subtitle: "Precisão e estilo para gamers",
        description: "Mouse gamer de alta performance com iluminação RGB customizável. Sensor óptico de 12.000 DPI ajustável, 7 botões programáveis e design ergonômico. Cabo trançado resistente e pés deslizantes em teflon para máxima precisão.",
        handle: "mouse-gamer-rgb",
        sku: "MOUSE-RGB-001",
        price: 15990,
        category_index: 1,
        inventory: 100
      },
      {
        title: "Teclado Mecânico",
        subtitle: "Switch blue para performance máxima",
        description: "Teclado mecânico profissional com switches blue clicky. Construção em alumínio premium, iluminação RGB por tecla, cabo USB-C destacável e keycaps PBT resistentes. Anti-ghosting completo e N-key rollover.",
        handle: "teclado-mecanico",
        sku: "KEYB-MECH-001",
        price: 34990,
        category_index: 1,
        inventory: 50
      },
      {
        title: "Headset Gamer",
        subtitle: "Som imersivo 7.1 surround",
        description: "Headset gamer premium com áudio surround 7.1 virtual. Drivers de 50mm para graves profundos, microfone removível com cancelamento de ruído e almofadas em memory foam. Compatível com PC, PS4, PS5, Xbox e Switch.",
        handle: "headset-gamer",
        sku: "HEAD-GAM-001",
        price: 29990,
        category_index: 1,
        inventory: 75
      },
      {
        title: "Mousepad XXL",
        subtitle: "Superfície premium tamanho estendido",
        description: "Mousepad gamer extra grande (900x400mm) com superfície de tecido premium de alta densidade. Base antiderrapante em borracha natural, bordas costuradas para maior durabilidade e espessura de 3mm para conforto ideal.",
        handle: "mousepad-xxl",
        sku: "MPAD-XXL-001",
        price: 7990,
        category_index: 1,
        inventory: 150
      },
      {
        title: "Action Figure Cyberpunk",
        subtitle: "Edição limitada colecionável",
        description: "Action figure de luxo com 30 pontos de articulação e acabamento premium. Inspirado no universo cyberpunk com detalhes meticulosos pintados à mão. Inclui 3 armas intercambiáveis, 2 pares de mãos extras e base de exposição iluminada.",
        handle: "action-figure-cyberpunk",
        sku: "ACFG-CYB-001",
        price: 24990,
        category_index: 2,
        inventory: 30
      },
      {
        title: "Funko Pop Gamer",
        subtitle: "Personagem icônico do mundo gamer",
        description: "Funko Pop oficial de personagem gamer clássico. Aproximadamente 9cm de altura, feito em vinil de alta qualidade com pintura detalhada. Vem em caixa com janela para exibição. Produto oficial licenciado.",
        handle: "funko-pop-gamer",
        sku: "FUNK-GAM-001",
        price: 12990,
        category_index: 2,
        inventory: 80
      },
      {
        title: 'Caneca "Coffee & Code"',
        subtitle: "Combustível oficial dos programadores",
        description: "Caneca de cerâmica premium com capacidade de 325ml. Estampa durável com a frase 'Coffee & Code' em design minimalista. Pode ir ao microondas e lava-louças. Presente perfeito para desenvolvedores e programadores.",
        handle: "caneca-coffee-and-code",
        sku: "CANE-COF-001",
        price: 3990,
        category_index: 2,
        inventory: 200
      },
      {
        title: "Adesivos Pack Geek",
        subtitle: "30 adesivos premium",
        description: "Pack com 30 adesivos temáticos geek/nerd de alta qualidade. Designs exclusivos de games, programação, sci-fi e cultura pop. Material vinílico resistente à água e UV, perfeitos para notebooks, tablets e mais.",
        handle: "adesivos-pack-geek",
        sku: "ADES-PCK-001",
        price: 2490,
        category_index: 2,
        inventory: 250
      },
      {
        title: "LED Strip RGB",
        subtitle: "5 metros de iluminação inteligente",
        description: "Fita LED RGB de 5 metros com controle remoto e app para smartphone. 16 milhões de cores, múltiplos modos de animação e sincronização com música. Controlador WiFi compatível com Alexa e Google Home.",
        handle: "led-strip-rgb",
        sku: "LED-RGB-001",
        price: 8990,
        category_index: 3,
        inventory: 120
      },
      {
        title: "Webcam Full HD",
        subtitle: "1080p 60fps para streaming",
        description: "Webcam Full HD profissional com resolução 1080p @ 60fps. Autofoco rápido e preciso, microfone stereo integrado com redução de ruído. Perfeita para streaming, videoconferências e aulas online.",
        handle: "webcam-full-hd",
        sku: "WEBC-FHD-001",
        price: 39990,
        category_index: 3,
        inventory: 60
      }
    ]

    let simpleCount = 0

    for (const product of simpleProducts) {
      console.log(`\n  Creating: ${product.title}...`)

      // Check if product exists
      const existingProd = await client.query(
        "SELECT id FROM public.product WHERE handle = $1 AND deleted_at IS NULL",
        [product.handle]
      )

      if (existingProd.rows.length > 0) {
        console.log(`  ⚠️  Product already exists: ${product.title}`)
        continue
      }

      const productId = `prod_${ulid()}`

      // Create product
      await client.query(
        `INSERT INTO public.product (id, title, subtitle, description, handle, is_giftcard, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [productId, product.title, product.subtitle, product.description, product.handle, false, "published"]
      )

      // Link to category
      await client.query(
        "INSERT INTO public.product_category_product (product_category_id, product_id) VALUES ($1, $2)",
        [categoryIds[product.category_index], productId]
      )

      // Create single variant
      const variantId = `variant_${ulid()}`
      await client.query(
        `INSERT INTO public.product_variant (id, title, sku, product_id, allow_backorder, manage_inventory, variant_rank, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [variantId, "Default", product.sku, productId, false, true, 0]
      )

      // Create inventory item
      const inventoryItemId = `inv_${ulid()}`
      await client.query(
        "INSERT INTO public.inventory_item (id, sku, requires_shipping, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())",
        [inventoryItemId, product.sku, true]
      )

      // Link variant to inventory
      await client.query(
        "INSERT INTO public.product_variant_inventory_item (variant_id, inventory_item_id, created_at, updated_at, required_quantity) VALUES ($1, $2, NOW(), NOW(), $3)",
        [variantId, inventoryItemId, 1]
      )

      // Create inventory level
      await client.query(
        "INSERT INTO public.inventory_level (id, inventory_item_id, location_id, stocked_quantity, reserved_quantity, incoming_quantity, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())",
        [`ilvl_${ulid()}`, inventoryItemId, stockLocationId, product.inventory, 0, 0]
      )

      // Create price set and price
      const priceSetId = `pset_${ulid()}`
      await client.query(
        "INSERT INTO public.price_set (id, created_at, updated_at) VALUES ($1, NOW(), NOW())",
        [priceSetId]
      )

      const priceId = `price_${ulid()}`
      await client.query(
        "INSERT INTO public.price (id, currency_code, amount, price_set_id, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())",
        [priceId, "brl", product.price, priceSetId]
      )

      // Link price set to variant
      await client.query(
        "INSERT INTO public.price_set_variant_link (variant_id, price_set_id) VALUES ($1, $2)",
        [variantId, priceSetId]
      )

      variantCount++
      simpleCount++
      console.log(`  ✅ Created: ${product.title}`)
    }

    // ============================================
    // STEP 6: Verification Queries
    // ============================================
    console.log("\n" + "=".repeat(50))
    console.log("📊 VERIFICATION")
    console.log("=".repeat(50))

    const catCount = await client.query("SELECT COUNT(*) FROM public.product_category WHERE deleted_at IS NULL")
    const prodCount = await client.query("SELECT COUNT(*) FROM public.product WHERE deleted_at IS NULL")
    const varCount = await client.query("SELECT COUNT(*) FROM public.product_variant WHERE deleted_at IS NULL")

    console.log(`\n✅ Categories in DB: ${catCount.rows[0].count}`)
    console.log(`✅ Products in DB: ${prodCount.rows[0].count}`)
    console.log(`✅ Variants in DB: ${varCount.rows[0].count}`)

    console.log(`\n✅ T-shirts created: ${tshirtCount}`)
    console.log(`✅ Simple products created: ${simpleCount}`)
    console.log(`✅ Total variants created: ${variantCount}`)

    // Sample products
    console.log("\n📦 Sample Products:")
    const sampleProds = await client.query(
      "SELECT id, title, handle, status FROM public.product WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 5"
    )
    sampleProds.rows.forEach((row: any) => {
      console.log(`  - ${row.title} (${row.handle}) - ${row.status}`)
    })

    // Products by category
    console.log("\n📂 Products by Category:")
    const prodsByCategory = await client.query(`
      SELECT pc.name as category, COUNT(pcp.product_id) as count
      FROM public.product_category pc
      LEFT JOIN public.product_category_product pcp ON pc.id = pcp.product_category_id
      WHERE pc.deleted_at IS NULL
      GROUP BY pc.name
      ORDER BY pc.rank
    `)
    prodsByCategory.rows.forEach((row: any) => {
      console.log(`  - ${row.category}: ${row.count} products`)
    })

    console.log("\n" + "=".repeat(50))
    console.log("🎉 CATALOG POPULATION COMPLETE!")
    console.log("=".repeat(50))

  } catch (error) {
    console.error("\n❌ Error during catalog population:", error)
    throw error
  } finally {
    await client.end()
    console.log("\n✅ Database connection closed")
  }
}

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
