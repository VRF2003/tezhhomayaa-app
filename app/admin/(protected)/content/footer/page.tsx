import { FooterBuilder } from "@/components/admin/FooterBuilder";

export default function FooterContentPage() {
  return (
    <FooterBuilder 
      apiEndpoint="/api/footer"
      pageTitle="Footer Builder"
      backUrl="/admin/content"
      previewUrl="/?preview_footer=true"
    />
  );
}
