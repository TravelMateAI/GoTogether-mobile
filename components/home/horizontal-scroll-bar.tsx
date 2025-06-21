import { LocationDetail } from "@/types/location-types";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ScrollButton {
  route: string;
  loading: boolean;
}

interface HorizontalScrollBarProps {
  title: string;
  cardData: LocationDetail[];
  scrollButton: ScrollButton;
  handleNavigation: (route: string) => void;
  images: any[]; // Fallback images array
}

const HorizontalScrollBar: React.FC<HorizontalScrollBarProps> = ({
  title,
  cardData,
  scrollButton,
  handleNavigation,
  images,
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

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold">{title}</Text>
        <TouchableOpacity onPress={() => handleNavigation(scrollButton.route)}>
          <Text className="text-indigo-600">See all</Text>
        </TouchableOpacity>
      </View>
      {scrollButton.loading ? (
        <ActivityIndicator size="large" color="#6366F1" className="my-4" />
      ) : (
        <FlatList
          data={cardData.slice(0, 10)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className="w-48 h-32 mr-4 rounded-2xl overflow-hidden"
              onPress={() => {
                // Handle item press - could navigate to details screen
                console.log(
                  "Selected location:",
                  item.name,
                  "Place ID:",
                  item.place_id
                );
              }}
            >
              <ImageBackground
                source={getImageSource(item, index)}
                className="w-full h-full justify-end"
                imageStyle={{ borderRadius: 16 }}
                resizeMode="cover"
              >
                <View className="absolute inset-0 bg-black/35 rounded-2xl" />
                <View className="absolute bottom-0 left-0 right-0 p-3">
                  <Text
                    className="text-white text-sm font-semibold"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  {item.rating && (
                    <View className="flex-row items-center mt-1">
                      <Text className="text-yellow-400 text-xs">⭐</Text>
                      <Text className="text-white text-xs ml-1">
                        {formatRating(item.rating)}
                      </Text>
                      {item.user_ratings_total && (
                        <Text className="text-gray-300 text-xs ml-1">
                          ({item.user_ratings_total})
                        </Text>
                      )}
                    </View>
                  )}
                  {item.opening_hours?.open_now !== undefined && (
                    <View className="mt-1">
                      <Text
                        className={`text-xs font-medium ${
                          item.opening_hours.open_now
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {item.opening_hours.open_now ? "Open now" : "Closed"}
                      </Text>
                    </View>
                  )}
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default HorizontalScrollBar;
