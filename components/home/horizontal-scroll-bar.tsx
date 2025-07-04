import { LocationDetail } from "@/types/location-types";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LocationCard from "./location-card";

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
  const router = useRouter();
  // Function to handle location card press
  const handleLocationPress = (item: LocationDetail) => {
    console.log("Selected location:", item.name, "Place ID:", item.place_id);
    router.push({
      pathname: "/location-details/[placeId]",
      params: { placeId: item.place_id },
    });
  };

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4 px-4">
        <Text className="text-xl font-bold text-gray-900">{title}</Text>
        <TouchableOpacity onPress={() => handleNavigation(scrollButton.route)}>
          <Text className="text-indigo-600 font-medium">See all</Text>
        </TouchableOpacity>
      </View>

      {scrollButton.loading ? (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="text-gray-500 mt-2">Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={cardData.slice(0, 10)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item, index }) => (
            <LocationCard
              item={item}
              index={index}
              images={images}
              onPress={handleLocationPress}
              cardStyle="horizontal"
            />
          )}
        />
      )}
    </View>
  );
};

export default HorizontalScrollBar;
