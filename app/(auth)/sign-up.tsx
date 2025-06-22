import { BASE_URL_SM } from "@/config";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "./user-context";

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword, firstName, lastName } =
      formData;

    if (
      !username.trim() ||
      !email.trim() ||
      !password ||
      !firstName.trim() ||
      !lastName.trim()
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL_SM}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success",
          "Account created successfully! Please sign in.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(auth)/log-in"),
            },
          ]
        );
      } else {
        Alert.alert("Error", data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 5,
            paddingTop: 50,
            paddingBottom: 50,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 mx-4 shadow-2xl">
            <Text className="text-4xl font-bold text-center mb-2 text-gray-800">
              Create Account
            </Text>
            <Image
              source={require("@/assets/images/logo.jpg")}
              style={styles.logo}
            />

            <View className="flex-row justify-between mb-6">
              <View className="flex-1 mr-3">
                <Text className="text-lg font-semibold mb-3 text-gray-700">
                  First Name
                </Text>
                <TextInput
                  className="border-2 border-gray-200 rounded-2xl px-4 py-4 text-lg bg-gray-50 focus:border-green-400 focus:bg-white"
                  value={formData.firstName}
                  onChangeText={(value) =>
                    handleInputChange("firstName", value)
                  }
                  placeholder="First name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-lg font-semibold mb-3 text-gray-700">
                  Last Name
                </Text>
                <TextInput
                  className="border-2 border-gray-200 rounded-2xl px-4 py-4 text-lg bg-gray-50 focus:border-green-400 focus:bg-white"
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange("lastName", value)}
                  placeholder="Last name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3 text-gray-700">
                Username
              </Text>
              <TextInput
                className="border-2 border-gray-200 rounded-2xl px-4 py-4 text-lg bg-gray-50 focus:border-green-400 focus:bg-white"
                value={formData.username}
                onChangeText={(value) => handleInputChange("username", value)}
                placeholder="Choose a username"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3 text-gray-700">
                Email
              </Text>
              <TextInput
                className="border-2 border-gray-200 rounded-2xl px-4 py-4 text-lg bg-gray-50 focus:border-green-400 focus:bg-white"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3 text-gray-700">
                Password
              </Text>
              <TextInput
                className="border-2 border-gray-200 rounded-2xl px-4 py-4 text-lg bg-gray-50 focus:border-green-400 focus:bg-white"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                placeholder="Create a password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
              />
            </View>

            <View style={{ marginBottom: 36 }}>
              <Text className="text-lg font-semibold mb-3 text-gray-700">
                Confirm Password
              </Text>
              <TextInput
                className="border-2 border-gray-200 rounded-2xl px-4 py-4 text-lg bg-gray-50 focus:border-green-400 focus:bg-white"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
              />
            </View>

            {loading ? (
              <TouchableOpacity
                style={[styles.button, styles.disabledButton]}
                onPress={handleSignup}
                disabled={true}
              >
                <Text style={styles.buttonText}>Creating Account...</Text>
              </TouchableOpacity>
            ) : (
              <LinearGradient
                colors={["#22c55e", "#3b82f6"]} // from green-500 to blue-500
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                  <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
              </LinearGradient>
            )}

            <View className="flex-row justify-center items-center">
              <Text className="text-lg text-gray-600">
                Already have an account?{" "}
              </Text>
              <Link href="/(auth)/log-in">
                <Text className="text-lg text-green-600 font-bold">
                  Sign In
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 16,
  },
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
    paddingVertical: 16, // py-4
    paddingHorizontal: 24, // px-6
    borderRadius: 16, // rounded-2xl
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9CA3AF", // Tailwind gray-400
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
