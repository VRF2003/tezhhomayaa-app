import { TranslationSet, TranslationHealth } from "../core/types";
import { ITranslationRepository } from "../repositories/ITranslationRepository";
import { TranslationResolver } from "../resolvers/TranslationResolver";
import { Market } from "@/lib/market/types";
import { RuntimeContext, ProductionRuntimeContext } from "@/lib/preview/core/types";

export class TranslationService {
  private readonly DEFAULT_FALLBACK_LANG = "en";

  constructor(private repo: ITranslationRepository) {}

  /**
   * Resolves a namespace for a given language and market.
   * If the requested language is completely missing, it falls back to the system default (en).
   */
  async resolveNamespace(namespace: string, languageCode: string, market: Market, runtime: RuntimeContext = new ProductionRuntimeContext()): Promise<Record<string, string>> {
    const sets = await this.repo.findByNamespace(namespace);
    if (!sets || sets.length === 0) return {};

    let dictionary = TranslationResolver.resolveNamespace(languageCode, market, sets, runtime);

    // Ultimate Safety Fallback: If no translations found for this language at all, fallback to English.
    if (Object.keys(dictionary).length === 0 && languageCode !== this.DEFAULT_FALLBACK_LANG) {
      dictionary = TranslationResolver.resolveNamespace(this.DEFAULT_FALLBACK_LANG, market, sets, runtime);
    }

    return dictionary;
  }

  /**
   * Translates a single key, applying variable interpolation.
   * Note: For rendering many keys, it's highly recommended to use resolveNamespace 
   * and interpolate locally to avoid repetitive database hits.
   */
  async translate(namespace: string, key: string, languageCode: string, market: Market, variables?: Record<string, string | number>, runtime: RuntimeContext = new ProductionRuntimeContext()): Promise<string> {
    const dictionary = await this.resolveNamespace(namespace, languageCode, market, runtime);
    const template = dictionary[key];

    if (!template) {
      return `[Missing: ${namespace}.${key}]`;
    }

    return this.interpolate(template, variables);
  }

  /**
   * Pure variable interpolation logic.
   * Example: "Hello {name}" + { name: "John" } -> "Hello John"
   */
  interpolate(template: string, variables?: Record<string, string | number>): string {
    if (!variables) return template;
    
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match;
    });
  }

  /**
   * Validates a TranslationSet before it can be published.
   */
  validate(set: TranslationSet): TranslationHealth {
    const messages: string[] = [];
    
    if (!set.name) messages.push("Set Name is required.");
    if (set.entries.length === 0) messages.push("Translation Set must contain at least one entry.");

    const keyMap = new Set<string>();

    for (const entry of set.entries) {
      if (!entry.namespace) messages.push(`Entry '${entry.id}' is missing a namespace.`);
      if (!entry.languageCode) messages.push(`Entry '${entry.id}' is missing a languageCode.`);
      if (!entry.value || entry.value.trim() === "") messages.push(`Entry '${entry.id}' has an empty value.`);

      // Broken Placeholder check
      if (entry.value.includes("{") && !entry.value.includes("}")) {
        messages.push(`Entry '${entry.id}' has an unclosed placeholder '{'.`);
      }
      if (entry.value.includes("}") && !entry.value.includes("{")) {
        messages.push(`Entry '${entry.id}' has a dangling placeholder '}'.`);
      }

      // Internal Duplicate check
      const uniqueKey = `${entry.namespace}:${entry.translationKey}:${entry.languageCode}:${entry.marketId || 'GLOBAL'}`;
      if (keyMap.has(uniqueKey)) {
        messages.push(`Duplicate key detected in set: '${uniqueKey}'.`);
      }
      keyMap.add(uniqueKey);
    }

    if (messages.length > 0) {
      return { status: "INVALID", messages };
    }

    return { status: "HEALTHY", messages: ["All checks passed."] };
  }
}
