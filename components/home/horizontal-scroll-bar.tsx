import { LocationDetail } from "@/types/location-types";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
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
}

const HorizontalScrollBar: React.FC<HorizontalScrollBarProps> = ({
  title,
  cardData,
  scrollButton,
  handleNavigation,
}) => {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold">{title}</Text>
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
          renderItem={({ item }) => (
            <View
              className={`w-40 h-24 mr-4 rounded-2xl justify-center items-center bg-purple-300`}
            >
              <Text className="text-white font-semibold">{item.name}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default HorizontalScrollBar;
