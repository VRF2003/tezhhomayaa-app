import { InfrastructureEventBus } from "../../events/InfrastructureEventBus";
import { IndexPipeline } from "../pipelines/IndexPipeline";

export class SearchEventSubscriber {
  static register() {
    InfrastructureEventBus.subscribe("ContentPublished", async (payload: any) => {
      // payload expects { entityId, entityType, data }
      await IndexPipeline.runIncrementalUpdate(
        "tezhhomayaa_content", 
        payload.entityId, 
        payload.entityType, 
        payload.data
      );
    });

    InfrastructureEventBus.subscribe("ContentDeleted", async (payload: any) => {
      await IndexPipeline.runDeletion(
        "tezhhomayaa_content", 
        payload.entityId
      );
    });

    InfrastructureEventBus.subscribe("CollectionUpdated", async (payload: any) => {
      await IndexPipeline.runIncrementalUpdate(
        "tezhhomayaa_collections", 
        payload.entityId, 
        "COLLECTION", 
        payload.data
      );
    });
  }
}
