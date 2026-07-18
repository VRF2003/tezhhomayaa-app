import { ExperienceServices } from "../services";

export class LocaleResolver {
  constructor(private readonly services: ExperienceServices) {}

  getLocale(): string {
    return this.services.getLocale();
  }

  getLanguage(): string {
    return this.services.getLanguage();
  }

  getLanguageCode(): string {
    // Extract language code from locale (e.g. "en" from "en-IN")
    const locale = this.services.getLocale();
    return locale.split("-")[0] || locale;
  }

  getCountryCode(): string {
    return this.services.getCountryCode();
  }

  isRTL(): boolean {
    // IMPORTANT: For now isRTL() must always return false.
    // RTL support is intentionally deferred.
    return false;
  }
}
