import type { Metadata } from "next";
import { ProductPage } from "@/components/marketing/product-page";
import { llmProduct } from "@/content/products";

export const metadata: Metadata = {
  title: "LLM Studio — ebma AI",
  description: llmProduct.description,
};

export default function LlmProductPage() {
  return <ProductPage product={llmProduct} />;
}
