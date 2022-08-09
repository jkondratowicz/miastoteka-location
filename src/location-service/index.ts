import { Location, LocationInfo, LocationService } from "./interfaces";
import { Nominatim } from "./nominatim";
import { RapidApi } from "./rapidapi";
import { LocationIQ } from "./locationiq";

export class LocationServiceProxy implements LocationService {
  private services: LocationService[] = [];

  constructor(enableNominatim: boolean, rapidApiKey?: string, locationIqKey?: string) {
    if (enableNominatim) {
      this.services.push(new Nominatim());
    }

    if (rapidApiKey) {
      this.services.push(new RapidApi(rapidApiKey));
    }

    if (locationIqKey) {
      this.services.push(new LocationIQ(locationIqKey));
    }
  }

  async reverseLocation(location: Location): Promise<LocationInfo> {
    if (!this.services.length) {
      throw new Error("No location services configured");
    }

    const shuffledServices = this.services.slice(0).sort(() => 0.5 - Math.random());
    for (const service of shuffledServices) {
      try {
        return await service.reverseLocation(location);
      } catch (e: any) {
        console.error(e);
      }
    }

    // @todo validate location?

    throw new Error("None of the location services returned a valid response");
  }
}
