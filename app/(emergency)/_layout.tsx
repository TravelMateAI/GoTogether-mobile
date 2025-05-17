import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeLayout() {
    const scheme = useColorScheme();
    const theme = Colors[scheme ?? "light"];

    return (
        <View
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
                                shadowColor: "#000",
                                shadowOpacity: 0.05,
                                shadowOffset: { width: 0, height: 4 },
                                shadowRadius: 12,
                                elevation: 6, // Android shadow
                                flex: 1,
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
                <Stack.Screen name="embassy-contacts" options={{ title: "Embassy Contacts" }} />
                <Stack.Screen name="emergency-contacts" options={{ title: "Emergency Contacts" }} />
            </Stack>
        </View>
    );
}
