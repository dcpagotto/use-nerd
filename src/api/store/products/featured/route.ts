import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

/**
 * Endpoint customizado para buscar produtos em destaque.
 *
 * Estratégias suportadas:
 * 1. Produtos com tag "destaque" ou "featured"
 * 2. Rotação aleatória de produtos publicados (fallback)
 *
 * Query params:
 * - limit: número de produtos a retornar (padrão: 6)
 * - random: se true, retorna produtos aleatórios mesmo que existam produtos com tag
 *
 * Endpoint: GET /store/products/featured
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const productModuleService = req.scope.resolve(Modules.PRODUCT);
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
  const useRandom = req.query.random === 'true';

  try {
    let featuredProducts = [];

    // Se não for forçar aleatório, tentar buscar produtos com tag "destaque" ou "featured"
    if (!useRandom) {
      // Buscar todos os produtos publicados com relações
      const allProducts = await productModuleService.listProducts(
        {
          status: "published",
        },
        {
          relations: [
            "variants",
            "variants.options",
            "images",
            "options",
            "options.values",
            "tags",
            "collection",
          ],
        }
      );

      // Filtrar produtos que têm tag "destaque" ou "featured"
      featuredProducts = allProducts.filter((product) =>
        product.tags?.some(
          (tag) =>
            tag.value.toLowerCase() === "destaque" ||
            tag.value.toLowerCase() === "featured"
        )
      );
    }

    // Se não houver produtos com tag ou for forçar aleatório, pegar produtos aleatórios
    if (featuredProducts.length === 0 || useRandom) {
      const allProducts = await productModuleService.listProducts(
        {
          status: "published",
        },
        {
          relations: [
            "variants",
            "variants.options",
            "images",
            "options",
            "options.values",
            "tags",
            "collection",
          ],
        }
      );

      // Embaralhar e pegar os primeiros N produtos
      featuredProducts = shuffleArray(allProducts).slice(0, limit);
    } else {
      // Se houver produtos com tag, pegar apenas o limite solicitado
      featuredProducts = featuredProducts.slice(0, limit);
    }

    // Formatar resposta similar à API pública
    const formattedProducts = featuredProducts.map((product) => ({
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      handle: product.handle,
      is_giftcard: product.is_giftcard,
      discountable: product.discountable,
      thumbnail: product.thumbnail,
      weight: product.weight,
      length: product.length,
      height: product.height,
      width: product.width,
      material: product.material,
      created_at: product.created_at,
      updated_at: product.updated_at,
      collection_id: product.collection_id,
      type_id: product.type_id,
      collection: product.collection,
      images: product.images,
      options: product.options,
      tags: product.tags,
      variants: product.variants?.map((variant) => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        barcode: variant.barcode,
        allow_backorder: variant.allow_backorder,
        manage_inventory: variant.manage_inventory,
        inventory_quantity: variant.inventory_quantity || 0,
        prices: [], // Prices handled separately in Medusa v2
        options: variant.options,
      })),
    }));

    res.json({
      products: formattedProducts,
      count: formattedProducts.length,
      strategy: useRandom
        ? "random"
        : featuredProducts.some((p) =>
            p.tags?.some(
              (tag) =>
                tag.value.toLowerCase() === "destaque" ||
                tag.value.toLowerCase() === "featured"
            )
          )
        ? "tagged"
        : "random_fallback",
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({
      message: "Failed to fetch featured products",
      error: error.message,
    });
  }
}

/**
 * Função auxiliar para embaralhar array (Fisher-Yates shuffle)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
