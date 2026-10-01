import type { Metadata } from "next";
import { ProductPage } from "@/components/marketing/product-page";
import { sttProduct } from "@/content/products";

export const metadata: Metadata = {
  title: "Speech to text — ebma AI",
  description: sttProduct.description,
};

export default function SpeechToTextProductPage() {
  return <ProductPage product={sttProduct} />;
}
