import { fontFamily } from "@/constants/fontFamily";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

import { StatusBar } from "react-native";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    [fontFamily.black]: require("@/assets/fonts/GeistMono-Black.ttf"),
    [fontFamily.bold]: require("@/assets/fonts/GeistMono-Bold.ttf"),
    [fontFamily.semibold]: require("@/assets/fonts/GeistMono-SemiBold.ttf"),
    [fontFamily.medium]: require("@/assets/fonts/GeistMono-Medium.ttf"),
    [fontFamily.regular]: require("@/assets/fonts/GeistMono-Regular.ttf"),
    [fontFamily.light]: require("@/assets/fonts/GeistMono-Light.ttf"),
    [fontFamily.thin]: require("@/assets/fonts/GeistMono-Thin.ttf"),
  });

  if (loaded) {
    SplashScreen.hideAsync();
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar
        animated={true}
        backgroundColor="#222222"
        barStyle="dark-content"
      />
    </ThemeProvider>
  );
}
