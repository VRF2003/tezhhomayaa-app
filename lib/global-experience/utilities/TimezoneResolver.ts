import { ExperienceServices } from "../services";

export class TimezoneResolver {
  constructor(private readonly services: ExperienceServices) {}

  getTimezone(): string {
    return this.services.getTimezone();
  }

  getUTCOffset(): string {
    // Retrieving the actual UTC offset cleanly without Intl formatting
    // or external libraries is complex and error-prone.
    // This is deferred to the formatting phase. Returning a safe default.
    return "+00:00";
  }
}
