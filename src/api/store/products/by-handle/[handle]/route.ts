import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

/**
 * Endpoint customizado para buscar produto por handle,
 * incluindo produtos sem preços configurados.
 *
 * Endpoint: GET /store/products/by-handle/:handle
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const productModuleService = req.scope.resolve(Modules.PRODUCT);
  const handle = req.params.handle;

  try {
    // Buscar produto por handle
    const products = await productModuleService.listProducts(
      {
        handle: handle,
      },
      {
        relations: [
          "variants",
          "variants.options",
          "variants.options.option",
          "images",
          "options",
          "options.values",
          "tags",
          "collection",
        ],
        take: 1,
      }
    );

    if (!products || products.length === 0) {
      res.status(404).json({
        type: "not_found",
        message: `Product with handle: ${handle} was not found`,
      });
      return;
    }

    const product = products[0];

    // Formatar resposta similar à API pública
    const formattedProduct = {
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
        // inventory_quantity not directly available in Medusa v2 ProductVariantDTO
        // Use inventory service separately if needed
        prices: [], // Prices handled separately in Medusa v2
        options: variant.options,
      })),
    };

    res.json({
      product: formattedProduct,
    });
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
}
