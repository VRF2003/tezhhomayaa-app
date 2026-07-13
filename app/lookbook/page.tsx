import { promises as fs } from 'fs';
import path from 'path';
import LookbookClient from "./LookbookClient";

export const metadata = {
  title: "Lookbook | Tezhhomayaa",
  description: "Discover the design collections of Tezhhomayaa.",
};

export default async function LookbookPage() {
  const dataFilePath = path.join(process.cwd(), 'lib', 'lookbook.json');
  let slides = [];
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    slides = JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to read lookbook data:', error);
  }

  return (
    <main style={{ background: "#1a1a18" }}>
      <LookbookClient initialSlides={slides} />
    </main>
  );
}
