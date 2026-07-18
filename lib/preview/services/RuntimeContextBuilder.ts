import { cookies } from "next/headers";
import { PreviewJwtPayload, PreviewRuntimeContext, ProductionRuntimeContext, RuntimeContext } from "../core/types";
import { PreviewService } from "./PreviewService";

export class RuntimeContextBuilder {
  /**
   * Constructs the appropriate RuntimeContext for the current request.
   * Reads the 'tezhhomayaa-preview' cookie if present.
   */
  static async build(): Promise<RuntimeContext> {
    try {
      const cookieStore = await cookies();
      const previewToken = cookieStore.get("tezhhomayaa-preview")?.value;

      if (previewToken) {
        // Will throw if tampered or expired
        const payload = PreviewService.validateToken(previewToken);
        
        // If it specifies a preview date, parse it, otherwise use Date.now()
        const currentDate = payload.previewDate ? new Date(payload.previewDate) : new Date();
        
        return new PreviewRuntimeContext(
          currentDate,
          payload.draftContentEnabled,
          payload.previewSessionId
        );
      }
    } catch (e) {
      // If validation fails (expired or tampered), fallback safely to Production.
      // In a real app we might want to log this or clear the invalid cookie.
    }

    return new ProductionRuntimeContext();
  }

  /**
   * Helper to retrieve full preview payload from cookie if active.
   * Useful for overriding MarketBridge contexts (Market & Language).
   */
  static async getPreviewPayload(): Promise<PreviewJwtPayload | null> {
    try {
      const cookieStore = await cookies();
      const previewToken = cookieStore.get("tezhhomayaa-preview")?.value;
      if (previewToken) {
        return PreviewService.validateToken(previewToken);
      }
    } catch (e) {
      return null;
    }
    return null;
  }
}
