// HorizontalCardList.tsx
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

interface CardItem {
  title: string;
  color: string;
}

interface ScrollButton {
  route: string;
}

interface HorizontalScrollBarProps {
  title: string;
  cardData: CardItem[];
  scrollButton: ScrollButton;
  handleNavigation: (route: string) => void;
  key: number;
}

const HorizontalScrollBar: React.FC<HorizontalScrollBarProps> = ({
  title,
  cardData,
  scrollButton,
  handleNavigation,
  key,
}) => {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold">{title}</Text>
        <TouchableOpacity
          key={key}
          onPress={() => handleNavigation(scrollButton.route)}
        >
          <Text className="text-indigo-600">See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={cardData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View
            className={`w-40 h-24 mr-4 rounded-2xl justify-center items-center ${item.color}`}
          >
            <Text className="text-white font-semibold">{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HorizontalScrollBar;
