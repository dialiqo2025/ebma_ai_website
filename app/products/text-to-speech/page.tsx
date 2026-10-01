import type { Metadata } from "next";
import { ProductPage } from "@/components/marketing/product-page";
import { ttsProduct } from "@/content/products";

export const metadata: Metadata = {
  title: "Text to speech — ebma AI",
  description: ttsProduct.description,
};

export default function TextToSpeechProductPage() {
  return <ProductPage product={ttsProduct} />;
}
