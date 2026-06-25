import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono } from "next/font/google";
import "./globals.css";
import StoreProviders from "@/components/ecommerce/StoreProviders";
import { getAllProducts } from "@/lib/collections";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TEZHHOMAYAA — Form Beyond Motion",
  description:
    "A sculptural luxury house. Where art becomes movement. Editorial fashion for those who inhabit the space between silence and form.",
  keywords: ["luxury fashion", "editorial", "sculptural", "avant-garde", "Tezhhomayaa"],
  openGraph: {
    title: "TEZHHOMAYAA — Form Beyond Motion",
    description: "Where art becomes movement.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const allProducts = getAllProducts();
  return (
    <html lang="en" className={`${cormorant.variable} ${dmMono.variable}`}>
      <body className="bg-white text-obsidian">
        {/* Devasia font is loaded via @font-face in globals.css */}
        <div className="grain-overlay" aria-hidden="true" />
        <StoreProviders allProducts={allProducts}>{children}</StoreProviders>
      </body>
    </html>
  );
}

