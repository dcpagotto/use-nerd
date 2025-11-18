import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

/**
 * Endpoint customizado para listar TODOS os produtos publicados,
 * incluindo aqueles sem preços configurados.
 *
 * Endpoint: GET /store/products/all
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const productModuleService = req.scope.resolve(Modules.PRODUCT);

  try {
    // Buscar todos os produtos publicados
    const products = await productModuleService.listProducts(
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
        take: req.query.limit ? parseInt(req.query.limit as string) : 100,
        skip: req.query.offset ? parseInt(req.query.offset as string) : 0,
      }
    );

    // Formatar resposta similar à API pública
    const formattedProducts = products.map((product) => ({
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
      count: products.length,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
    });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
}
