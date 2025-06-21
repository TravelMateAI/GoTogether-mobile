import HorizontalScrollBar from "@/components/home/horizontal-scroll-bar";
import { BASE_URL_API } from "@/config";
import { getHiddenLocations } from "@/services/location-service";
import { LocationDetail } from "@/types/location-types";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Linking,
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

  const [loadingTopPicks, setLoadingTopPicks] = useState(true);
  const [loadingEntertainment, setLoadingEntertainment] = useState(true);
  const [loadingCulture, setLoadingCulture] = useState(true);

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const { lat, lng } = await getCurrentLatLng();

        const response = await getHiddenLocations(
          `${lat},${lng}`,
          5000000,
          ["restaurant"],
          BASE_URL_API
        );
        setTopPicks(response.slice(0, 10));
      } catch (error) {
        console.error("Error fetching top picks:", error);
      } finally {
        setLoadingTopPicks(false);
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
          5000000,
          ["cinema"],
          BASE_URL_API
        );
        setEntertainment(response.slice(0, 10));
      } catch (error) {
        console.error("Error fetching entertainment:", error);
      } finally {
        setLoadingEntertainment(false);
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
          5000000,
          ["museum"],
          BASE_URL_API
        );
        setCulture(response.slice(0, 10));
      } catch (error) {
        console.error("Error fetching culture:", error);
      } finally {
        setLoadingCulture(false);
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
      emoji: "🧭",
      onClick: () => {
        const query = "things to do";
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          query
        )}`;
        Linking.openURL(url);
      },
    },
    {
      title: "Book Stay",
      route: "STAY",
      color: "bg-sky-500",
      icon: "hotel",
      emoji: "🏨",
      onClick: () => {
        const url = "https://www.booking.com";
        Linking.openURL(url);
      },
    },
    {
      title: "Food & Fun",
      route: "FOOD",
      color: "bg-rose-500",
      icon: "restaurant",
      emoji: "🍽",
      onClick: () => {
        const query = "restaurants";
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          query
        )}`;
        Linking.openURL(url);
      },
    },
    {
      title: "Language Help",
      route: "LANGUAGE",
      color: "bg-yellow-500",
      icon: "language",
      emoji: "🉐",
      onClick: () => handleNavigation("LANGUAGE" as keyof typeof ROUTES),
    },
  ];

  // Fallback images in case API doesn't provide photos
  const topPicksImages = [
    require("@/assets/images/top-picks/img1.jpg"),
    require("@/assets/images/top-picks/img2.jpg"),
    require("@/assets/images/top-picks/img3.jpg"),
    require("@/assets/images/top-picks/img4.jpg"),
    require("@/assets/images/top-picks/img5.jpg"),
    require("@/assets/images/top-picks/img6.jpg"),
    require("@/assets/images/top-picks/img7.jpg"),
    require("@/assets/images/top-picks/img8.jpg"),
    require("@/assets/images/top-picks/img9.jpg"),
    require("@/assets/images/top-picks/img10.jpg"),
  ];

  const entertainmentImages = [
    require("@/assets/images/entertainment/img1.jpg"),
    require("@/assets/images/entertainment/img2.jpg"),
    require("@/assets/images/entertainment/img3.jpg"),
    require("@/assets/images/entertainment/img4.jpg"),
    require("@/assets/images/entertainment/img5.jpg"),
    require("@/assets/images/entertainment/img6.jpg"),
    require("@/assets/images/entertainment/img7.jpg"),
    require("@/assets/images/entertainment/img8.jpg"),
    require("@/assets/images/entertainment/img9.jpg"),
    require("@/assets/images/entertainment/img10.jpg"),
  ];

  const cultureImages = [
    require("@/assets/images/culture/img1.jpg"),
    require("@/assets/images/culture/img2.jpg"),
    require("@/assets/images/culture/img3.jpg"),
    require("@/assets/images/culture/img4.jpg"),
    require("@/assets/images/culture/img5.jpg"),
    require("@/assets/images/culture/img6.jpg"),
    require("@/assets/images/culture/img7.jpg"),
    require("@/assets/images/culture/img8.jpg"),
    require("@/assets/images/culture/img9.jpg"),
    require("@/assets/images/culture/img10.jpg"),
  ];

  const scrollButtons = [
    {
      title: "Top Picks",
      route: "TOP_PICKS",
      data: topPicks,
      loading: loadingTopPicks,
      images: topPicksImages,
    },
    {
      title: "Entertainment",
      route: "ENTERTAINMENT",
      data: entertainment,
      loading: loadingEntertainment,
      images: entertainmentImages,
    },
    {
      title: "Culture",
      route: "CULTURE",
      data: culture,
      loading: loadingCulture,
      images: cultureImages,
    },
  ];

  const router = useRouter();

  const handleNavigation = (routeKey: keyof typeof ROUTES) => {
    router.push(ROUTES[routeKey]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-5">
        {/* Greeting section */}
        <View className="flex-row justify-between items-center mt-4 mb-4">
          <View>
            <Text className="text-2xl font-bold text-indigo-700">
              Hello, Lishan!
            </Text>
            <Text className="text-gray-500">Where are you headed today?</Text>
          </View>
          <View className="bg-indigo-500 w-10 h-10 rounded-full justify-center items-center">
            <Text className="text-white font-bold">L</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2 mb-4 mt-4">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search destinations, activities..."
            className="flex-1 ml-2"
          />
          <Ionicons name="mic" size={20} color="gray" />
        </View>

        {/* Feature Buttons Grid */}
        <View className="flex-row flex-wrap justify-between mt-5 mb-4 px-5">
          {cardButtons.map((btn, index) => (
            <TouchableOpacity
              key={index}
              className={`w-[47%] h-28 ${btn.color} rounded-2xl justify-center items-center mb-5`}
              onPress={btn.onClick}
            >
              <Text className="text-3xl">{btn.emoji}</Text>
              <Text className="text-white text-base font-semibold text-center mt-2">
                {btn.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View>
          {scrollButtons.map((btn, index) => (
            <HorizontalScrollBar
              title={btn.title}
              key={index}
              cardData={btn.data}
              scrollButton={btn}
              handleNavigation={(route) =>
                handleNavigation(route as keyof typeof ROUTES)
              }
              images={btn.images}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
