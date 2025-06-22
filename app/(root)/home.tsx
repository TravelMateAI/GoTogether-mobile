import HorizontalScrollBar from "@/components/home/horizontal-scroll-bar";
import { BASE_URL_API } from "@/config";
import { GOOGLE_API_KEY } from "@/keys";
import { getHiddenLocations } from "@/services/location-service";
import { LocationDetail } from "@/types/location-types";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../(auth)/user-context";
import { ROUTES } from "./routes";

export const getCurrentLatLng = async () => {
  const { coords } = await Location.getCurrentPositionAsync({});
  return {
    lat: coords.latitude,
    lng: coords.longitude,
  };
};

export default function HomeScreen() {
  const { user, logout, isLoading } = useUser();
  const [topPicks, setTopPicks] = useState<LocationDetail[]>([]);
  const [entertainment, setEntertainment] = useState<LocationDetail[]>([]);
  const [culture, setCulture] = useState<LocationDetail[]>([]);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  const [loadingTopPicks, setLoadingTopPicks] = useState(true);
  const [loadingEntertainment, setLoadingEntertainment] = useState(true);
  const [loadingCulture, setLoadingCulture] = useState(true);

  const router = useRouter();

  console.log("User in HomeScreen:", user);

  // Logout handler
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            setIsProfileModalVisible(false);
            await logout();
            router.replace("/(auth)/log-in");
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleProfileNavigation = () => {
    setIsProfileModalVisible(false);
    // Replace with your actual profile route
    router.push("/(root)/profile");
  };

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
        setTopPicks(response);
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
        setEntertainment(response);
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
        setCulture(response);
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

  const handleNavigation = (routeKey: keyof typeof ROUTES) => {
    router.push(ROUTES[routeKey]);
  };

  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [weather, setWeather] = useState<any>(null);

  const fetchLocationAndWeather = async () => {
    try {
      const { lat, lng } = await getCurrentLatLng();

      // Get location name (you might need to add reverse geocoding)
      const locationResponse = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${GOOGLE_API_KEY}`
      );
      const locationData = await locationResponse.json();
      console.log("Location Data:", locationData);
      if (locationData.results[0]) {
        setCurrentLocation(locationData.results[0].formatted);
      }

      // Get weather (you'll need to add weather API)
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${GOOGLE_API_KEY}&units=metric`
      );
      const weatherData = await weatherResponse.json();
      console.log("Weather Data:", weatherData);
      setWeather(weatherData);
    } catch (error) {
      console.error("Error fetching location/weather:", error);
    }
  };

  useEffect(() => {
    fetchLocationAndWeather();
  }, []);

  const renderLocationWeatherWidget = () => (
    <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 mb-4 mt-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-white text-sm opacity-90">
            Current Location
          </Text>
          <Text
            className="text-white font-semibold text-base"
            numberOfLines={1}
          >
            {currentLocation || "Getting location..."}
          </Text>
        </View>
        {weather?.main?.temp !== undefined && weather.weather?.[0]?.main ? (
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {Math.round(weather.main.temp)}°
            </Text>
            <Text className="text-white text-xs opacity-90">
              {weather.weather[0].main}
            </Text>
          </View>
        ) : (
          <Text className="text-white text-xs opacity-50">
            Loading weather...
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-5" style={{ marginBottom: -38 }}>
        {/* Greeting section */}
        {!isLoading && (
          <View className="flex-row justify-between items-center mt-4 mb-4">
            <View>
              <Text
                className="font-bold text-indigo-600"
                style={{ fontSize: 25 }}
              >
                Hello, {user ? user.firstName : "Traveler"}!
              </Text>
              <Text className="text-gray-500" style={{ fontSize: 14 }}>
                Where are you headed today?
              </Text>
            </View>

            {/* User Avatar with Profile Modal */}
            <TouchableOpacity onPress={() => setIsProfileModalVisible(true)}>
              <View className="bg-indigo-500 w-12 h-12 rounded-full justify-center items-center">
                <Text className="text-white font-bold" style={{ fontSize: 18 }}>
                  {(
                    (user && user.firstName ? user.firstName : "T")[0] || "T"
                  ).toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2 mb-4 mt-4">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search destinations, activities..."
            className="flex-1 ml-2"
          />
          <Ionicons name="mic" size={20} color="gray" />
        </View>

        {/* Location and Weather Widget */}
        {/* {renderLocationWeatherWidget()} */}

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

      {/* Profile Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isProfileModalVisible}
        onRequestClose={() => setIsProfileModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-start"
          onPress={() => setIsProfileModalVisible(false)}
        >
          {/* Modal Content - Positioned at top right */}
          <View
            className="absolute bg-white rounded-xl shadow-lg"
            style={{ top: 66, right: 12, minWidth: 170 }} // 18 * 4 = 72px
          >
            {/* User Info Section */}
            <View className="p-4 border-b border-gray-100">
              <View className="flex-row items-center mb-2">
                <View className="bg-indigo-500 w-12 h-12 rounded-full justify-center items-center mr-3">
                  <Text className="text-white font-bold text-lg">
                    {(
                      (user && user.firstName ? user.firstName : "T")[0] || "T"
                    ).toUpperCase()}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-base">
                    {user
                      ? `${user.firstName || ""} ${
                          user.lastName || ""
                        }`.trim() || "Traveler"
                      : "Traveler"}
                  </Text>
                  {user?.email && (
                    <Text className="text-gray-500 text-sm">{user.email}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="py-2">
              {/* Profile Button */}
              <TouchableOpacity
                onPress={handleProfileNavigation}
                className="flex-row items-center px-4 py-3 active:bg-gray-50"
              >
                <Ionicons name="person-outline" size={20} color="#6366f1" />
                <Text className="ml-3 text-gray-900 font-medium">
                  View Profile
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </TouchableOpacity>

              {/* Logout Button */}
              <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center px-4 py-3 active:bg-red-50"
              >
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text className="ml-3 text-red-600 font-medium">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
