import { router, useSegments } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = 50;
const DURATION = 300;

const TABS = ["index", "arview", "troubleshoot", "training"] as const;
type Tab = (typeof TABS)[number];

const TAB_ROUTES: Record<Tab, string> = {
  index: "/(tabs)/",
  arview: "/(tabs)/arview",
  troubleshoot: "/(tabs)/troubleshoot",
  training: "/(tabs)/training",
};

export default function SwipeableScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const segments = useSegments();
  const translateX = useSharedValue(0);
  const locked = useRef(false);

  // ✅ Pure JS function — called via runOnJS only
  const getCurrentIndex = useCallback((): number => {
    const last = segments[segments.length - 1];
    const tab: Tab = last === "(tabs)" ? "index" : (last as Tab);
    return TABS.indexOf(tab);
  }, [segments]);

  // ✅ Named function so runOnJS can reference it
  const unlock = useCallback(() => {
    locked.current = false;
  }, []);

  const navigate = useCallback(
    (direction: "left" | "right") => {
      if (locked.current) return;
      const currentIndex = getCurrentIndex();
      if (currentIndex === -1) return;

      const nextIndex =
        direction === "left" ? currentIndex + 1 : currentIndex - 1;

      if (nextIndex < 0 || nextIndex >= TABS.length) return;

      locked.current = true;
      router.navigate(TAB_ROUTES[TABS[nextIndex]] as any);
    },
    [getCurrentIndex]
  );

  const snapBack = useCallback(() => {
    translateX.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [translateX]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onUpdate((e) => {
      "worklet";
      // ✅ Pure shared value update — no JS calls here
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      "worklet";
      const { translationX, velocityX } = e;

      const goLeft = translationX < -SWIPE_THRESHOLD || velocityX < -800;
      const goRight = translationX > SWIPE_THRESHOLD || velocityX > 800;

      if (goLeft) {
        // Slide out to the left, then navigate
        translateX.value = withTiming(
          -SCREEN_WIDTH,
          { duration: DURATION, easing: Easing.inOut(Easing.cubic) },
          (finished) => {
            "worklet";
            if (finished) {
              translateX.value = 0;
              runOnJS(navigate)("left");
            }
          }
        );
      } else if (goRight) {
        translateX.value = withTiming(
          SCREEN_WIDTH,
          { duration: DURATION, easing: Easing.inOut(Easing.cubic) },
          (finished) => {
            "worklet";
            if (finished) {
              translateX.value = 0;
              runOnJS(navigate)("right");
            }
          }
        );
      } else {
        runOnJS(snapBack)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
