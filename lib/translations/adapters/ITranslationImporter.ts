import { TranslationSet } from "../core/types";

/**
 * Future Architecture Extension Point: Importing
 *
 * Defines the contract for ingesting bulk translations from external systems
 * or files (JSON, CSV, XLIFF).
 */
export interface ITranslationImporter {
  /**
   * Parses raw data and returns a structured TranslationSet ready for validation and saving.
   */
  import(rawData: string | Buffer): Promise<TranslationSet>;
}
