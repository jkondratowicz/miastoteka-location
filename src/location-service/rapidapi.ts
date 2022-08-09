import { Location, LocationInfo, LocationService } from "./interfaces";
import axios, { AxiosError } from "axios";
import { osmResponseToLocationInfo } from "../util/osm";
import { NominatimReverseResponse } from "./nominatim";

export class RapidApi implements LocationService {
  constructor(
    private readonly apiKey: string,
    private readonly apiHost = "https://forward-reverse-geocoding.p.rapidapi.com"
  ) {}

  async reverseLocation(location: Location): Promise<LocationInfo> {
    console.log(`Getting location from RapidAPI: ${location.latitude}, ${location.longitude}`);
    const options = {
      method: "GET",
      url: this.apiHost + "/v1/reverse",
      params: {
        lat: location.latitude,
        lon: location.longitude,
        "accept-language": "pl,en",
        polygon_threshold: "0.0",
      },
      headers: {
        "X-RapidAPI-Key": this.apiKey,
        "X-RapidAPI-Host": "forward-reverse-geocoding.p.rapidapi.com",
      },
    };
    return axios
      .request<NominatimReverseResponse>(options)
      .then((res) => osmResponseToLocationInfo(res.data.address))
      .catch((e) => {
        if (e instanceof AxiosError && (e as AxiosError)?.response?.data) {
          console.log(JSON.stringify((e as AxiosError)?.response?.data, null, 2));
        }
        throw e;
      });
  }
}
