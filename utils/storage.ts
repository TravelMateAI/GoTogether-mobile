// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER_DATA: "user_data",
  REFRESH_TOKEN: "refresh_token",
} as const;

export class StorageService {
  static async setAccessToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } catch (error) {
      console.error("Failed to store access token:", error);
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error("Failed to retrieve access token:", error);
      return null;
    }
  }

  static async setUserData(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to store user data:", error);
    }
  }

  static async getUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Failed to retrieve user data:", error);
      return null;
    }
  }

  static async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.REFRESH_TOKEN,
      ]);
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
  }

  static async setRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error("Failed to store refresh token:", error);
    }
  }

  static async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error("Failed to retrieve refresh token:", error);
      return null;
    }
  }
}
