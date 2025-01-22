import { Metadata } from "next"
import { getFeaturedProducts } from "@lib/data/products";
import FeaturedProducts from "@modules/home/components/featured-products";
import Hero from "@modules/home/components/hero";

export const metadata: Metadata = {
  title: "Home",
  description: "Shop the latest spices and seasonings.",
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const products = await getFeaturedProducts();

  return (
    <>
      <Hero />
      <FeaturedProducts products={products} />
    </>
  );
}
