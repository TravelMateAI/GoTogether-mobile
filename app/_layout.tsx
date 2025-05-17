// app/_layout.tsx
import "@/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useLocationPermission } from "@/hooks/useLocationPermission"; // 🆕 Import custom hook
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Text, View } from "react-native";
import "react-native-reanimated";
import { UserProvider } from "./(auth)/user-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const locationGranted = useLocationPermission();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded || locationGranted === null) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4B5563" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (!locationGranted) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-lg font-semibold text-center text-red-600">
          Location permission is required to use this app.
        </Text>
        <Text className="mt-2 text-center text-gray-500">
          Please enable it from your device settings and restart the app.
        </Text>
      </View>
    );
  }

  return (
    <UserProvider>
      <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(root)" options={{ headerShown: false }} />
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
          <Stack.Screen name="(emergency)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </UserProvider>
  );
}
