import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeLayout() {
  const theme = Colors["light"];
  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: theme.background,
      }}
    >
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerBackground: () => (
            <SafeAreaView
              style={{
                backgroundColor: theme.background,
                borderBottomLeftRadius: 24,
                borderBottomRightRadius: 24,
                flex: 1,
                height: 50,
              }}
            />
          ),
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: "700",
            color: theme.text,
          },
          headerTintColor: theme.tint,
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="culture" options={{ title: "Culture" }} />
        <Stack.Screen name="food" options={{ title: "Food & Fun" }} />
        <Stack.Screen name="language" options={{ title: "Language Help" }} />
        <Stack.Screen
          name="entertainment"
          options={{ title: "Entertainment" }}
        />
        <Stack.Screen name="nearby" options={{ title: "Explore Nearby" }} />
        <Stack.Screen name="stay" options={{ title: "Book Stay" }} />
        <Stack.Screen name="top-picks" options={{ title: "Top Picks" }} />
        <Stack.Screen
          name="location-details/[placeId]"
          options={{ title: "Location Details" }}
        />
      </Stack>
    </SafeAreaView>
  );
}
