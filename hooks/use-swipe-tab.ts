import { router, useSegments } from "expo-router";
import { useCallback } from "react";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

const TABS = ["index", "arview", "troubleshoot", "training"] as const;
type Tab = (typeof TABS)[number];

const SWIPE_THRESHOLD = 50;

// Map tab name → its Expo Router href
const TAB_ROUTES: Record<Tab, string> = {
  index: "/(tabs)/", // index uses "/" not "/index"
  arview: "/(tabs)/arview",
  troubleshoot: "/(tabs)/troubleshoot",
  training: "/(tabs)/training",
};

export default function useSwipeTabs() {
  const segments = useSegments();

  const navigate = useCallback(
    (direction: "left" | "right") => {
      // segments looks like ["(tabs)", "arview"] or ["(tabs)"] for index
      const lastSegment = segments[segments.length - 1];

      // When on index, last segment is "(tabs)" not "index"
      const currentTab: Tab =
        lastSegment === "(tabs)" ? "index" : (lastSegment as Tab);

      const currentIndex = TABS.indexOf(currentTab);
      if (currentIndex === -1) return;

      const nextIndex =
        direction === "left" ? currentIndex + 1 : currentIndex - 1;

      if (nextIndex >= 0 && nextIndex < TABS.length) {
        router.navigate(TAB_ROUTES[TABS[nextIndex]] as any);
      }
    },
    [segments]
  );

  return Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD) runOnJS(navigate)("left");
      else if (e.translationX > SWIPE_THRESHOLD) runOnJS(navigate)("right");
    });
}
