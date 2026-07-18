/**
 * Future Architecture Extension Point: Pluralization
 *
 * Defines the contract for an engine (e.g. Intl.PluralRules) that determines 
 * if a number corresponds to "one", "few", "many", or "other" in a given language.
 */
export interface IPluralizationStrategy {
  getPluralForm(languageCode: string, count: number): "one" | "few" | "many" | "other";
}
