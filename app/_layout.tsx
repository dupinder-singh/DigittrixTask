import { Stack } from "expo-router";
import { FavoriteProvider } from "@/src/context/FavContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function RootLayout() {
  return <SafeAreaProvider>
    <FavoriteProvider>
      <Stack >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </FavoriteProvider>;
  </SafeAreaProvider>
}
