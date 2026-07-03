import { fontFamily } from "@/constants/fontFamily";
import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const THUMB_SIZE = 28;
const TRACK_HEIGHT = 10;

export interface TemperatureSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

function roundToStep(raw: number, min: number, step: number): number {
  const stepped = Math.round((raw - min) / step) * step + min;
  return Number(stepped.toFixed(2));
}

export default function TemperatureSlider({
  min = 33,
  max = 39.5,
  step = 0.1,
  value,
  onChange,
}: TemperatureSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  const offset = useSharedValue(0);
  const startOffset = useSharedValue(0);

  const usable = Math.max(0, trackWidth - THUMB_SIZE);

  React.useEffect(() => {
    if (usable <= 0 || max <= min) return;
    const ratio = (value - min) / (max - min);
    offset.value = Math.max(0, Math.min(usable, ratio * usable));
  }, [value, usable, min, max, offset]);

  const commit = (px: number) => {
    if (usable <= 0) return;
    const ratio = px / usable;
    const raw = min + ratio * (max - min);
    onChange(roundToStep(raw, min, step));
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      startOffset.value = offset.value;
    })
    .onUpdate((e) => {
      const next = Math.max(
        0,
        Math.min(usable, startOffset.value + e.translationX)
      );
      offset.value = next;
      runOnJS(commit)(next);
    });

  const tap = Gesture.Tap().onEnd((e) => {
    const next = Math.max(0, Math.min(usable, e.x - THUMB_SIZE / 2));
    offset.value = next;
    runOnJS(commit)(next);
  });

  const gesture = Gesture.Race(pan, tap);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: offset.value + THUMB_SIZE / 2,
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={gesture}>
        <View style={styles.trackArea} onLayout={onLayout}>
          <View style={styles.trackBg} />
          <Animated.View style={[styles.trackFill, fillStyle]} />
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </View>
      </GestureDetector>

      <View style={styles.labels}>
        <Text style={styles.label}>{min}°C</Text>
        <Text style={styles.label}>{max}°C</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 10,
  },
  trackArea: {
    height: THUMB_SIZE,
    justifyContent: "center",
  },
  trackBg: {
    position: "absolute",
    left: 0,
    right: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: "#D9ECFF",
  },
  trackFill: {
    position: "absolute",
    left: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: "#1E90FF",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#0749FF",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    fontFamily: fontFamily.medium,
    color: "#333",
  },
});
