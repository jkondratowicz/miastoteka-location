export type Location = { latitude: number; longitude: number };

export type LocationInfo = {
  country: string | null;
  city: string | null;
  district: string | null;
  area: string | null;
  rawLocationData?: any;
};

export interface LocationService {
  reverseLocation: (location: Location) => Promise<LocationInfo>;
}
