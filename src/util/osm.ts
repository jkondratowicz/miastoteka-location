import { LocationInfo } from "../location-service/interfaces";

export interface OsmAddress {
  amenity?: string;
  city?: string;
  city_district?: string;
  country?: string;
  country_code?: string;
  county?: string;
  hamlet?: string;
  house_number?: string;
  municipality?: string;
  neighbourhood?: string;
  postcode?: string;
  quarter?: string;
  region?: string;
  road?: string;
  state?: string;
  suburb?: string;
  village?: string;
}

export const osmResponseToLocationInfo = (osmResponse: OsmAddress): LocationInfo => {
  // @todo better algorithm outside of cities?
  return {
    country: osmResponse.country || null,
    city: osmResponse.city || null,
    district: osmResponse.suburb || osmResponse.municipality || null,
    area: osmResponse.quarter || osmResponse.neighbourhood || osmResponse.village || osmResponse.road || null,
    rawLocationData: osmResponse,
  };
};
