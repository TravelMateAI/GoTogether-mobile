import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="log-in" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
