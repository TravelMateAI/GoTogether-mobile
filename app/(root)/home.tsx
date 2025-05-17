import HorizontalScrollBar from "@/components/home/horizontal-scroll-bar";
import { getHiddenLocations } from "@/services/location-service";
import { LocationDetail } from "@/types/location-types";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROUTES } from "./routes";

export default function HomeScreen() {
  const getCurrentLatLng = async () => {
    const { coords } = await Location.getCurrentPositionAsync({});
    return {
      lat: coords.latitude,
      lng: coords.longitude,
    };
  };

  const [topPicks, setTopPicks] = useState<LocationDetail[]>([]);
  const [entertainment, setEntertainment] = useState<LocationDetail[]>([]);
  const [culture, setCulture] = useState<LocationDetail[]>([]);

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const { lat, lng } = await getCurrentLatLng();

        const response = await getHiddenLocations(
          `${lat},${lng}`,
          5000,
          ["restaurant"],
          ""
        );
        setTopPicks(response.slice(0, 10));
        console.log("Top Picks:", response);
      } catch (error) {
        console.error("Error fetching top picks:", error);
      }
    };
    fetchTopPicks();
  }, []);

  useEffect(() => {
    const fetchEntertainment = async () => {
      try {
        const { lat, lng } = await getCurrentLatLng();

        const response = await getHiddenLocations(
          `${lat},${lng}`,
          10000,
          ["cinema", "nightclub", "theatre"],
          ""
        );
        setEntertainment(response.slice(0, 10));
        console.log("Entertainment:", response);
      } catch (error) {
        console.error("Error fetching entertainment:", error);
      }
    };
    fetchEntertainment();
  }, []);

  useEffect(() => {
    const fetchCulture = async () => {
      try {
        const { lat, lng } = await getCurrentLatLng();

        const response = await getHiddenLocations(
          `${lat},${lng}`,
          20000,
          [
            "arts_centre",
            "community_centre",
            "events_venue",
            "fountain",
            "stage",
            "social_centre",
          ],
          ""
        );
        setCulture(response.slice(0, 10));
        console.log("Culture:", response);
      } catch (error) {
        console.error("Error fetching culture:", error);
      }
    };
    fetchCulture();
  }, []);

  const cardButtons = [
    {
      title: "Explore Nearby",
      route: "NEARBY",
      color: "bg-green-500",
      icon: "map",
    },
    {
      title: "Book Stay",
      route: "STAY",
      color: "bg-yellow-500",
      icon: "hotel",
    },
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
      title: "Top Picks",
      route: "TOP_PICKS",
      data: topPicks,
    },
    {
      title: "Entertainment",
      route: "ENTERTAINMENT",
      data: entertainment,
    },
    {
      title: "Culture",
      route: "CULTURE",
      data: culture,
    },
  ];

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
            cardData={btn.data}
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
