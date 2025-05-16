import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { GradientIcon } from "@/components/ui/GradientIcon";
import TabBarBackground from "@/components/ui/TabBarBackground";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6B5CFF",
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
            <GradientIcon
              name={focused ? "house.fill" : "house"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: "Planner",
          tabBarIcon: ({ focused }) => (
            <GradientIcon
              name={focused ? "doc.plaintext" : "doc"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transport"
        options={{
          title: "Transport",
          tabBarIcon: ({ focused }) => (
            <GradientIcon
              name={focused ? "map.fill" : "map"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: "Emergency",
          tabBarIcon: ({ focused }) => (
            <GradientIcon
              name={focused ? "triangle.fill" : "triangle"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <GradientIcon
              name={focused ? "gearshape.fill" : "gearshape"}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
