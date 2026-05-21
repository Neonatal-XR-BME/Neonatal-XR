import { fontFamily } from "@/constants/fontFamily";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

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

  if (loaded) {
    SplashScreen.hideAsync();
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
