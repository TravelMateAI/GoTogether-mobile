import { BASE_URL_SM } from "@/config";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "./user-context";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, setAccessToken } = useUser();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL_SM}/api/users/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        // Decode the base64 encoded user data
        let decodedUser;
        try {
          const base64User = data.user;
          const decodedString = atob(base64User); // Decode base64
          decodedUser = JSON.parse(decodedString); // Parse JSON
          console.log("Decoded user:", decodedUser);
        } catch (decodeError) {
          console.error("Error decoding user data:", decodeError);
          Alert.alert("Error", "Invalid user data received");
          return;
        }

        const userData = {
          id: decodedUser.userId || decodedUser.id,
          name: decodedUser.firstName || decodedUser.username,
          email: decodedUser.email || username,
          username: decodedUser.username,
          firstName: decodedUser.firstName,
          lastName: decodedUser.lastName,
          avatarUrl: decodedUser.avatarUrl,
        };

        await setUser(userData);
        console.log("User set in context:", userData);
        await setAccessToken(data.accessToken); // Note: use accessToken, not token

        Alert.alert("Success", "Login successful!", [
          {
            text: "OK",
            onPress: () => router.replace("/(root)/home"),
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 mx-4 shadow-2xl">
        <Text className="text-4xl font-bold text-center mb-2 text-gray-800">
          Welcome Back
        </Text>
        <Text className="text-lg text-center mb-8 text-gray-600">
          Sign in to your account
        </Text>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3 text-gray-700">
            Username
          </Text>
          <TextInput
            className="border-2 border-gray-200 rounded-2xl px-4 py-4 text-lg bg-gray-50 focus:border-purple-400 focus:bg-white"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View className="mb-8">
          <Text className="text-lg font-semibold mb-3 text-gray-700">
            Password
          </Text>
          <TextInput
            className="border-2 border-gray-200 rounded-2xl px-4 py-4 text-lg bg-gray-50 focus:border-purple-400 focus:bg-white"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className={`rounded-2xl py-4 px-6 mb-6 shadow-lg ${
            loading
              ? "bg-gray-400"
              : "bg-gradient-to-r from-purple-500 to-blue-500"
          }`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-xl font-bold text-center">
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center">
          <Text className="text-lg text-gray-600">Don't have an account? </Text>
          <Link href="/(auth)/sign-up">
            <Text className="text-lg text-purple-600 font-bold">Sign Up</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
