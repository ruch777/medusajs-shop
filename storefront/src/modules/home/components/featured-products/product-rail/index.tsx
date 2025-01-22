import React from "react";
import { useCart } from "@lib/context/cart-context";
import { Button } from "@components/ui/button";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import type { Product } from "@lib/types/product";
import type { MoneyAmountDTO as MoneyAmount } from "@medusajs/types";
import { useCurrency } from "@lib/context/currency-context";
import { formatAmount } from "@lib/util/money";

interface ProductRailProps {
  product: Product;
}

const ProductRail: React.FC<ProductRailProps> = ({ product }) => {
  const { addItem } = useCart();
  const { currency } = useCurrency();

  const handleAddItem = async (
    event: React.MouseEvent<HTMLButtonElement>,
    productId: string
  ) => {
    event.preventDefault();
    const variantId = product.variants?.[0]?.id;
    if (variantId) {
      try {
        await addItem(productId, 1);
      } catch (error) {
        console.error("Error adding item to cart:", error);
        // Optionally display a user-friendly error message here
      }
    }
  };

  const variant = product.variants && product.variants[0];
  const price: MoneyAmount | undefined = variant?.prices.find(
    (price) => price.currency_code === currency?.code
  );

  return (
    <div className="relative">
      <LocalizedClientLink href={`/products/${product.handle}`} key={product.id}>
        <div className="overflow-hidden bg-gray-100 rounded-md aspect-square">
          {product.thumbnail && (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="object-cover w-full h-full"
            />
          )}
        </div>
      </LocalizedClientLink>
      <div className="mt-4">
        <LocalizedClientLink href={`/products/${product.handle}`} key={product.id}>
          <h3 className="text-sm text-gray-700">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.title}
          </h3>
        </LocalizedClientLink>
        <p className="mt-1 text-lg font-medium text-gray-900">
          {price && currency
            ? formatAmount({
                amount: Number(price?.amount),
                currency_code: currency.code,
              })
            : ""}
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4">
        <Button
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleAddItem(event, product.id)}
          className="w-full"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductRail;
