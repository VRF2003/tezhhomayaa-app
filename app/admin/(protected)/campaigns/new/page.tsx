import { createCampaignAction } from "../actions";

export default async function NewCampaignPage() {
  await createCampaignAction();
  return null;
}
