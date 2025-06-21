import { LocationDetail } from "@/types/location-types";
import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

interface LocationCardProps {
  item: LocationDetail;
  index: number;
  images: any[]; // Fallback images array
  onPress?: (item: LocationDetail) => void;
  cardStyle?: "horizontal" | "grid";
}

const LocationCard: React.FC<LocationCardProps> = ({
  item,
  index,
  images,
  onPress,
  cardStyle = "grid",
}) => {
  const getImageSource = (item: LocationDetail, index: number) => {
    // Use API photo URLs if available, otherwise use fallback images
    if (item.photo_urls && item.photo_urls.length > 0) {
      return { uri: item.photo_urls[0] };
    }
    return images[index % images.length];
  };

  const formatRating = (rating?: number) => {
    return rating ? rating.toFixed(1) : null;
  };

  const getCardDimensions = () => {
    if (cardStyle === "horizontal") {
      return "w-48 h-32";
    }
    return "w-full h-48"; // Grid style - full width with responsive height
  };

  return (
    <TouchableOpacity
      className={`${getCardDimensions()} ${
        cardStyle === "horizontal" ? "mr-4" : "mb-4"
      } rounded-2xl overflow-hidden shadow-lg`}
      onPress={() => onPress?.(item)}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={getImageSource(item, index)}
        className="w-full h-full justify-end"
        imageStyle={{ borderRadius: 16 }}
        resizeMode="cover"
      >
        {/* Gradient overlay for better text readability */}
        <View className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl" />

        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Text
            className="text-white text-base font-bold mb-1"
            numberOfLines={2}
          >
            {item.name}
          </Text>

          {item.vicinity && (
            <Text className="text-gray-200 text-xs mb-2" numberOfLines={1}>
              📍 {item.vicinity}
            </Text>
          )}

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              {item.rating && (
                <View className="flex-row items-center bg-black/40 px-2 py-1 rounded-full">
                  <Text className="text-yellow-400 text-xs">⭐</Text>
                  <Text className="text-white text-xs ml-1 font-medium">
                    {formatRating(item.rating)}
                  </Text>
                  {item.user_ratings_total && (
                    <Text className="text-gray-300 text-xs ml-1">
                      (
                      {item.user_ratings_total > 999
                        ? `${Math.floor(item.user_ratings_total / 1000)}k`
                        : item.user_ratings_total}
                      )
                    </Text>
                  )}
                </View>
              )}
            </View>

            {item.opening_hours?.open_now !== undefined && (
              <View className="bg-black/40 px-2 py-1 rounded-full">
                <Text
                  className={`text-xs font-medium ${
                    item.opening_hours.open_now
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {item.opening_hours.open_now ? "🟢 Open" : "🔴 Closed"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default LocationCard;
