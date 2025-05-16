import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { GradientIcon } from "@/components/ui/GradientIcon";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6B5CFF',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <GradientIcon name="house.fill" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: "Planner",
          tabBarIcon: ({ focused }) => (
            <GradientIcon name="doc.plaintext" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="transport"
        options={{
          title: "Transport",
          tabBarIcon: ({ focused }) => (
            <GradientIcon name="map.fill" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="language"
        options={{
          title: "Language",
          tabBarIcon: ({ focused }) => (
            <GradientIcon name="globe" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: "Emergency",
          tabBarIcon: ({ focused }) => (
            <GradientIcon name="triangle.fill" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <GradientIcon name="gearshape.fill" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
