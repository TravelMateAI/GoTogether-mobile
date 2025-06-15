import { API_BASE_URL } from "@/config";
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
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/auth/login`, {
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

      if (response.ok) {
        // Parse the user data from the response
        const userData = {
          id: data.user.userId || data.user.id,
          name: data.user.firstName || data.user.username,
          email: data.user.email || username,
        };

        setUser(userData);

        // Store token if needed for future requests
        // You might want to use AsyncStorage here

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
