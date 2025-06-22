import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { StorageService } from "../../utils/storage";

type User = {
  id: string;
  name: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add debugging
  useEffect(() => {
    console.log("UserProvider - user state changed:", user);
  }, [user]);

  useEffect(() => {
    console.log("UserProvider - isLoading changed:", isLoading);
  }, [isLoading]);

  // Load user data and token from storage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      console.log("Loading user from storage...");
      const [storedUser, storedToken] = await Promise.all([
        StorageService.getUserData(),
        StorageService.getAccessToken(),
      ]);

      console.log("Stored user:", storedUser);
      console.log("Stored token:", storedToken);

      if (storedUser) {
        setUserState(storedUser);
      }
      if (storedToken) {
        setAccessTokenState(storedToken);
      }
    } catch (error) {
      console.error("Failed to load user from storage:", error);
    } finally {
      console.log("Setting isLoading to false");
      setIsLoading(false);
    }
  };

  const setUser = async (userData: User | null) => {
    console.log("setUser called with:", userData);
    setUserState(userData);
    if (userData) {
      console.log("Saving user to storage...");
      await StorageService.setUserData(userData);
      console.log("User saved to storage");
    } else {
      await StorageService.clearAuthData();
    }
  };

  const setAccessToken = async (token: string | null) => {
    console.log(
      "setAccessToken called with:",
      token ? "token present" : "null"
    );
    setAccessTokenState(token);
    if (token) {
      await StorageService.setAccessToken(token);
    } else {
      await StorageService.clearAuthData();
    }
  };

  const logout = async () => {
    try {
      await StorageService.clearAuthData();
      setUserState(null);
      setAccessTokenState(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        isLoading,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
