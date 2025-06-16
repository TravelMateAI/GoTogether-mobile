export interface LocationDetail {
  name: string;
  vicinity: string; // Corresponds to Address in Go struct with json:"vicinity"
  rating?: number;
  user_ratings_total?: number;
  place_id: string;
  types?: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: {
    // Entire object is optional
    open_now?: boolean; // Field within is also optional
  };
  photos?: Array<{
    // Array of photo objects is optional - original Google photo references
    photo_reference: string;
    height: number;
    width: number;
    html_attributions?: string[];
  }>;
  photo_urls?: string[]; // Field for directly usable photo URLs from the Go backend
  business_status?: string; // e.g., "OPERATIONAL" - Added this as it's common
}

export interface PlaceDetails {
  name: string;
  formatted_address: string;
  place_id: string;
  types?: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{
    // Original Google photo references
    photo_reference: string;
    height: number;
    width: number;
    html_attributions?: string[];
  }>;
  photo_urls?: string[]; // Fully constructed photo URLs
  reviews?: Array<{
    author_name: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
    author_url?: string;
    profile_photo_url?: string;
    language?: string;
  }>;
  website?: string;
  international_phone_number?: string;
  formatted_phone_number?: string;
  opening_hours?: {
    open_now?: boolean;
    periods?: Array<{
      open: { day: number; time: string; date?: string };
      close?: { day: number; time: string; date?: string };
    }>;
    weekday_text?: string[];
    permanently_closed?: boolean;
  };
  vicinity?: string;
  utc_offset_minutes?: number;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  business_status?: string;
}

export interface PlaceDetailsResponse {
  result: PlaceDetails;
  status: string;
  error_message?: string;
  html_attributions?: any[];
}

export interface LocationSearchResponse {
  results: LocationDetail[];
  status: string;
  error_message?: string;
  html_attributions?: any[];
}

export type LocationCategory =
  | "restaurant"
  | "cinema"
  | "nightclub"
  | "theatre"
  | "arts_centre"
  | "community_centre"
  | "events_venue"
  | "fountain"
  | "stage"
  | "museum"
  | "social_centre";
