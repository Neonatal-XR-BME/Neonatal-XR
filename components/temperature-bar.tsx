import { CORE_RANGE } from "@/lib/parameter-state";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * TemperatureBar
 *
 * Fills proportionally across [rangeMin, rangeMax] and colors the fill by how
 * far the value sits from the expected (clinical) band [normalMin, normalMax]:
 *   - green  : within the normal band
 *   - yellow : outside the band but by <= tolerance
 *   - red    : outside the band by more than tolerance
 *
 * rangeMin/rangeMax control the visual fill (e.g. core 34 -> set target,
 * ambient 20 -> 26). normalMin/normalMax control the color only.
 */

const COLOR_NORMAL = "#0AC084"; // green
const COLOR_WARN = "#FBEC47"; // yellow
const COLOR_ALERT = "#FF5252"; // red

const BAR_HEIGHT = 24;
const BAR_RADIUS = 6;

export interface TemperatureBarProps {
  temperature: number;
  rangeMin?: number;
  rangeMax?: number;
  normalMin?: number;
  normalMax?: number;
  tolerance?: number;
}

export function colorForTemperature(
  temperature: number,
  normalMin: number,
  normalMax: number,
  tolerance: number
): string {
  if (temperature >= normalMin && temperature <= normalMax) {
    return COLOR_NORMAL;
  }
  const deviation =
    temperature < normalMin ? normalMin - temperature : temperature - normalMax;
  return deviation <= tolerance ? COLOR_WARN : COLOR_ALERT;
}

export function fillPercent(
  temperature: number,
  rangeMin: number,
  rangeMax: number
): number {
  if (rangeMax <= rangeMin) return 0;
  const pct = ((temperature - rangeMin) / (rangeMax - rangeMin)) * 100;
  return Math.max(0, Math.min(100, pct));
}

export default function TemperatureBar({
  temperature,
  rangeMin = 34,
  rangeMax = 37.5,
  normalMin = CORE_RANGE.min,
  normalMax = CORE_RANGE.max,
  tolerance = 0.2,
}: TemperatureBarProps) {
  const color = colorForTemperature(
    temperature,
    normalMin,
    normalMax,
    tolerance
  );
  const width = fillPercent(temperature, rangeMin, rangeMax);

  return (
    <View style={styles.track}>
      <View
        style={[styles.fill, { backgroundColor: color, width: `${width}%` }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: BAR_HEIGHT,
    borderRadius: BAR_RADIUS,
    backgroundColor: "#EEEEEE",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: BAR_RADIUS,
  },
});
