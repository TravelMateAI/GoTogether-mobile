import { LocationCategory, LocationDetail } from "@/types/location-types";

export const getHiddenLocations = async (
  location: string,
  radius: number,
  types: LocationCategory[],
  _apiBaseUrl: string
): Promise<LocationDetail[]> => {
  try {
    const [lat, lng] = location.split(",").map(Number);

    const query = `
      [out:json];
      (
        ${types
          .map(
            (type) =>
              `node["amenity"="${type}"](around:${radius},${lat},${lng});`
          )
          .join("\n")}
      );
      out body 20;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();

    const results: LocationDetail[] = data.elements.map((el: any) => ({
      name: el.tags?.name || "Unknown",
      location: {
        lat: el.lat?.toFixed(4) || null,
        lng: el.lon?.toFixed(4) || null,
      },
      website: el.tags?.website || null,
      openingHours: el.tags?.["opening_hours"] || null,
      phone: el.tags?.phone || null,
      address: {
        houseNumber: el.tags?.["addr:housenumber"] || null,
        street: el.tags?.["addr:street"] || null,
        city: el.tags?.["addr:city"] || null,
        state: el.tags?.["addr:state"] || null,
        country: el.tags?.["addr:country"] || null,
        postalCode: el.tags?.["addr:postcode"] || null,
      },
      type: el.tags?.["amenity"] || null,
    }));

    return results;
  } catch (error) {
    console.error("Overpass API Error:", error);
    throw error;
  }
};
