import { getCurrentLatLng } from "@/app/(root)/home";
import { BASE_URL_API } from "@/config";
import { getHiddenLocations } from "@/services/location-service";
import { LocationCategory, LocationDetail } from "@/types/location-types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LocationCard from "./location-card";

interface LocationsScreenProps {
  title: string;
  subtitle?: string;
  categories: LocationCategory[];
  radius?: number;
  maxResults?: number;
  images: any[];
  screenType?: "grid" | "list";
}

const LocationsScreen: React.FC<LocationsScreenProps> = ({
  title,
  subtitle,
  categories,
  radius = 5000000,
  maxResults = 20,
  images,
  screenType = "grid",
}) => {
  const [locations, setLocations] = useState<LocationDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = async () => {
    try {
      setError(null);
      const { lat, lng } = await getCurrentLatLng();

      const response = await getHiddenLocations(
        `${lat},${lng}`,
        radius,
        categories,
        BASE_URL_API
      );

      // Limit results if maxResults is specified
      const limitedResults = maxResults
        ? response.slice(0, maxResults)
        : response;
      setLocations(limitedResults);
    } catch (error) {
      console.error(`Error fetching ${title.toLowerCase()}:`, error);
      setError(`Failed to load ${title.toLowerCase()}. Please try again.`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [categories, radius]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await fetchLocations();
  };

  const router = useRouter();
  // Function to handle location card press
  const handleLocationPress = (item: LocationDetail) => {
    console.log("Selected location:", item.name, "Place ID:", item.place_id);
    router.push({
      pathname: "/location-details/[placeId]",
      params: { placeId: item.place_id },
    });
  };

  const renderLocationCard = ({
    item,
    index,
  }: {
    item: LocationDetail;
    index: number;
  }) => {
    if (screenType === "list") {
      return (
        <View className="mb-4">
          <LocationCard
            item={item}
            index={index}
            images={images}
            onPress={handleLocationPress}
            cardStyle="grid"
          />
        </View>
      );
    }

    return (
      <View className="w-1/2 px-2">
        <LocationCard
          item={item}
          index={index}
          images={images}
          onPress={handleLocationPress}
          cardStyle="grid"
        />
      </View>
    );
  };

  const getStatsData = () => {
    const openNow = locations.filter(
      (item) => item.opening_hours?.open_now
    ).length;
    const highlyRated = locations.filter(
      (item) => item.rating && item.rating >= 4.0
    ).length;
    const hasPhotos = locations.filter(
      (item) => item.photo_urls && item.photo_urls.length > 0
    ).length;

    return { openNow, highlyRated, hasPhotos };
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="text-gray-600 mt-4">
          Loading {title.toLowerCase()}...
        </Text>
      </SafeAreaView>
    );
  }

  if (error && locations.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-red-500 text-lg font-semibold mb-2">Oops!</Text>
        <Text className="text-gray-600 text-center mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-indigo-600 px-6 py-3 rounded-full"
          onPress={fetchLocations}
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { openNow, highlyRated, hasPhotos } = getStatsData();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#6366F1"]}
            tintColor="#6366F1"
          />
        }
      >
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-gray-600 text-base">{subtitle}</Text>
            )}
          </View>

          {/* Error message if there's an error but we have cached data */}
          {error && locations.length > 0 && (
            <View className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 mb-4">
              <Text className="text-yellow-800 text-sm">{error}</Text>
            </View>
          )}

          {/* Stats */}
          {locations.length > 0 && (
            <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-indigo-600">
                    {locations.length}
                  </Text>
                  <Text className="text-gray-600 text-sm">Found</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-600">
                    {openNow}
                  </Text>
                  <Text className="text-gray-600 text-sm">Open Now</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-yellow-600">
                    {highlyRated}
                  </Text>
                  <Text className="text-gray-600 text-sm">Top Rated</Text>
                </View>
              </View>
            </View>
          )}

          {/* Locations Grid/List */}
          {locations.length > 0 ? (
            <FlatList
              data={locations}
              renderItem={renderLocationCard}
              keyExtractor={(item) => item.place_id}
              numColumns={screenType === "grid" ? 2 : 1}
              columnWrapperStyle={
                screenType === "grid"
                  ? { justifyContent: "space-between" }
                  : undefined
              }
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500 text-lg">
                No {title.toLowerCase()} found
              </Text>
              <Text className="text-gray-400 text-sm mt-2">
                Pull down to refresh or try adjusting your search
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LocationsScreen;
