import CollectionPage from "@/components/layout/CollectionPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bags — TEZHHOMAYAA",
  description: "Architectural proportions. The Signature Bags collection.",
};

export default function BagsPage() {
  return <CollectionPage categoryKey="bags" />;
}
