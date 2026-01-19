
import type { Product } from './types';

/**
 * Sanitizes a product object to be compatible with Firestore.
 * Firestore does not allow `undefined` values. This function converts
 * any `undefined` optional fields to `null`.
 *
 * @param product The product object to sanitize.
 * @returns A new product object that is safe to save to Firestore.
 */
export function sanitizeProductForFirebase(product: Product): Product {
  const sanitizedProduct: Product = {
    ...product,
    salePrice: product.salePrice ?? null,
    variants: product.variants ?? null,
  };

  // Remove any remaining undefined keys, just in case
  Object.keys(sanitizedProduct).forEach(key => {
    if ((sanitizedProduct as any)[key] === undefined) {
      (sanitizedProduct as any)[key] = null;
    }
  });

  return sanitizedProduct;
}
