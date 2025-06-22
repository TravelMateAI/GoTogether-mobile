import { BASE_URL_PLAN } from "@/config";
import { GOOGLE_API_KEY } from "@/keys";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

// Types
interface RouteData {
  routes: Array<{
    legs: Array<{
      startAddress: string;
      endAddress: string;
      distance: { text: string };
      duration: { text: string };
    }>;
    overviewPolyline: {
      points: string;
    };
  }>;
}

interface Place {
  placeId: string;
  name: string;
  vicinity: string;
  rating?: number;
  geometryLocation: {
    lat: number;
    lng: number;
  };
  photos?: Array<{
    photoReference: string;
  }>;
}

// API functions (you'll need to implement these based on your backend)
const getPathFindingResult = async (
  origin: string,
  destination: string
): Promise<RouteData> => {
  const response = await fetch(
    `${BASE_URL_PLAN || "http://localhost:8081"}/pipeline/path`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ origin, destination }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get route");
  }

  return response.json();
};

const searchNearbyPlaces = async (
  userId: string,
  destination: string
): Promise<{ results: Place[] }> => {
  const url = new URL(
    `${BASE_URL_PLAN || "http://localhost:8081"}/pipeline/search`
  );
  url.searchParams.append("userId", userId);
  url.searchParams.append("location", destination);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get nearby places");
  }

  return response.json();
};

import { Dimensions } from "react-native";

const mapContainerStyle = {
  height: 300,
  width: Dimensions.get("window").width,
};

const defaultCenter = {
  latitude: 6.9271,
  longitude: 79.8612,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}; // Default to Colombo

export default function PlannerScreen() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [planning, setPlanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const handlePlan = async () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert("Error", "Please enter both origin and destination");
      return;
    }

    setLoading(true);
    try {
      const routeResponse = await getPathFindingResult(origin, destination);
      setRouteData(routeResponse);

      const placeSearchResponse = await searchNearbyPlaces(
        "demo-user",
        destination
      );
      setPlaces(placeSearchResponse.results);

      setPlanning(true);

      // Fit bounds to show the route
      setTimeout(() => {
        if (
          mapRef.current &&
          routeResponse.routes?.[0]?.overviewPolyline?.points
        ) {
          const decodedPoints = decodePolyline(
            routeResponse.routes[0].overviewPolyline.points
          );
          if (decodedPoints.length > 0) {
            mapRef.current.fitToCoordinates(decodedPoints, {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            });
          }
        }
      }, 500);
    } catch (error) {
      console.error("Trip planning failed", error);
      Alert.alert("Error", "Failed to plan trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const decodePolyline = (encoded: string) => {
    const points: Array<{ latitude: number; longitude: number }> = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  const resetPlanning = () => {
    setPlanning(false);
    setRouteData(null);
    setPlaces([]);
    setSelectedPlaceId(null);
    setOrigin("");
    setDestination("");
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-slate-900">
      <View className="p-4">
        {/* Header */}
        <View className="mb-8 mt-5">
          <Text className="text-4xl font-bold text-gray-800 dark:text-slate-100">
            Trip Planner
          </Text>
          <Text className="text-lg text-gray-600 dark:text-slate-300">
            Plan your next adventure here!
          </Text>
        </View>

        {/* Input Form */}
        {!planning && (
          <View className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md space-y-4 mb-6">
            <TextInput
              placeholder="Enter origin"
              value={origin}
              onChangeText={setOrigin}
              className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 dark:text-white"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              placeholder="Enter destination"
              value={destination}
              onChangeText={setDestination}
              className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 dark:text-white"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              onPress={handlePlan}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 rounded-lg items-center"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-lg">
                  Plan Trip
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Planning Results */}
        {planning && routeData && (
          <View className="space-y-6">
            {/* Back Button */}
            <TouchableOpacity
              onPress={resetPlanning}
              className="bg-gray-500 px-4 py-2 rounded-lg self-start"
            >
              <Text className="text-white font-semibold">
                ← Back to Planning
              </Text>
            </TouchableOpacity>

            {/* Map */}
            <View className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md">
              <MapView
                ref={mapRef}
                style={mapContainerStyle}
                provider={PROVIDER_GOOGLE}
                initialRegion={defaultCenter}
              >
                <Polyline
                  coordinates={decodePolyline(
                    routeData.routes[0].overviewPolyline.points
                  )}
                  strokeColor="#1E90FF"
                  strokeWidth={5}
                />

                {places.map((place) => (
                  <Marker
                    key={place.placeId}
                    coordinate={{
                      latitude: place.geometryLocation.lat,
                      longitude: place.geometryLocation.lng,
                    }}
                    onPress={() => setSelectedPlaceId(place.placeId)}
                    pinColor={
                      selectedPlaceId === place.placeId ? "#FF6B6B" : "#4A90E2"
                    }
                  />
                ))}
              </MapView>
            </View>

            {/* Route Details */}
            <View className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <Text className="text-xl font-semibold mb-4 text-gray-800 dark:text-slate-200">
                Route Details
              </Text>
              <Text className="text-gray-600 dark:text-slate-300 mb-2">
                From{" "}
                <Text className="font-bold">
                  {routeData.routes[0].legs[0].startAddress}
                </Text>{" "}
                to{" "}
                <Text className="font-bold">
                  {routeData.routes[0].legs[0].endAddress}
                </Text>
              </Text>
              <Text className="text-gray-600 dark:text-slate-300">
                Distance: {routeData.routes[0].legs[0].distance.text} |
                Duration: {routeData.routes[0].legs[0].duration.text}
              </Text>
            </View>

            {/* Nearby Places */}
            <View className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <Text className="text-xl font-semibold mb-4 text-gray-800 dark:text-slate-200">
                Nearby Places
              </Text>
              <View className="space-y-4">
                {places.map((place) => {
                  const photoRef = place.photos?.[0]?.photoReference;
                  const photoUrl = photoRef
                    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`
                    : null;
                  const isSelected = selectedPlaceId === place.placeId;

                  return (
                    <TouchableOpacity
                      key={place.placeId}
                      onPress={() => setSelectedPlaceId(place.placeId)}
                      className={`border p-4 rounded-lg dark:border-slate-700 ${
                        isSelected
                          ? "border-blue-500 border-2"
                          : "border-gray-300"
                      }`}
                    >
                      {photoUrl && (
                        <Image
                          source={{ uri: photoUrl }}
                          className="w-full h-40 rounded-lg mb-2"
                          resizeMode="cover"
                        />
                      )}
                      <Text className="font-semibold text-gray-800 dark:text-slate-100 text-lg">
                        {place.name}
                      </Text>
                      <Text className="text-sm text-gray-500 dark:text-slate-300 mb-1">
                        {place.vicinity}
                      </Text>
                      {place.rating && (
                        <Text className="text-yellow-600 dark:text-yellow-400">
                          ⭐ {place.rating}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Footer */}
        <View className="mt-12 items-center">
          <Text className="text-sm text-gray-500 dark:text-slate-400">
            © {new Date().getFullYear()} GoTogether. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
