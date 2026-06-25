import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomepageClientWrapper from "@/components/sections/HomepageClientWrapper";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export default function HomePage() {
  let homepageData = null;
  try {
    const filePath = path.join(process.cwd(), "lib", "homepage.json");
    if (fs.existsSync(filePath)) {
      homepageData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (err) {
    console.error("Could not load homepage data", err);
  }

  const sections = homepageData?.sections || [];

  return (
    <main id="main-content" aria-label="Tezhhomayaa homepage">
      <Navbar />
      <HomepageClientWrapper initialSections={sections} />
      <Footer />
    </main>
  );
}
