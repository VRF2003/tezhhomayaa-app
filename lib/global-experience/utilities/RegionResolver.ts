import { ExperienceServices } from "../services";

export class RegionResolver {
  constructor(private readonly services: ExperienceServices) {}

  getRegion(): string {
    return this.services.getRegion();
  }

  isAsiaPacific(): boolean {
    return this.services.getRegion() === "asia-pacific";
  }

  isMiddleEast(): boolean {
    return this.services.getRegion() === "middle-east";
  }

  isEurope(): boolean {
    return this.services.getRegion() === "europe";
  }

  isNorthAmerica(): boolean {
    return this.services.getRegion() === "north-america";
  }
}
