import { fontFamily } from "@/constants/fontFamily";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "react-native-url-polyfill/auto";

export const unstable_settings = {
  anchor: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    [fontFamily.black]: require("@/assets/fonts/PaperMono-ExtraBold.otf"),
    [fontFamily.bold]: require("@/assets/fonts/PaperMono-Bold.otf"),
    [fontFamily.semibold]: require("@/assets/fonts/PaperMono-SemiBold.otf"),
    [fontFamily.medium]: require("@/assets/fonts/PaperMono-Medium.otf"),
    [fontFamily.regular]: require("@/assets/fonts/PaperMono-Regular.otf"),
    [fontFamily.light]: require("@/assets/fonts/GeistMono-Light.ttf"),
    [fontFamily.thin]: require("@/assets/fonts/GeistMono-Thin.ttf"),
    [fontFamily.Paprika]: require("@/assets/fonts/Paprika-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Don't render anything until fonts are ready
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          <Stack.Screen
            name="arscene"
            options={{
              animation: "slide_from_right",
              gestureEnabled: false,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="vrscene"
            options={{
              animation: "slide_from_right",
              gestureEnabled: false,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="mobilevr"
            options={{
              animation: "slide_from_right",
              gestureEnabled: false,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="training/components"
            options={{
              animation: "slide_from_right",
              headerShown: true,
              headerBackButtonDisplayMode: "minimal",

              headerTransparent: true,
              headerTitle: "MODULE TWO",
              headerTitleStyle: { color: "#000", fontWeight: "bold" },
            }}
          />
          <Stack.Screen
            name="training/procedures"
            options={{
              animation: "slide_from_right",
              headerShown: true,
              headerBackButtonDisplayMode: "minimal",
              headerTransparent: true,
              headerTitle: "MODULE THREE",
              headerTitleStyle: { color: "#000", fontWeight: "bold" },
            }}
          />

          <Stack.Screen
            name="training/orientation"
            options={{
              animation: "slide_from_right",
              headerShown: true,
              headerBackButtonDisplayMode: "minimal",
              headerTransparent: true,
              headerTitle: "MODULE ONE",
              headerTitleStyle: { color: "#000", fontWeight: "bold" },
            }}
          />
        </Stack>
        <StatusBar
          animated={true}
          backgroundColor="#FFF"
          barStyle={
            Platform?.OS === "android" ? "light-content" : "dark-content"
          }
        />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
