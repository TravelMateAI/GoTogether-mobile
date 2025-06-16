import { BASE_URL_API } from "@/config";
import {
  LocationCategory,
  LocationDetail,
  LocationSearchResponse,
  PlaceDetails,
  PlaceDetailsResponse,
} from "@/types/location-types";

// Create a simple fetch wrapper similar to ky functionality
const createApiClient = (baseUrl: string) => {
  const request = async (url: string, options: RequestInit = {}) => {
    const fullUrl = `${baseUrl}/${url}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };

    const response = await fetch(fullUrl, defaultOptions);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    if (!text || text.trim() === "") return null;

    return JSON.parse(text);
  };

  return {
    get: (url: string) => ({
      json: async <T>() => request(url, { method: "GET" }) as Promise<T>,
    }),
    post: (url: string, data?: any) => ({
      json: async <T>() =>
        request(url, {
          method: "POST",
          body: data ? JSON.stringify(data) : undefined,
        }) as Promise<T>,
    }),
  };
};

const apiClient = createApiClient(BASE_URL_API);

export const getHiddenLocations = async (
  location: string,
  radius: number,
  types: LocationCategory[],
  apiBaseUrl: string = BASE_URL_API
): Promise<LocationDetail[]> => {
  try {
    // Convert types array to a query string for Google Places API
    const googlePlacesTypes = mapToGooglePlacesTypes(types);
    const query = googlePlacesTypes.join(" OR ");

    // Use the same endpoint structure as your web app
    // Assuming you have a search endpoint similar to location-data
    const response = await apiClient
      .get(
        `maps/places?query=${encodeURIComponent(
          query
        )}&location=${encodeURIComponent(location)}&radius=${radius}`
      )
      .json<LocationSearchResponse>();

    if (response.status === "OK") {
      // Filter results by radius if needed (additional client-side filtering)
      const [lat, lng] = location.split(",").map(Number);
      const filteredResults = response.results
        .filter((result) => {
          if (
            !result.geometry?.location?.lat ||
            !result.geometry?.location?.lng
          )
            return false;
          const distance = calculateDistance(
            lat,
            lng,
            result.geometry.location.lat,
            result.geometry.location.lng
          );
          return distance <= radius;
        })
        .slice(0, 20); // Limit to 20 results

      console.log(
        `Found ${filteredResults.length} locations for query "${query}" within ${radius} meters`
      );
      return filteredResults;
    } else {
      console.error(
        "Location search API error:",
        response.status,
        response.error_message
      );
      throw new Error(
        response.error_message || `API Error: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Location Service Error:", error);
    throw error;
  }
};

// Get detailed information for a specific place - matching your web app structure
export const getPlaceDetailsByIdAction = async (
  placeId: string
): Promise<{
  success: boolean;
  data?: PlaceDetails;
  error?: string;
  status?: string;
}> => {
  if (!placeId || placeId.trim() === "") {
    return {
      success: false,
      error: "Place ID is required.",
      status: "INVALID_REQUEST_CLIENT",
    };
  }

  try {
    // Use the same endpoint structure as your web app: maps/place/{placeId}
    const response = await apiClient
      .get(`maps/place/${placeId}`)
      .json<PlaceDetailsResponse>();

    if (response.status === "OK") {
      return {
        success: true,
        data: response.result,
        status: response.status,
      };
    } else {
      console.error(
        `API returned non-OK status for place ${placeId}: ${
          response.status
        } - ${response.error_message || ""}`
      );
      return {
        success: false,
        error: response.error_message || `API Error: ${response.status}`,
        status: response.status,
      };
    }
  } catch (error: any) {
    console.error(`Error fetching details for place ${placeId}:`, error);
    let errorMessage = "Failed to fetch place details.";
    let errorStatus = "UNKNOWN_ERROR_CLIENT";

    if (error.message?.includes("HTTP")) {
      // Handle HTTP errors
      errorMessage = error.message;
      const statusMatch = error.message.match(/HTTP (\d+)/);
      if (statusMatch) {
        errorStatus = `HTTP_${statusMatch[1]}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
      status: errorStatus,
    };
  }
};

// Helper function to map your location categories to Google Places types
const mapToGooglePlacesTypes = (types: LocationCategory[]): string[] => {
  const typeMapping: Record<string, string> = {
    restaurant: "restaurant",
    cinema: "movie_theater",
    nightclub: "night_club",
    theatre: "movie_theater",
    arts_centre: "art_gallery",
    community_centre: "community_center",
    events_venue: "event_venue",
    fountain: "tourist_attraction",
    stage: "performing_arts_theater",
    social_centre: "community_center",
    // Add more mappings as needed
  };

  return types.map((type) => typeMapping[type] || type);
};

// Helper function to calculate distance between two points
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};
