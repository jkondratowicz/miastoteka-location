import { Location, LocationInfo, LocationService } from "./interfaces";
import axios, { AxiosError } from "axios";
import { osmResponseToLocationInfo } from "../util/osm";
import querystring from "querystring";
import { NominatimReverseResponse } from "./nominatim";

export class LocationIQ implements LocationService {
  constructor(private readonly apiKey: string, private readonly apiHost = "https://eu1.locationiq.com") {}

  async reverseLocation(location: Location): Promise<LocationInfo> {
    console.log(`Getting location from LocationIQ: ${location.latitude}, ${location.longitude}`);
    return axios
      .get<NominatimReverseResponse>(
        this.apiHost +
          "/v1/reverse?" +
          querystring.stringify({
            format: "json",
            lat: location.latitude,
            lon: location.longitude,
            "accept-language": "pl,en",
            key: this.apiKey,
          }),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => osmResponseToLocationInfo(res.data.address))
      .catch((e) => {
        if (e instanceof AxiosError && (e as AxiosError)?.response?.data) {
          console.log(JSON.stringify((e as AxiosError)?.response?.data, null, 2));
        }
        throw e;
      });
  }
}
