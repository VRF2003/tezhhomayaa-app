import { CommerceBuilder } from "@/components/admin/CommerceBuilder";

export const metadata = { title: "Commerce Builder — Admin" };

export default function CommerceBuilderPage() {
  return <CommerceBuilder apiEndpoint="/api/commerce" backUrl="/admin/content" />;
}
