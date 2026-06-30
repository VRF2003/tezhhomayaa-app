import { Metadata } from "next";
import MobileLayoutBuilder from "@/components/admin/MobileLayoutBuilder";

export const metadata: Metadata = {
  title: "Mobile Layout - Appearance",
};

export default function MobileLayoutPage() {
  return <MobileLayoutBuilder />;
}
