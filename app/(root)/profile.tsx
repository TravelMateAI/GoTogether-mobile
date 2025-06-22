import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../(auth)/user-context";

export default function ProfileScreen() {
  const { user, logout, isLoading } = useUser();
  const router = useRouter();

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
            await logout();
            router.replace("/(auth)/log-in");
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="person-circle-outline" size={80} color="#9CA3AF" />
          <Text className="text-xl font-semibold text-gray-800 mt-4 mb-2">
            Not Logged In
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Please log in to view your profile
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/log-in")}
            className="bg-indigo-500 py-3 px-8 rounded-xl"
          >
            <Text className="text-white text-lg font-semibold">
              Go to Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const profileItems = [
    {
      icon: "person-outline",
      label: "Full Name",
      value: user.firstName
        ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
        : user.name || "Not provided",
    },
    {
      icon: "at-outline",
      label: "Username",
      value: user.username || "Not provided",
    },
    {
      icon: "mail-outline",
      label: "Email",
      value: user.email || "Not provided",
    },
    {
      icon: "card-outline",
      label: "User ID",
      value: user.id,
    },
  ];

  const menuItems = [
    {
      icon: "settings-outline",
      label: "Settings",
      onPress: () => {
        // Navigate to settings
        Alert.alert("Settings", "Settings page coming soon!");
      },
    },
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      onPress: () => {
        Alert.alert("Help", "Help page coming soon!");
      },
    },
    {
      icon: "information-circle-outline",
      label: "About",
      onPress: () => {
        Alert.alert("About", "Travel app v1.0.0");
      },
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-6 pt-6 pb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-6">Profile</Text>

          {/* Avatar and Name Section */}
          <View className="items-center mb-6">
            <View className="relative">
              {user.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <View className="w-24 h-24 bg-indigo-500 rounded-full justify-center items-center">
                  <Text className="text-white text-3xl font-bold">
                    {(user.firstName || user.name || "U")[0].toUpperCase()}
                  </Text>
                </View>
              )}
              <TouchableOpacity className="absolute -bottom-2 -right-2 bg-indigo-500 w-8 h-8 rounded-full justify-center items-center">
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>

            <Text className="text-xl font-bold text-gray-800 mt-4">
              {user.firstName || user.name || "User"}
            </Text>
            <Text className="text-gray-600">
              @{user.username || "username"}
            </Text>
          </View>
        </View>

        {/* Profile Information */}
        <View className="bg-white mx-4 rounded-2xl mt-4 overflow-hidden">
          <Text className="text-lg font-semibold text-gray-800 px-6 py-4 bg-gray-50">
            Personal Information
          </Text>
          {profileItems.map((item, index) => (
            <View
              key={index}
              className={`flex-row items-center px-6 py-4 ${
                index !== profileItems.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <View className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center mr-4">
                <Ionicons name={item.icon as any} size={20} color="#6B7280" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-1">{item.label}</Text>
                <Text className="text-gray-800 font-medium" numberOfLines={2}>
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View className="bg-white mx-4 rounded-2xl mt-4 overflow-hidden">
          <Text className="text-lg font-semibold text-gray-800 px-6 py-4 bg-gray-50">
            Menu
          </Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className={`flex-row items-center px-6 py-4 ${
                index !== menuItems.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <View className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center mr-4">
                <Ionicons name={item.icon as any} size={20} color="#6B7280" />
              </View>
              <Text className="flex-1 text-gray-800 font-medium">
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View className="mx-4 mt-6 mb-8">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 py-4 px-6 rounded-2xl flex-row justify-center items-center shadow-sm"
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
