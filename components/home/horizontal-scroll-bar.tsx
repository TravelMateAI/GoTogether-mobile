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
  images: any[];
}

const HorizontalScrollBar: React.FC<HorizontalScrollBarProps> = ({
  title,
  cardData,
  scrollButton,
  handleNavigation,
  images,
}) => {
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
          data={cardData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) =>
            `${item.name}-${item.location.lat}-${item.location.lng}`
          }
          renderItem={({ item, index }) => (
            <ImageBackground
              source={images[index % images.length]}
              className="w-48 h-32 mr-4 justify-center items-center rounded-2xl overflow-hidden"
              imageStyle={{ borderRadius: 16 }}
            >
              <View className="absolute inset-0 bg-black/35" />
              <Text className="absolute bottom-2 left-2 text-white text-sm font-semibold">
                {item.name}
              </Text>
            </ImageBackground>
          )}
        />
      )}
    </View>
  );
};

export default HorizontalScrollBar;
