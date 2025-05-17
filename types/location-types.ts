export type LocationCategory = "restaurant" | "park" | "museum" | string;

export interface LocationDetail {
  name: string;
  location: {
    lat?: number;
    lng?: number;
  };
  website?: string;
  openingHours?: string;
  phone?: string;
  address: {
    houseNumber?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  type?: string;
}
