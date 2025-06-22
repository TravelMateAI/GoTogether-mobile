import { BASE_URL_SM } from "@/config";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
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
        let decodedUser;
        try {
          const base64User = data.user;
          const decodedString = atob(base64User);
          decodedUser = JSON.parse(decodedString);
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
        await setAccessToken(data.accessToken);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // 🛠️ KEY PART
      style={{ flex: 1 }} // 🛠️ Must be full height
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 mx-4 shadow-2xl">
          <Text className="text-4xl font-bold text-center mb-2 text-gray-800">
            Welcome Back
          </Text>
          <Image
            source={require("@/assets/images/logo.jpg")} // adjust path if needed
            style={styles.logo}
          />
          {/* <Text className="text-lg text-center mb-8 text-gray-600">
            Sign in to your account
          </Text> */}

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

          {loading ? (
            <TouchableOpacity
              style={[styles.button, styles.disabledButton]}
              onPress={handleLogin}
              disabled={true}
            >
              <Text style={styles.buttonText}>Signing In...</Text>
            </TouchableOpacity>
          ) : (
            <LinearGradient
              colors={["#8b5cf6", "#3b82f6"]} // purple-500 to blue-500
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}

          <View className="flex-row justify-center items-center">
            <Text className="text-lg text-gray-600">
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/sign-up">
              <Text className="text-lg text-purple-600 font-bold">Sign Up</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gradientButton: {
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#a78bfa", // Tailwind purple-400
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 16,
  },
});
