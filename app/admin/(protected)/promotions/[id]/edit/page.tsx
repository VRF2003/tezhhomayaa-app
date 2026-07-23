import React from "react";
import { notFound } from "next/navigation";
import { PromotionService } from "@/lib/promotions/services/PromotionService";
import EditPromotionForm from "./EditForm";

export default async function EditPromotionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = new PromotionService();
  const promo = await service.getPromotion(id);

  if (!promo) {
    notFound();
  }

  return <EditPromotionForm promo={promo} />;
}
