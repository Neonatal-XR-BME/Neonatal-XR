import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type ToggleSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  onColor?: string;
  offColor?: string;
};

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 30;
const THUMB_SIZE = 24;
const THUMB_MARGIN = (TRACK_HEIGHT - THUMB_SIZE) / 2;

// Plain RN Switch looks platform-native (very iOS/Android-default styled),
// which stands out against this app's custom pill/glass aesthetic. This is
// a small custom track+thumb built on Reanimated (already a dependency)
// instead, so its colors and shape match the rest of the UI.
export function ToggleSwitch({
  value,
  onValueChange,
  disabled = false,
  onColor = "#01885B",
  offColor = "#D1D1D6",
}: ToggleSwitchProps) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 180 });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [offColor, onColor]
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          progress.value * (TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN * 2),
      },
    ],
  }));

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <Animated.View
        style={[styles.track, trackStyle, disabled && styles.disabled]}
      >
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    padding: THUMB_MARGIN,
    justifyContent: "center",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ToggleSwitch;
