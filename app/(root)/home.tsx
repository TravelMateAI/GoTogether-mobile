import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROUTES } from "./routes";

export default function HomeScreen() {
  const router = useRouter();

  const buttons = [
    { title: "Local Events", route: "EVENTS" },
    { title: "Food & Fun", route: "FOOD" },
    { title: "Language Help", route: "LANGUAGE" },
    { title: "Hidden Gems", route: "LOCATIONS" },
    { title: "Explore Nearby", route: "NEARBY" },
    { title: "Book Stay", route: "STAY" },
    { title: "Top Picks", route: "TOP_PICKS" },
  ];

  type RouteKeys = keyof typeof ROUTES;

  const handleNavigation = (routeName: RouteKeys) => {
    router.push(ROUTES[routeName]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white p-5">
        <Text className="text-3xl font-bold text-center mb-6 text-red-700">
          Discover Your City
        </Text>

        {buttons.map((btn) => (
          <TouchableOpacity
            key={btn.route}
            onPress={() => handleNavigation(btn.route as RouteKeys)}
            className="bg-red-600 p-4 my-2 rounded-2xl shadow-md"
          >
            <Text className="text-white text-center text-lg font-semibold">
              {btn.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
