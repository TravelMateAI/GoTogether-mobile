import HorizontalScrollBar from "@/components/home/horizontal-scroll-bar";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROUTES } from "./routes";

const cardButtons = [
  {
    title: "Explore Nearby",
    route: "NEARBY",
    color: "bg-green-500",
    icon: "map",
  },
  { title: "Book Stay", route: "STAY", color: "bg-yellow-500", icon: "hotel" },
  {
    title: "Food & Fun",
    route: "FOOD",
    color: "bg-rose-500",
    icon: "restaurant",
  },
  {
    title: "Language Help",
    route: "LANGUAGE",
    color: "bg-sky-500",
    icon: "language",
  },
];

const scrollButtons = [
  {
    title: "Hidden Gems",
    route: "HIDDEN_GEMS",
    color: "bg-teal-500",
    icon: "place",
  },
  {
    title: "Local Events",
    route: "EVENTS",
    color: "bg-purple-500",
    icon: "event",
  },
  {
    title: "Top Picks",
    route: "TOP_PICKS",
    color: "bg-orange-500",
    icon: "star",
  },
];

// 🆕 Mock cards for Hidden Gems and Local Events
const cardData = [
  { title: "Secret Beach", color: "bg-indigo-300" },
  { title: "Grand Palace", color: "bg-orange-300" },
  { title: "Hidden Waterfall", color: "bg-green-300" },
  { title: "Night Market", color: "bg-pink-300" },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleNavigation = (routeKey: keyof typeof ROUTES) => {
    router.push(ROUTES[routeKey]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-5">
        {/* 🆕 Greeting section */}
        <View className="flex-row justify-between items-center mt-2 mb-4">
          <View>
            <Text className="text-xl font-bold text-indigo-700">
              Hello, Alex!
            </Text>
            <Text className="text-gray-500">Where are you headed today?</Text>
          </View>
          <View className="bg-indigo-500 w-10 h-10 rounded-full justify-center items-center">
            <Text className="text-white font-bold">A</Text>
          </View>
        </View>

        {/* 🆕 Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2 mb-6">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search destinations, activities..."
            className="flex-1 ml-2"
          />
          <Ionicons name="mic" size={20} color="gray" />
        </View>

        {/* 🆕 Feature Buttons Grid */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {cardButtons.map((btn, index) => (
            <TouchableOpacity
              key={index}
              className={`w-[30%] aspect-square ${btn.color} rounded-2xl justify-center items-center mb-4`}
              onPress={() => handleNavigation(btn.route as keyof typeof ROUTES)}
            >
              <MaterialIcons name={btn.icon as any} size={24} color="white" />
              <Text className="text-white text-sm font-semibold text-center mt-2">
                {btn.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {scrollButtons.map((btn, index) => (
          <HorizontalScrollBar
            title={btn.title}
            key={index}
            cardData={cardData}
            scrollButton={btn}
            handleNavigation={(route) =>
              handleNavigation(route as keyof typeof ROUTES)
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
