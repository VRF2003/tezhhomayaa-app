"use server";

import { revalidatePath } from "next/cache";
import { PromotionService } from "@/lib/promotions/services/PromotionService";
import { PromotionStatus } from "@/lib/promotions/models";

const promotionService = new PromotionService();

export async function changePromotionStatusAction(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as PromotionStatus;
  try {
    await promotionService.changeStatus(id, status, "admin");
    revalidatePath("/admin/promotions");
  } catch (error) {
    console.error("Error changing status:", error);
  }
}

export async function duplicatePromotionAction(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await promotionService.duplicatePromotion(id, "admin");
    revalidatePath("/admin/promotions");
  } catch (error) {
    console.error(error);
  }
}

export async function createPromotionAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const appliesTo = data.appliesTo as string;
    const targetIdsRaw = data.targetIds as string;
    let rewardTargetIds: string[] | undefined = undefined;
    if (appliesTo !== 'ENTIRE_ORDER' && targetIdsRaw) {
      rewardTargetIds = targetIdsRaw.split(',').map(id => id.trim()).filter(id => id.length > 0);
    }

    const rewardMinItemPriceRaw = data.rewardMinItemPrice as string;
    let rewardMinItemPrice: number | undefined = undefined;
    if (rewardMinItemPriceRaw) {
      rewardMinItemPrice = Number(rewardMinItemPriceRaw);
    }

    const newPromo = await promotionService.createPromotion({
      name: data.name as string,
      code: data.code ? data.code as string : undefined,
      type: "AUTOMATIC",
      discountValue: 0,
      status: "ACTIVE",
      validFrom: data.validFrom as string || null,
      validUntil: data.validUntil as string || null,
      timezone: "UTC",
      createdBy: "admin",
      updatedBy: "admin",
      eligibility: {
        firstOrderOnly: data.firstOrderOnly === "on"
      },
      trigger: {
        type: (data.triggerType as any) || 'MIN_CART_VALUE',
        value: parseInt(data.triggerValue as string || "0")
      },
      reward: {
        type: (data.rewardType as any) || 'PERCENTAGE_DISCOUNT',
        value: parseInt(data.rewardValue as string || "0"),
        targetIds: rewardTargetIds && rewardTargetIds.length > 0 ? rewardTargetIds : undefined,
        minItemPrice: rewardMinItemPrice
      }
    });
    revalidatePath("/admin/promotions");
    return { success: true, id: newPromo.id };
  } catch (error: any) {
    console.error("Error creating promotion:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

export async function updatePromotionAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const data = Object.fromEntries(formData);
    
    const appliesTo = data.appliesTo as string;
    const targetIdsRaw = data.targetIds as string;
    let rewardTargetIds: string[] | undefined = undefined;
    if (appliesTo !== 'ENTIRE_ORDER' && targetIdsRaw) {
      rewardTargetIds = targetIdsRaw.split(',').map(id => id.trim()).filter(id => id.length > 0);
    }

    const rewardMinItemPriceRaw = data.rewardMinItemPrice as string;
    let rewardMinItemPrice: number | undefined = undefined;
    if (rewardMinItemPriceRaw) {
      rewardMinItemPrice = Number(rewardMinItemPriceRaw);
    }

    await promotionService.updatePromotion(id, {
      name: data.name as string,
      code: data.code ? data.code as string : undefined,
      validFrom: data.validFrom as string || null,
      validUntil: data.validUntil as string || null,
      eligibility: {
        firstOrderOnly: data.firstOrderOnly === "on"
      },
      trigger: {
        type: (data.triggerType as any) || 'MIN_CART_VALUE',
        value: parseInt(data.triggerValue as string || "0")
      },
      reward: {
        type: (data.rewardType as any) || 'PERCENTAGE_DISCOUNT',
        value: parseInt(data.rewardValue as string || "0"),
        targetIds: rewardTargetIds && rewardTargetIds.length > 0 ? rewardTargetIds : undefined,
        minItemPrice: rewardMinItemPrice
      }
    });
    
    revalidatePath("/admin/promotions");
    revalidatePath(`/admin/promotions/${id}`);
    return { success: true, id };
  } catch (error: any) {
    console.error("Error updating promotion:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

export async function deletePromotionAction(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await promotionService.deletePromotion(id);
    revalidatePath("/admin/promotions");
  } catch(error) {
    console.error(error);
  }
}

import { redirect } from "next/navigation";

export async function deletePromotionAndRedirectAction(formData: FormData) {
  const id = formData.get("id") as string;
  await promotionService.deletePromotion(id);
  revalidatePath("/admin/promotions");
  redirect("/admin/promotions");
}

export async function seedDummyPromotionsAction() {
  const all = await promotionService.getAllPromotions();
  if (all.length > 0) return; // Only seed if empty

  await promotionService.createPromotion({
    name: "Summer VIP Exclusive",
    code: "SUMMERVIP20",
    type: "PERCENTAGE",
    discountValue: 20,
    status: "ACTIVE",
    validFrom: "2026-06-01T00:00:00Z",
    validUntil: "2026-08-31T23:59:59Z",
    timezone: "UTC",
    createdBy: "admin",
    updatedBy: "admin",
    eligibility: { firstOrderOnly: false },
    trigger: { type: 'MIN_CART_VALUE', value: 2000 },
    reward: { type: 'PERCENTAGE_DISCOUNT', value: 20 },
    assignment: {
      participantId: "vip_group_1",
      participantName: "VIP Tier 1",
      assignmentType: "VIP"
    }
  });

  await promotionService.createPromotion({
    name: "Buy 3 Get Cheapest Free",
    type: "BUY_X_GET_Y",
    discountValue: 100,
    status: "ACTIVE",
    validFrom: "2026-09-01T00:00:00Z",
    validUntil: null,
    timezone: "UTC",
    createdBy: "admin",
    updatedBy: "admin",
    eligibility: { firstOrderOnly: false },
    trigger: { type: 'MIN_QUANTITY', value: 3 },
    reward: { type: 'CHEAPEST_ITEM_FREE' }
  });
}
