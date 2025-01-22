import React from "react";
import { useCart } from "@lib/context/cart-context";
import { Button } from "@components/ui/button";
import { Heading } from "@medusajs/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import type { Product, ProductVariant, MoneyAmount } from "@medusajs/types";
import { useCurrency } from "@lib/context/currency-context";
import type { Currency } from "@lib/types/currency";
import { formatAmount } from "@lib/util/format-amount";

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const { addItem } = useCart();
  const { currency } = useCurrency();

  const handleAddItem = async (
    event: React.MouseEvent<HTMLButtonElement>,
    productId: string,
  ) => {
    event.preventDefault();
    // Find the first variant to add to the cart
    const variantId = products.find(p => p.id === productId)?.variants?.[0]?.id;
    if (variantId) {
      try {
        await addItem(productId, 1, { variantId });
      } catch (error) {
        console.error("Error adding item to cart:", error);
        // Optionally display a user-friendly error message here
      }
    }
  };

  return (
    <div className="my-16">
      <Heading as="h2" className="mb-8 text-center">
        Featured Products
      </Heading>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products?.map((p) => {
          const variant = p.variants && p.variants[0];
          const price: MoneyAmount | undefined = variant?.prices.find(
            (price) => price.currency_code === currency?.code
          );

          return (
            <div key={p.id} className="relative">
              <LocalizedClientLink href={`/products/${p.handle}`} key={p.id}>
                <div className="overflow-hidden bg-gray-100 rounded-md aspect-square">
                  {p.thumbnail && (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              </LocalizedClientLink>
              <div className="mt-4">
                <LocalizedClientLink href={`/products/${p.handle}`} key={p.id}>
                  <h3 className="text-sm text-gray-700">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {p.title}
                  </h3>
                </LocalizedClientLink>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {price && currency
                    ? formatAmount({
                        amount: price?.amount,
                        currencyCode: currency.code,
                      })
                    : ""}
                </p>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4">
                <Button
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleAddItem(event, p.id)}
                  className="w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProducts;
