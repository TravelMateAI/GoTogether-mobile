import { API_BASE_URL } from "@/config";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  userId: string;
  username: string;
  firstName: string;
  lastName?: string;
  email: string;
  avatarUrl?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: string; // Base64 encoded user data
}

class AuthService {
  async login(loginData: LoginRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data: LoginResponse = await response.json();

      // Decode the base64 user data
      let userData: User;
      try {
        const decodedUser = atob(data.user);
        const parsedUser = JSON.parse(decodedUser);
        userData = {
          userId: parsedUser.userId,
          username: parsedUser.username,
          firstName: parsedUser.firstName,
          email: loginData.username, // Use the login username as email fallback
          avatarUrl: parsedUser.avatarUrl,
        };
      } catch (error) {
        // Fallback if decoding fails
        userData = {
          userId: "",
          username: loginData.username,
          firstName: "",
          email: loginData.username,
          avatarUrl: undefined,
        };
      }

      return {
        user: userData,
        token: data.accessToken,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(registerData: RegisterRequest): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const userData: User = await response.json();
      return userData;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async getUserByEmail(email: string, token: string): Promise<User> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/email/${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData: User = await response.json();
      return userData;
    } catch (error) {
      console.error("Get user error:", error);
      throw error;
    }
  }

  async getUserById(userId: string, token: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData: User = await response.json();
      return userData;
    } catch (error) {
      console.error("Get user error:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
