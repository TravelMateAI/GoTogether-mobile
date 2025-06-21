import { Stack } from "expo-router";
import { UserProvider } from "./user-context";

const AuthLayout = () => {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="log-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
};

export default AuthLayout;
