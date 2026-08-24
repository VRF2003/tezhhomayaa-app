import { db } from "./lib/firebase";
import { doc, getDoc } from "firebase/firestore";

async function debugContent() {
  const docRef = doc(db, "lep_content_items", "ci-auto-1785154716014-0");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Content exists:", JSON.stringify(docSnap.data(), null, 2));
  } else {
    console.log("Content DOES NOT exist in DB!");
  }
}

debugContent().catch(console.error);
