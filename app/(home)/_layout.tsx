import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Stack component for the screens */}
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#C60024", // Common header background color
          },
          headerTitleStyle: {
            color: "#fff",
            fontSize: 24, // Adjust the title font size
            fontWeight: "bold", // Set the title font weight to bold
          },
          headerTintColor: "#fff", // Change the Go Back icon color
        }}
      >
        <Stack.Screen name="events" options={{ title: "Local Events" }} />
        <Stack.Screen name="food" options={{ title: "Food & Fun" }} />
        <Stack.Screen name="language" options={{ title: "Language Help" }} />
        <Stack.Screen name="locations" options={{ title: "Hidden Gems" }} />
        <Stack.Screen name="nearby" options={{ title: "Explore Nearby" }} />
        <Stack.Screen name="stay" options={{ title: "Book Stay" }} />
        <Stack.Screen name="top-picks" options={{ title: "Top Picks" }} />
      </Stack>
    </SafeAreaView>
  );
}
