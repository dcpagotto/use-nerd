import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

/**
 * Script para adicionar preços e estoque a produtos sem configuração
 * Uso: npx medusa exec ./src/scripts/fix-product-prices.ts
 */
export default async function fixProductPrices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService = container.resolve(Modules.PRODUCT);
  const pricingModuleService = container.resolve(Modules.PRICING);
  const inventoryModuleService = container.resolve(Modules.INVENTORY);
  const link = container.resolve(ContainerRegistrationKeys.LINK);

  try {
    logger.info("🔧 Corrigindo preços e estoque de produtos...");

    // Buscar todos os produtos publicados
    const products = await productModuleService.listProducts({
      status: "published",
    });

    logger.info(`📦 Encontrados ${products.length} produtos publicados`);

    for (const product of products) {
      logger.info(`\n📝 Processando: ${product.title} (${product.handle})`);

      // Buscar variantes do produto
      const variants = await productModuleService.listProductVariants({
        product_id: product.id,
      });

      for (const variant of variants) {
        // Verificar se a variante tem preços
        const existingPrices = await pricingModuleService.listPrices({
          variant_id: variant.id,
        });

        if (existingPrices.length === 0) {
          logger.info(`  💰 Adicionando preços para variante: ${variant.title || variant.sku}`);

          // Adicionar preço padrão de R$ 100,00 (10000 centavos)
          await pricingModuleService.createPriceSets({
            prices: [
              {
                amount: 10000, // R$ 100,00
                currency_code: "brl",
                variant_id: variant.id,
              },
              {
                amount: 2500, // $25.00
                currency_code: "usd",
                variant_id: variant.id,
              },
            ],
          });

          logger.info(`  ✅ Preços adicionados: BRL R$100,00 | USD $25.00`);
        } else {
          logger.info(`  ℹ️  Variante já tem ${existingPrices.length} preço(s)`);
        }

        // Verificar estoque através do link
        const inventoryItems = await link.list("product_variant_inventory_item", {
          variant_id: variant.id,
        });

        if (inventoryItems.length === 0) {
          logger.info(`  📦 Criando inventory item para: ${variant.title || variant.sku}`);

          // Criar inventory item
          const inventoryItem = await inventoryModuleService.createInventoryItems({
            sku: variant.sku || `${product.handle}-${variant.id.slice(-6)}`,
            title: variant.title || product.title,
          });

          // Link variant ao inventory item
          await link.create({
            [Modules.PRODUCT]: {
              variant_id: variant.id,
            },
            [Modules.INVENTORY]: {
              inventory_item_id: inventoryItem.id,
            },
          });

          // Buscar o stock location padrão
          const stockLocations = await inventoryModuleService.listStockLocations({
            name: "Armazém São Paulo",
          });

          if (stockLocations.length > 0) {
            // Criar inventory level com estoque de 100 unidades
            await inventoryModuleService.createInventoryLevels({
              inventory_item_id: inventoryItem.id,
              location_id: stockLocations[0].id,
              stocked_quantity: 100,
            });

            logger.info(`  ✅ Estoque adicionado: 100 unidades`);
          } else {
            logger.warn(`  ⚠️  Stock location não encontrado`);
          }
        } else {
          logger.info(`  ℹ️  Variante já tem inventory configurado`);
        }
      }

      logger.info(`✅ Produto "${product.title}" processado com sucesso!`);
    }

    logger.info("\n🎉 Todos os produtos foram corrigidos!");
    logger.info("🔄 Recarregue o frontend para ver as mudanças");

  } catch (error) {
    logger.error("❌ Erro ao corrigir produtos:", error);
    throw error;
  }
}
