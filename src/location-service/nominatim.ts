import { Location, LocationInfo, LocationService } from "./interfaces";
import axios, { AxiosError } from "axios";
import { OsmAddress, osmResponseToLocationInfo } from "../util/osm";
import querystring from "querystring";

// @todo
const MIASTOTEKA_EMAIL = process.env.MIASTOTEKA_EMAIL ?? "miastoteka@gmail.com";

export interface NominatimReverseResponse {
  place_id?: number;
  licence?: string;
  osm_type?: string;
  osm_id?: number;
  lat?: string;
  lon?: string;
  display_name: string;
  address: OsmAddress;
  boundingbox?: string[];
}

export class Nominatim implements LocationService {
  constructor(private readonly apiHost = "https://nominatim.openstreetmap.org") {}

  async reverseLocation(location: Location): Promise<LocationInfo> {
    console.log(`Getting location from Nominatim: ${location.latitude}, ${location.longitude}`);
    return axios
      .get<NominatimReverseResponse>(
        this.apiHost +
          "/reverse?" +
          querystring.stringify({
            email: MIASTOTEKA_EMAIL,
            format: "json",
            lat: location.latitude,
            lon: location.longitude,
            "accept-language": "pl,en",
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
