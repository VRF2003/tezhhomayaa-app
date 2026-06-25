import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CollectionBanner from "@/components/sections/CollectionBanner";
import ProductGrid from "@/components/sections/ProductGrid";

type CollectionPageUIProps = {
  categoryKey: string;
  meta: any;
  bannerData: any;
  finalProducts: any[];
  totalRaw: number;
  totalActive: number;
  totalDraft: number;
  smartCollection?: any;
};

export default function CollectionPageUI({ 
  categoryKey, 
  meta, 
  bannerData, 
  finalProducts, 
  totalRaw, 
  totalActive, 
  totalDraft, 
  smartCollection 
}: CollectionPageUIProps) {
  if (!meta && !smartCollection) {
    return (
      <main>
        <Navbar />
        <div style={{ paddingTop: "120px", textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.5rem", color: "var(--stone)", fontWeight: 300 }}>
            Collection coming soon.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <div style={{ background: "#F7F5F2", minHeight: "100vh" }}>
      <main>
        <Navbar />

        {/* Spacer for fixed header */}
        <div style={{ height: "80px" }} aria-hidden="true" />

        {/* Editorial Banner */}
        <CollectionBanner
          categoryKey={categoryKey}
          data={bannerData}
          presentation={smartCollection?.presentation}
        />


        {/* Product Grid */}
        <ProductGrid 
          products={finalProducts} 
          presentation={smartCollection?.presentation}
        />

        <Footer />
      </main>
    </div>
  );
}
